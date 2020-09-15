/**字符串去除空格
 *
 *
 * @export
 * @param {*} str
 * @returns
 */
export declare function formatTrim(str: string): string;
/**千位分割
 *千位分割
 *
 * @export
 * @param {*} num
 * @returns
 */
export declare function formatLocaleString(num: number | string): string | 0;
/**
 *保留指定位数小数
 *
 * @export
 * @param {*} number
 * @param {*} fractionSize
 * @returns
 */
export declare function number(number: any, fractionSize: number): any;
/**
 *金额保留两位小数
 *
 * @export
 * @param {*} value
 * @returns
 */
export declare function amount(value: number | string): any;
/**
 * 判断字符串是否是json
 * @param str 要判断的字符串
 * @returns 返回布尔值
 */
export declare function isJSON(str: string): boolean;
