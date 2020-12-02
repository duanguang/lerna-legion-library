import {
  FrameworkConfiguration,
  FrameworkLifeCycles,
  LoadableApp,
  MicroApp,
  RegistrableApp,
} from '../interfaces';
import noop from 'lodash/noop';
import {
  mountRootParcel,
  ParcelConfigObject,
  registerApplication,
  start as startSingleSpa,
} from 'single-spa';
import { doPrefetchStrategy } from '../core/prefetch';
import { Deferred, getContainer, getXPathForElement, toArray } from '../utils';
import { loadApp, ParcelConfigObjectGetter } from './loader';

export let frameworkConfiguration: FrameworkConfiguration = {};
const frameworkStartedDefer = new Deferred<void>();
let microApps: RegistrableApp[] = [];

export function registerMicroApps<T extends object = {}>(
  apps: Array<RegistrableApp<T>>,
  lifeCycles?: FrameworkLifeCycles<T>
) {
  // Each app only needs to be registered once
  const unregisteredApps = apps.filter(
    app => !microApps.some(registeredApp => registeredApp.name === app.name)
  );

  microApps = [...microApps, ...unregisteredApps];

  unregisteredApps.forEach(app => {
    const { name, activeRule, loader = noop, props,isMerge=false, ...appConfig } = app;
    registerApplication({
      name,
      app: async () => {
        loader(true);
        await frameworkStartedDefer.promise;

        const { mount, ...otherMicroAppConfigs } = (
          await loadApp(
            { name, props, ...appConfig },
            {...frameworkConfiguration,isMerge},
            lifeCycles
          )
        )();
        return {
          mount: [
            async () => loader(true),
            ...toArray(mount),
            async () => loader(false),
          ],
          ...otherMicroAppConfigs,
        };
      },
      activeWhen: activeRule,
      customProps: props,
    });
  });
}
const appConfigPromiseGetterMap = new Map<string, Promise<ParcelConfigObjectGetter>>();

export function loadMicroApp<T extends object = {}>(
  app: LoadableApp<T>,
  configuration?: FrameworkConfiguration,
  lifeCycles?: FrameworkLifeCycles<T>,
): MicroApp {
  const { props, name } = app;

  const getContainerXpath = (container: string | HTMLElement): string | void => {
    const containerElement = getContainer(container);
    if (containerElement) {
      return getXPathForElement(containerElement, document);
    }

    return undefined;
  };

  const wrapParcelConfigForRemount = (config: ParcelConfigObject): ParcelConfigObject => {
    return {
      ...config,
      // empty bootstrap hook which should not run twice while it calling from cached micro app
      bootstrap: () => Promise.resolve(),
    };
  };

  /**
   * using name + container xpath as the micro app instance id,
   * it means if you rendering a micro app to a dom which have been rendered before,
   * the micro app would not load and evaluate its lifecycles again
   */
  const memorizedLoadingFn = async (): Promise<ParcelConfigObject> => {
    const { $$cacheLifecycleByAppName } = configuration ?? frameworkConfiguration;
    const container = 'container' in app ? app.container : undefined;

    if (container) {
      // using appName as cache for internal experimental scenario
      if ($$cacheLifecycleByAppName) {
        const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);
        if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
      }

      const xpath = getContainerXpath(container);
      if (xpath) {
        const parcelConfigGetterPromise = appConfigPromiseGetterMap.get(`${name}-${xpath}`);
        if (parcelConfigGetterPromise) return wrapParcelConfigForRemount((await parcelConfigGetterPromise)(container));
      }
    }

    const parcelConfigObjectGetterPromise = loadApp(app, configuration ?? frameworkConfiguration, lifeCycles);

    if (container) {
      if ($$cacheLifecycleByAppName) {
        appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
      } else {
        const xpath = getContainerXpath(container);
        if (xpath) appConfigPromiseGetterMap.set(`${name}-${xpath}`, parcelConfigObjectGetterPromise);
      }
    }

    return (await parcelConfigObjectGetterPromise)(container);
  };

  return mountRootParcel(memorizedLoadingFn, { domElement: document.createElement('div'), ...props });
}

export function start(opts: FrameworkConfiguration = {}) {
  frameworkConfiguration = {
    prefetch: true,
    singular: true, // 是否为单实例场景，默认为 true。
    sandbox: true,
    ...opts,
  };
  const {
    prefetch,
    sandbox,
    singular,
    urlRerouteOnly,
    ...importEntryOpts
  } = frameworkConfiguration;
  if (prefetch) {
    doPrefetchStrategy(microApps, prefetch, importEntryOpts);
  }

  if (sandbox) {
    if (!window.Proxy) {
      console.warn(
        '[legions] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox'
      );
      frameworkConfiguration.sandbox =
        typeof sandbox === 'object'
          ? { ...sandbox, loose: true }
          : { loose: true };
      if (!singular) {
        console.warn(
          '[legions] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy'
        );
      }
    }
  }

  startSingleSpa({ urlRerouteOnly });

  frameworkStartedDefer.resolve();
}
