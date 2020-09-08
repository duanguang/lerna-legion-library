export declare const RESOLVE_ACTION = "observableFromPromise-resolve";
export declare const REJECT_ACTION = "observableFromPromise-reject";
export declare namespace IObservablePromise {
    type PramsResult<T> = {
        /**
         *数据状态 none 数据初始化状态
         *pending 数据请求中
         * resolved 数据请求完成
         * rejected 数据请求异常
         * @type {('none'|'pending'|'resolved'|'rejected'|'timeout'|'serverError'|'onLine')}
         */
        state: 'none' | 'pending' | 'resolved' | 'rejected' | 'timeout' | 'serverError' | 'onLine';
        /**
         *数据异常时，错误信息存储 例如 rejected
         *
         * @type {String}
         */
        error: String;
        /**
         *目标数据存放 如api接口请求结果
         *
         * @type {(T|any)}
         */
        data: T;
        /**
         *是否请求中
         *
         * @type {boolean}
         */
        isPending: boolean;
        /**
         *请求完成
         *
         * @type {boolean}
         */
        isResolved: boolean;
        /**
         *请求异常状态
         *
         * @type {boolean}
         */
        isRejected: boolean;
        /**
         *请求超时
         *
         * @type {boolean}
         * @memberof ObservableTempState
         */
        isTimeout: boolean;
        /**
         *服务端错误
         *
         * @type {boolean}
         * @memberof ObservableTempState
         */
        isServerError: boolean;
        /**
         *是否在线
         *
         * @type {boolean}
         * @memberof ObservableTempState
         */
        isOnLine: boolean;
    };
    type PromiseOptions = {
        /**
         *http请求  类型promise
         *
         * @type {Promise}
         */
        requestPromise: Promise<any>;
        /**
         *vuex dispatch
         *
         * @type {*}
         */
        dispatch: any;
    };
}
export declare const promiseStatus: {
    none: string;
    pending: string;
    resolved: string;
    rejected: string;
    timeout: string;
    serverError: string;
    onLine: string;
};
export declare class ObservablePromiseModel<T> {
    state: string;
    error: null;
    data: null;
    constructor(options?: IObservablePromise.PromiseOptions);
    get isPending(): boolean;
    get isResolved(): boolean;
    get isRejected(): boolean;
    get isTimeout(): boolean;
    get isServerError(): boolean;
    get isOnLine(): boolean;
}
export default function observablePromise<T>(options?: IObservablePromise.PromiseOptions): ObservablePromiseModel<T>;
