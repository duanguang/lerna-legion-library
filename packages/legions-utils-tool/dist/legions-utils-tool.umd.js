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

  function warning(condition, format) {
      //@ts-ignore
      {
          if (!condition) {
              if (typeof console !== 'undefined') {
                  console.error(format);
                  throw new Error(format);
              }
              try {
                  // This error was thrown as a convenience so that you can use this stack
                  // to find the callsite that caused this warning to fire.
                  throw new Error(format);
              }
              catch (x) {
                  // @ts-ignore
                  console.error(x);
              }
          }
      }
  }

  exports.warning = warning;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
