/**
 * legions-mobx-decorator v0.0.3
 * (c) 2020 duanguang
 * @license MIT
 */
import { reaction } from 'mobx';
import { ObservablePromiseModel } from 'brain-store-utils';
import { NProgress } from 'legions-nprogress';
import { getInjector } from 'brain-store';
import { message, Modal } from 'antd';
import React from 'react';
import { OpenDeleteConfirm, OpenConfirm, OpenModal } from '../antd-toolkit/index.ts';

var invariant = require('invariant');
/**
 * 进度条自动加载
 *
 * @export
 * @param {IOptions} options
 * @returns
 */
function loadProgress(options) {
    return function (target, key, descriptor) {
        var oldValue = descriptor.value;
        options.store = options.store || 'store';
        descriptor.ReactionList = [];
        descriptor.value = function () {
            var that = this;
            var props = that.props || {};
            invariant(props[options.store], "loadProgress[" + target.constructor.name + "-\u9876\u90E8\u8FDB\u5EA6\u6761UI]:\u60A8\u7684\u7EC4\u4EF6\u5B9E\u4F8B\u6CA1\u6709store\u53D8\u91CF,\u8BF7\u68C0\u67E5\u662F\u5426\u7ED1\u5B9Astore");
            var __mobxDecorators = props[options.store]['__mobxDecorators'] || props[options.store]['__mobxInitializedProps'];
            invariant(__mobxDecorators && __mobxDecorators[options.state], "loadProgress[" + target.constructor.name + "-\u9876\u90E8\u8FDB\u5EA6\u6761UI]:\u60A8\u7684\u7EC4\u4EF6\u5B9E\u4F8Bstore\u5BF9\u8C61\u4E0A\u9700\u8981\u76D1\u542C\u7684\u5C5E\u6027\u6CA1\u6709\u88AB@observable\u5305\u88F9,\u8BF7\u53C2\u7167observable[mobx]\u7528\u6CD5");
            if (__mobxDecorators && __mobxDecorators[options.state]) {
                if (descriptor.ReactionList.length === 0) {
                    var Reaction = reaction(function () {
                        if (props[options.store]) {
                            return props[options.store][options.state].state;
                        }
                    }, function (state, reaction) {
                        invariant(props[options.store][options.state] instanceof ObservablePromiseModel, "loadProgress[\u9876\u90E8\u8FDB\u5EA6\u6761UI-" + target.constructor.name + "]:\u60A8\u5728store\u5BF9\u8C61\u91CC\u9762\u9700\u8981\u76D1\u542C\u7684state\u539F\u578B\u4E0D\u662FObservablePromiseModel");
                        if (state) {
                            if (state === 'pending') {
                                NProgress.start(); // 显示顶部加载进度条
                            }
                            else {
                                NProgress.done();
                                reaction.dispose();
                                descriptor.ReactionList = [];
                            }
                        }
                    });
                    descriptor.ReactionList.push(Reaction);
                }
            }
            return oldValue.apply(this, arguments);
        };
        return descriptor;
    };
}

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

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        var arguments$1 = arguments;

        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments$1[i];
            for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p)) { t[p] = s[p]; } }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var invariant$1 = require('invariant');
/**
* 操作数据后，根据接口结果自动弹出提示信息
*T:组件实例
* S：Store实例约束
* @export
* @param {IAutoMessage} options
*/
function submittingAutoMessage(options) {
    return function (target, key, descriptor) {
        var oldValue = descriptor.value;
        options.store = options.store || 'store';
        options.type = options.type || 'message';
        descriptor.ReactionList = [];
        descriptor.value = function () {
            var _this = this;
            var that = this;
            var props = that.props || {};
            var viewStore = props[options.store];
            if (typeof options.store !== 'string') {
                var stores = getInjector();
                viewStore = stores.getState(options.store);
            }
            invariant$1(viewStore, "submittingAutoMessage[" + target.constructor.name + "-\u81EA\u52A8\u5F39\u51FA\u63D0\u793A\u64CD\u4F5C\u4FE1\u606F]:\u60A8\u7684\u7EC4\u4EF6\u5B9E\u4F8B\u6CA1\u6709store\u53D8\u91CF,\u8BF7\u68C0\u67E5\u662F\u5426\u7ED1\u5B9Astore");
            var __mobxDecorators = viewStore['__mobxDecorators'] || viewStore['__mobxInitializedProps'];
            invariant$1(__mobxDecorators && __mobxDecorators[options.state], "submittingAutoMessage[" + target.constructor.name + "-\u81EA\u52A8\u5F39\u51FA\u63D0\u793A\u64CD\u4F5C\u4FE1\u606F]:\u60A8\u7684\u7EC4\u4EF6\u5B9E\u4F8Bstore\u5BF9\u8C61\u4E0A\u9700\u8981\u76D1\u542C\u7684\u5C5E\u6027\u6CA1\u6709\u88AB@observable\u5305\u88F9,\u8BF7\u53C2\u7167observable[mobx]\u7528\u6CD5");
            if (__mobxDecorators && __mobxDecorators[options.state]) {
                if (descriptor.ReactionList.length === 0) {
                    var Reaction = reaction(function () {
                        if (viewStore) {
                            var store = __assign({}, viewStore[options.state]);
                            return store;
                        }
                    }, function (store, reaction) {
                        invariant$1(viewStore[options.state] instanceof ObservablePromiseModel, "submittingAutoMessage[\u81EA\u52A8\u5F39\u51FA\u63D0\u793A\u64CD\u4F5C\u4FE1\u606F-" + target.constructor.name + "]:\u60A8\u5728store\u5BF9\u8C61\u91CC\u9762\u9700\u8981\u76D1\u542C\u7684state\u539F\u578B\u4E0D\u662FObservablePromiseModel");
                        if (store) {
                            options.showProgressBar && NProgress.start();
                            if (store.state === 'resolved') {
                                if (store.value.success) {
                                    store.value && store.value.message && message.success(React.createElement("pre", { style: { display: 'inline-block' } }, store.value && store.value.message));
                                }
                                else {
                                    if (options.type === 'message') {
                                        store.value && store.value.message && message.error(React.createElement("pre", { style: { display: 'inline-block' } }, store.value && store.value.message), 4);
                                    }
                                    else {
                                        Modal.error({
                                            title: "" + (options.modalTitle || '操作反馈信息'),
                                            content: (React.createElement("div", { style: { maxHeight: '120px', overflowY: 'scroll', padding: '10px 0' } },
                                                React.createElement("pre", { style: { display: 'inline-block' } }, store.value && store.value.message))),
                                        });
                                    }
                                }
                                store.clear && store.clear();
                                options.sideEffect && options.sideEffect(_this);
                                descriptor.ReactionList = [];
                                options.showProgressBar && NProgress.done();
                                reaction.dispose();
                            }
                        }
                    });
                    descriptor.ReactionList.push(Reaction);
                }
            }
            return oldValue.apply(this, arguments);
        };
        return descriptor;
    };
}

/** 对话框修饰器 */
function confirmAnnotation(options) {
    return function (target, key, descriptor) {
        var oldValue = descriptor.value;
        descriptor.value = function () {
            var arguments$1 = arguments;

            var _this = this;
            var rest = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                rest[_i] = arguments$1[_i];
            }
            var that = this;
            try {
                options['onOk'] = function () {
                    oldValue.apply(_this, rest);
                    options.logger && options.logger.call(_this, {
                        that: that,
                    });
                };
                if (options.confirmType !== 'message') {
                    if (options['onCancel']) {
                        var onCancel_1 = options['onCancel'].bind(that);
                        options['onCancel'] = function () {
                            onCancel_1(that);
                        };
                    }
                }
                if (options.type && typeof options.type === 'function') {
                    var type = options.type.call(that, that);
                    options.type = type;
                }
                if (options.title && typeof options.title === 'function') {
                    var title = options.title.call(that, that);
                    options.title = title;
                }
                if (options.content && typeof options.content === 'function') {
                    var content = options.content.call(that, that);
                    options.content = content;
                }
                if (options.confirmType === 'delete') {
                    // @ts-ignore
                    OpenDeleteConfirm(options);
                }
                else if (options.confirmType === 'confirm') {
                    //@ts-ignore
                    OpenConfirm(options);
                }
                else if (options.confirmType === 'message') {
                    //@ts-ignore
                    OpenModal(options);
                }
            }
            catch (error) {
                options.logger && options.logger.call(this, {
                    that: that,
                });
            }
        };
        return descriptor;
    };
}

export { confirmAnnotation, loadProgress, submittingAutoMessage };
