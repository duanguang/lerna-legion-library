/**
 *
 *
 * @param {*} entryMain 主JS脚本资源链接
 * @param {*} scripts ['JS脚本资源']
 * @param {*} [proxy=window]
 * @param {*} keys 模块URL ，一般是指入口资源链接
 * @returns
 */
export function execScripts(entryMain: any, scripts: any, proxy?: any, keys: any): Promise<any>;
export function importHTML(url: any, options: any): any;
export function importEntry(entry: any): any;
export { fetch };
