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

  /** DOM节点绑定事件 */
  var on = (function () {
      //@ts-ignore
      if (document.addEventListener) {
          return function (element, event, handler, useCapture) {
              if (useCapture === void 0) { useCapture = false; }
              if (element && event && handler) {
                  element.addEventListener(event, handler, useCapture);
              }
          };
      }
      else {
          return function (element, event, handler) {
              if (element && event && handler) {
                  //@ts-ignore
                  element.attachEvent('on' + event, handler);
              }
          };
      }
  })();
  /** 卸载DOM元素节点事件 */
  var off = (function () {
      // @ts-ignore
      if (document.removeEventListener) {
          return function (element, event, handler, useCapture) {
              if (useCapture === void 0) { useCapture = false; }
              if (element && event) {
                  element.removeEventListener(event, handler, useCapture);
              }
          };
      }
      else {
          return function (element, event, handler) {
              if (element && event) {
                  // @ts-ignore
                  element.detachEvent('on' + event, handler);
              }
          };
      }
  })();

  exports.off = off;
  exports.on = on;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
