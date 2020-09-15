export const RESOLVE_ACTION = 'observableFromPromise-resolve';
export const REJECT_ACTION = 'observableFromPromise-reject';
export declare namespace IObservablePromise {
  type PramsResult<T> = {
    /**
     *数据状态 none 数据初始化状态
     *pending 数据请求中
     * resolved 数据请求完成
     * rejected 数据请求异常
     * @type {('none'|'pending'|'resolved'|'rejected'|'timeout'|'serverError'|'onLine')}
     */
    state:
      | 'none'
      | 'pending'
      | 'resolved'
      | 'rejected'
      | 'timeout'
      | 'serverError'
      | 'onLine';

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
export const promiseStatus = {
  none: 'none',
  pending: 'pending',
  resolved: 'resolved',
  rejected: 'rejected',
  timeout: 'timeout',
  serverError: 'serverError',
  onLine: 'onLine',
};

export class ObservablePromiseModel<T> {
  // promise = null;
  state = promiseStatus.none;
  error = null;
  data = null;

  constructor(options?: IObservablePromise.PromiseOptions) {
    //@ts-ignore
    options = options || {};
    //@ts-ignore
    options.promise = options.promise || null;
    //@ts-ignore
    options.dispatch = options.dispatch || null;
    //@ts-ignore
    this.state = options.state || promiseStatus.none;
    //@ts-ignore
    if (options.promise && options.promise.then) {
      //@ts-ignore
      options.promise.then(
        item => {
          this.state = promiseStatus.resolved;
          this.data = item;
          //@ts-ignore
          options.dispatch && options.dispatch(this);
        },
        err => {
          if (typeof err === 'object') {
            if (err.status === 504) {
              this.state = promiseStatus.timeout;
            } else if (err.status === 500) {
              if (window.navigator.onLine) {
                this.state = promiseStatus.serverError;
              } else {
                this.state = promiseStatus.onLine;
              }
            } else {
              this.state = promiseStatus.rejected;
            }
          }
          this.data = null;
          this.error = err;
          //@ts-ignore
          options.dispatch && options.dispatch(this);
        }
      );
    }
  }

  get isPending() {
    return this.state === promiseStatus.pending;
  }

  get isResolved() {
    return this.state === promiseStatus.resolved;
  }

  get isRejected() {
    return this.state === promiseStatus.rejected;
  }
  get isTimeout() {
    return this.state === promiseStatus.timeout;
  }
  get isServerError() {
    return this.state === promiseStatus.serverError;
  }
  get isOnLine() {
    return this.state !== promiseStatus.onLine;
  }
}
export default function observablePromise<T>(
  options?: IObservablePromise.PromiseOptions
) {
  //@ts-ignore
  options = options || {};
  //@ts-ignore
  options.promise = options.promise || null;
  //@ts-ignore
  options.dispatch = options.dispatch || null;
  return new ObservablePromiseModel<T>(options);
}
