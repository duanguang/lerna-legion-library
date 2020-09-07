
import { ObservablePromiseModel,observablePromise } from 'brain-store-utils';
import { getInjector,setInjector } from 'brain-store';
import {
    reaction,
    action,
    computed,
    observable,
    ObservableMap,
    autorun,
} from 'mobx';
interface IPageQuery<S = {}> {

    keyWords: string,
    /**
     *  mobx store类
     *
     * @type {Function}
     * @memberof IPageQuery
     */
    store: Function | IPageQueryResult<S>,


    /**
     * 需要操作的数据状态名称 
     * 
     * 注意 状态名称必须在你的store 类里面定义
     *
     * @type {string}
     * @memberof IPageQuery
     */
    state?: string,

    /**
     * map 项 keys
     *
     * @type {string}
     * @memberof IPageQuery
     */
    mapItemKeys: string

    callback?: (store: IPageQueryResult<S>) => void
}
export interface IPageQueryObject extends IPageQuery {
    /**
         *
         * 接口查询参数对象
         * @type {Object}
         * @memberof IPageQuery
         */
    queryPrams?: Object,
    /**
    * 查询接口
    *
    * @memberof IPageQuery
    */
    servicePromise: (prams?: Object) => Promise<any>
}
export interface IPageQueryRestOfName extends IPageQuery {
    /**
        * 查询接口
        *
        * @memberof IPageQuery
        */
    servicePromise: (...restOfName: any[]) => Promise<any>
}
export interface IPageQueryResult<T> {
    keyWords: string,
    data: ObservableMap<observablePromise.PramsResult<T>>
}
const SearchPageQuery = debounce((fn: () => void) => {
    setTimeout(() => {
        fn && fn()
    },100)
},2000)

/**
 * 一般用于搜索分页自动保存每页数据，防止每次请求切换页码会重新去服务端拉取数据,优化页面体验
 *
 * @export
 * @template T
 * @param {IPageQuery} options
 * @param {...any[]} restOfName
 * @returns {IPageQueryResult<T>}
 */
export function pagingQueryProcessing<T = {}>(options: IPageQueryObject | IPageQueryRestOfName,...restOfName: any[]): IPageQueryResult<T> {
    const stores = getInjector()
    // @ts-ignore
    let store: IPageQueryResult<T> = null
    if (options.store) {
        if (typeof options.store === 'function' && options.state) {
            store = stores.getState(options.store)[options.state];
        }
        else {
            store = options.store as unknown as IPageQueryResult<T>
        }
        let data: any = null;
        if (store.keyWords !== options.keyWords) {
            if (process.env.NODE_ENV === 'dev') {
                console.warn('搜索关键词发生变化，数据即将清理')
            }
            store.data.clear();
        }
        const watch = (fireImmediatelys = true) => {
            const Reaction = reaction(() => {
                const state = {
                    // @ts-ignore
                    error: data.error,
                    // @ts-ignore
                    state: data.state,
                    // @ts-ignore
                    value: data.value,
                    // @ts-ignore
                    isPending: data.isPending,
                    // @ts-ignore
                    isResolved: data.isResolved,
                    // @ts-ignore
                    isRejected: data.isRejected,
                    // @ts-ignore
                    clear: data.clear,
                };
                return state
            },(state,reaction) => {
                store.data.set(options.mapItemKeys,state)
                store.keyWords = options.keyWords;
                if (state.state === 'resolved') {
                    reaction.dispose();
                }
                // @ts-ignore
                options.callback && options.callback(store)
            },{ fireImmediately: fireImmediatelys })
        }
        const dispatchQuery = () => {
            if (options['queryPrams']) {
                data = observablePromise<T>(options.servicePromise(options['queryPrams']))
            }
            else {
                data = observablePromise<T>(options.servicePromise(...restOfName))
            }
        }
        if (!store.data.has(options.mapItemKeys)) {
            dispatchQuery()
            watch();
        }
        else {
            SearchPageQuery(() => {
                dispatchQuery()
                watch(false);
            })
        }
        return store;
    }

}