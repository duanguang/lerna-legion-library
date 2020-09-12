import {
    reaction,
} from 'mobx';
import { ObservablePromiseModel,observablePromise } from 'brain-store-utils';
import { NProgress } from 'legions-nprogress';
const invariant = require('invariant')
interface IOptions {
    state: string //需要监听的状态属性名称
    store?: string,
}
/**
 * 进度条自动加载
 *
 * @export
 * @param {IOptions} options
 * @returns
 */
export function loadProgress(options: IOptions) {
    return (target,key,descriptor) => {
        const oldValue = descriptor.value;
        options.store = options.store || 'store'
        descriptor.ReactionList = []
        descriptor.value = function () {
            const that = this;
            const props = that.props || {}
            invariant(props[options.store as string],`loadProgress[${target.constructor.name}-顶部进度条UI]:您的组件实例没有store变量,请检查是否绑定store`);
            let __mobxDecorators = props[options.store as string]['__mobxDecorators'] || props[options.store as string]['__mobxInitializedProps'];
            invariant(__mobxDecorators && __mobxDecorators[options.state],`loadProgress[${target.constructor.name}-顶部进度条UI]:您的组件实例store对象上需要监听的属性没有被@observable包裹,请参照observable[mobx]用法`);
            if (__mobxDecorators && __mobxDecorators[options.state]) {
                if (descriptor.ReactionList.length === 0) {
                    const Reaction = reaction(
                        () => {
                            if (props[options.store as string]) {
                                return props[options.store as string][options.state].state
                            }
                        },
                        (state,reaction) => {
                            invariant(props[options.store as string][options.state] instanceof ObservablePromiseModel,`loadProgress[顶部进度条UI-${target.constructor.name}]:您在store对象里面需要监听的state原型不是ObservablePromiseModel`)
                            if (state) {
                                if (state === 'pending') {
                                    NProgress.start(); // 显示顶部加载进度条
                                } else {
                                    NProgress.done();
                                    reaction.dispose();
                                    descriptor.ReactionList = [];
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