export declare class MicroApps {
    importHTML: string;
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
        importHTML?: string;
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
        scriptResources: {};
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
        scriptResources: {};
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
