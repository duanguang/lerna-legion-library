import {
  FrameworkConfiguration,
  FrameworkLifeCycles,
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
import { Deferred, toArray } from '../utils';
import { loadApp } from './loader';

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
    const { name, activeRule, loader = noop, props, ...appConfig } = app;

    registerApplication({
      name,
      app: async () => {
        loader(true);
        await frameworkStartedDefer.promise;

        const { mount, ...otherMicroAppConfigs } = (
          await loadApp(
            { name, props, ...appConfig },
            frameworkConfiguration,
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
  console.log(
    frameworkConfiguration,
    'frameworkConfigurationframeworkConfigurationframeworkConfiguration'
  );
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
