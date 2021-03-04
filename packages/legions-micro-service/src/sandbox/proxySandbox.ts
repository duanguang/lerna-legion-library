/* import Proxy from 'es6-proxy-polyfill';
import 'object-defineproperty-ie'; */
import { nextTick, SandBoxType } from '../utils';
import { documentAttachProxyMap, getTargetValue } from './common';
import 'reflect-metadata';
/**
 * copy from https://www.npmjs.com/package/qiankun
 */
let activeSandboxCount = 0;
/**
 * fastest(at most time) unique array method
 * @see https://jsperf.com/array-filter-unique/30
 */
function uniq(array: PropertyKey[]) {
  return array.filter(function filter(this: PropertyKey[], element) {
    return element in this ? false : ((this as any)[element] = true);
  }, Object.create(null));
}
const unscopables = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  eval: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true,
};
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
  // 遍历出 window 对象所有不可配置属性
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
        ) {// 将 top、parent、self、window 这几个属性由不可配置改为可配置
          descriptor.configurable = true;
          /*
           The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
           Example:
            Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
            Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
           */
          if (!hasGetter) {
            // 如果这几个属性没有 getter，则说明由 writeable 属性，将其设置为可写
            descriptor.writable = true;
          }
        }
 // 如果存在 getter，则以该属性为 key，true 为 value 存入 propertiesWithGetter map
        if (hasGetter) propertiesWithGetter.set(p, true);
     // 将属性和描述设置到 fakeWindow 对象，并且冻结属性描述符，不然有可能会被更改，比如 zone.js
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

export default class ProxySandbox {
  /** 沙箱导出的代理实体 */
  sandbox: Window;

  private eventListeners = {};

  private timeoutIds: number[] = [];

  private intervalIds: number[] = [];

  /* private propertyAdded = {};

  private originalValues = {}; */

  /** window 值变更记录 */
  private updatedValueSet = new Set<PropertyKey>();

  /** 沙箱的名字 */
  name: string = '';
  /** 沙箱的类型 */
  public type: SandBoxType = SandBoxType.Proxy;
  /** 沙箱是否在运行中 */
  sandboxRunning: boolean = true;

  constructor(props: SandboxProps = { name: '' }) {
    if (!window.Proxy) {
      console.warn('proxy sandbox is not support by current browser');
    } /*  else {
      PROXY = window.Proxy;
    } */
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
    if (process.env.NODE_ENV !== 'production') {
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
    const {
      /* propertyAdded, originalValues,  */
      updatedValueSet,
    } = this;
    const self = this;
    const rawWindow = window;
    const { fakeWindow, propertiesWithGetter } = createFakeWindow(rawWindow); // 生成一份伪造的window
    const descriptorTargetMap = new Map<PropertyKey, SymbolTarget>();
    const hasOwnProperty = (key: PropertyKey) =>
      fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
    const sandbox = new window.Proxy(fakeWindow, {
      set(target: FakeWindow, p: PropertyKey, value: any): boolean {
        if (self.sandboxRunning) {// 如果沙箱在运行，则更新属性值并记录被更改的属性
          // eslint-disable-next-line no-prototype-builtins
          if (variableWhiteList.indexOf(p) !== -1) {
            // @ts-ignore
            rawWindow[p] = value;
          }
          // eslint-disable-next-line no-param-reassign
          //@ts-ignore
          target[p] = value;
          updatedValueSet.add(p);
        }
        return true;
      },
      get(target: FakeWindow, p: PropertyKey): any {
        if (p === Symbol.unscopables) {
          // 加固，防止逃逸
          return unscopables;
        }
        // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
        if (p === 'window' || p === 'self') {
          return sandbox;
        }

        if (p === 'top' || p === 'parent') {
          // if your master app in an iframe context, allow these props escape the sandbox
          /* if (rawWindow === rawWindow.parent) {
            return sandbox;
          }
          return (rawWindow as any)[p]; */
          return sandbox;
        }
        // proxy hasOwnProperty, in case of proxy.hasOwnProperty value represented as originalWindow.hasOwnProperty
        if (p === 'hasOwnProperty') {
          // eslint-disable-next-line no-prototype-builtins
          /* return (key: PropertyKey) =>
            //@ts-ignore
            !!target[key] || rawWindow.hasOwnProperty(key); */
          return hasOwnProperty;
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
        const value = propertiesWithGetter.has(p)
          ? (rawWindow as any)[p]
          : (target as any)[p] || (rawWindow as any)[p];
        return getTargetValue(rawWindow, value);
      },
      has(target: Window, p: PropertyKey): boolean {
        return p in unscopables || p in target || p in rawWindow;
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
}
