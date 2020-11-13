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
        /** 外部资源加载Promise结果 */
        externalOnloadScriptPromise: Promise<any>[];
    };
}
export declare class MicroApps {
    constructor();
    static getStore(): {
        apps: {
            name: string;
            entry: string;
            container: string;
        }[];
        scriptResources: IScriptResources;
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
        }[];
        scriptResources: IScriptResources;
        externalOnloadScript: {
            url: string;
            code: string;
        }[];
    };
    isRegister(apps: any): {
        name: string;
        entry: string;
        container: string;
    }[] | null;
    register(apps: any): void;
    bootstrap(apps: {
        container: string;
        entry: string;
        name: string;
    }, importHtmlentryResult: {
        getExternalScripts: Unpacked<ReturnType<typeof importHTML>>['getExternalScripts'];
        getScripts: Unpacked<ReturnType<typeof importHTML>>['getScripts'];
    }): void;
}
export {};
