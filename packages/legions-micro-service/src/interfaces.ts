/**
 * copy from https://www.npmjs.com/package/qiankun
 */
import { ImportEntryOpts } from 'legions-import-html-entry';
import { RegisterApplicationConfig, StartOpts, Parcel } from 'single-spa';
declare global {
  interface Window {
    __POWERED_BY_LEGIONS__?: boolean;
    __INJECTED_PUBLIC_PATH_BY_LEGIONS__?: string;
  }
}
export type AppMetadata = {
  // app name
  name: string;
  // app entry
  entry: string;
};
export type HTMLContentRender = (props: {
  appContent: string;
  loading: boolean;
}) => any;
export type PrefetchStrategy = boolean | 'all' | string[];
export type LoadableApp<T extends object = {}> = AppMetadata & {
  /* props pass through to app */ props?: T;
} & (
    | {
        // legacy mode, the render function all handled by user
        render: HTMLContentRender;
      }
    | {
        // where the app mount to, mutual exclusive with the legacy custom render function
        container: string | HTMLElement;
      }
  );
export type RegistrableApp<T extends object = {}> = LoadableApp<T> & {
  loader?: (loading: boolean) => void;
  activeRule: RegisterApplicationConfig['activeWhen'];
  /** 是否合并多文件js代码后在执行，默认false,不合并 */
  isMerge?: boolean;
};
type legionsMicroServerSpecialOpts = {
  /**
   * @deprecated internal api, don't used it as normal, might be removed after next version
   */
  $$cacheLifecycleByAppName?: boolean;
  prefetch?: PrefetchStrategy;
  sandbox?:
    | boolean
    | {
        strictStyleIsolation?: boolean;
        experimentalStyleIsolation?: boolean;
        /**
         * @deprecated We use strict mode by default
         */
        loose?: boolean;
        patchers?: Patcher[];
      };
  /*
    with singular mode, any app will wait to load until other apps are unmouting
    it is useful for the scenario that only one sub app shown at one time
  */
  singular?: boolean | ((app: LoadableApp<any>) => Promise<boolean>);
  /**
   * skip some scripts or links intercept, like JSONP
   */
  excludeAssetFilter?: (url: string) => boolean;
};
export type FrameworkConfiguration = legionsMicroServerSpecialOpts &
  ImportEntryOpts &
  StartOpts;

export type LifeCycleFn<T extends object> = (
  app: LoadableApp<T>,
  global: typeof window
) => Promise<any>;
export type FrameworkLifeCycles<T extends object> = {
  beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app load
  beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app mount
  afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function after app mount
  beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function before app unmount
  afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>; // function after app unmount
};

export type MicroApp = Parcel;
export type Rebuilder = () => void;
export type Freer = () => Rebuilder;
export type Patcher = () => Freer;

export type OnGlobalStateChangeCallback = (
  state: Record<string, any>,
  prevState: Record<string, any>
) => void;
export type MicroAppStateActions = {
  onGlobalStateChange: (
    callback: OnGlobalStateChangeCallback,
    fireImmediately?: boolean
  ) => void;
  setGlobalState: (state: Record<string, any>) => boolean;
  offGlobalStateChange: () => boolean;
};

export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;
