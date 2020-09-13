import { partial, map } from 'lodash';
import { autorun } from 'mobx';
export interface ISchedule {
  /**
   * 取消数据订阅
   *
   * @memberof ISchedule
   */
  unsubscribe: () => void | Function;
}
/**
 *
 * 订阅数据，在数据变化时，可以处理一些副作用，当你不需要监听时，请及时调用取消调用进行销毁
 * @param {...Array<any>} funcs 数组内第一个参数一定为函数类型
 * @returns {Array<Function>}
 * @memberof StoreBase
 */
export function schedule(...funcs: Array<any>): ISchedule {
  const subscription: Array<() => void | Function> = map(
    map(funcs, args => partial(...args)),
    autorun
  );
  return { unsubscribe: subscription[0] };
}
