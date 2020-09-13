/**
 * legions-lunar v0.0.3
 * (c) 2020 duanguang
 * @license MIT
 */
import { reaction, autorun } from 'mobx';
import { ObservablePromiseModel } from 'brain-store-utils';
import { NProgress } from 'legions-nprogress';
import { getInjector } from 'brain-store';
import { message, Modal } from 'antd';
import React from 'react';
import { MD5 } from 'object-hash';
import { map, partial } from 'lodash';
import { any, func } from 'prop-types';

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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) { if (Object.prototype.hasOwnProperty.call(b, p)) { d[p] = b[p]; } } };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

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

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) { return o; }
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) { ar.push(r.value); }
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) { m.call(i); }
        }
        finally { if (e) { throw e.error; } }
    }
    return ar;
}

function __spread() {
    var arguments$1 = arguments;

    for (var ar = [], i = 0; i < arguments.length; i++)
        { ar = ar.concat(__read(arguments$1[i])); }
    return ar;
}

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

var OpenModal = function OpenModal(options) {
  //信息提示样式
  options.type = options.type || 'success';
  var ref = Modal[options.type]({
    title: options.title || '',
    content: options.content || '',
    onOk: function onOk() {
      options.onOk && options.onOk();
      ref.destroy();
    }
  });
};
var OpenDeleteConfirm = function OpenDeleteConfirm(options) {
  var ref = Modal.confirm({
    title: options && options.title || '删除',
    content: options && options.content || '您确认删除选中数据吗？',
    okText: options && options.okText || '确认',
    okType: options && options.okType || 'danger',
    cancelText: options && options.cancelText || '取消',
    onOk: function onOk() {
      options.onOk && options.onOk();
      ref.destroy();
    },
    onCancel: function onCancel() {
      options.onCancel && options.onCancel();
      ref.destroy();
    }
  });
};
var OpenConfirm = function OpenConfirm(options) {
  var ref = Modal.confirm({
    title: options.title || 'confirm',
    content: options.content,
    okText: options.okText || '确认',
    okType: options.okType || 'danger',
    cancelText: options.cancelText || '取消',
    onOk: function onOk() {
      options.onOk && options.onOk();
      ref.destroy();
    },
    onCancel: function onCancel() {
      options.onCancel && options.onCancel();
      ref.destroy();
    }
  });
};

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

function shortHash(val) {
  return MD5(val, {
    algorithm: 'md5',
    encoding: 'base64'
  });
}

function warning(condition, format) {
  var __DEV__ = process.env.NODE_ENV === 'dev';

  if (__DEV__) {
    if (!condition) {
      if (typeof console !== 'undefined') {
        console.error(format);
        throw new Error(format);
      }

      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(format);
      } catch (x) {
        // @ts-ignore
        console.error(x);
      }
    }
  }
}
var warned = {};
function warningOnce(condition, format) {
  if (!warned[format]) {
    warning(condition, format);
    warned[format] = !condition;
  }
}

/**
 *
 * 订阅数据，在数据变化时，可以处理一些副作用，当你不需要监听时，请及时调用取消调用进行销毁
 * @param {...Array<any>} funcs 数组内第一个参数一定为函数类型
 * @returns {Array<Function>}
 * @memberof StoreBase
 */

function schedule() {
  var arguments$1 = arguments;
  var funcs = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    funcs[_i] = arguments$1[_i];
  }

  var subscription = map(map(funcs, function (args) {
    return partial.apply(void 0, __spread(args));
  }), autorun);
  return {
    unsubscribe: subscription[0]
  };
}

var mountedContainerInstance = null;
var mountedWrapperInstances = [];
var PageWrapper = /** @class */ (function () {
    function PageWrapper(instance, mapPropsToPageState, uuid) {
        this.instance = instance;
        this.mapPropsToPageState = mapPropsToPageState;
        this.uuid = uuid;
    }
    return PageWrapper;
}());
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
function emitChange(uuid) {
    var newState = { loading: false, submitting: false, progress: false };
    mountedWrapperInstances.forEach(function (wrapper) {
        if (wrapper.uuid === uuid) {
            // @ts-ignore
            var temp = wrapper.mapPropsToPageState(wrapper.instance.props);
            newState.loading = newState.loading || temp.loading;
            newState.submitting = newState.submitting || temp.submitting;
            newState.progress = newState.progress || temp.progress;
            /* let state = mountedContainerInstance.state; */
            // @ts-ignore
            var state = wrapper.instance.state;
            for (var key in newState) {
                if (newState[key] !== state[key]) {
                    /* mountedContainerInstance.setState(newState); */
                    // @ts-ignore
                    wrapper.instance.setState(newState);
                    break;
                }
            }
        }
    });
}
var PageContainer = /** @class */ (function (_super) {
    __extends(PageContainer, _super);
    function PageContainer(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            loading: false,
            submitting: false,
            progress: false
        };
        return _this;
    }
    PageContainer.prototype.getChildContext = function () {
        return {
            page: {
                loading: this.state.loading,
                submitting: this.state.submitting,
                progress: this.state.progress
            },
            emit: emitChange
        };
    };
    PageContainer.prototype.componentWillMount = function () {
        if (mountedContainerInstance) {
            throw new Error("page container must single.");
        }
        //@ts-ignore
        mountedContainerInstance = this;
    };
    PageContainer.prototype.componentWillUnmount = function () {
        mountedContainerInstance = null;
    };
    PageContainer.prototype.render = function () {
        return React.createElement("div", null, this.props.children);
    };
    PageContainer.childContextTypes = {
        page: any,
        emit: func
    };
    return PageContainer;
}(React.Component));
function page(options) {
    return function (WrappedComponent) {
        /* @observer */
        var page = /** @class */ (function (_super) {
            __extends(page, _super);
            function page() {
                var _this = _super.call(this) || this;
                _this.timeId = new Date().getTime();
                _this.uid = "page" + shortHash(_this.timeId);
                //@ts-ignore
                _this.subscription = null;
                //@ts-ignore
                _this.subscriptionWatch = null;
                //@ts-ignore
                _this.ref = null;
                _this.dispatch = function () {
                    if (_this.context.page && options && options.mapPropsToPageState) {
                        emitChange(_this.uid);
                    }
                };
                _this.watch = function (props) {
                    var store = [];
                    if (options) {
                        if (options.store && typeof options.store === 'string') {
                            store = [];
                            warningOnce(props[options.store], 'page(' + getDisplayName(WrappedComponent) + ')' + '你需要监听的数据store在props对象上不存在');
                            //@ts-ignore
                            store.push(props[options.store]);
                        }
                        else if (options.store && Array.isArray(options.store)) {
                            store = [];
                            options.store.map(function (item) {
                                warningOnce(props[item], 'page(' + getDisplayName(WrappedComponent) + ')' + '你需要监听的数据store在props对象上不存在');
                                //@ts-ignore
                                store.push(props[item]);
                            });
                        }
                        else {
                            store = [];
                            warningOnce(props['store'], 'page(' + getDisplayName(WrappedComponent) + ')' + '你需要监听的数据store在props对象上不存在');
                            //@ts-ignore
                            store.push(props['store']);
                        }
                    }
                    (options && options.sideEffect) && options.sideEffect.apply(options, __spread([_this.ref], store));
                };
                _this.state = {
                    loading: false,
                    submitting: false,
                    progress: false
                };
                return _this;
            }
            page.prototype.componentWillMount = function () {
                if (this.context.page && options && options.mapPropsToPageState) {
                    //@ts-ignore
                    mountedWrapperInstances.push(new PageWrapper(this, options.mapPropsToPageState, this.uid));
                    /* emitChange(); */
                    this.subscription = schedule([this.dispatch.bind(this)]);
                }
            };
            page.prototype.componentDidMount = function () {
                if (options && options.sideEffect) {
                    this.subscriptionWatch = schedule([this.watch.bind(this), this.props]);
                }
            };
            page.prototype.componentWillReact = function () {
            };
            page.prototype.componentWillUnmount = function () {
                var _this = this;
                if (this.context.page && options && options.mapPropsToPageState) {
                    //@ts-ignore
                    var index = mountedWrapperInstances.findIndex(function (item) { return item.instance == _this; });
                    mountedWrapperInstances.splice(index, 1);
                    emitChange(this.uid);
                }
                if (this.subscription) {
                    this.subscription.unsubscribe();
                    //@ts-ignore
                    this.subscription = null;
                }
                if (this.subscriptionWatch) {
                    this.subscriptionWatch.unsubscribe();
                    //@ts-ignore
                    this.subscriptionWatch = null;
                }
            };
            page.prototype.render = function () {
                var _this = this;
                var props = __assign(__assign({}, this.props), { 
                    /* page: this.context.page, */
                    page: this.state });
                /* return React.createElement(component, props); */
                // @ts-ignore
                return React.createElement(WrappedComponent, __assign({}, props, { ref: function (ref) { return _this.ref = ref; } }));
                /* return <WrappedComponent {...props} ref={ref=>runInAction(()=>this.ref=ref) }></WrappedComponent>; */
            };
            page.displayName = 'page(' + getDisplayName(WrappedComponent) + ')';
            page.contextTypes = { page: any, emit: func };
            return page;
        }(React.Component));
        return page;
    };
}
/**
 *  当操作结果还未返回时，再次触发按钮将不执行函数体代码
 * 结合page修饰器进行
 *
 * @export
 * @param {*} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns
 */
function noSubmitting(target, propertyKey, descriptor) {
    var oldValue = descriptor.value;
    descriptor.value = function () {
        //@ts-ignore
        if (this.props.page && this.props.page.submitting) {
            return;
        }
        oldValue.apply(this, arguments);
    };
    return descriptor;
}

export { PageContainer, confirmAnnotation, loadProgress, noSubmitting, page, submittingAutoMessage };
