interface IAutoMessage<T = {}, S = {}> {
    /**
     *
     * 需要监听的数据名称
     * @type {string}
     * @memberof IAutoMessage
     */
    state: string;
    /**
     * 需要监听的store 名称，默认 store
     *
     * @type {string}
     * @memberof IAutoMessage
     */
    store?: string | S;
    /**
     *  处理一些副作用，在执行时会把函数所在类实例抛回去，如果是组件，即抛回组件this
     *
     * @memberof IAutoMessage
     */
    sideEffect?: (that: T) => void;
    /**
     * 当操作失败时，弹提示方式
     *
     * @type {('message'|'modal')}
     * @memberof IAutoMessage
     */
    type?: 'message' | 'modal';
    /**
     * 当选择modal 方式，可以设置其标题名称
     *
     * @type {string}
     * @memberof IAutoMessage
     */
    modalTitle?: string;
    /**
     *
     * 是否显示数据处理进度条 true 启用
     * @type {boolean}
     * @memberof IAutoMessage
     */
    showProgressBar?: boolean;
}
/**
* 操作数据后，根据接口结果自动弹出提示信息
*T:组件实例
* S：Store实例约束
* @export
* @param {IAutoMessage} options
*/
export declare function submittingAutoMessage<T = {}, S = {}>(options: IAutoMessage<T, S>): (target: any, key: any, descriptor: any) => any;
export {};
