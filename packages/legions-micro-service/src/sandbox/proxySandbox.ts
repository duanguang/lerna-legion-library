import Proxy from 'es6-proxy-polyfill';
import { nextTick, SandBoxType } from '../utils';
import { documentAttachProxyMap, getTargetValue } from './common';
import 'reflect-metadata';
let PROXY = Proxy;
let activeSandboxCount = 0;
/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
function uniq(array: PropertyKey[]) {
  return array.filter(function filter(this: PropertyKey[], element) {
    return element in this ? false : ((this as any)[element] = true);
  }, {});
}
type SymbolTarget = 'target' | 'rawWindow';
const rawObjectDefineProperty = Object.defineProperty;
const variableWhiteListInDev =
  //@ts-ignore
  process.env.NODE_ENV === 'development'
    ? ['__REACT_ERROR_OVERLAY_GLOBAL_HOOK__']
    : [];
const variableWhiteList: PropertyKey[] = [
  'System',
  '__cjsWrapper',
  ...variableWhiteListInDev,
];
type FakeWindow = Window & Record<PropertyKey, any>;
function createFakeWindow(global: Window) {
  // map always has the fastest performance in has check scenario
  // see https://jsperf.com/array-indexof-vs-set-has/23
  const propertiesWithGetter = new Map<PropertyKey, boolean>();
  const fakeWindow = {} as FakeWindow;

  /*
   copy the non-configurable property of global to fakeWindow
   see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
   > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
   */
  Object.getOwnPropertyNames(global)
    .filter(p => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      return !descriptor?.configurable;
    })
    .forEach(p => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p);
      if (descriptor) {
        const hasGetter = Object.prototype.hasOwnProperty.call(
          descriptor,
          'get'
        );

        /*
         make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
         > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
         */
        if (
          p === 'top' ||
          p === 'parent' ||
          p === 'self' ||
          p === 'window' ||
          //@ts-ignore
          (process.env.NODE_ENV === 'test' &&
            (p === 'mockTop' || p === 'mockSafariTop'))
        ) {
          descriptor.configurable = true;
          /*
           The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
           Example:
            Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
            Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
           */
          if (!hasGetter) {
            descriptor.writable = true;
          }
        }

        if (hasGetter) propertiesWithGetter.set(p, true);

        // freeze the descriptor to avoid being modified by zone.js
        // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71
        rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
      }
    });

  return {
    fakeWindow,
    propertiesWithGetter,
  };
}

export interface SandboxProps {
  multiMode?: boolean;
  name: string;
}

export interface SandboxContructor {
  new (): ProxySandbox;
}

// check window contructor function， like Object Array
/* function isConstructor(fn) {
  // generator function and has own prototype properties
  const hasConstructor =
    fn.prototype &&
    fn.prototype.constructor === fn &&
    Object.getOwnPropertyNames(fn.prototype).length > 1;
  // unnecessary to call toString if it has contructor function
  const functionStr = !hasConstructor && fn.toString();
  const upperCaseRegex = /^function\s+[A-Z]/;

  return (
    hasConstructor ||
    // upper case
    upperCaseRegex.test(functionStr) ||
    // ES6 class, window function do not have this case
    functionStr.slice(0, 5) === 'class'
  );
}

// get function from original window, such as scrollTo, parseInt
function isWindowFunction(func) {
  return func && typeof func === 'function' && !isConstructor(func);
} */

export default class ProxySandbox {
  /** 沙箱导出的代理实体 */
  sandbox: Window;

  private multiMode: boolean = false;

  private eventListeners = {};

  private timeoutIds: number[] = [];

  private intervalIds: number[] = [];

  private propertyAdded = {};

  private originalValues = {};

  //@ts-ignore
  public sandboxDisabled: boolean;

  /** window 值变更记录 */
  private updatedValueSet = new Set<PropertyKey>();

  /** 沙箱的名字 */
  name: string = '';
  /** 沙箱的类型 */
  public type: SandBoxType = SandBoxType.Proxy;
  /** 沙箱是否在运行中 */
  sandboxRunning: boolean = true;

  constructor(props: SandboxProps = { name: '' }) {
    const { multiMode } = props;
    if (!window.Proxy) {
      console.warn('proxy sandbox is not support by current browser');
      /* this.sandboxDisabled = true; */
    } else {
      PROXY = window.Proxy;
    }
    // enable multiMode in case of create mulit sandbox in same time
    //@ts-ignore
    this.multiMode = multiMode;
    //@ts-ignore
    this.sandbox = null;
    this.name = props.name;
    this.createProxySandbox();
  }
  active() {
    if (!this.sandboxRunning) activeSandboxCount++;
    this.sandboxRunning = true;
  }
  inactive() {
    //@ts-ignore
    if (process.env.NODE_ENV === 'development') {
      console.info(
        `[legions:sandbox] ${this.name} modified global properties restore...`,
        [...this.updatedValueSet.keys()]
      );
    }

    if (--activeSandboxCount === 0) {
      variableWhiteList.forEach(p => {
        if (this.sandbox.hasOwnProperty(p)) {
          // @ts-ignore
          delete window[p];
        }
      });
    }

    this.sandboxRunning = false;
  }
  createProxySandbox() {
    const { propertyAdded, originalValues, multiMode, updatedValueSet } = this;
    const self = this;
    const rawWindow = window;
    const { fakeWindow, propertiesWithGetter } = createFakeWindow(rawWindow);
    console.log(fakeWindow, 'fakeWindowfakeWindowfakeWindow');
    /* const proxyWindow = Object.create(null) as Window; */
    /* const proxyWindow = fakeWindow; */
    const originalAddEventListener = window.addEventListener;
    const originalRemoveEventListener = window.removeEventListener;
    const originalSetInerval = window.setInterval;
    const originalSetTimeout = window.setTimeout;
    // hijack addEventListener
    fakeWindow.addEventListener = (eventName, fn, ...rest) => {
      const listeners = this.eventListeners[eventName] || [];
      listeners.push(fn);
      return originalAddEventListener.apply(rawWindow, [
        eventName,
        fn,
        ...rest,
      ]);
    };
    // hijack removeEventListener
    fakeWindow.removeEventListener = (eventName, fn, ...rest) => {
      const listeners = this.eventListeners[eventName] || [];
      if (listeners.includes(fn)) {
        listeners.splice(listeners.indexOf(fn), 1);
      }
      return originalRemoveEventListener.apply(rawWindow, [
        eventName,
        fn,
        ...rest,
      ]);
    };
    // hijack setTimeout
    fakeWindow.setTimeout = (...args) => {
      const timerId = originalSetTimeout(...args);
      this.timeoutIds.push(timerId);
      return timerId;
    };
    // hijack setInterval
    fakeWindow.setInterval = (...args) => {
      const intervalId = originalSetInerval(...args);
      this.intervalIds.push(intervalId);
      return intervalId;
    };
    const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>();
    const sandbox = new PROXY(fakeWindow, {
      set(target: Window, p: PropertyKey, value: any): boolean {
        console.log(self.sandboxRunning, 'self.sandboxRunning');
        if (self.sandboxRunning) {
          // eslint-disable-next-line no-prototype-builtins
          if (!rawWindow.hasOwnProperty(p)) {
            // 如果在原始window 不存在，则在沙箱中添加
            // recorde value added in sandbox
            propertyAdded[p] = value;
            // eslint-disable-next-line no-prototype-builtins
          } else if (!originalValues.hasOwnProperty(p)) {
            // 如果在原始window 存在，则记录原始值
            // if it is already been setted in orignal window, record it's original value
            originalValues[p] = rawWindow[p];
          }
          // set new value to original window in case of jsonp, js bundle which will be execute outof sandbox
          if (!multiMode) {
            rawWindow[p] = value;
          }
          updatedValueSet.add(p);
          // eslint-disable-next-line no-param-reassign
          target[p] = value;
        }
        return true;
      },
      get(target: Window, p: PropertyKey): any {
        if (p === Symbol.unscopables) {
          // 加固，防止逃逸
          return undefined;
        }
        //@ts-ignore
        if (['top', 'window', 'self', 'globalThis'].includes(p as string)) {
          // 优先从自身应用取值
          return sandbox;
        }
        // proxy hasOwnProperty, in case of proxy.hasOwnProperty value represented as originalWindow.hasOwnProperty
        if (p === 'hasOwnProperty') {
          // eslint-disable-next-line no-prototype-builtins
          return (key: PropertyKey) =>
            !!target[key] || rawWindow.hasOwnProperty(key);
        }
        // mark the symbol to document while accessing as document.createElement could know is invoked by which sandbox for dynamic append patcher
        if (p === 'document') {
          documentAttachProxyMap.set(document, sandbox);
          // remove the mark in next tick, thus we can identify whether it in micro app or not
          // this approach is just a workaround, it could not cover all the complex scenarios, such as the micro app runs in the same task context with master in som case
          // fixme if you have any other good ideas
          nextTick(() => documentAttachProxyMap.delete(document));
          return document;
        }
        /* const targetValue = target[p];
        if (targetValue) {
          // case of addEventListener, removeEventListener, setTimeout, setInterval setted in sandbox
          return targetValue;
        } else {
          
        } */
        const value = propertiesWithGetter.has(p)
          ? (rawWindow as any)[p]
          : (target as any)[p] || (rawWindow as any)[p];
        /* const value = originalWindow[p]; */
        return getTargetValue(rawWindow, value);
      },
      has(target: Window, p: PropertyKey): boolean {
        return p in target || p in rawWindow;
      },
      getOwnPropertyDescriptor(
        target: FakeWindow,
        p: string | number | symbol
      ): PropertyDescriptor | undefined {
        /*
         as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
         > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
         */
        if (target.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(target, p);
          descriptorTargetMap.set(p, 'target');
          return descriptor;
        }

        if (rawWindow.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
          descriptorTargetMap.set(p, 'rawWindow');
          // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object
          if (descriptor && !descriptor.configurable) {
            descriptor.configurable = true;
          }
          return descriptor;
        }

        return undefined;
      },
      // trap to support iterator with sandbox
      ownKeys(target: FakeWindow): PropertyKey[] {
        return uniq(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)));
      },
      defineProperty(
        target: Window,
        p: PropertyKey,
        attributes: PropertyDescriptor
      ): boolean {
        const from = descriptorTargetMap.get(p);
        /*
         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
         otherwise it would cause a TypeError with illegal invocation.
         */
        switch (from) {
          case 'rawWindow':
            return Reflect.defineProperty(rawWindow, p, attributes);
          default:
            return Reflect.defineProperty(target, p, attributes);
        }
      },
      deleteProperty(target: FakeWindow, p: string | number | symbol): boolean {
        if (target.hasOwnProperty(p)) {
          // @ts-ignore
          delete target[p];
          updatedValueSet.delete(p);

          return true;
        }

        return true;
      },
    });
    this.sandbox = sandbox;
  }

  getSandbox() {
    return this.sandbox;
  }

  execScriptInSandbox(script: string): void {
    if (!this.sandboxDisabled) {
      // create sandbox before exec script
      if (!this.sandbox) {
        this.createProxySandbox();
      }
      try {
        const execScript = `with (sandbox) {;${script}\n}`;
        // eslint-disable-next-line no-new-func
        const code = new Function('sandbox', execScript).bind(this.sandbox);
        // run code with sandbox
        code(this.sandbox);
      } catch (error) {
        console.error(`error occurs when execute script in sandbox: ${error}`);
        throw error;
      }
    }
  }

  clear() {
    if (!this.sandboxDisabled) {
      // remove event listeners
      Object.keys(this.eventListeners).forEach(eventName => {
        (this.eventListeners[eventName] || []).forEach(listener => {
          window.removeEventListener(eventName, listener);
        });
      });
      // clear timeout
      this.timeoutIds.forEach(id => window.clearTimeout(id));
      this.intervalIds.forEach(id => window.clearInterval(id));
      // recover original values
      Object.keys(this.originalValues).forEach(key => {
        window[key] = this.originalValues[key];
      });
      Object.keys(this.propertyAdded).forEach(key => {
        delete window[key];
      });
    }
  }
}
