import { observablePromise } from 'brain-store-utils';
import { ObservableMap } from 'mobx';
interface IPageQuery<S = {}> {
    keyWords: string;
    /**
     *  mobx store类
     *
     * @type {Function}
     * @memberof IPageQuery
     */
    store: Function | IPageQueryResult<S>;
    /**
     * 需要操作的数据状态名称
     *
     * 注意 状态名称必须在你的store 类里面定义
     *
     * @type {string}
     * @memberof IPageQuery
     */
    state?: string;
    /**
     * map 项 keys
     *
     * @type {string}
     * @memberof IPageQuery
     */
    mapItemKeys: string;
    callback?: (store: IPageQueryResult<S>) => void;
}
export interface IPageQueryObject extends IPageQuery {
    /**
         *
         * 接口查询参数对象
         * @type {Object}
         * @memberof IPageQuery
         */
    queryPrams?: Object;
    /**
    * 查询接口
    *
    * @memberof IPageQuery
    */
    servicePromise: (prams?: Object) => Promise<any>;
}
export interface IPageQueryRestOfName extends IPageQuery {
    /**
        * 查询接口
        *
        * @memberof IPageQuery
        */
    servicePromise: (...restOfName: any[]) => Promise<any>;
}
export interface IPageQueryResult<T> {
    keyWords: string;
    data: ObservableMap<observablePromise.PramsResult<T>>;
}
/**
 * 一般用于搜索分页自动保存每页数据，防止每次请求切换页码会重新去服务端拉取数据,优化页面体验
 *
 * @export
 * @template T
 * @param {IPageQuery} options
 * @param {...any[]} restOfName
 * @returns {IPageQueryResult<T>}
 */
export declare function pagingQueryProcessing<T = {}>(options: IPageQueryObject | IPageQueryRestOfName, ...restOfName: any[]): IPageQueryResult<T>;
export {};
