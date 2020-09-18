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

  /* export function isObject(value: any) {
    return Object(value) === value;
  } */
  var isObject = function (obj) {
      return obj && typeof obj === 'object' && !Array.isArray(obj);
  };
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
  function isArray(val) {
      return Object.prototype.toString.call(val) === '[object Array]';
  }
  function isNullUndefined(val) {
      return val === null || val === void 0;
  }

  exports.isArray = isArray;
  exports.isNull = isNull;
  exports.isNullUndefined = isNullUndefined;
  exports.isObject = isObject;
  exports.isPromise = isPromise;
  exports.isUndefined = isUndefined;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
