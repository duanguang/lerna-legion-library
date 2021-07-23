import XLSX from 'xlsx';
import ExportCsv from './export-csv';
import Csv from './csv';
import invariant from '../utils/invariant';
import { IExportTableCsv } from '../../api/exportCsv';
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
function auto_width(ws, data) {
  /*set worksheet max width per col*/
  const colWidth = data.map(row =>
    row.map(val => {
      /*if null/undefined*/
      if (val == null) {
        return { wch: 10 };
      } else if (val.toString().charCodeAt(0) > 255) {
        /*if chinese*/
        return { wch: val.toString().length * 2 };
      } else {
        return { wch: val.toString().length };
      }
    })
  );
  /*start in the first row*/
  let result = colWidth[0];
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch'];
      }
    }
  }
  ws['!cols'] = result;
}
function json_to_array(key: string[], jsonData: any[]) {
  return jsonData.map(v =>
    key.map(j => {
      return v[j];
    })
  );
}
// fix data,return string
function fixdata(data) {
  let o = '';
  let l = 0;
  const w = 10240;
  for (; l < data.byteLength / w; ++l)
    o += String.fromCharCode.apply(
      null,
      new Uint8Array(data.slice(l * w, l * w + w))
    );
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
  return o;
}
// get head from excel file,return array
function get_header_row(sheet) {
  const headers = [];
  const range = XLSX.utils.decode_range(sheet['!ref']);
  let C;
  const R = range.s.r; /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    var cell =
      sheet[
        XLSX.utils.encode_cell({ c: C, r: R })
      ]; /* find the cell in the first row */
    var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
    //@ts-ignore
    headers.push(hdr);
  }
  return headers;
}
const export_table_to_excel = (id: string, filename: string) => {
  //@ts-ignore
  const table = document.querySelector(`.${id}`).querySelector('table');
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, filename);
};
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
const exportJsonToExcel = ({
  data,
  columns,
  autoWidth,
  filename,
}: IExportCsv) => {
  const newArr = [];
  data.map(item => {
    let dataItem = {};
    for (let key in item) {
      const newItem = columns.filter(entity => entity['dataIndex'] === key);
      if (newItem && newItem.length) {
        // @ts-ignore
        dataItem[newItem[0].title] = item[key];
      }
    }
    if (dataItem) {
      //@ts-ignore
      newArr.push(dataItem);
    }
  });
  export_json_to_excel({
    data: newArr,
    key: columns.map(item => item['title'] as string),
    filename: filename,
    //@ts-ignore
    autoWidth,
  });
};
const exportArrayToExcel = ({
  data,
  columns,
  autoWidth,
  filename,
}: IExportCsv) => {
  const newArr = [];
  data.map(item => {
    let newDataItem = [];
    columns.map(entity => {
      //@ts-ignore
      newDataItem.push(item[entity['dataIndex']]);
    });
    //@ts-ignore
    newArr.push(newDataItem);
  });
  export_array_to_excel({
    data: newArr,
    key: columns.map(item => item['title'] as string),
    filename: filename,
    //@ts-ignore
    autoWidth,
  });
};
const export_json_to_excel = ({
  data,
  key,
  title,
  filename,
  autoWidth,
}: IExcelProps) => {
  const wb = XLSX.utils.book_new();
  // data.unshift(title);
  const ws = XLSX.utils.json_to_sheet(data, { header: key });
  if (autoWidth) {
    const arr = json_to_array(key, data);
    auto_width(ws, arr);
  }
  XLSX.utils.book_append_sheet(wb, ws, filename);
  XLSX.writeFile(wb, filename + '.xlsx');
};
const export_array_to_excel = ({
  key,
  data,
  title,
  filename,
  autoWidth,
}: IExcelProps) => {
  const wb = XLSX.utils.book_new();

  // arr.unshift(title);

  //const ws = XLSX.utils.aoa_to_sheet(arr);
  const ws = XLSX.utils.aoa_to_sheet([key]);
  if (autoWidth) {
    const arr = json_to_array(key, data);
    auto_width(ws, arr);
  }
  XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A2' });
  XLSX.utils.book_append_sheet(wb, ws, filename);
  XLSX.writeFile(wb, filename + '.xlsx');
};

const read = (
  data,
  type: 'buffer' | 'base64' | 'string' | 'binary' | 'array' | 'file'
) => {
  const workbook = XLSX.read(data, { type: type });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const header = get_header_row(worksheet);
  const results = XLSX.utils.sheet_to_json(worksheet);
  return { header, results };
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
function exportCsv(params: IExportTableCsv) {
  if (params.filename) {
    if (params.filename.indexOf('.csv') === -1) {
      params.filename += '.csv';
    }
  } else {
    params.filename = 'table.csv';
  }
  invariant(params.columns instanceof Array, `请设置需要导出的列信息`);
  invariant(params.data instanceof Array, `请设置需要导出的信息`);
  let columns = [];
  let datas = [];

  if (params.columns && params.data) {
    //@ts-ignore
    columns = params.columns;
    //@ts-ignore
    datas = params.data;
  }

  let noHeader = false;
  //@ts-ignore
  if ('noHeader' in params) noHeader = params.noHeader;

  const data = Csv(columns, datas, params, noHeader);
  if (params.callback) params.callback(data);
  else ExportCsv.download(params.filename, data);
}
export {
  export_table_to_excel,
  export_array_to_excel,
  export_json_to_excel,
  exportJsonToExcel,
  exportArrayToExcel,
  read,
  exportCsv,
};
