interface validatorTypeEnum {
  required: number;
  chinese: number;
  number: number;
  integer: number;
  plusInteger: number;
  double: number;
  plusDouble: number;
  english: number;
  username: number;
  mobile: number;
  phone: number;
  email: number;
  url: number;
  ip: number;
  qq: number;
  decimal: number;
  zipCode: number;
  amount: number;
  path: number;
}
export declare function RegExChk(
  type: RegExp | validatorTypeEnum,
  value: string
): any;
export declare let validatorType: validatorTypeEnum;
export declare const commonRegex: {
  REQUIRED: RegExp;
  CHINESE: RegExp;
  NUMBER: RegExp;
  INTEGER: RegExp;
  PLUSINTEGER: RegExp;
  DOUBLE: RegExp;
  PLUSDOUBLE: RegExp;
  ENGLISH: RegExp;
  USERNAME: RegExp;
  MOBILE: RegExp;
  PHONE: RegExp;
  EMAIL: RegExp;
  URL: RegExp;
  PATH: RegExp;
  IP: RegExp;
  QQ: RegExp;
  DECIMAL: RegExp;
  ZIPCODE: RegExp;
  /** 集装箱号 */
  PACKBOXNO: RegExp;
  /** 价格，整数位10位，小数位4位 */
  PRICE: RegExp;
  /** 单位转化率，整数位10位，小数位6位 */
  RATE: RegExp;
  /** 重量，整数位9位，小数位9位 */
  WEIGHT: RegExp;
};
export {};
