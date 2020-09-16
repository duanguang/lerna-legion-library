export declare type loggerType = 'hlTable-constructor' | 'hlTable-watchData' | 'hlTable-componentWillMount' | 'hlTable-componentWillUnmount' | 'hlTable-componentDidMount' | 'hlTable-componentDidUpdate' | 'hlTable-componentWillReceiveProps' | 'hlTable-render' | 'hlFormContainer-constructor' | 'hlFormContainer-watchData' | 'hlFormContainer-componentWillMount' | 'hlFormContainer-componentWillUnmount' | 'hlFormContainer-componentDidMount' | 'hlFormContainer-componentDidUpdate' | 'hlFormContainer-componentWillReceiveProps' | 'hlFormContainer-render' | 'hlFormContainer-validateFields' | 'uiStore';
interface IUserInfo<U = {}> {
    userEntity?: {
        userName: string;
        userUid: string;
        companyName?: string;
        companyUid?: string;
        /** 接口返回的原始用户信息 */
        rowData?: U;
    };
}
interface IWindow<U = {}> {
    openTabPane?: (pane: {
        key: string;
        keyPath?: string[];
        title?: string;
        path?: string;
    }) => void;
    removeTablePane?: (targetKey: string | string[]) => void;
    userInfo?: IUserInfo<U>['userEntity'];
}
export interface ILegionsPluginDataOrigin {
    /** 表格组件关键点函数埋点函数，如果需要调试各个节点输出信息，就请注入。 系统级别私有方法 */
    onHLTableCycle?: (value: Object, type: loggerType) => void;
    /** 表单组件关键点函数埋点函数，如果需要调试各个节点输出信息，就请注入。 系统级别私有方法 */
    onHLFormCycle?: (value: Object, type: loggerType) => void;
    /** 系统级别私有方法, 其他成员调用前先咨询 */
    openBrowserUpdateMessage?: () => void;
    /** 操作记录上报函数， 系统级别私有方法, 其他成员调用前先咨询 */
    loggerReport?: (value: Object, type: loggerType) => void;
    /** 打开系统菜单页签 */
    onSysOpenTabPane?: IWindow['openTabPane'];
    /** 移除系统菜单页签 */
    onSysRemoveTablePane?: IWindow['removeTablePane'];
    /** 获取用户信息, 请勿直接修改 */
    readonly sysUserInfos?: IUserInfo['userEntity'];
}
interface IReport {
    new (options: {
        /**
         * 上报数据的属性名，用于服务器获取数据
         *
         * @type {string}
         */
        dataKey: string;
        /**
         * mergeReport 是否合并上报， false 关闭， true 启动（默认）
         *
         * @type {boolean}
         */
        mergeReport?: boolean;
        /**
         *
         * 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
         * @type {number}
         */
        delay?: number;
        /**
         *
         * 指定错误上报地址
         * @type {string}
         */
        url: string;
        /**
         *
         * post请求路径
         * @type {string}
         */
        postPath: string;
        /**
         * 抽样上报，1~0 之间数值，1为100%上报（默认 1）
         *
         * @type {number}
         */
        random?: number;
    }): IReportMethods;
}
interface IReportMethods {
    watch: (appSystem: string, environment: string) => void;
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
        get: <T, K extends keyof T>(key: keyof Partial<T & ILegionsPluginDataOrigin>) => T[K];
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
}
/** 公共SDK方法，包含用户浏览器信息,写入公共方法 */
export declare const legionsPlugins: (onLoaded?: () => void, src?: string) => IlegionsPlugin;
/**全局变量LegionsPlugins执行函数
 * 回调函数执行时机，如果SDK资源未加载，则在资源加载完成时执行。如果资源已经准备妥当，则直接执行回调
 *
 */
export declare function LegionsPluginsExecute(onExecute: (legions: IlegionsPlugin) => void): void;
interface ILoggerManagerConsoleLog {
    type: loggerType;
    logConent?: Object;
    /**  */
    methodsName: keyof Partial<ILegionsPluginDataOrigin>;
}
interface IReportApi {
    api: (params: {
        modulesPath?: string;
        type: string;
        content: string;
        modulesName?: string;
        userInfo: string;
        traceId: string;
        browserEnvironment: string;
    }) => any;
}
interface ILoggerManagerReport extends Pick<ILoggerManagerConsoleLog, 'type' | 'logConent'> {
    traceId: string;
    modulesPath?: string;
    content: string;
    modulesName?: string;
    userInfo?: string;
    browserEnvironment?: string;
}
/** 日志记录 */
export declare const LoggerManager: {
    consoleLog: (options: ILoggerManagerConsoleLog) => void;
    report: (options: ILoggerManagerReport, reportApi: IReportApi['api']) => void;
};
export {};
