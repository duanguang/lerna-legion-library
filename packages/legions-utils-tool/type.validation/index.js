/**
 * legions-utils-tool v0.0.5
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsUtilsTool = {}));
}(this, (function (exports) { 'use strict';

  function isObject(value) {
      return Object(value) === value;
  }
  function isUndefined(value) {
      return value === undefined;
  }
  function isNull(value) {
      return value === null;
  }
  function isPromise(obj) {
      return (!!obj &&
          (typeof obj === 'object' || typeof obj === 'function') &&
          typeof obj.then === 'function');
  }

  exports.isNull = isNull;
  exports.isObject = isObject;
  exports.isPromise = isPromise;
  exports.isUndefined = isUndefined;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
