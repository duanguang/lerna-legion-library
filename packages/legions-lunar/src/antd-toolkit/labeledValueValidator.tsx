/*
 * @Author: duanguang 
 * @Date: 2020-09-13 12:36:40 
 * @description: 表单校验相关工具库
 * @Last Modified by:   duanguang 
 * @Last Modified time: 2020-09-13 12:36:40 
 */
import { LabeledValue } from 'antd/lib/select'

/** 下拉框开启labelInValue时的特殊表单验证规则 */
export const LabeledValueValidator = (value: LabeledValue,error: string,callBack: Function) => {
    if (value && !value.key) {
        callBack(error)
    } else {
        callBack()
    }
}