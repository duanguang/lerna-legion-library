import { IlegionsThirdpartyPlugin } from "../../api";
import { createObj } from "./utils";

/** 插件信息 */
export const PLUGINS = ['excel',
'html2canvas',
'jsBarcode',
'clipboard',
'dexie',
  'focusOutside',] as const
type SuitTuple = typeof PLUGINS;
export type TypePluginName = SuitTuple[number]; 
export const LEGIONS_THIRDPARTY_PLUGIN: IlegionsThirdpartyPlugin = createObj();
export const PROXY_LEGIONS_THIRPARTY_PLUGIN: IlegionsThirdpartyPlugin = createObj();
/** 第三方插件信息 */
export const THIRDPARTY_PLUGINS = {
  excel: 'legionsThirdpartyExcelPlugin',
  html2canvas: 'legionsThirdpartyHtml2canvasPlugin',
  jsBarcode: 'legionsThirdpartyJsbarcodePlugin',
  clipboard: 'legionsThirdpartyClipboardPlugin',
  dexie: 'legionsThirdpartyDexiePlugin',
  focusOutside: 'legionsThirdpartyFocusOutsidePlugin',
};
