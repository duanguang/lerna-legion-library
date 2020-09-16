import { RegExChk, validatorType } from 'legions-utils-tool/regex';
/* const { RegExChk,validatorType} = require('legions-utils-tool/regex') */
import 'reflect-metadata';
import { FormRule } from '../../types/api/formRule';
const FORM_META_DATA_KEY = 'JsonProperty';

/**
 * 属性规则描述信息修饰器
 *
 * @export
 * @param {any} metadata
 * @returns
 */
export function FormRuleProperty<P = {}, V = {}>(
  metadata: FormRule.metadata<P, V>
): any {
  let decoratorMetaData;
  if (metadata && typeof metadata === 'object') {
    decoratorMetaData = metadata;
  } else {
    throw new Error(
      'meta data in FormRule property is undefined. meta data: ' + metadata
    );
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
export function createFormRule<T>(
  Clazz: { new (): T },
  that: T,
  extendRuleClazz?: Function | { ruleClazz?: Function; props?: Object }
) {
  let instance = new Clazz();
  let extendProps = null;
  if (
    Object.prototype.toString.call(extendRuleClazz) === '[object Object]' &&
    //@ts-ignore
    extendRuleClazz['props']
  ) {
    //@ts-ignore
    extendProps = extendRuleClazz['props'];
    //@ts-ignore
    extendRuleClazz = extendRuleClazz['ruleClazz'];
  }
  Object.keys(instance).forEach(key => {
    /**
     * get decoratorMetaData, structure: { name?:string, clazz?:{ new():T } }
     */
    let decoratorMetaData = getFormRuleProperty(instance, key);
    let regex = createValidator.call(that, decoratorMetaData, extendProps);
    instance[key] = regex;
    that[key] = regex;
  });
  if (extendRuleClazz && typeof extendRuleClazz === 'function') {
    //@ts-ignore
    let extendRule = new extendRuleClazz();
    Object.keys(extendRule).forEach(key => {
      /**
       * get decoratorMetaData, structure: { name?:string, clazz?:{ new():T } }
       */
      let decoratorMetaData = getFormRuleProperty(extendRule, key);
      let regex = createValidator.call(that, decoratorMetaData, extendProps);
      extendRule[key] = regex;
      that[key] = regex;
    });
  }
  return { ...instance, ...extendRuleClazz };
}

const validate = function (regexType, error, regex, props) {
  //@ts-ignore
  const that = this;
  return (rule, value, callback) => {
    if (!value) {
      callback();
    } else if (regex && regex instanceof RegExp && !regex.test(value)) {
      callback(new Error(error));
    } else if (
      regexType &&
      typeof regexType === 'number' &&
      validatorType[regexType] &&
      //@ts-ignore
      !RegExChk(regexType, value)
    ) {
      callback(new Error(error));
    } else if (regexType && typeof regexType === 'function') {
      regexType.call(that, value, error, callback, props);
    } else {
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
  let regex = [];
  let rule = { type: option.type };
  if (option.required) {
    let required = {
      type: rule.type,
      required: true,
      message: `${option.desc}不能为空`,
      trigger: option.trigger,
    };
    //@ts-ignore
    regex.push(required);
  }
  rule = Object.assign(
    { trigger: option.trigger, message: option.error },
    rule
  );
  //@ts-ignore
  regex.push(rule);
  if (option.validator || option.regex) {
    regex.push({
      //@ts-ignore
      validator: validate.call(
        //@ts-ignore
        this,
        option.validator,
        option.error,
        option.regex,
        props
      ),
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
