/**
 * legions-lunar v0.0.3
 * (c) 2020 duanguang
 * @license MIT
 */
/** 下拉选项数据VModel */
var HlLabeledValue = /** @class */ (function () {
    function HlLabeledValue(params) {
        //@ts-ignore
        this.key = void 0;
        //@ts-ignore
        this.label = void 0;
        this.keyValue = void 0;
        if (params) {
            this.key = params.key;
            this.label = params.label;
            this.keyValue = params.keyValue;
        }
    }
    return HlLabeledValue;
}());

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

/** 表单字段基础类
 *
 * 包含字段常用方法，如服务端接口数据同步到表单实体；表单vmodel数据映射到表单接口数据模型
 */
var BaseFormFields = /** @class */ (function () {
    function BaseFormFields() {
    }
    /**
     *
     * 服务端数据同步到表单实体模型
     *
     * @static
     * @template Form
     * @template ResData
     * @param {Form} formFields 表单实体模型
     * @param {ResData} data 服务端实体模型
     * @memberof BaseFormFields
     */
    BaseFormFields.dataToFormFields = function (formFields, data) {
        // @ts-ignore
        var obj = {};
        Object.keys(formFields).forEach(function (key) {
            var RequestParamKey = formFields[key]['requestParamKey'] || key;
            if (formFields[key]['beforeDataToFormFields'] &&
                typeof formFields[key]['beforeDataToFormFields'] === 'function') {
                obj[key] = {
                    value: formFields[key]['beforeDataToFormFields'](data[RequestParamKey], data),
                };
            }
            else {
                obj[key] = { value: data[RequestParamKey] };
            }
        });
        return obj;
    };
    /**
     * 表单UI数据同步到表单接口
     *
     *
     * @static
     * @template Form 表单实体模型
     * @template FormPrams 表单接口参数结构
     * @param {Form} formFields 前端UI表单实体模型
     * @param {Form} values 映射的数据源
     * @returns {FormPrams} 返回数据结构
     * @memberof BaseFormFields
     */
    BaseFormFields.formFieldsToData = function (formFields, values) {
        // @ts-ignore
        var obj = {};
        var model = formFields;
        var value = formFields;
        if (typeof model === 'function') {
            // @ts-ignore
            model = new formFields();
            // @ts-ignore
            value = values || {};
        }
        Object.keys(model).forEach(function (key) {
            var RequestParamKey = model[key]['requestParamKey'] || key;
            if (model[key]['ignore'] === true) {
                return;
            }
            if (model[key]['submitBeforeTransform'] &&
                typeof model[key]['submitBeforeTransform'] === 'function') {
                obj[RequestParamKey] = model[key]['submitBeforeTransform'](value[key].value, value);
            }
            else {
                obj[RequestParamKey] = value[key].value || '';
            }
        });
        return obj;
    };
    /**
     *
     * 把父组件的属性映射到表单项上
     * @protected
     * @static
     * @template Form
     * @param {Form} form
     * @param {ClassOf<Form>} formClass
     * @returns {Form}
     * @memberof BaseFormFields
     */
    /* static mapPropsToFields<Form>(form:Form,formClass:ClassOf<Form>):Form{
          let obj = new formClass()
          if(form){
            Object.keys(obj).forEach((item)=>{
              obj[item] = form[item]
            })
          }
          return obj
      } */
    /**
     *
     * 初始表单数据结构 父级构造函数中使用,其他地方请勿调用
     * @static
     * @template Form
     * @param {Form} form
     * @memberof BaseFormFields
     */
    BaseFormFields.initMapPropsToFields = function (form) {
        var _this = this;
        if (form && this) {
            Object.keys(form).forEach(function (item) {
                _this[item] = __assign(__assign({}, form[item]), { value: form[item].value });
            });
        }
    };
    /**
     *
     * 生成表单规则
     * @static
     * @template Form
     * @param {ClassOf<Form>} formClass
     * @returns {IFormRules<Form>}
     * @memberof BaseFormFields
     */
    BaseFormFields.createFormRules = function (formClass, structparame) {
        // @ts-ignore
        var rules = new formClass(structparame);
        return rules;
    };
    return BaseFormFields;
}());

export { BaseFormFields, HlLabeledValue };
