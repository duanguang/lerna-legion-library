/**
 * legions-decorator v0.0.2
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('legions-utils-tool/regex'), require('reflect-metadata')) :
    typeof define === 'function' && define.amd ? define(['exports', 'legions-utils-tool/regex', 'reflect-metadata'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsDecorator = {}, global.regex));
}(this, (function (exports, regex) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

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
    function getFormRuleProperty(target, propertyKey) {
        return Reflect.getMetadata(FORM_META_DATA_KEY, target, propertyKey);
    }
    /**
     * 生成表单验证规则
     *
     * @export
     * @param {any} Clazz
     * @param {any} that
     *  @param {any} extendRuleClazz
     * @returns
     */
    function createFormRule(Clazz, that, extendRuleClazz) {
        var instance = new Clazz();
        var extendProps = null;
        if (Object.prototype.toString.call(extendRuleClazz) === '[object Object]' &&
            //@ts-ignore
            extendRuleClazz['props']) {
            //@ts-ignore
            extendProps = extendRuleClazz['props'];
            //@ts-ignore
            extendRuleClazz = extendRuleClazz['ruleClazz'];
        }
        Object.keys(instance).forEach(function (key) {
            /**
             * get decoratorMetaData, structure: { name?:string, clazz?:{ new():T } }
             */
            var decoratorMetaData = getFormRuleProperty(instance, key);
            var regex = createValidator.call(that, decoratorMetaData, extendProps);
            instance[key] = regex;
            that[key] = regex;
        });
        if (extendRuleClazz && typeof extendRuleClazz === 'function') {
            //@ts-ignore
            var extendRule_1 = new extendRuleClazz();
            Object.keys(extendRule_1).forEach(function (key) {
                /**
                 * get decoratorMetaData, structure: { name?:string, clazz?:{ new():T } }
                 */
                var decoratorMetaData = getFormRuleProperty(extendRule_1, key);
                var regex = createValidator.call(that, decoratorMetaData, extendProps);
                extendRule_1[key] = regex;
                that[key] = regex;
            });
        }
        return __assign(__assign({}, instance), extendRuleClazz);
    }
    var validate = function (regexType, error, regex$1, props) {
        //@ts-ignore
        var that = this;
        return function (rule, value, callback) {
            if (!value) {
                callback();
            }
            else if (regex$1 && regex$1 instanceof RegExp && !regex$1.test(value)) {
                callback(new Error(error));
            }
            else if (regexType &&
                typeof regexType === 'number' &&
                regex.validatorType[regexType] &&
                //@ts-ignore
                !regex.RegExChk(regexType, value)) {
                callback(new Error(error));
            }
            else if (regexType && typeof regexType === 'function') {
                regexType.call(that, value, error, callback, props);
            }
            else {
                callback();
            }
        };
    };
    /*function hasPrototypeProterty(obj, name){
      
        return !obj.hasOwnProperty(name) && (name in obj)
      
      /**
       * 组装规则信息，转换成表单可识别的数据结构
       *
       * @export
       * @param {any} option
       * @returns
       */
    function createValidator(option, props) {
        option = option || {};
        option.trigger = option.trigger || 'blur,change';
        option.required = option.required || false;
        option.validator = option.validator || void 0;
        option.transform = option.transform || void 0;
        option.type = option.type || 'string';
        option.name = option.name || '';
        option.desc = option.desc || '';
        option.error = option.error || '格式错误';
        option.regex = option.regex || void 0;
        var regex = [];
        var rule = { type: option.type };
        if (option.required) {
            var required = {
                type: rule.type,
                required: true,
                message: option.desc + "\u4E0D\u80FD\u4E3A\u7A7A",
                trigger: option.trigger,
            };
            //@ts-ignore
            regex.push(required);
        }
        rule = Object.assign({ trigger: option.trigger, message: option.error }, rule);
        //@ts-ignore
        regex.push(rule);
        if (option.validator || option.regex) {
            regex.push({
                //@ts-ignore
                validator: validate.call(
                //@ts-ignore
                this, option.validator, option.error, option.regex, props),
                //@ts-ignore
                trigger: option.trigger,
            });
        }
        if (option.transform) {
            //@ts-ignore
            regex.push({ transform: option.transform });
        }
        return regex;
    }

    exports.FormRuleProperty = FormRuleProperty;
    exports.createFormRule = createFormRule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
