import { LabeledValue } from 'antd/lib/select';
/** 下拉选项数据VModel */
export class HlLabeledValue implements LabeledValue {
  //@ts-ignore
  key: string = void 0;
  //@ts-ignore
  label: string = void 0;
  keyValue?: string = void 0;
  constructor(params?: HlLabeledValue) {
    if (params) {
      this.key = params.key;
      this.label = params.label;
      this.keyValue = params.keyValue;
    }
  }
}
