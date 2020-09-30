import { IlegionsThirdpartyPlugin } from '../types/api';
declare const ALL_SUITS: readonly ["excel", "html2canvas", "jsBarcode", "clipboard", "dexie", "focusOutside"];
declare type SuitTuple = typeof ALL_SUITS;
declare type TypePluginName = SuitTuple[number];
interface IPlugin {
    name: TypePluginName;
    url: string;
}
export declare class LegionsThirdpartyPlugin {
    use(plugin: IPlugin[] | IPlugin): void;
    /** 订阅某个插件数据,在有结果时，执行回调函数
     *
     * 注意 如果在使用插件数据时，非常明确插件数据有值，就不需要订阅执行
     *
     * 主要应用场景插件发起异步请求时，无法确定其返回具体时间,这时依赖插件数据做的事件必须等其准备才能去执行
     *
     * name参数为字符串时，订阅单个数据
     *
     * name参数为字符串数组时，使用场景为你的回调函数依赖多个插件值，这时才去使用，然而大多数情况我们是用不上，因此有需要就传数组
     */
    subscribe(name: IPlugin['name'] | IPlugin['name'][], callback: () => void): void;
    get plugins(): IlegionsThirdpartyPlugin;
}
export declare const legionsThirdpartyPlugin: LegionsThirdpartyPlugin;
export { LegionsPluginsExecute, legionsPlugins, dynamicLoadingScript, findWindow, } from './legions.plugin.sdk/legions';
