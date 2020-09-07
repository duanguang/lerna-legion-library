/**
 * 获取相应键值缓存信息
 *
 * @export
 * @param {string} key 键名
 * @param {string} defaultValue 默认值
 * @returns {string}
 */
export function getStorageItem<T = {}>(key: string, defaultValue: T): T {
  let localValue = JSON.parse(window.localStorage.getItem(key) as string);
  return localValue ? localValue : defaultValue;
}
/**
 *设置相应键值缓存信息
 *
 * @export
 * @param {*} key 键名
 * @param {*} value 缓存数据
 */
export function setStorageItems(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
