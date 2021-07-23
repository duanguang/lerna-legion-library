/**
 * legions-thirdparty-plugin v0.0.8
 * (c) 2021 duanguang
 * @license MIT
 */
import XLSX from 'xlsx';

function has (browser) {
    const ua = navigator.userAgent;
    if (browser === 'ie') {
        const isIE = ua.indexOf('compatible') > -1 && ua.indexOf('MSIE') > -1;
        if (isIE) {
            const reIE = new RegExp('MSIE (\\d+\\.\\d+);');
            reIE.test(ua);
            return parseFloat(RegExp['$1']);
        } else {
            return false;
        }
    } else {
        return ua.indexOf(browser) > -1;
    }
}

const csv$1 = {
    _isIE11 () {
        let iev = 0;
        const ieold = (/MSIE (\d+\.\d+);/.test(navigator.userAgent));
        const trident = !!navigator.userAgent.match(/Trident\/7.0/);
        const rv = navigator.userAgent.indexOf('rv:11.0');

        if (ieold) {
            iev = Number(RegExp.$1);
        }
        if (navigator.appVersion.indexOf('MSIE 10') !== -1) {
            iev = 10;
        }
        if (trident && rv !== -1) {
            iev = 11;
        }

        return iev === 11;
    },

    _isEdge () {
        return /Edge/.test(navigator.userAgent);
    },

    _getDownloadUrl (text) {
        const BOM = '\uFEFF';
        // Add BOM to text for open in excel correctly
        if (window.Blob && window.URL && window.URL.createObjectURL) {
            const csvData = new Blob([BOM + text], { type: 'text/csv' });
            return URL.createObjectURL(csvData);
        } else {
            return 'data:attachment/csv;charset=utf-8,' + BOM + encodeURIComponent(text);
        }
    },

    download (filename, text) {
        if (has('ie') && has('ie') < 10) {
            // has module unable identify ie11 and Edge
            const oWin = window.top.open('about:blank', '_blank');
            oWin.document.charset = 'utf-8';
            oWin.document.write(text);
            oWin.document.close();
            oWin.document.execCommand('SaveAs', filename);
            oWin.close();
        } else if (has('ie') === 10 || this._isIE11() || this._isEdge()) {
            const BOM = '\uFEFF';
            const csvData = new Blob([BOM + text], { type: 'text/csv' });
            navigator.msSaveBlob(csvData, filename);
        } else {
            const link = document.createElement('a');
            link.download = filename;
            link.href = this._getDownloadUrl(text);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};

/*
  inspired by https://www.npmjs.com/package/react-csv-downloader
  now removed from Github
*/

const newLine = '\r\n';
const appendLine = (content, row, { separator, quoted }) => {
  const line = row.map(data => {
    if (!quoted) return data;
    // quote data
    data = typeof data === 'string' ? data.replace(/"/g, '"') : data;
    return typeof data === 'string' ? `"${data}"\t` : data;
    // return `"${data}\t"`;  // add \t 解决数字字符过长显示成科学计算法
  });
  content.push(line.join(separator));
};

const defaults = {
  separator: ',',
  quoted: false,
};

function csv(columns, datas, options, noHeader = false) {
  options = Object.assign({}, defaults, options);
  let columnOrder;
  const content = [];
  const column = [];

  if (columns) {
    columnOrder = columns.map(v => {
      if (typeof v === 'string') return v;
      if (!noHeader) {
        column.push(typeof v.title !== 'undefined' ? v.title : v.dataIndex);
      }
      return v.dataIndex;
    });
    if (column.length > 0) appendLine(content, column, options);
  } else {
    columnOrder = [];
    datas.forEach(v => {
      if (!Array.isArray(v)) {
        columnOrder = columnOrder.concat(Object.keys(v));
      }
    });
    if (columnOrder.length > 0) {
      columnOrder = columnOrder.filter(
        (value, index, self) => self.indexOf(value) === index
      );
      if (!noHeader) appendLine(content, columnOrder, options);
    }
  }

  if (Array.isArray(datas)) {
    datas.forEach(row => {
      if (!Array.isArray(row)) {
        row = columnOrder.map(k =>
          typeof row[k] !== 'undefined' ? row[k] : ''
        );
      }
      appendLine(
        content,
        row,
        Object.assign(options, { separator: ',', quoted: true })
      ); // 修复内容区遇到逗号，会换行
    });
  }
  return content.join(newLine);
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function () {
          return args[argIndex++];
        })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

function auto_width(ws, data) {
    /*set worksheet max width per col*/
    var colWidth = data.map(function (row) {
        return row.map(function (val) {
            /*if null/undefined*/
            if (val == null) {
                return { wch: 10 };
            }
            else if (val.toString().charCodeAt(0) > 255) {
                /*if chinese*/
                return { wch: val.toString().length * 2 };
            }
            else {
                return { wch: val.toString().length };
            }
        });
    });
    /*start in the first row*/
    var result = colWidth[0];
    for (var i = 1; i < colWidth.length; i++) {
        for (var j = 0; j < colWidth[i].length; j++) {
            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                result[j]['wch'] = colWidth[i][j]['wch'];
            }
        }
    }
    ws['!cols'] = result;
}
function json_to_array(key, jsonData) {
    return jsonData.map(function (v) {
        return key.map(function (j) {
            return v[j];
        });
    });
}
// get head from excel file,return array
function get_header_row(sheet) {
    var headers = [];
    var range = XLSX.utils.decode_range(sheet['!ref']);
    var C;
    var R = range.s.r; /* start in the first row */
    for (C = range.s.c; C <= range.e.c; ++C) {
        /* walk every column in the range */
        var cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]; /* find the cell in the first row */
        var hdr = 'UNKNOWN ' + C; // <-- replace with your desired default
        if (cell && cell.t)
            hdr = XLSX.utils.format_cell(cell);
        //@ts-ignore
        headers.push(hdr);
    }
    return headers;
}
var export_table_to_excel = function (id, filename) {
    //@ts-ignore
    var table = document.querySelector("." + id).querySelector('table');
    var wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, filename);
};
var exportJsonToExcel = function (_a) {
    var data = _a.data, columns = _a.columns, autoWidth = _a.autoWidth, filename = _a.filename;
    var newArr = [];
    data.map(function (item) {
        var dataItem = {};
        var _loop_1 = function (key) {
            var newItem = columns.filter(function (entity) { return entity['dataIndex'] === key; });
            if (newItem && newItem.length) {
                // @ts-ignore
                dataItem[newItem[0].title] = item[key];
            }
        };
        for (var key in item) {
            _loop_1(key);
        }
        if (dataItem) {
            //@ts-ignore
            newArr.push(dataItem);
        }
    });
    export_json_to_excel({
        data: newArr,
        key: columns.map(function (item) { return item['title']; }),
        filename: filename,
        //@ts-ignore
        autoWidth: autoWidth,
    });
};
var exportArrayToExcel = function (_a) {
    var data = _a.data, columns = _a.columns, autoWidth = _a.autoWidth, filename = _a.filename;
    var newArr = [];
    data.map(function (item) {
        var newDataItem = [];
        columns.map(function (entity) {
            //@ts-ignore
            newDataItem.push(item[entity['dataIndex']]);
        });
        //@ts-ignore
        newArr.push(newDataItem);
    });
    export_array_to_excel({
        data: newArr,
        key: columns.map(function (item) { return item['title']; }),
        filename: filename,
        //@ts-ignore
        autoWidth: autoWidth,
    });
};
var export_json_to_excel = function (_a) {
    var data = _a.data, key = _a.key; _a.title; var filename = _a.filename, autoWidth = _a.autoWidth;
    var wb = XLSX.utils.book_new();
    // data.unshift(title);
    var ws = XLSX.utils.json_to_sheet(data, { header: key });
    if (autoWidth) {
        var arr = json_to_array(key, data);
        auto_width(ws, arr);
    }
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
};
var export_array_to_excel = function (_a) {
    var key = _a.key, data = _a.data; _a.title; var filename = _a.filename, autoWidth = _a.autoWidth;
    var wb = XLSX.utils.book_new();
    // arr.unshift(title);
    //const ws = XLSX.utils.aoa_to_sheet(arr);
    var ws = XLSX.utils.aoa_to_sheet([key]);
    if (autoWidth) {
        var arr = json_to_array(key, data);
        auto_width(ws, arr);
    }
    XLSX.utils.sheet_add_aoa(ws, data, { origin: 'A2' });
    XLSX.utils.book_append_sheet(wb, ws, filename);
    XLSX.writeFile(wb, filename + '.xlsx');
};
var read = function (data, type) {
    var workbook = XLSX.read(data, { type: type });
    var firstSheetName = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[firstSheetName];
    var header = get_header_row(worksheet);
    var results = XLSX.utils.sheet_to_json(worksheet);
    return { header: header, results: results };
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
function exportCsv(params) {
    if (params.filename) {
        if (params.filename.indexOf('.csv') === -1) {
            params.filename += '.csv';
        }
    }
    else {
        params.filename = 'table.csv';
    }
    invariant_1(params.columns instanceof Array, "\u8BF7\u8BBE\u7F6E\u9700\u8981\u5BFC\u51FA\u7684\u5217\u4FE1\u606F");
    invariant_1(params.data instanceof Array, "\u8BF7\u8BBE\u7F6E\u9700\u8981\u5BFC\u51FA\u7684\u4FE1\u606F");
    var columns = [];
    var datas = [];
    if (params.columns && params.data) {
        //@ts-ignore
        columns = params.columns;
        //@ts-ignore
        datas = params.data;
    }
    var noHeader = false;
    //@ts-ignore
    if ('noHeader' in params)
        noHeader = params.noHeader;
    var data = csv(columns, datas, params, noHeader);
    if (params.callback)
        params.callback(data);
    else
        csv$1.download(params.filename, data);
}

export { exportArrayToExcel, exportCsv, exportJsonToExcel, export_array_to_excel, export_json_to_excel, export_table_to_excel, read };
