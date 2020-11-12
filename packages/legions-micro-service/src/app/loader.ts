import {
  FrameworkConfiguration,
  FrameworkLifeCycles,
  HTMLContentRender,
  LifeCycleFn,
  LoadableApp,
} from '../interfaces';
import { LifeCycles, ParcelConfigObject } from 'single-spa';
import forEach from 'lodash/forEach';
import concat from 'lodash/concat';
import mergeWith from 'lodash/mergeWith';
import {
  Deferred,
  getContainer,
  getDefaultTplWrapper,
  getWrapperId,
  isEnableScopedCSS,
  performanceMark,
  performanceMeasure,
  toArray,
  validateExportLifecycle,
} from '../utils';
import { importHTML } from 'legions-import-html-entry';
import * as css from '../sandbox/patchers/css';
import getAddOns from '../addons';
import { getMicroAppStateActions } from './globalState';
import { createSandbox } from '../sandbox';

function assertElementExist(element: Element | null | undefined, msg?: string) {
  if (!element) {
    if (msg) {
      throw new Error(msg);
    }

    throw new Error('[legions] element not existed!');
  }
}

function execHooksChain<T extends object>(
  hooks: Array<LifeCycleFn<T>>,
  app: LoadableApp<T>,
  global = window
): Promise<any> {
  if (hooks.length) {
    return hooks.reduce(
      (chain, hook) => chain.then(() => hook(app, global)),
      Promise.resolve()
    );
  }

  return Promise.resolve();
}

function getAppWrapperGetter(
  appName: string,
  appInstanceId: string,
  useLegacyRender: boolean,
  strictStyleIsolation: boolean,
  scopedCSS: boolean,
  elementGetter: () => HTMLElement | null
) {
  return () => {
    if (useLegacyRender) {
      if (strictStyleIsolation)
        throw new Error(
          '[legions]: strictStyleIsolation can not be used with legacy render!'
        );
      if (scopedCSS)
        throw new Error(
          '[legions]: experimentalStyleIsolation can not be used with legacy render!'
        );

      const appWrapper = document.getElementById(getWrapperId(appInstanceId));
      console.log(
        useLegacyRender,
        strictStyleIsolation,
        appInstanceId,
        appWrapper,
        'appInstanceIdappInstanceIdappInstanceId'
      );
      assertElementExist(
        appWrapper,
        `[legions] Wrapper element for ${appName} with instance ${appInstanceId} is not existed!`
      );
      return appWrapper!;
    }

    const element = elementGetter();
    assertElementExist(
      element,
      `[legions] Wrapper element for ${appName} with instance ${appInstanceId} is not existed!`
    );

    if (strictStyleIsolation) {
      return element!.shadowRoot!;
    }

    return element!;
  };
}
const rawAppendChild = HTMLElement.prototype.appendChild;
const rawRemoveChild = HTMLElement.prototype.removeChild;
type ElementRender = (
  props: {
    element: HTMLElement | null;
    loading: boolean;
    container?: string | HTMLElement;
  },
  phase: 'loading' | 'mounting' | 'mounted' | 'unmounted'
) => any;
function getRender(
  appName: string,
  appContent: string,
  legacyRender?: HTMLContentRender
) {
  const render: ElementRender = ({ element, loading, container }, phase) => {
    if (legacyRender) {
      //@ts-ignore
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          '[legions] Custom rendering function is deprecated, you can use the container element setting instead!'
        );
      }
      return legacyRender({ loading, appContent: element ? appContent : '' });
    }

    const containerElement = getContainer(container!);
    // The container might have be removed after micro app unmounted.
    // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed
    if (phase !== 'unmounted') {
      const errorMsg = (() => {
        switch (phase) {
          case 'loading':
          case 'mounting':
            return `[legions] Target container with ${container} not existed while ${appName} ${phase}!`;

          case 'mounted':
            return `[legions] Target container with ${container} not existed after ${appName} ${phase}!`;

          default:
            return `[legions] Target container with ${container} not existed while ${appName} rendering!`;
        }
      })();
      assertElementExist(containerElement, errorMsg);
    }

    if (containerElement && !containerElement.contains(element)) {
      // clear the container
      while (containerElement!.firstChild) {
        rawRemoveChild.call(containerElement, containerElement!.firstChild);
      }

      // append the element to container if it exist
      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }

    return undefined;
  };

  return render;
}

const supportShadowDOM =
  // @ts-ignore
  document.head.attachShadow || document.head.createShadowRoot;
function createElement(
  appContent: string,
  strictStyleIsolation: boolean,
  scopedCSS: boolean,
  appName: string
): HTMLElement {
  const containerElement = document.createElement('div');
  containerElement.innerHTML = appContent;
  // appContent always wrapped with a singular div
  const appElement = containerElement.firstChild as HTMLElement;
  if (strictStyleIsolation) {
    if (!supportShadowDOM) {
      console.warn(
        '[legions]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!'
      );
    } else {
      const { innerHTML } = appElement;
      appElement.innerHTML = '';
      let shadow: ShadowRoot;

      if (appElement.attachShadow) {
        shadow = appElement.attachShadow({ mode: 'open' });
      } else {
        // createShadowRoot was proposed in initial spec, which has then been deprecated
        shadow = (appElement as any).createShadowRoot();
      }
      shadow.innerHTML = innerHTML;
    }
  }

  if (scopedCSS) {
    const attr = appElement.getAttribute(css.QiankunCSSRewriteAttr);
    if (!attr) {
      appElement.setAttribute(css.QiankunCSSRewriteAttr, appName);
    }

    const styleNodes = appElement.querySelectorAll('style') || [];
    forEach(styleNodes, (stylesheetElement: HTMLStyleElement) => {
      css.process(appElement!, stylesheetElement, appName);
    });
  }

  return appElement;
}

async function validateSingularMode<T extends object>(
  validate: FrameworkConfiguration['singular'],
  app: LoadableApp<T>
): Promise<boolean> {
  return typeof validate === 'function' ? validate(app) : !!validate;
}

function getLifecyclesFromExports(
  scriptExports: LifeCycles<any>,
  appName: string,
  global: WindowProxy
) {
  console.log(
    appName,
    'appName',
    global['react15-home'],
    validateExportLifecycle(scriptExports)
  );
  if (validateExportLifecycle(scriptExports)) {
    return scriptExports;
  }
  //@ts-ignore
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[legions] lifecycle not found from ${appName} entry exports, fallback to get from window['${appName}']`
    );
  }

  // fallback to global variable who named with ${appName} while module exports not found
  const globalVariableExports = (global as any)[appName];

  if (validateExportLifecycle(globalVariableExports)) {
    return globalVariableExports;
  }

  throw new Error(
    `[legions] You need to export lifecycle functions in ${appName} entry`
  );
}

let prevAppUnmountedDeferred: Deferred<void>;
export type ParcelConfigObjectGetter = (
  remountContainer?: string | HTMLElement
) => ParcelConfigObject;
export async function loadApp<T extends object>(
  app: LoadableApp<T>,
  configuration: FrameworkConfiguration = {},
  lifeCycles?: FrameworkLifeCycles<T>
): Promise<ParcelConfigObjectGetter> {
  const { entry, name: appName } = app;
  const appInstanceId = `${appName}_${+new Date()}_${Math.floor(
    Math.random() * 1000
  )}`;

  const markName = `[legions] App ${appInstanceId} Loading`;
  //@ts-ignore
  if (process.env.NODE_ENV !== 'production') {
    performanceMark(markName);
  }

  const {
    singular = false,
    sandbox = true,
    excludeAssetFilter,
    ...importEntryOpts
  } = configuration;

  // get the entry html content and script executor
  const { template, execScripts, assetPublicPath } = await importHTML(
    entry,
    importEntryOpts
  );
  console.log(execScripts, 'execScripts');
  // as single-spa load and bootstrap new app parallel with other apps unmounting
  // (see https://github.com/CanopyTax/single-spa/blob/master/src/navigation/reroute.js#L74)
  // we need wait to load the app until all apps are finishing unmount in singular mode
  if (await validateSingularMode(singular, app)) {
    await (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise);
  }

  const appContent = getDefaultTplWrapper(appInstanceId, appName)(template);

  const strictStyleIsolation =
    typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;
  const scopedCSS = isEnableScopedCSS(sandbox);
  let initialAppWrapperElement: HTMLElement | null = createElement(
    appContent,
    strictStyleIsolation,
    scopedCSS,
    appName
  );

  const initialContainer = 'container' in app ? app.container : undefined;
  const legacyRender = 'render' in app ? app.render : undefined;
  const render = getRender(appName, appContent, legacyRender);

  // 第一次加载设置应用可见区域 dom 结构
  // 确保每次应用加载前容器 dom 结构已经设置完毕
  render(
    {
      element: initialAppWrapperElement,
      loading: true,
      container: initialContainer,
    },
    'loading'
  );

  let global = window;
  let mountSandbox = () => Promise.resolve();
  let unmountSandbox = () => Promise.resolve();
  if (sandbox) {
    const sandboxInstance = createSandbox(
      appName
      // FIXME should use a strict sandbox logic while remount, see https://github.com/umijs/qiankun/issues/518
    );
    console.log(
      sandboxInstance.proxy,
      'sandboxInstance.proxy sandboxInstance.proxy '
    );
    // 用沙箱的代理对象作为接下来使用的全局对象
    global = sandboxInstance.proxy as typeof window;
    mountSandbox = sandboxInstance.mount;
    unmountSandbox = sandboxInstance.unmount;
  }

  const {
    beforeUnmount = [],
    afterUnmount = [],
    afterMount = [],
    beforeMount = [],
    beforeLoad = [],
  } = mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, (v1, v2) =>
    concat(v1 ?? [], v2 ?? [])
  );

  await execHooksChain(toArray(beforeLoad), app, global);

  // get the lifecycle hooks from module exports
  const scriptExports: any = await execScripts(global);
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    scriptExports,
    appName,
    global
  );

  console.log(mount, 'mountmount');
  const {
    onGlobalStateChange,
    setGlobalState,
    offGlobalStateChange,
  }: Record<string, Function> = getMicroAppStateActions(appInstanceId);

  // FIXME temporary way
  const syncAppWrapperElement2Sandbox = (element: HTMLElement | null) =>
    (initialAppWrapperElement = element);

  const parcelConfigGetter: ParcelConfigObjectGetter = (
    remountContainer = initialContainer
  ) => {
    let appWrapperElement: HTMLElement | null = initialAppWrapperElement;
    const appWrapperGetter = getAppWrapperGetter(
      appName,
      appInstanceId,
      !!legacyRender,
      strictStyleIsolation,
      scopedCSS,
      () => appWrapperElement
    );

    const parcelConfig: ParcelConfigObject = {
      name: appInstanceId,
      bootstrap,
      mount: [
        async () => {
          //@ts-ignore
          if (process.env.NODE_ENV === 'development') {
            const marks = performance.getEntriesByName(markName, 'mark');
            // mark length is zero means the app is remounting
            if (!marks.length) {
              performanceMark(markName);
            }
          }
        },
        async () => {
          if (
            (await validateSingularMode(singular, app)) &&
            prevAppUnmountedDeferred
          ) {
            return prevAppUnmountedDeferred.promise;
          }

          return undefined;
        },
        // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
        async () => {
          const useNewContainer = remountContainer !== initialContainer;
          if (useNewContainer || !appWrapperElement) {
            // element will be destroyed after unmounted, we need to recreate it if it not exist
            // or we try to remount into a new container
            appWrapperElement = createElement(
              appContent,
              strictStyleIsolation,
              scopedCSS,
              appName
            );
            syncAppWrapperElement2Sandbox(appWrapperElement);
          }

          render(
            {
              element: appWrapperElement,
              loading: true,
              container: remountContainer,
            },
            'mounting'
          );
        },
        mountSandbox,
        // exec the chain after rendering to keep the behavior with beforeLoad
        async () => execHooksChain(toArray(beforeMount), app, global),
        async props =>
          mount({
            ...props,
            container: appWrapperGetter(),
            setGlobalState,
            onGlobalStateChange,
          }),
        // finish loading after app mounted
        async () =>
          render(
            {
              element: appWrapperElement,
              loading: false,
              container: remountContainer,
            },
            'mounted'
          ),
        async () => execHooksChain(toArray(afterMount), app, global),
        // initialize the unmount defer after app mounted and resolve the defer after it unmounted
        async () => {
          if (await validateSingularMode(singular, app)) {
            prevAppUnmountedDeferred = new Deferred<void>();
          }
        },
        async () => {
          //@ts-ignore
          if (process.env.NODE_ENV === 'development') {
            const measureName = `[legions] App ${appInstanceId} Loading Consuming`;
            performanceMeasure(measureName, markName);
          }
        },
      ],
      unmount: [
        async () => execHooksChain(toArray(beforeUnmount), app, global),
        async props => unmount({ ...props, container: appWrapperGetter() }),
        unmountSandbox,
        async () => execHooksChain(toArray(afterUnmount), app, global),
        async () => {
          render(
            { element: null, loading: false, container: remountContainer },
            'unmounted'
          );
          offGlobalStateChange(appInstanceId);
          // for gc
          appWrapperElement = null;
          syncAppWrapperElement2Sandbox(appWrapperElement);
        },
        async () => {
          if (
            (await validateSingularMode(singular, app)) &&
            prevAppUnmountedDeferred
          ) {
            prevAppUnmountedDeferred.resolve();
          }
        },
      ],
    };

    if (typeof update === 'function') {
      parcelConfig.update = update;
    }

    return parcelConfig;
  };

  return parcelConfigGetter;
}
