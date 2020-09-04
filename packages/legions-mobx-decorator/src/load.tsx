import {
  reaction,
  action,
  computed,
  observable,
  ObservableMap,
  autorun,
} from 'mobx';
import { getInjector,setInjector } from 'brain-store';
import { ObservablePromiseModel,observablePromise } from 'brain-store-utils';

import { createHashHistory } from 'history';
const invariant = require('invariant')
import { message,Modal } from 'antd';
import React from 'react';
import NProgress from './nprogress';
interface IOptions {
  state: string //需要监听的状态属性名称
  store?: string,
}
interface IAutoMessage<T = {},S = {}> {

  /**
   *
   * 需要监听的数据名称
   * @type {string}
   * @memberof IAutoMessage
   */
  state: string,

  /**
   * 需要监听的store 名称，默认 store
   *
   * @type {string}
   * @memberof IAutoMessage
   */
  store?: string | S,

  /**
   *  处理一些副作用，在执行时会把函数所在类实例抛回去，如果是组件，即抛回组件this
   *
   * @memberof IAutoMessage
   */
  sideEffect?: (that: T) => void,


  /**
   * 当操作失败时，弹提示方式
   *
   * @type {('message'|'modal')}
   * @memberof IAutoMessage
   */
  type?: 'message' | 'modal',

  /**
   * 当选择modal 方式，可以设置其标题名称
   *
   * @type {string}
   * @memberof IAutoMessage
   */
  modalTitle?: string,

  /**
   *
   * 是否显示数据处理进度条 true 启用
   * @type {boolean}
   * @memberof IAutoMessage
   */
  showProgressBar?: boolean,
}
/**
* 操作数据后，根据接口结果自动弹出提示信息
*T:组件实例
* S：Store实例约束
* @export
* @param {IAutoMessage} options
*/
export function submittingAutoMessage<T = {},S = {}>(options: IAutoMessage<T,S>) {

  return (target,key,descriptor) => {
    const oldValue = descriptor.value;
    options.store = options.store || 'store'
    options.type = options.type || 'message'
    descriptor.ReactionList = []
    descriptor.value = function () {
      const that = this;
      const props = that.props || {};
      let viewStore = props[options.store]
      if (typeof options.store !== 'string') {
        const stores = getInjector()
        viewStore = stores.getState(options.store) as S;
      }
      invariant(viewStore,`submittingAutoMessage[${target.constructor.name}-自动弹出提示操作信息]:您的组件实例没有store变量,请检查是否绑定store`);
      let __mobxDecorators = viewStore['__mobxDecorators'] || viewStore['__mobxInitializedProps'];
      invariant(__mobxDecorators && __mobxDecorators[options.state],`submittingAutoMessage[${target.constructor.name}-自动弹出提示操作信息]:您的组件实例store对象上需要监听的属性没有被@observable包裹,请参照observable[mobx]用法`);
      if (__mobxDecorators && __mobxDecorators[options.state]) {
        if (descriptor.ReactionList.length === 0) {
          const Reaction = reaction(
            () => {
              if (viewStore) {

                const store = { ...viewStore[options.state] }
                return store
              }
            },
            (store,reaction) => {
              invariant(viewStore[options.state] instanceof ObservablePromiseModel,`submittingAutoMessage[自动弹出提示操作信息-${target.constructor.name}]:您在store对象里面需要监听的state原型不是ObservablePromiseModel`)
              if (store) {
                options.showProgressBar && NProgress.start();
                if (store.state === 'resolved') {
                  if (store.value.success) {
                    store.value && store.value.message && message.success(<pre style={{ display: 'inline-block' }}>{store.value && store.value.message}</pre>)
                  }
                  else {
                    if (options.type === 'message') {
                      store.value && store.value.message && message.error(<pre style={{ display: 'inline-block' }}>{store.value && store.value.message}</pre>,4)
                    }
                    else {
                      Modal.error({
                        title: `${options.modalTitle || '操作反馈信息'}`,
                        content: (<div style={{ maxHeight: '120px',overflowY: 'scroll',padding: '10px 0' }}>
                          <pre style={{ display: 'inline-block' }}>{store.value && store.value.message}</pre>
                        </div>),
                      });
                    }

                  }
                  store.clear && store.clear()
                  options.sideEffect && options.sideEffect(this)
                  descriptor.ReactionList = [];
                  options.showProgressBar && NProgress.done();
                  reaction.dispose();
                }
              }
            }
          );
          descriptor.ReactionList.push(Reaction)
        }


      }
      return oldValue.apply(this,arguments);
    }
    return descriptor;
  }
}
