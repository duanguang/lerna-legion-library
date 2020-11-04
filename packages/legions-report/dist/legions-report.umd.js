/**
  *  legions-report v0.0.5
  * (c) 2020 duanguang
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('legions-utils-tool/browser')) :
    typeof define === 'function' && define.amd ? define(['exports', 'legions-utils-tool/browser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsReport = {}, global.browser));
}(this, (function (exports, browser) { 'use strict';

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
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function assignObject(obj1, obj2) {
        for (var name_1 in obj2) {
            if (obj2.hasOwnProperty(name_1)) {
                obj1[name_1] = obj2[name_1];
            }
        }
        return obj1;
    }
    function typeDecide(o, type) {
        return Object.prototype.toString.call(o) === '[object ' + type + ']';
    }
    function stringify(obj) {
        if (window.JSON && window.JSON.stringify) {
            return JSON.stringify(obj);
        }
        var t = typeof obj;
        if (t != 'object' || obj === null) {
            // simple data type
            if (t == 'string')
                obj = '"' + obj + '"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = obj && obj.constructor == Array;
            // fix.
            var self = arguments.callee;
            for (n in obj) {
                if (obj.hasOwnProperty(n)) {
                    v = obj[n];
                    t = typeof v;
                    if (obj.hasOwnProperty(n)) {
                        if (t == 'string')
                            v = '"' + v + '"';
                        else if (t == 'object' && v !== null)
                            // v = jQuery.stringify(v);
                            v = self(v);
                        json.push((arr ? '' : '"' + n + '":') + String(v));
                    }
                }
            }
            return (arr ? '[' : '{') + String(json) + (arr ? ']' : '}');
        }
    }
    function serializeObj(obj) {
        var parames = '';
        Object.keys(obj).forEach(function (name) {
            if (typeDecide(obj[name], 'Object')) {
                parames += name + '=' + stringify(obj[name]);
            }
            else {
                parames += name + '=' + obj[name] + '^';
            }
        });
        return encodeURIComponent(parames.substr(0, parames.length - 1));
    }

    var Events = /** @class */ (function () {
        function Events() {
            this.handlers = {};
        }
        Events.prototype.on = function (event, handler) {
            this.handlers[event] = this.handlers[event] || [];
            this.handlers[event].push(handler);
            return this.handlers[event];
        };
        Events.prototype.off = function (event) {
            if (this.handlers[event]) {
                delete this.handlers[event];
            }
        };
        Events.prototype.trigger = function (event, args) {
            var _this = this;
            var arg = args || [];
            var funcs = this.handlers[event];
            if (funcs) {
                return funcs.every(function (f) {
                    var ret = f.apply(_this, arg);
                    return ret === false ? false : true;
                });
            }
            return true;
        };
        return Events;
    }());

    var Report = /** @class */ (function (_super) {
        __extends(Report, _super);
        function Report(options) {
            var _this = _super.call(this) || this;
            var config = {
                dataKey: '',
                mergeReport: true,
                delay: 1000,
                url: '',
                getPath: '',
                postPath: '',
                random: 1,
            };
            _this.config = assignObject(config, options);
            _this.queue = {
                get: [],
                post: [],
            };
            _this.getUrl = _this.config.url + _this.config.getPath;
            _this.postUrl = _this.config.url + _this.config.postPath;
            _this.isRegisterMonitoring = false;
            browser.BrowserMatch.init();
            return _this;
        }
        Report.prototype.reportByGet = function (data) {
            this.sendData('get', data);
        };
        Report.prototype.reportByPost = function (data) {
            this.sendData('post', data);
        };
        Report.prototype.sendData = function (type, data) {
            if (this.catchData(type, data)) {
                this.delayReport();
            }
        };
        Report.prototype.delayReport = function (cb) {
            var _this = this;
            if (!this.trigger('beforeReport'))
                return;
            var delay = this.config.mergeReport ? this.config.delay : 0;
            setTimeout(function () {
                if (!_this.trigger('beforeSend'))
                    return;
                _this.report(cb);
            }, delay);
        };
        // push数据到pool
        Report.prototype.catchData = function (type, data) {
            var rnd = Math.random();
            if (rnd >= this.config.random) {
                return false;
            }
            this.queue[type].push(data);
            return this.queue[type];
        };
        Report.prototype.postRequest = function () {
            var _this = this;
            return new Promise(function (resolve) {
                if (_this.queue.post.length === 0) {
                    resolve();
                }
                else {
                    var parames_1 = _this._postParames('post');
                    var xmlhttp_1 = new XMLHttpRequest();
                    xmlhttp_1.onreadystatechange = function () {
                        if (xmlhttp_1.readyState == 4 && xmlhttp_1.status == 200) {
                            resolve(parames_1);
                        }
                    };
                    xmlhttp_1.open('POST', _this.postUrl, true);
                    xmlhttp_1.setRequestHeader('Content-Type', 'application/json');
                    /* const data = {};
                          data[this.config.dataKey] = parames; */
                    xmlhttp_1.send(JSON.stringify(parames_1));
                }
            });
        };
        Report.prototype._getParames = function (type) {
            var queue = this.queue[type];
            var mergeReport = this.config.mergeReport;
            var curQueue = mergeReport ? queue : [queue.shift()];
            if (mergeReport)
                this.queue[type] = [];
            var parames = curQueue
                .map(function (obj) {
                return serializeObj(obj);
            })
                .join('|');
            return parames;
        };
        Report.prototype._postParames = function (type) {
            var queue = this.queue[type];
            var mergeReport = this.config.mergeReport;
            var curQueue = mergeReport ? queue : [queue.shift()];
            if (mergeReport)
                this.queue[type] = [];
            var parames = curQueue.map(function (obj) {
                return obj;
            });
            return parames[0];
        };
        Report.prototype.report = function (cb) {
            var _this = this;
            Promise.all([this.postRequest()]).then(function (urls) {
                _this.trigger('afterReport');
                cb && cb.call(_this, urls);
            });
        };
        Report.prototype.watch = function (appSystem, environment) {
            if (appSystem === void 0) { appSystem = ''; }
            if (environment === void 0) { environment = ''; }
            var that = this;
            window.onerror = function (event, source, lineno, colno, error) {
                if (!error) {
                    return;
                }
                var prams = {
                    errorType: 'onerror',
                    errorFilename: source,
                    errorLineNo: lineno,
                    errorColNo: colno,
                    errorStack: error.stack,
                    errorLevel: '1',
                    path: window.location.href,
                    errorMessage: error.message,
                    errorTimeStamp: new Date().getTime(),
                    network: browser.getNetworkType(),
                    userAgent: navigator.userAgent,
                    device: navigator.appName + ";" + navigator.appVersion,
                    system: JSON.stringify({
                        platform: navigator.platform,
                        OS: browser.BrowserMatch.OS,
                        browser: browser.BrowserMatch.browser,
                        version: browser.BrowserMatch.version,
                    }),
                    environment: environment,
                    appSystem: appSystem,
                };
                that.reportByPost(prams, function (data) {
                    console.log(data);
                });
            };
            window.addEventListener('unhandledrejection', function (e) {
                // Promise Catch 捕获异常
                e.preventDefault(); // 控制台不显示错误信息
                console.log('捕获到异常：', e);
                /* return true; */
            });
            /* performance.getEntries().forEach(function(item){console.log(item.name)}) */
            window.addEventListener('error', function (error) {
                // 图片资源及脚本请求异常上报
                var errorTarget = event.target;
                if (errorTarget && errorTarget['baseURI'] && error && error.error) {
                    var prams = {
                        errorType: 'error',
                        errorFilename: error.filename,
                        errorLineNo: error.lineno,
                        errorColNo: error.colno,
                        errorStack: error.error.stack,
                        errorLevel: '1',
                        path: window.location.href,
                        errorMessage: error.message + ";;;" + errorTarget['outerHTM'] + ";;;" + errorTarget['baseURI'],
                        errorTimeStamp: new Date().getTime(),
                        network: browser.getNetworkType(),
                        userAgent: navigator.userAgent,
                        device: navigator.appName + ";" + navigator.appVersion,
                        system: JSON.stringify({
                            platform: navigator.platform,
                            OS: browser.BrowserMatch.OS,
                            browser: browser.BrowserMatch.browser,
                            version: browser.BrowserMatch.version,
                        }),
                        environment: environment,
                        appSystem: appSystem,
                    };
                    that.reportByPost(prams, function (data) {
                        console.log('捕获到异常资源请求：', error + data);
                    });
                }
            }, true);
            /**  监控崩溃
             * 在页面加载时（load 事件）在 sessionStorage
             * 记录 good_exit 状态为 pending，如果用户正常退出（beforeunload 事件）状态改为 true，
             * 如果 crash 了，状态依然为 pending，在用户第2次访问网页的时候（第2个load事件），
             * 查看 good_exit 的状态，如果仍然是 pending 就是可以断定上次访问网页崩溃了！
             *
             */
            window.addEventListener('load', function () {
                sessionStorage.setItem('good_exit', 'pending');
                setInterval(function () {
                    sessionStorage.setItem('time_before_crash', new Date().toString());
                }, 1000);
            });
            window.addEventListener('beforeunload', function () {
                sessionStorage.setItem('good_exit', 'true');
            });
            if (sessionStorage.getItem('good_exit') &&
                sessionStorage.getItem('good_exit') !== 'true') ;
            this.isRegisterMonitoring = true;
        };
        return Report;
    }(Events));

    exports.Report = Report;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
