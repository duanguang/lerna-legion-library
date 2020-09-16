export declare namespace FormRule {
  type metadata<P, V> = {
    regex?: RegExp;
    /**
     *是否必填
     *
     * @type {Boolean}
     */
    required?: Boolean;

    /**
     * 字段名称
     *
     * @type {string}
     */
    name: string;

    /**
     *
     *
     * @type {string}
     */
    error: string;

    /**
     *描述信息
     *
     * @type {string}
     */
    desc: string;

    /**
     *事件触发器
     *
     * @type {string}
     */
    trigger?: string;

    /**
     *自定义验证
     *
     * @param {V} value 验证的值
     * @param {*} error 错误信息
     * @param {Function} callBack 回调函数
     * @param {P} props 注入到构造函数的对象
     */
    validator?: (value: V, error: string, callBack: Function, props?: P) => any;

    /**
     *
     *校验前转换字段值
     * @memberof IAntdRule
     */
    transform?: (value) => any;

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
  };
}
