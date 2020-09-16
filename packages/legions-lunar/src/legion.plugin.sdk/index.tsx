import { notification } from 'antd';
import React from 'react';
export type loggerType = 'hlTable-constructor' | 'hlTable-watchData' | 'hlTable-componentWillMount' | 'hlTable-componentWillUnmount'
    | 'hlTable-componentDidMount' | 'hlTable-componentDidUpdate' | 'hlTable-componentWillReceiveProps' | 'hlTable-render'
    | 'hlFormContainer-constructor' | 'hlFormContainer-watchData' | 'hlFormContainer-componentWillMount' | 'hlFormContainer-componentWillUnmount'
    | 'hlFormContainer-componentDidMount' | 'hlFormContainer-componentDidUpdate' | 'hlFormContainer-componentWillReceiveProps' | 'hlFormContainer-render'
    | 'hlFormContainer-validateFields' | 'uiStore'
interface IUserInfo<U = {}> {
    userEntity?: {
        userName: string
        userUid: string;
        companyName?: string,
        companyUid?: string,
        /** 接口返回的原始用户信息 */
        rowData?: U;
    }
}
interface IWindow<U = {}> {
    openTabPane?: (pane: { key: string; keyPath?: string[]; title?: string; path?: string }) => void;
    removeTablePane?: (targetKey: string | string[]) => void;
    userInfo?: IUserInfo<U>['userEntity']
}
export interface ILegionsPluginDataOrigin {
    /** 表格组件关键点函数埋点函数，如果需要调试各个节点输出信息，就请注入。 系统级别私有方法 */
    onHLTableCycle?: (value: Object,type: loggerType) => void;
    /** 表单组件关键点函数埋点函数，如果需要调试各个节点输出信息，就请注入。 系统级别私有方法 */
    onHLFormCycle?: (value: Object,type: loggerType) => void;
    /** 系统级别私有方法, 其他成员调用前先咨询 */
    openBrowserUpdateMessage?: () => void;
    /** 操作记录上报函数， 系统级别私有方法, 其他成员调用前先咨询 */
    loggerReport?: (value: Object,type: loggerType) => void;
    /** 打开系统菜单页签 */
    onSysOpenTabPane?: IWindow['openTabPane'];
    /** 移除系统菜单页签 */
    onSysRemoveTablePane?: IWindow['removeTablePane'];
    /** 获取用户信息, 请勿直接修改 */
    readonly sysUserInfos?: IUserInfo['userEntity'];
}
interface IReport {
    // tslint:disable-next-line: callable-types
    new(options: {

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
    }): IReportMethods
}
interface IReportMethods {
    watch: (appSystem: string,environment: string) => void;
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
        add: <T,K extends keyof T>(key: keyof Partial<T>,value: T[K]) => void;
        has: <T>(key: keyof Partial<T>) => boolean;
        get: <T,K extends keyof T>(key: keyof Partial<T & ILegionsPluginDataOrigin>) => T[K];
        update: <T,K extends keyof T>(key: keyof Partial<T>,value: T[K]) => void
    };
    onloadScript: (src: string,onLoad?: Function) => void;
    checkBrowser: () => boolean;
    PostMessageUtils: {
        receiveMessage: (receive: Function) => void;
        sendMessageToChildrenWin: (options: { data: Object; childrenId: string; origin: string }) => void;
        sendMessageToParentWin: (options: { data: Object; origin: string }) => void;
    };
    Report: IReport;
}
let legionsPluginLoadedList: Array<() => void> = []; // 主要用于存储legions-plugin-sdk 加载完成时，需要执行的回调函数队列信息
function onLoadScript(onLoaded?: () => void,src?: string) {
    let id = 'legions-plugin-sdk'
    if (!window['legionsPlugins'] && !window.parent['legionsPlugins'] && !document.getElementById(id)) {
        let script = document.createElement('script');
        script.id = id;
        const version = Date.parse(new Date().toString());
        if (src && typeof src === 'string') {
            script.src = src;
        } else {
            script.src = process.env.environment === 'production' ? `https://hoolinks.com/static/common/plugins/legions-plugin-sdk.min.js?v=${version}` : `https://qa-zy.hoolinks.com/static/plugin/legions-plugin-sdk.js?v=${version}`;
        }
        document.body.appendChild(script);
        // @ts-ignore
        script.onload = script.onreadystatechange = function () {
            // tslint:disable-next-line: no-invalid-this
            //@ts-ignore
            if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
                let legions = legionsPlugins();
                addBrowserMessage(legions);
                if (typeof onLoaded === 'function') {
                    onLoaded && onLoaded();
                }
                legionsPluginLoadedList.map((item) => {
                    item();
                })
                legionsPluginLoadedList = [];
            }
        };
    }
}
function addBrowserMessage(legions: IlegionsPlugin) {
    if (!legions) {
        return;
    }
    if (legions.DataOrigin.has<ILegionsPluginDataOrigin>('openBrowserUpdateMessage')) {
        return;
    }
    legions.DataOrigin.add('openBrowserUpdateMessage',() => {
        const keys = 'isOpenBrowserUpdateMessage'
        if (!legions.DataOrigin.get(keys)) {
            const key = `open${Date.now()}`;
            notification.warning({
                btn: (<a href="http://browsehappy.osfipin.com/">
                    立即升级
                </a>),
                duration: void 0,
                key,
                className: key,
                message: (<span style={{ color: 'red' }}>浏览器升级通知</span>),
                description: (<div><p>您的浏览器版本过低，可能无法使用部分功能。</p><p>为了获得更好的使用体验，请您升级。</p><p style={{ color: 'red' }}>推荐使用谷歌，火狐浏览器!</p></div>),
            })
            let closeDom = document.getElementsByClassName(key);
            if (closeDom && closeDom.length > 0) {
                closeDom = closeDom[0].getElementsByClassName('ant-notification-notice-close');
                if (closeDom && closeDom.length > 0) {
                    let closeDoms = closeDom[0];
                    closeDoms.setAttribute('style','display:none')
                }
            }
            if (legions.DataOrigin.has(keys)) {
                legions.DataOrigin.update(keys,true);
            } else {
                legions.DataOrigin.add(keys,true);
            }
        }
    })
}
const _LegionsPlugins = () => {
    let _legions = null;
    let getLegions = (onLoaded?: () => void,src?: string) => {
        if (_legions) {
            if (typeof onLoaded === 'function') {
                onLoaded && onLoaded(); // 如果资源已经加载完成，传入的回调函数立即执行
            }
            //@ts-ignore
            addBrowserMessage(_legions)
            return _legions;
        }
        let legions = null;
        try {
            if (window['legionsPlugins'] && Object.keys(window['legionsPlugins']).length > 0) {
                legions = window['legionsPlugins'];
            } else if (window.parent['legionsPlugins'] && Object.keys(window.parent['legionsPlugins']).length > 0) {
                legions = window.parent['legionsPlugins'];
            }
        } catch (e) {
            legions = window['legionsPlugins'];
        } finally {
            if (!legions) {
                if (onLoaded && typeof onLoaded === 'function') {
                    // 当资源还未加载完成时，所有调用该函数的回调，全部写入待执行队列，在资源加载完成，在依次执行
                    legionsPluginLoadedList.push(onLoaded);
                }
                onLoadScript(onLoaded,src)
            }
        }
        _legions = legions;
        return _legions;
    }
    return getLegions;
}
/** 公共SDK方法，包含用户浏览器信息,写入公共方法 */
//@ts-ignore
export const legionsPlugins: (onLoaded?: () => void,src?: string) => IlegionsPlugin = _LegionsPlugins();

/**全局变量LegionsPlugins执行函数
 * 回调函数执行时机，如果SDK资源未加载，则在资源加载完成时执行。如果资源已经准备妥当，则直接执行回调
 *
 */
export function LegionsPluginsExecute(onExecute: (legions: IlegionsPlugin) => void) {
    legionsPlugins(() => {
        const legions = legionsPlugins()
        if (legions) {
            onExecute && onExecute(legions);
        }
    })
}

interface ILoggerManagerConsoleLog {
    type: loggerType;
    logConent?: Object;
    /**  */
    methodsName: keyof Partial<ILegionsPluginDataOrigin>;
}
interface IReportApi {
    /*上报接口*/
    api: (params: {
        modulesPath?: string;
        type: string;
        content: string;
        modulesName?: string;
        userInfo: string;
        traceId: string;
        browserEnvironment: string;
    }) => any
}
declare function loggerReport(params: {
    modulesPath?: string;
    type: string;
    content: string;
    modulesName?: string;
    userInfo: string;
    traceId: string;
    browserEnvironment: string;
}): any
interface ILoggerManagerReport
    extends Pick<ILoggerManagerConsoleLog,'type' | 'logConent'> {
    traceId: string;
    modulesPath?: string;
    content: string;
    modulesName?: string;
    userInfo?: string;
    browserEnvironment?: string;
}
/** 日志记录 */
export const LoggerManager = {
    consoleLog: (options: ILoggerManagerConsoleLog) => {
        LegionsPluginsExecute(legions => {
            const logConent = options.logConent || {};
            // @ts-ignore
            if (
                legions.DataOrigin.has<ILegionsPluginDataOrigin>(options.methodsName) &&
                //@ts-ignore
                typeof legions.DataOrigin.get<ILegionsPluginDataOrigin>(
                    options.methodsName
                ) === 'function'
            ) {
                // @ts-ignore
                const func = legions.DataOrigin.get<ILegionsPluginDataOrigin>(
                    options.methodsName
                );
                // @ts-ignore
                func({ ...logConent },options.type);
            }
        });
    },
    report: (options: ILoggerManagerReport,
        reportApi: IReportApi['api']) => {
        const logConent = options.content || {};
        const methodsName = 'loggerReport';
        LegionsPluginsExecute(legions => {
            if (
                legions.DataOrigin.has<ILegionsPluginDataOrigin>(methodsName) &&
                typeof legions.DataOrigin.get<ILegionsPluginDataOrigin,'loggerReport'>(
                    methodsName
                ) === 'function'
            ) {
                //@ts-ignore
                legions.DataOrigin.get<ILegionsPluginDataOrigin,'loggerReport'>(
                    methodsName
                )({ ...logConent },options.type);
            } else {
                legions.DataOrigin.add<ILegionsPluginDataOrigin,'loggerReport'>(
                    methodsName,
                    (value: Object,type: loggerType) => {
                        let user: ILegionsPluginDataOrigin['sysUserInfos'] = void 0;
                        if (
                            legions.DataOrigin.has<ILegionsPluginDataOrigin>('sysUserInfos')
                        ) {
                            user = legions.DataOrigin.get<
                                ILegionsPluginDataOrigin,
                                'sysUserInfos'
                            >('sysUserInfos');
                        }
                        legions.BrowserMatch.init();
                        const params: Parameters<typeof loggerReport>[0] = {
                            ...options,
                            userInfo: JSON.stringify(user ? user : {}),
                            browserEnvironment: JSON.stringify({
                                platform: navigator.platform,
                                OS: legions.BrowserMatch.OS,
                                browser: legions.BrowserMatch.browser,
                                version: legions.BrowserMatch.version,
                            }),
                        };
                        /// 上报代码   实时上报
                        if (typeof reportApi === 'function') {
                            reportApi && reportApi(params);
                        }
                    }
                );
                //@ts-ignore
                legions.DataOrigin.get<ILegionsPluginDataOrigin,'loggerReport'>(
                    methodsName
                )({ ...logConent },options.type);
            }
        });
    },
};