import { IlegionsThirdpartyPlugin } from "../../api";
/** 插件信息 */
export declare const PLUGINS: readonly ["excel", "xlsx", "html2canvas", "jsBarcode", "clipboard", "dexie", "focusOutside"];
declare type SuitTuple = typeof PLUGINS;
export declare type TypePluginName = SuitTuple[number];
export declare const LEGIONS_THIRDPARTY_PLUGIN: IlegionsThirdpartyPlugin;
export declare const PROXY_LEGIONS_THIRPARTY_PLUGIN: IlegionsThirdpartyPlugin;
/** 第三方插件信息 */
export declare const THIRDPARTY_PLUGINS: {
    excel: string;
    html2canvas: string;
    jsBarcode: string;
    clipboard: string;
    dexie: string;
    focusOutside: string;
    xlsx: string;
};
export {};
