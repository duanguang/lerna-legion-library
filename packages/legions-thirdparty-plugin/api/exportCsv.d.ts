export interface IExportTableCsv {
  /**
   *
   * 文件名，默认为 table.csv
   * @type {string}
   * @memberof IExportCsv
   */
  filename: string;

  /**
   * 不显示表头，默认为 false
   *
   * @type {boolean}
   * @memberof IExportCsv
   */
  noHeader?: boolean;

  /**
   * 自定义导出的列数据
   *
   * @type {any[]}
   * @memberof IExportCsv
   */
  columns: any[];

  /**
   * 自定义导出的行数据
   *
   * @type {any[]}
   * @memberof IExportCsv
   */
  data: any[];

  /**
   * 添加此函数后，不会下载，而是返回数据
   *
   * @type {Function}
   * @memberof IExportCsv
   */
  callback?: Function;

  /**
   *
   * 数据分隔符，默认是逗号(,)
   * @type {string}
   * @memberof IExportCsv
   */
  separator?: string;

  /**
   * 每项数据是否加引号，默认为 false
   *
   * @type {boolean}
   * @memberof IExportCsv
   */
  quoted?: boolean;
}
