/**
 * 排除指定对象属性
 *
 * @export
 * @param {Object} exclude 需要排除的对象属性
 * @param {Object} source 源对象
 * @returns
 */
export declare function excludeObj<T = {}>(exclude: Object, source: Object): T;
/**
 * 对字符串进行自然排序
 *
 * @export
 * @param {[]} source 需要排序的数据对象
 * @param {string} sortKey 如果是字符串数组 不需要传递，如果是对象数组，请传递需要排序的字段名称
 * @returns
 */
export declare function sort(source: any[], sortKey?: string): any[];
/** 通用排序compareFunction */
export declare function compare(a: string, b: string): any;
export declare function warning(condition: boolean, format: string): void;
export declare const on: (element: any, event: any, handler: any, useCapture?: boolean) => void;
export declare const off: (element: any, event: any, handler: any, useCapture?: boolean) => void;
/**  获取指定对象属性 不存在返回 null*/
export declare const get: (p: (string | number)[]) => <T = {}>(o: Object) => T;
