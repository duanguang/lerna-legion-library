/**
 * legions-lunar v0.0.3
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('brain-store-utils'), require('brain-store'), require('mobx'), require('lodash.debounce')) :
    typeof define === 'function' && define.amd ? define(['exports', 'brain-store-utils', 'brain-store', 'mobx', 'lodash.debounce'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsMobxDecorator = {}, global.brainStoreUtils, global.brainStore, global.mobx, global.debounce));
}(this, (function (exports, brainStoreUtils, brainStore, mobx, debounce) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) { return e; } else {
            var n = Object.create(null);
            if (e) {
                Object.keys(e).forEach(function (k) {
                    if (k !== 'default') {
                        var d = Object.getOwnPropertyDescriptor(e, k);
                        Object.defineProperty(n, k, d.get ? d : {
                            enumerable: true,
                            get: function () {
                                return e[k];
                            }
                        });
                    }
                });
            }
            n['default'] = e;
            return Object.freeze(n);
        }
    }

    var debounce__namespace = /*#__PURE__*/_interopNamespace(debounce);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    var SearchPageQuery = debounce__namespace(function (fn) {
        setTimeout(function () {
            fn && fn();
        }, 100);
    }, 2000);
    /**
     * 一般用于搜索分页自动保存每页数据，防止每次请求切换页码会重新去服务端拉取数据,优化页面体验
     *
     * @export
     * @template T
     * @param {IPageQuery} options
     * @param {...any[]} restOfName
     * @returns {IPageQueryResult<T>}
     */
    //@ts-ignore
    function pagingQueryProcessing(options) {
        var restOfName = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            restOfName[_i - 1] = arguments[_i];
        }
        var stores = brainStore.getInjector();
        // @ts-ignore
        var store = null;
        if (options.store) {
            if (typeof options.store === 'function' && options.state) {
                store = stores.getState(options.store)[options.state];
            }
            else {
                store = options.store;
            }
            var data_1 = null;
            if (store.keyWords !== options.keyWords) {
                if (process.env.NODE_ENV === 'dev') {
                    console.warn('搜索关键词发生变化，数据即将清理');
                }
                store.data.clear();
            }
            var watch_1 = function (fireImmediatelys) {
                if (fireImmediatelys === void 0) { fireImmediatelys = true; }
                var Reaction = mobx.reaction(function () {
                    var state = {
                        // @ts-ignore
                        error: data_1.error,
                        // @ts-ignore
                        state: data_1.state,
                        // @ts-ignore
                        value: data_1.value,
                        // @ts-ignore
                        isPending: data_1.isPending,
                        // @ts-ignore
                        isResolved: data_1.isResolved,
                        // @ts-ignore
                        isRejected: data_1.isRejected,
                        // @ts-ignore
                        clear: data_1.clear,
                    };
                    return state;
                }, function (state, reaction) {
                    store.data.set(options.mapItemKeys, state);
                    store.keyWords = options.keyWords;
                    if (state.state === 'resolved') {
                        reaction.dispose();
                    }
                    // @ts-ignore
                    options.callback && options.callback(store);
                }, { fireImmediately: fireImmediatelys });
            };
            var dispatchQuery_1 = function () {
                if (options['queryPrams']) {
                    data_1 = brainStoreUtils.observablePromise(options.servicePromise(options['queryPrams']));
                }
                else {
                    data_1 = brainStoreUtils.observablePromise(options.servicePromise.apply(options, __spread(restOfName)));
                }
            };
            if (!store.data.has(options.mapItemKeys)) {
                dispatchQuery_1();
                watch_1();
            }
            else {
                SearchPageQuery(function () {
                    dispatchQuery_1();
                    watch_1(false);
                });
            }
            return store;
        }
    }

    exports.pagingQueryProcessing = pagingQueryProcessing;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
