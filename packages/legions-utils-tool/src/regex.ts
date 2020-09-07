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
}
export function RegExChk(type: RegExp | validatorTypeEnum, value: string) {
  let $pintu = value;
  let regex;
  switch (type) {
    //@ts-ignore
    case type instanceof RegExp:
      regex = type;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.required:
      regex = /[^(^\s*)|(\s*$)]/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.chinese:
      regex = /^[\u0391-\uFFE5]+$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.number:
      regex = /^[\d]+$/; //或者/^\d+$/
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.integer:
      regex = /^[-\+]?\d$/; //正负整数
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.plusInteger:
      regex = /^[1-9]\d*$/;
      //regex=/^[+]?\d$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.double:
      regex = /^[-\+]?\d+(\.\d+)?$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.plusDouble:
      regex = /[+]?\d+(\.\d+)?$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.english:
      regex = /^[A-Z a-z]+$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.username:
      regex = /^[a-z]\w{3,}$/i;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.mobile:
      regex = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.phone:
      regex = /^\d{3}-\d{8}|\d{4}-\d{7,8}$/; //手机号
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.email:
      regex = /^[\w\.]+([-]\w+)*@\w+[\.]\w*$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.url:
      regex = /^http|https:\/\/\w+\.\w+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.ip:
      regex = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.qq:
      regex = /^[1-9]\d{4,10}$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.decimal:
      //regex=/^\d+(\.\d+)*$/;
      regex = /^\d+(\.\d{0,2})*$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.amount:
      regex = /^\d{1,12}(\.\d{1,2})?$/;
      return regex.test($pintu);
    //@ts-ignore
    case validatorType.zipCode:
      regex = /^[1-9]\d{5}$/;
      return regex.test($pintu);
    default:
      return false;
  }
}
export let validatorType: validatorTypeEnum;
(function (validatorType) {
  validatorType[(validatorType['required'] = 0)] = 'required';
  validatorType[(validatorType['chinese'] = 1)] = 'chinese';
  validatorType[(validatorType['number'] = 2)] = 'number';
  validatorType[(validatorType['integer'] = 3)] = 'integer';
  validatorType[(validatorType['plusInteger'] = 4)] = 'plusInteger';
  validatorType[(validatorType['double'] = 5)] = 'double';
  validatorType[(validatorType['plusDouble'] = 6)] = 'plusDouble';
  validatorType[(validatorType['english'] = 7)] = 'english';
  validatorType[(validatorType['username'] = 8)] = 'username';
  validatorType[(validatorType['mobile'] = 9)] = 'mobile';
  validatorType[(validatorType['phone'] = 10)] = 'phone';
  validatorType[(validatorType['email'] = 11)] = 'email';
  validatorType[(validatorType['url'] = 12)] = 'url';
  validatorType[(validatorType['ip'] = 13)] = 'ip';
  validatorType[(validatorType['qq'] = 14)] = 'qq';
  validatorType[(validatorType['decimal'] = 15)] = 'decimal';
  validatorType[(validatorType['zipCode'] = 16)] = 'zipCode';
  validatorType[(validatorType['amount'] = 17)] = 'amount';
  //@ts-ignore
})(validatorType || (validatorType = {}));
