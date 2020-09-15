/**
 *设置cookie值
 *
 * @export
 * @param {*} name
 * @param {*} value
 * @param {*} iDay 有效期 数字
 */
export function setCookie(name: string, value: string, iDay: number) {
  let oDate = new Date();
  oDate.setDate(oDate.getDate() + iDay);
  document.cookie = name + '=' + value + ';expires=' + oDate;
}

/**
 *获取cookie值
 *
 * @export
 * @param {*} name
 * @returns
 */
export function getCookie(name: string) {
  if (name) {
    let arr = document.cookie.split('; ');
    for (let i = 0; i < arr.length; i++) {
      let arr2 = arr[i].split('=');
      if (arr2[0] == name) {
        return arr2[1];
      }
    }
  }

  return document.cookie || '';
}

/**
 *移除cookie
 *
 * @export
 * @param {*} name
 */
export function removeCookie(name: string) {
  //@ts-ignore
  setCookie(name, 1, -1);
}

/**
 *清空
 *
 * @export
 */
export function clearAllCookie() {
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
  if (keys) {
    for (var i = keys.length; i--; )
      document.cookie =
        keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();
    document.cookie =
      keys[i] +
      '=0;path=/;domain=' +
      document.domain +
      ';expires=' +
      new Date(0).toUTCString();
  }
}
