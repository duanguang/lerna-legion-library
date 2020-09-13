import { LabeledValue } from 'antd/lib/select';
/** 下拉选项数据VModel */
export declare class HlLabeledValue implements LabeledValue {
    key: string;
    label: string;
    keyValue?: string;
    constructor(params?: HlLabeledValue);
}
