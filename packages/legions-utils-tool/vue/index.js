/**
 * legions-utils-tool v0.0.5
 * (c) 2020 duanguang
 * @license MIT
 */
var promiseStatus = {
    none: 'none',
    pending: 'pending',
    resolved: 'resolved',
    rejected: 'rejected',
    timeout: 'timeout',
    serverError: 'serverError',
    onLine: 'onLine',
};
var ObservablePromiseModel = /** @class */ (function () {
    function ObservablePromiseModel(options) {
        var _this = this;
        // promise = null;
        this.state = promiseStatus.none;
        this.error = null;
        this.data = null;
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
            options.promise.then(function (item) {
                _this.state = promiseStatus.resolved;
                _this.data = item;
                //@ts-ignore
                options.dispatch && options.dispatch(_this);
            }, function (err) {
                if (typeof err === 'object') {
                    if (err.status === 504) {
                        _this.state = promiseStatus.timeout;
                    }
                    else if (err.status === 500) {
                        if (window.navigator.onLine) {
                            _this.state = promiseStatus.serverError;
                        }
                        else {
                            _this.state = promiseStatus.onLine;
                        }
                    }
                    else {
                        _this.state = promiseStatus.rejected;
                    }
                }
                _this.data = null;
                _this.error = err;
                //@ts-ignore
                options.dispatch && options.dispatch(_this);
            });
        }
    }
    Object.defineProperty(ObservablePromiseModel.prototype, "isPending", {
        get: function () {
            return this.state === promiseStatus.pending;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservablePromiseModel.prototype, "isResolved", {
        get: function () {
            return this.state === promiseStatus.resolved;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservablePromiseModel.prototype, "isRejected", {
        get: function () {
            return this.state === promiseStatus.rejected;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservablePromiseModel.prototype, "isTimeout", {
        get: function () {
            return this.state === promiseStatus.timeout;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservablePromiseModel.prototype, "isServerError", {
        get: function () {
            return this.state === promiseStatus.serverError;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ObservablePromiseModel.prototype, "isOnLine", {
        get: function () {
            return this.state !== promiseStatus.onLine;
        },
        enumerable: false,
        configurable: true
    });
    return ObservablePromiseModel;
}());
function observablePromise(options) {
    //@ts-ignore
    options = options || {};
    //@ts-ignore
    options.promise = options.promise || null;
    //@ts-ignore
    options.dispatch = options.dispatch || null;
    return new ObservablePromiseModel(options);
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function () {
          return args[argIndex++];
        })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

var PromiseAction = /** @class */ (function () {
    function PromiseAction(options) {
        return this;
    }
    PromiseAction.prototype.init = function (dispatch, type) {
        invariant_1(typeof dispatch === 'object', 'dispatch: dispatch should be a object');
        invariant_1(typeof dispatch.commit === 'function', 'dispatch.commit: dispatch.commit should be a function');
        invariant_1(typeof type === 'string', 'type: dispatch.commit should be a string');
        dispatch.commit(type);
        return this;
    };
    PromiseAction.prototype.set = function (dispatch, type, promise) {
        invariant_1(typeof dispatch === 'object', 'dispatch: dispatch should be a object');
        invariant_1(typeof dispatch.commit === 'function', 'dispatch.commit: dispatch.commit should be a function');
        invariant_1(typeof type === 'string', 'type: dispatch.commit should be a string');
        //@ts-ignore
        dispatch.commit(type, new observablePromise({ state: 'pending' }));
        observablePromise({
            //@ts-ignore
            promise: promise,
            dispatch: function (item) {
                dispatch.commit(type, item);
            },
        });
        return this;
    };
    PromiseAction.prototype.commit = function (promise, callBackFunc) {
        observablePromise({
            //@ts-ignore
            promise: promise,
            dispatch: function (item) {
                callBackFunc && callBackFunc(item);
            },
        });
        return this;
    };
    return PromiseAction;
}());

export { PromiseAction, observablePromise };
