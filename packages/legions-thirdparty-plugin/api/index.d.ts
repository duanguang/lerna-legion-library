import { DexieUtils } from '../types/dexies';
import { IExportTableCsv } from './exportCsv';
import { html2canvasOptions } from './html2canvas';
import { ISdkXlsx } from './sdk.xlsx'
import { ISdkhtml2canvas } from './sdk.html2canvas'
import { ISdkClipboard } from './sdk.clipboard'
import { JsBarcode } from './jsbarcode';
import {focusBind,focusUnbind} from '../types/focus-outside'
export interface IlegionsThirdpartyPlugin {
  /* use: (plugin: IPlugin[] | IPlugin) => void; */
  xlsx: ISdkXlsx;
  html2canvas: ISdkhtml2canvas;
  jsBarcode: JsBarcode;
  clipboard: ISdkClipboard;
  dexie: DexieUtils;
  focusOutside: {
    focusBind:typeof focusBind;
    focusUnbind: typeof focusUnbind;
  };
}
