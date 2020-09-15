/**
 * 获取相应键值缓存信息
 *
 * @export
 * @param {string} key 键名
 * @param {string} defaultValue 默认值
 * @returns {string}
 */
export declare function getStorageItem<T = {}>(key: string, defaultValue: T): T;
/**
 *设置相应键值缓存信息
 *
 * @export
 * @param {*} key 键名
 * @param {*} value 缓存数据
 */
export declare function setStorageItems(key: string, value: any): void;
