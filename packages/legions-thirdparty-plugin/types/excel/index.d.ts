import { IExportTableCsv } from '../../types/api/exportCsv';
export declare type TableColumnConfig<T> = ColumnProps<T>;
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
declare const export_table_to_excel: (id: string, filename: string) => void;
interface IExcelProps {
    data: any[];
    key: string[];
    title?: string[];
    filename: string;
    autoWidth: boolean;
}
interface IExportCsv {
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
declare const exportJsonToExcel: ({ data, columns, autoWidth, filename, }: IExportCsv) => void;
declare const exportArrayToExcel: ({ data, columns, autoWidth, filename, }: IExportCsv) => void;
declare const export_json_to_excel: ({ data, key, title, filename, autoWidth, }: IExcelProps) => void;
declare const export_array_to_excel: ({ key, data, title, filename, autoWidth, }: IExcelProps) => void;
declare const read: (data: any, type: 'buffer' | 'base64' | 'string' | 'binary' | 'array' | 'file') => {
    header: never[];
    results: unknown[];
};
/**
 * 将数据导出为 .csv 文件，不适应复杂表格的excel 文件生成 说明
支持IE9~IE11、Edge、Chrome、Safari、Firefox 全系列浏览器。
IE9、Safari 需要手动修改后缀名为 .csv。
IE9暂时只支持英文，中文会显示为乱码。
 *说明：columns 和 data 需同时声明，声明后将导出指定的数据，建议列数据有自定义render时，可以根据需求自定义导出内容
 * @export
 * @param {IExportCsv} params
 */
declare function exportCsv(params: IExportTableCsv): void;
export { export_table_to_excel, export_array_to_excel, export_json_to_excel, exportJsonToExcel, exportArrayToExcel, read, exportCsv, };
