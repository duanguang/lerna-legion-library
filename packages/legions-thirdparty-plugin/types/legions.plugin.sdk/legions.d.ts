import { IReport } from './report';
import { ILegionsPluginDataOrigin } from './data.origin';
interface IAppStore {
    apps: {
        appId: string;
        styleId: string;
        name: string;
        render: () => void;
        entry: string;
        container: string;
    }[];
    scriptResources: {
        [x: string]: {
            excludeSandboxFiles: {
                code: string;
                url: string;
            }[];
            sandbox: string[];
            scriptCache: {
                code: string;
                key: string;
            }[];
            scripts: string[];
            styles: string[];
        };
    };
    currentEnvironment: 'normal' | 'sandbox';
    externalOnloadScript: {
        url: string;
        code: string;
    }[];
}
interface ClassOf<T> {
    new (...args: any[]): T;
}
declare class MicroApps {
    /**
     *Creates an instance of MicroApps.
     * @param {*} options  {
                excludeFiles:['vendor.dll.65dbcc8352253775138423bdeb0f0cdf.js'],
                importHTML:'',
        isMerge:false}
     * @memberof MicroApps
     */
    constructor(options: {
        isMerge: boolean;
        excludeFiles: string[];
        /** url */
        importHTML: string;
    });
    static getStore(): IAppStore;
    getApps(): IAppStore;
    mounted(apps?: {
        entry: string;
        name: string;
        appId: string;
        styleId: string;
        /** 容易 */
        container: string;
    }): void;
}
interface IlegionsPlugin {
    BrowserMatch: {
        getBrowser: () => {
            browser: string;
            desc: string;
            version: string;
        };
        getOS: () => string;
        getDigits: () => string;
        init: () => void;
        OS?: string;
        browser?: string;
        version?: string;
    };
    DataOrigin: {
        add: <T, K extends keyof T>(key: keyof Partial<T>, value: T[K]) => void;
        has: <T>(key: keyof Partial<T>) => boolean;
        get: <T, K extends keyof T, DataOrigin = {}>(key: keyof Partial<T & ILegionsPluginDataOrigin & DataOrigin>) => T[K];
        update: <T, K extends keyof T>(key: keyof Partial<T>, value: T[K]) => void;
    };
    onloadScript: (src: string, onLoad?: Function) => void;
    checkBrowser: () => boolean;
    PostMessageUtils: {
        receiveMessage: (receive: Function) => void;
        sendMessageToChildrenWin: (options: {
            data: Object;
            childrenId: string;
            origin: string;
        }) => void;
        sendMessageToParentWin: (options: {
            data: Object;
            origin: string;
        }) => void;
    };
    Report: IReport;
    MicroApps: ClassOf<MicroApps> & typeof MicroApps;
}
/** 公共SDK方法，包含用户浏览器信息,写入公共方法 */
export declare const legionsPlugins: (onLoaded?: () => void, src?: string) => IlegionsPlugin;
/**全局变量LegionsPlugins执行函数
 * 回调函数执行时机，如果SDK资源未加载，则在资源加载完成时执行。如果资源已经准备妥当，则直接执行回调
 *
 */
export declare function LegionsPluginsExecute(onExecute: (legions: IlegionsPlugin) => void): void;
/** 查找window 变量值，优先查找父级元素，如果没有找到 */
export declare function findWindow<T = {}>(name: string): T | null;
/** 动态加载JS资源 */
export declare function dynamicLoadingScript<T = {}>(options: {
    /** 创建资源节点的唯一ID */
    scriptId: string;
    src: string;
    /** 全局变量名称 */
    library: string;
    loaded?: (value: T | null) => void;
}): void;
export {};
