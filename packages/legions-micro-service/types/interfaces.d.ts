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
export declare type AppMetadata = {
    name: string;
    entry: string;
};
export declare type HTMLContentRender = (props: {
    appContent: string;
    loading: boolean;
}) => any;
export declare type PrefetchStrategy = boolean | 'all' | string[];
export declare type LoadableApp<T extends object = {}> = AppMetadata & {
    props?: T;
} & ({
    render: HTMLContentRender;
} | {
    container: string | HTMLElement;
});
export declare type RegistrableApp<T extends object = {}> = LoadableApp<T> & {
    loader?: (loading: boolean) => void;
    activeRule: RegisterApplicationConfig['activeWhen'];
    /** 是否合并多文件js代码后在执行，默认false,不合并 */
    isMerge?: boolean;
};
declare type legionsMicroServerSpecialOpts = {
    /**
     * @deprecated internal api, don't used it as normal, might be removed after next version
     */
    $$cacheLifecycleByAppName?: boolean;
    prefetch?: PrefetchStrategy;
    sandbox?: boolean | {
        strictStyleIsolation?: boolean;
        experimentalStyleIsolation?: boolean;
        /**
         * @deprecated We use strict mode by default
         */
        loose?: boolean;
        patchers?: Patcher[];
    };
    singular?: boolean | ((app: LoadableApp<any>) => Promise<boolean>);
    /**
     * skip some scripts or links intercept, like JSONP
     */
    excludeAssetFilter?: (url: string) => boolean;
};
export declare type FrameworkConfiguration = legionsMicroServerSpecialOpts & ImportEntryOpts & StartOpts;
export declare type LifeCycleFn<T extends object> = (app: LoadableApp<T>, global: typeof window) => Promise<any>;
export declare type FrameworkLifeCycles<T extends object> = {
    beforeLoad?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
    beforeMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
    afterMount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
    beforeUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
    afterUnmount?: LifeCycleFn<T> | Array<LifeCycleFn<T>>;
};
export declare type MicroApp = Parcel;
export declare type Rebuilder = () => void;
export declare type Freer = () => Rebuilder;
export declare type Patcher = () => Freer;
export declare type OnGlobalStateChangeCallback<IGlobalState = Record<string, any>> = (state: IGlobalState, prevState: IGlobalState, event?: IOperation) => void;
interface IOperation {
    name: string;
    scope: string;
}
export interface IResource {
    created: IOperation;
    events: string[];
    name: string;
    removed: IOperation;
    updated: IOperation;
}
export declare type MicroAppStateActions = {
    onGlobalStateChange: <IGlobalState = Record<string, any>>(callback: OnGlobalStateChangeCallback<IGlobalState>, options?: {
        fireImmediately?: boolean;
        eventScopes?: IResource[];
    }) => void;
    setGlobalState: (state: Record<string, any>, event: {
        name: string;
        scope: string;
    }) => boolean;
    offGlobalStateChange: () => boolean;
};
export declare type Unpacked<T> = T extends (infer U)[] ? U : T extends (...args: any[]) => infer U ? U : T extends Promise<infer U> ? U : T;
export {};
