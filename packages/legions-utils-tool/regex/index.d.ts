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
export declare function RegExChk(type: RegExp | validatorTypeEnum, value: string): any;
export declare let validatorType: validatorTypeEnum;
export {};
