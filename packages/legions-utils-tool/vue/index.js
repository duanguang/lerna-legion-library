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

export { observablePromise };
