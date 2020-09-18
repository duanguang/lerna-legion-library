/**
 * legions-utils-tool v0.0.7
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsUtilsTool = {}));
}(this, (function (exports) { 'use strict';

  /**
   *设置cookie值
   *
   * @export
   * @param {*} name
   * @param {*} value
   * @param {*} iDay 有效期 数字
   */
  function setCookie(name, value, iDay) {
      var oDate = new Date();
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
  function getCookie(name) {
      if (name) {
          var arr = document.cookie.split('; ');
          for (var i = 0; i < arr.length; i++) {
              var arr2 = arr[i].split('=');
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
  function removeCookie(name) {
      //@ts-ignore
      setCookie(name, 1, -1);
  }
  /**
   *清空
   *
   * @export
   */
  function clearAllCookie() {
      var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
      if (keys) {
          for (var i = keys.length; i--;)
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

  exports.clearAllCookie = clearAllCookie;
  exports.getCookie = getCookie;
  exports.removeCookie = removeCookie;
  exports.setCookie = setCookie;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
