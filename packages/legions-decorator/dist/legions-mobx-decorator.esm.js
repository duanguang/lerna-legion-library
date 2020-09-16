/**
 * legions-decorator v0.0.2
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('legions-utils-tool/regex'), require('reflect-metadata')) :
  typeof define === 'function' && define.amd ? define(['exports', 'legions-utils-tool/regex', 'reflect-metadata'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsDecorator = {}));
}(this, (function (exports) { 'use strict';

  var FORM_META_DATA_KEY = 'JsonProperty';
  /**
   * 属性规则描述信息修饰器
   *
   * @export
   * @param {any} metadata
   * @returns
   */
  function FormRuleProperty(metadata) {
      var decoratorMetaData;
      if (metadata && typeof metadata === 'object') {
          decoratorMetaData = metadata;
      }
      else {
          throw new Error('meta data in FormRule property is undefined. meta data: ' + metadata);
      }
      return Reflect.metadata(FORM_META_DATA_KEY, decoratorMetaData);
  }

  exports.FormRuleProperty = FormRuleProperty;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
