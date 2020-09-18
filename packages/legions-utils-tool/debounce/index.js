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

  function debounce(func, delay) {
      var timeout;
      return function () {
          clearTimeout(timeout);
          //@ts-ignore
          var context = this, args = arguments;
          timeout = setTimeout(function () {
              func.apply(context, args);
          }, delay);
      };
  }

  exports.debounce = debounce;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
