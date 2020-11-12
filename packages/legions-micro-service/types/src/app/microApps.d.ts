import { importHTML } from 'legions-import-html-entry';
import { Unpacked } from '../interfaces';
interface IScriptResources {
    [key: string]: {
        scripts: string[];
        scriptCache: {
            key: string;
            code: string;
        }[];
        sandbox: string[];
        styles: string[];
        excludeSandboxFiles: {
            url: string;
            code: string;
        }[];
        importHtmlentryResult: Unpacked<ReturnType<typeof importHTML>>;
        /** 外部资源加载Promise结果 */
        externalOnloadScriptPromise: Promise<any>[];
    };
}
export declare class MicroApps {
    importHTMLOptions: {
        excludeFiles: string[];
        isMerge: boolean;
    };
    /**
       *Creates an instance of MicroApps.
       * @param {*} options  {
                  excludeFiles:['vendor.dll.65dbcc8352253775138423bdeb0f0cdf.js'],
                  importHTML:'',
                  isMerge:false}
       * @memberof MicroApps
       */
    constructor(options: {
        excludeFiles?: string[];
        isMerge?: boolean;
    });
    static getStore(): {
        apps: {
            name: string;
            entry: string;
            container: string;
            appId: string;
            styleId: string;
            loading?: boolean | undefined;
            render?: (() => void) | undefined;
        }[];
        scriptResources: IScriptResources;
        currentEnvironment: string;
        externalOnloadScript: {
            url: string;
            code: string;
        }[];
    };
    getApps(): {
        apps: {
            name: string;
            entry: string;
            container: string;
            appId: string;
            styleId: string;
            loading?: boolean | undefined;
            render?: (() => void) | undefined;
        }[];
        scriptResources: IScriptResources;
        currentEnvironment: string;
        externalOnloadScript: {
            url: string;
            code: string;
        }[];
    };
    isRegister(apps: any): {
        name: string;
        entry: string;
        container: string;
        appId: string;
        styleId: string;
        loading?: boolean | undefined;
        render?: (() => void) | undefined;
    }[] | null;
    register(apps: any): void;
    addRender(app: {
        name: string;
        render: () => void;
    }): void;
    mounted(apps: {
        appId: string;
        container: string;
        styleId: string;
        entry: string;
        name: string;
        loading?: boolean;
        render?: () => void;
    }): void;
}
export {};
