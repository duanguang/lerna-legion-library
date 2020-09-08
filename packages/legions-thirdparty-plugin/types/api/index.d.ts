declare type TableColumnConfig<T> = ColumnProps<T>;
import { JsBarcodeSpace } from './jsbarcode';
import { IDexieUtils } from './dexie';
import { IExportTableCsv } from './exportCsv';
import { html2canvasOptions } from './html2canvas';
interface ColumnProps<T> {
  title?: string;
  key?: string;
  dataIndex?: string;
  filters?: {
    text: string;
    value: string;
    children?: any[];
  }[];
  filterMultiple?: boolean;
  filterDropdownVisible?: boolean;
  sorter?: boolean | ((a: any, b: any) => number);
  colSpan?: number;
  width?: string | number;
  className?: string;
  fixed?: boolean | ('left' | 'right');
  filteredValue?: any[];
  sortOrder?: boolean | ('ascend' | 'descend');
  children?: ColumnProps<T>[];
}
export interface IExcelProps {
  data: any[];
  key: string[];
  title?: string[];
  filename: string;
  autoWidth: boolean;
}
export interface IExportCsv {
  /**
   *
   * 文件名，默认为 table.csv
   * @type {string}
   * @memberof IExportCsv
   */
  filename: string;
  /**
   * 是否自动设置宽度，默认为 false
   *
   * @type {boolean}
   * @memberof IExportCsv
   */
  autoWidth?: boolean;
  /**
   * 自定义导出的列数据
   *
   * @type {any[]}
   * @memberof IExportCsv
   */
  columns: TableColumnConfig<{}>[];
  /**
   * 自定义导出的行数据
   *
   * @type {any[]}
   * @memberof IExportCsv
   */
  data: any[];
}
interface IJsBarcode {
  IJsBarcode1: (element: any) => JsBarcodeSpace.api;
  IJsBarcode2: (
    element: any,
    data: string,
    options?: JsBarcodeSpace.Options
  ) => void;
}
export interface IlegionsThirdpartyPlugin {
  /* use: (plugin: IPlugin[] | IPlugin) => void; */
  excel: {
    export_table_to_excel: (id: string, filename: string) => void;
    export_array_to_excel: ({
      key,
      data,
      title,
      filename,
      autoWidth,
    }: IExcelProps) => void;
    export_json_to_excel: ({
      data,
      key,
      title,
      filename,
      autoWidth,
    }: IExcelProps) => void;
    exportJsonToExcel: ({
      data,
      columns,
      autoWidth,
      filename,
    }: IExportCsv) => void;
    exportArrayToExcel: ({
      data,
      columns,
      autoWidth,
      filename,
    }: IExportCsv) => void;
    read: (
      data: any,
      type: 'buffer' | 'base64' | 'string' | 'binary' | 'array' | 'file'
    ) => {
      header: never[];
      results: unknown[];
    };
    exportCsv: (params: IExportTableCsv) => void;
  };
  html2canvas: {
    Canvas2Image: {
      saveAsImage: (canvas: any, width: any, height: any, type: any) => void;
      saveAsPNG: (canvas: any, width: number, height: number) => void;
      saveAsJPEG: (canvas: any, width: number, height: number) => void;
      saveAsGIF: (canvas: any, width: number, height: number) => void;
      saveAsBMP: (canvas: any, width: number, height: number) => void;
      convertToImage: (
        canvas: any,
        width: any,
        height: any,
        type: any
      ) => HTMLImageElement | undefined;
      convertToPNG: (
        canvas: any,
        width: number,
        height: number
      ) => HTMLImageElement | undefined;
      convertToJPEG: (
        canvas: any,
        width: number,
        height: number
      ) => HTMLImageElement | undefined;
      convertToGIF: (
        canvas: any,
        width: number,
        height: number
      ) => HTMLImageElement | undefined;
      convertToBMP: (
        canvas: any,
        width: number,
        height: number
      ) => HTMLImageElement | undefined;
    };
    html2canvas: (
      element: HTMLElement,
      options?: Partial<html2canvasOptions>
    ) => Promise<HTMLCanvasElement>;
  };
  jsBarcode: IJsBarcode['IJsBarcode1'] | IJsBarcode['IJsBarcode2'];
  clipboard: {
    Clipboard: (
      trigger: string | HTMLElement | HTMLCollection | NodeList,
      options: any
    ) => any;
    copyText: (text: string) => Promise<any>;
  };
  dexie: IDexieUtils;
}
