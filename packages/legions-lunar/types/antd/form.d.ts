import { ValidationRule } from 'antd/lib/form/Form';
export interface IAntdRule extends ValidationRule {
  required?: boolean;

  /**
   *
   *校验前转换字段值
   * @memberof IAntdRule
   */
  transform: (value) => any;

  /**
   * 内建校验类型
   *object: Must be of type object and not Array.isArray.
   * @type {('string'|'number'|'boolean'|'method'|'regexp'|'integer'|'float'|'object'
   *     |'array'|'date'|'upload')}
   * @memberof IAntdRule
   */
  type?:
    | 'string'
    | 'number'
    | 'boolean'
    | 'method'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'object'
    | 'enum'
    | 'url'
    | 'email'
    | 'array'
    | 'date';
}
