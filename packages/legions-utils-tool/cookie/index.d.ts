/**
 *设置cookie值
 *
 * @export
 * @param {*} name
 * @param {*} value
 * @param {*} iDay 有效期 数字
 */
export declare function setCookie(
  name: string,
  value: string,
  iDay: number
): void;
/**
 *获取cookie值
 *
 * @export
 * @param {*} name
 * @returns
 */
export declare function getCookie(name?: string): string;
/**
 *移除cookie
 *
 * @export
 * @param {*} name
 */
export declare function removeCookie(name: string): void;
/**
 *清空
 *
 * @export
 */
export declare function clearAllCookie(): void;
