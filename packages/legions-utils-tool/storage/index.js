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
   * 获取相应键值缓存信息
   *
   * @export
   * @param {string} key 键名
   * @param {string} defaultValue 默认值
   * @returns {string}
   */
  function getStorageItem(key, defaultValue) {
      var localValue = JSON.parse(window.localStorage.getItem(key));
      return localValue ? localValue : defaultValue;
  }
  /**
   *设置相应键值缓存信息
   *
   * @export
   * @param {*} key 键名
   * @param {*} value 缓存数据
   */
  function setStorageItems(key, value) {
      window.localStorage.setItem(key, JSON.stringify(value));
  }

  exports.getStorageItem = getStorageItem;
  exports.setStorageItems = setStorageItems;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
