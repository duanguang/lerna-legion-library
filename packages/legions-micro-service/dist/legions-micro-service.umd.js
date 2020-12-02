/**
  *  legions-micro-service v0.0.6
  * (c) 2020 duanguang
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('legions-import-html-entry'), require('single-spa'), require('lodash/noop'), require('lodash/isFunction'), require('lodash/snakeCase'), require('lodash/forEach'), require('lodash/concat'), require('lodash/mergeWith'), require('lodash/cloneDeep'), require('reflect-metadata')) :
    typeof define === 'function' && define.amd ? define(['exports', 'legions-import-html-entry', 'single-spa', 'lodash/noop', 'lodash/isFunction', 'lodash/snakeCase', 'lodash/forEach', 'lodash/concat', 'lodash/mergeWith', 'lodash/cloneDeep', 'reflect-metadata'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsMicroService = {}, global.legionsImportHtmlEntry, global.singleSpa, global.noop, global.isFunction, global.snakeCase, global.forEach, global.concat, global.mergeWith, global.cloneDeep));
}(this, (function (exports, legionsImportHtmlEntry, singleSpa, noop, isFunction, snakeCase, forEach, concat, mergeWith, cloneDeep) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var noop__default = /*#__PURE__*/_interopDefaultLegacy(noop);
    var isFunction__default = /*#__PURE__*/_interopDefaultLegacy(isFunction);
    var snakeCase__default = /*#__PURE__*/_interopDefaultLegacy(snakeCase);
    var forEach__default = /*#__PURE__*/_interopDefaultLegacy(forEach);
    var concat__default = /*#__PURE__*/_interopDefaultLegacy(concat);
    var mergeWith__default = /*#__PURE__*/_interopDefaultLegacy(mergeWith);
    var cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);

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
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

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

    function onloadScript(src, onLoad) {
        if (src === void 0) { src = ''; }
        if (onLoad === void 0) { onLoad = function () { }; }
        if (src) {
            var script = document.createElement('script');
            script.src = src;
            document.body.appendChild(script);
            //@ts-ignore
            script.onload = script.onreadystatechange = function () {
                //@ts-ignore
                if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
                    onLoad && onLoad();
                }
            };
        }
    }
    function isObject(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    function checkBrowser() {
        /**浏览器升级提示**/
        var d = document.createElement('div');
        d.innerHTML =
            '<style>.btn{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px;} a.btn {display: inline-block;background-color: #0885f2;color: #ffffff;line-height:16px;border: 1px solid #0885f2;outline: none;cursor: pointer;border-radius: 2px;cursor:pointer;} a.btn:hover {color:#fff;}</style> <div  id = "updateBrowseBoxVersion" style = "position: fixed;top: 0;left:0px;width: 100%;color: red;border-bottom: 1px solid #b1b4b9;padding-left: 10px;" class="update-browse-tips" > 您的浏览器版本过低，可能无法正常使用部分功能，请升级。推荐使用谷歌，火狐浏览器<a class="btn btn-update" target="_blank" href="http://browsehappy.osfipin.com/">立即升级</a></div > ';
        var func = function () {
            var updateBrowseBoxVersion = document.getElementById('updateBrowseBoxVersion');
            if (updateBrowseBoxVersion !== null) {
                return;
            }
            var s = document.getElementsByTagName('body')[0];
            if ('undefined' == typeof s) {
                //@ts-ignore
                setTimeout(f, 10);
            }
            else {
                s.insertBefore(d, s.firstChild);
            }
        };
        /**IE10及其以下提示*/
        if (!('WebSocket' in window && 2 === window.WebSocket.CLOSING) ||
            window.navigator.userAgent.indexOf('MSIE') >= 1) {
            /* if('continue' == window.sessionStorage.getItem('UPDATE_BROWSE_TIPS')) return;
                  let handlerContinue = "document.getElementById('updateBrowseBox').parentNode.removeChild(document.getElementById('updateBrowseBox'));window.sessionStorage.setItem('UPDATE_BROWSE_TIPS', 'continue')"; */
            func();
            return false;
        }
        return true;
    }

    var microApps = []; // {name:'',entry:'url',container:'DOMid',appId:'',styleId:'',loading:true}
    var scriptResources = {}; // {'entry':{scripts:[],scriptCache:[],sandbox:[],excludeSandboxFiles:[]}}
    /* let isImportHTML = false; */
    var externalOnloadScript = []; // [{url:'',code:''}] 已加载过外部资源列表
    var isPassCheckBrowser = false;
    var currentEnvironment = 'normal'; // 'normal'|'sandbox'  正常环境或沙盒
    var MicroApps = /** @class */ (function () {
        /**
           *Creates an instance of MicroApps.
           * @param {*} options  {
                      excludeFiles:['vendor.dll.65dbcc8352253775138423bdeb0f0cdf.js'],
                      importHTML:'',
                      isMerge:false}
           * @memberof MicroApps
           */
        function MicroApps(options) {
            this.importHTMLOptions = {
                excludeFiles: [],
                isMerge: false,
            };
            if (options && isObject(options)) {
                /* if (options['importHTML']) {
                  this.importHTML = options['importHTML'];
                  //@ts-ignore
                  delete options['importHTML'];
                } */
                this.importHTMLOptions = {
                    excludeFiles: options['excludeFiles'] || [],
                    isMerge: options['isMerge'] || false,
                };
            }
        }
        MicroApps.getStore = function () {
            return {
                apps: microApps,
                scriptResources: scriptResources,
                currentEnvironment: currentEnvironment,
                externalOnloadScript: externalOnloadScript,
            };
        };
        MicroApps.prototype.getApps = function () {
            return {
                apps: microApps,
                scriptResources: scriptResources,
                currentEnvironment: currentEnvironment,
                externalOnloadScript: externalOnloadScript,
            };
        };
        MicroApps.prototype.isRegister = function (apps) {
            var unregisteredApps = microApps.filter(function (item) { return item.name === apps.name; });
            if (unregisteredApps.length > 0) {
                return unregisteredApps;
            }
            return null;
        };
        MicroApps.prototype.register = function (apps) {
            if (Array.isArray(apps)) {
                var unregisteredApps = apps.filter(function (app) { return !microApps.some(function (registeredApp) { return registeredApp.name === app.name; }); });
                microApps = __spread(microApps, unregisteredApps);
            }
        };
        MicroApps.prototype.addRender = function (app) {
            microApps.forEach(function (item) {
                if (item.name === app.name && !item.render) {
                    item.render = app.render;
                }
            });
        };
        MicroApps.prototype.mounted = function (apps) {
            var _this = this;
            var that = this;
            if (!isPassCheckBrowser) {
                //@ts-ignore
                isPassCheckBrowser = checkBrowser();
            }
            var sourceUrl = apps['entry'];
            var appId = apps.appId;
            var container = apps.container || 'reactSandboxWrap';
            if (!appId) {
                console.error('请先设置应用appId信息');
                return;
            }
            if (!sourceUrl) {
                console.error('请先设置应用入口地址entry信息');
                return;
            }
            var styleId = apps.styleId;
            var isCheckRegister = function () {
                var oldApps = _this.isRegister(apps);
                if (!oldApps) {
                    microApps = __spread(microApps, [apps]);
                }
                else {
                    apps = oldApps[0];
                }
            };
            isCheckRegister.call(that);
            function renderStyles(styles) {
                if (styles === void 0) { styles = []; }
                styles.forEach(function (item) {
                    var style = document.createElement('style');
                    var styleWrap = document.getElementById(styleId);
                    style.innerHTML = item;
                    //@ts-ignore
                    styleWrap.appendChild(style);
                });
            }
            function main() {
                /* if (reactSandboxList && reactSandboxList.indexOf(sourceUrl)>-1) return; */
                if (scriptResources && scriptResources.hasOwnProperty(sourceUrl)) {
                    currentEnvironment = 'sandbox';
                    apps.render && apps.render();
                    renderStyles(scriptResources[sourceUrl]['styles']);
                    return;
                }
                legionsImportHtmlEntry.importHTML(sourceUrl, 
                /* {
                        excludeFiles:['vendor.dll.js'],
                        isMerge:false,
                    } */ that.importHTMLOptions ||
                    {}).then(function (res) {
                    /** 添加标记，防止重复加载 */
                    res.getExternalScripts().then(function (exports) {
                        if (res.getScripts) {
                            /** // {excludeFiles:{url:['']},
                             * scripts:{url:[]}} */
                            var scriptList = res.getScripts();
                            var excludeFiles_1 = [];
                            var _scripts = scriptList['scripts'];
                            var scriptCache_1 = [];
                            if (exports &&
                                Object.prototype.toString.call(exports) === '[object Array]') {
                                exports.forEach(function (item) {
                                    scriptCache_1.push({
                                        key: item.scripts,
                                        code: item['scriptsText'],
                                    });
                                });
                            }
                            if (scriptList['excludeFiles'].hasOwnProperty(sourceUrl)) {
                                scriptList['excludeFiles'][sourceUrl].forEach(function (item) {
                                    scriptCache_1.forEach(function (entity) {
                                        var _index = entity.key.indexOf(item);
                                        if (_index > -1) {
                                            excludeFiles_1.push({ url: entity.key, code: entity.code });
                                        }
                                    });
                                });
                            }
                            scriptResources[sourceUrl] = {
                                scripts: scriptList['scripts'][sourceUrl],
                                scriptCache: scriptCache_1,
                                excludeSandboxFiles: excludeFiles_1,
                                sandbox: [],
                                styles: [],
                            };
                            if (_scripts.hasOwnProperty(sourceUrl)) {
                                _scripts[sourceUrl].forEach(function (item) {
                                    excludeFiles_1.forEach(function (entity) {
                                        if (entity) {
                                            var _index = entity.url.indexOf(item);
                                            if (_index < 0) {
                                                scriptResources[sourceUrl]['sandbox'].push(item);
                                            }
                                        }
                                    });
                                });
                            }
                            var promiseLoadScript_1 = [];
                            excludeFiles_1.forEach(function (item) {
                                var fn = function () {
                                    var p = new Promise(function (resolve, reject) {
                                        onloadScript(item.url, function () {
                                            scriptResources[sourceUrl].scriptCache.forEach(function (s) {
                                                if (s.key === item.url) {
                                                    externalOnloadScript.push({
                                                        url: item.url,
                                                        code: s.code,
                                                    });
                                                    resolve(externalOnloadScript);
                                                }
                                            });
                                        });
                                    });
                                    promiseLoadScript_1.push(p);
                                };
                                if (!externalOnloadScript.length) {
                                    // 如果外部加载资源项为空，则直接加载资源
                                    fn();
                                }
                                else {
                                    externalOnloadScript.forEach(function (entry) {
                                        var _index = entry.url.indexOf(item.url); // 判定资源名称及资源代码字符串是否一致，如果一样，则表示资源已经加载过，不需要重复加载
                                        if (_index < 0 && entry.code !== item.code) {
                                            fn();
                                        }
                                    });
                                }
                            });
                            Promise.all(promiseLoadScript_1).then(function (values) {
                                res.execScripts().then(function () {
                                    isCheckRegister.call(that);
                                    currentEnvironment = 'sandbox';
                                    apps.render && apps.render();
                                });
                                res.getExternalStyleSheets().then(function (exports) {
                                    if (scriptResources[sourceUrl]['styles'].length) {
                                        scriptResources[sourceUrl]['styles'] = [];
                                    }
                                    exports.forEach(function (item) {
                                        scriptResources[sourceUrl]['styles'].push(item);
                                        var style = document.createElement('style');
                                        var styleWrap = document.getElementById(styleId);
                                        style.innerHTML = item;
                                        //@ts-ignore
                                        styleWrap.appendChild(style);
                                    });
                                });
                            });
                        }
                    });
                });
            }
            /** 环境准备，加载import-html-entry.js，创建模块渲染节点，创建样式节点 */
            var wrap = document.getElementById(container) ||
                document.getElementsByClassName(container);
            var style = document.createElement('div');
            var app = document.createElement('div');
            /* script.src = 'https://hoolinks.com/static/common/plugins/import-html-entry.js'; */
            style.id = styleId;
            app.id = appId;
            if (apps.loading) {
                app.innerHTML =
                    '<div class="preloader"><div class="cs-loader"><div class="cs-loader-inner"><label> ●</label><label> ●</label><label> ●</label><label> ●</label><label> ●</label><label> ●</label></div></div></div><style type="text/css">.reactSandboxWrap{position:relative;min-height: 100%;}.tab-right{padding: 0!important;}.preloader{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;background:#1890ff;z-index:9999;transition:opacity .65s}.preloader-hidden-add{opacity:1;display:block}.preloader-hidden-add-active{opacity:0}.preloader-hidden{display:none}.cs-loader{position:absolute;top:0;left:0;height:100%;width:100%}.cs-loader-inner{transform:translateY(-50%);top:50%;position:absolute;width:100%;color:#fff;text-align:center}.cs-loader-inner label{font-size:20px;opacity:0;display:inline-block}@keyframes lol{0%{opacity:0;transform:translateX(-300px)}33%{opacity:1;transform:translateX(0)}66%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(300px)}}.cs-loader-inner label:nth-child(6){animation:lol 3s infinite ease-in-out}.cs-loader-inner label:nth-child(5){animation:lol 3s .1s infinite ease-in-out}.cs-loader-inner label:nth-child(4){animation:lol 3s .2s infinite ease-in-out}.cs-loader-inner label:nth-child(3){animation:lol 3s .3s infinite ease-in-out}.cs-loader-inner label:nth-child(2){animation:lol 3s .4s infinite ease-in-out}.cs-loader-inner label:nth-child(1){animation:lol 3s .5s infinite ease-in-out}</style>';
            }
            /** 插入app节点和样式节点 */
            if (wrap) {
                if (wrap instanceof HTMLCollection) {
                    if (wrap[0]) {
                        !document.getElementById(style.id) && wrap[0].appendChild(style);
                        !document.getElementById(app.id) && wrap[0].appendChild(app);
                    }
                    else {
                        !document.getElementById(style.id) &&
                            document.body.appendChild(style);
                        !document.getElementById(app.id) && document.body.appendChild(app);
                    }
                }
                else {
                    //@ts-ignore
                    !document.getElementById(style.id) && wrap.appendChild(style);
                    //@ts-ignore
                    !document.getElementById(app.id) && wrap.appendChild(app);
                }
            }
            else {
                !document.getElementById(style.id) && document.body.appendChild(style);
                !document.getElementById(app.id) && document.body.appendChild(app);
            }
            main.call(that);
        };
        return MicroApps;
    }());

    var microApps$1 = []; // {name:'',entry:'url',container:'DOMid',appId:'',styleId:'',loading:true}
    var scriptResources$1 = {}; // {'entry':{scripts:[],scriptCache:[],sandbox:[],excludeSandboxFiles:[]}}
    /* let isImportHTML = false; */
    var externalOnloadScript$1 = []; // [{url:'',code:''}] 已加载过外部资源列表
    var MicroApps$1 = /** @class */ (function () {
        function MicroApps() {
        }
        MicroApps.getStore = function () {
            return {
                apps: microApps$1,
                scriptResources: scriptResources$1,
                externalOnloadScript: externalOnloadScript$1,
            };
        };
        MicroApps.prototype.getApps = function () {
            return {
                apps: microApps$1,
                scriptResources: scriptResources$1,
                externalOnloadScript: externalOnloadScript$1,
            };
        };
        MicroApps.prototype.isRegister = function (apps) {
            var unregisteredApps = microApps$1.filter(function (item) { return item.name === apps.name; });
            if (unregisteredApps.length > 0) {
                return unregisteredApps;
            }
            return null;
        };
        MicroApps.prototype.register = function (apps) {
            if (Array.isArray(apps)) {
                var unregisteredApps = apps.filter(function (app) { return !microApps$1.some(function (registeredApp) { return registeredApp.name === app.name; }); });
                microApps$1 = __spread(microApps$1, unregisteredApps);
            }
        };
        MicroApps.prototype.bootstrap = function (apps, importHtmlentryResult) {
            var _this = this;
            var that = this;
            var sourceUrl = apps['entry'];
            var isCheckRegister = function () {
                var oldApps = _this.isRegister(apps);
                if (!oldApps) {
                    microApps$1 = __spread(microApps$1, [apps]);
                    syncMicroApps();
                }
            };
            var syncMicroApps = function () {
                importHtmlentryResult.getExternalScripts().then(function (exports) {
                    if (importHtmlentryResult.getScripts) {
                        var scriptList = importHtmlentryResult.getScripts();
                        var excludeFiles_1 = [];
                        var _scripts = scriptList['scripts'];
                        var scriptCache_1 = [];
                        if (exports &&
                            Object.prototype.toString.call(exports) === '[object Array]') {
                            exports.forEach(function (item) {
                                scriptCache_1.push({
                                    key: item.scripts,
                                    code: item['scriptsText'],
                                });
                            });
                        }
                        if (scriptList['excludeFiles'].hasOwnProperty(sourceUrl)) {
                            scriptList['excludeFiles'][sourceUrl].forEach(function (item) {
                                scriptCache_1.forEach(function (entity) {
                                    var _index = entity.key.indexOf(item);
                                    if (_index > -1) {
                                        excludeFiles_1.push({ url: entity.key, code: entity.code });
                                    }
                                });
                            });
                        }
                        scriptResources$1[sourceUrl] = {
                            scripts: scriptList['scripts'][sourceUrl],
                            scriptCache: scriptCache_1,
                            excludeSandboxFiles: excludeFiles_1,
                            sandbox: [],
                            styles: [],
                            externalOnloadScriptPromise: [],
                        };
                        if (_scripts.hasOwnProperty(sourceUrl)) {
                            _scripts[sourceUrl].forEach(function (item) {
                                excludeFiles_1.forEach(function (entity) {
                                    if (entity) {
                                        var _index = entity.url.indexOf(item);
                                        if (_index < 0) {
                                            scriptResources$1[sourceUrl]['sandbox'].push(item);
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            };
            isCheckRegister.call(that);
        };
        return MicroApps;
    }());

    var requestIdleCallback = window.requestIdleCallback ||
        function requestIdleCallback(cb) {
            var start = Date.now();
            return setTimeout(function () {
                cb({
                    didTimeout: false,
                    timeRemaining: function () {
                        return Math.max(0, 50 - (Date.now() - start));
                    },
                });
            }, 1);
        };
    var isSlowNetwork = navigator.connection
        ? navigator.connection.saveData ||
            (navigator.connection.type !== 'wifi' &&
                navigator.connection.type !== 'ethernet' &&
                /(2|3)g/.test(navigator.connection.effectiveType))
        : false;
    /**
     * prefetch assets, do nothing while in mobile network
     * @param entry
     * @param opts
     */
    function prefetch(entry, opts) {
        var _this = this;
        if (!navigator.onLine || isSlowNetwork) {
            // Don't prefetch if in a slow network or offline
            return;
        }
        requestIdleCallback(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, getExternalScripts, getExternalStyleSheets;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, legionsImportHtmlEntry.importHTML(entry, opts)];
                    case 1:
                        _a = _b.sent(), getExternalScripts = _a.getExternalScripts, getExternalStyleSheets = _a.getExternalStyleSheets;
                        requestIdleCallback(getExternalStyleSheets);
                        requestIdleCallback(getExternalScripts);
                        return [2 /*return*/];
                }
            });
        }); });
    }
    function prefetchAfterFirstMounted(apps, opts) {
        window.addEventListener('single-spa:first-mount', function listener() {
            var notLoadedApps = apps.filter(function (app) { return singleSpa.getAppStatus(app.name) === singleSpa.NOT_LOADED; });
            //@ts-ignore
            if (process.env.NODE_ENV !== 'production') {
                var mountedApps = singleSpa.getMountedApps();
                console.log("[legions] prefetch starting after " + mountedApps + " mounted...", notLoadedApps);
            }
            notLoadedApps.forEach(function (_a) {
                var entry = _a.entry;
                return prefetch(entry, opts);
            });
            window.removeEventListener('single-spa:first-mount', listener);
        });
    }
    function prefetchImmediately(apps, opts) {
        //@ts-ignore
        if (process.env.NODE_ENV !== 'production') {
            console.log('[legions] prefetch starting for apps...', apps);
        }
        apps.forEach(function (_a) {
            var entry = _a.entry;
            return prefetch(entry, opts);
        });
    }
    function doPrefetchStrategy(apps, prefetchStrategy, importEntryOpts) {
        var appsName2Apps = function (names) {
            return apps.filter(function (app) { return names.includes(app.name); });
        };
        if (Array.isArray(prefetchStrategy)) {
            prefetchAfterFirstMounted(appsName2Apps(prefetchStrategy), importEntryOpts);
        }
        else {
            switch (prefetchStrategy) {
                case true:
                    prefetchAfterFirstMounted(apps, importEntryOpts);
                    break;
                case 'all':
                    prefetchImmediately(apps, importEntryOpts);
                    break;
            }
        }
    }

    function sleep(ms) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
            });
        });
    }
    /**
     * run a callback after next tick
     * @param cb
     */
    function nextTick(cb) {
        Promise.resolve().then(cb);
    }
    function toArray(array) {
        return Array.isArray(array) ? array : [array];
    }
    function getDefaultTplWrapper(id, name) {
        return function (tpl) {
            return "<div id=\"" + getWrapperId(id) + "\" data-name=\"" + name + "\">" + tpl + "</div>";
        };
    }
    function getWrapperId(id) {
        return "__legions_microapp_wrapper_for_" + snakeCase__default['default'](id) + "__";
    }
    function isEnableScopedCSS(sandbox) {
        if (typeof sandbox !== 'object') {
            return false;
        }
        if (sandbox.strictStyleIsolation) {
            return false;
        }
        return !!sandbox.experimentalStyleIsolation;
    }
    var Deferred = /** @class */ (function () {
        function Deferred() {
            var _this = this;
            this.promise = new Promise(function (resolve, reject) {
                _this.resolve = resolve;
                _this.reject = reject;
            });
        }
        return Deferred;
    }());
    var supportsUserTiming = typeof performance !== 'undefined' &&
        typeof performance.mark === 'function' &&
        typeof performance.clearMarks === 'function' &&
        typeof performance.measure === 'function' &&
        typeof performance.clearMeasures === 'function';
    function performanceMark(markName) {
        if (supportsUserTiming) {
            performance.mark(markName);
        }
    }
    function performanceMeasure(measureName, markName) {
        if (supportsUserTiming &&
            performance.getEntriesByName(markName, 'mark').length) {
            performance.measure(measureName, markName);
            performance.clearMarks(markName);
            performance.clearMeasures(measureName);
        }
    }
    function getContainer(container) {
        return typeof container === 'string'
            ? document.querySelector(container)
            : container;
    }
    /** 校验子应用导出的 生命周期 对象是否正确 */
    function validateExportLifecycle(exports) {
        var _a = exports !== null && exports !== void 0 ? exports : {}, bootstrap = _a.bootstrap, mount = _a.mount, unmount = _a.unmount;
        return isFunction__default['default'](bootstrap) && isFunction__default['default'](mount) && isFunction__default['default'](unmount);
    }
    var SandBoxType;
    (function (SandBoxType) {
        SandBoxType["Proxy"] = "Proxy";
        /** 暂时不用 */
        SandBoxType["Snapshot"] = "Snapshot";
        SandBoxType["LegacyProxy"] = "LegacyProxy";
    })(SandBoxType || (SandBoxType = {}));
    var naughtySafari = typeof document.all === 'function' && typeof document.all === 'undefined';
    var isCallable = naughtySafari
        ? function (fn) { return typeof fn === 'function' && typeof fn !== 'undefined'; }
        : function (fn) { return typeof fn === 'function'; };
    var boundedMap = new WeakMap();
    function isBoundedFunction(fn) {
        if (boundedMap.has(fn)) {
            return boundedMap.get(fn);
        }
        /*
         indexOf is faster than startsWith
         see https://jsperf.com/string-startswith/72
         */
        var bounded = fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
        boundedMap.set(fn, bounded);
        return bounded;
    }
    var constructableMap = new WeakMap();
    function isConstructable(fn) {
        if (constructableMap.has(fn)) {
            return constructableMap.get(fn);
        }
        var constructableFunctionRegex = /^function\b\s[A-Z].*/;
        var classRegex = /^class\b/;
        // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数
        var constructable = (fn.prototype &&
            fn.prototype.constructor === fn &&
            Object.getOwnPropertyNames(fn.prototype).length > 1) ||
            constructableFunctionRegex.test(fn.toString()) ||
            classRegex.test(fn.toString());
        constructableMap.set(fn, constructable);
        return constructable;
    }
    /**
     * copy from https://developer.mozilla.org/zh-CN/docs/Using_XPath
     * @param el
     * @param document
     */
    function getXPathForElement(el, document) {
        // not support that if el not existed in document yet(such as it not append to document before it mounted)
        if (!document.body.contains(el)) {
            return undefined;
        }
        var xpath = '';
        var pos;
        var tmpEle;
        var element = el;
        while (element !== document.documentElement) {
            pos = 0;
            tmpEle = element;
            while (tmpEle) {
                if (tmpEle.nodeType === 1 && tmpEle.nodeName === element.nodeName) {
                    // If it is ELEMENT_NODE of the same name
                    pos += 1;
                }
                tmpEle = tmpEle.previousSibling;
            }
            xpath = "*[name()='" + element.nodeName + "' and namespace-uri()='" + (element.namespaceURI === null ? '' : element.namespaceURI) + "'][" + pos + "]/" + xpath;
            element = element.parentNode;
        }
        xpath = "/*[name()='" + document.documentElement.nodeName + "' and namespace-uri()='" + (element.namespaceURI === null ? '' : element.namespaceURI) + "']/" + xpath;
        xpath = xpath.replace(/\/$/, '');
        return xpath;
    }

    var RuleType;
    (function (RuleType) {
        // type: rule will be rewrote
        RuleType[RuleType["STYLE"] = 1] = "STYLE";
        RuleType[RuleType["MEDIA"] = 4] = "MEDIA";
        RuleType[RuleType["SUPPORTS"] = 12] = "SUPPORTS";
        // type: value will be kept
        RuleType[RuleType["IMPORT"] = 3] = "IMPORT";
        RuleType[RuleType["FONT_FACE"] = 5] = "FONT_FACE";
        RuleType[RuleType["PAGE"] = 6] = "PAGE";
        RuleType[RuleType["KEYFRAMES"] = 7] = "KEYFRAMES";
        RuleType[RuleType["KEYFRAME"] = 8] = "KEYFRAME";
    })(RuleType || (RuleType = {}));
    var arrayify = function (list) {
        return [].slice.call(list, 0);
    };
    var rawDocumentBodyAppend = HTMLBodyElement.prototype.appendChild;
    var QiankunCSSRewriteAttr = 'data-legions';
    var ScopedCSS = /** @class */ (function () {
        function ScopedCSS() {
            var styleNode = document.createElement('style');
            rawDocumentBodyAppend.call(document.body, styleNode);
            this.swapNode = styleNode;
            this.sheet = styleNode.sheet;
            this.sheet.disabled = true;
        }
        ScopedCSS.prototype.process = function (styleNode, prefix) {
            var _this = this;
            var _a;
            if (prefix === void 0) { prefix = ''; }
            if (styleNode.textContent !== '') {
                var textNode = document.createTextNode(styleNode.textContent || '');
                this.swapNode.appendChild(textNode);
                var sheet = this.swapNode.sheet; // type is missing
                var rules = arrayify((_a = sheet === null || sheet === void 0 ? void 0 : sheet.cssRules) !== null && _a !== void 0 ? _a : []);
                var css = this.rewrite(rules, prefix);
                // eslint-disable-next-line no-param-reassign
                styleNode.textContent = css;
                // cleanup
                this.swapNode.removeChild(textNode);
                return;
            }
            var mutator = new MutationObserver(function (mutations) {
                var _a;
                for (var i = 0; i < mutations.length; i += 1) {
                    var mutation = mutations[i];
                    if (ScopedCSS.ModifiedTag in styleNode) {
                        return;
                    }
                    if (mutation.type === 'childList') {
                        var sheet = styleNode.sheet;
                        var rules = arrayify((_a = sheet === null || sheet === void 0 ? void 0 : sheet.cssRules) !== null && _a !== void 0 ? _a : []);
                        var css = _this.rewrite(rules, prefix);
                        // eslint-disable-next-line no-param-reassign
                        styleNode.textContent = css;
                        // eslint-disable-next-line no-param-reassign
                        styleNode[ScopedCSS.ModifiedTag] = true;
                    }
                }
            });
            // since observer will be deleted when node be removed
            // we dont need create a cleanup function manually
            // see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect
            mutator.observe(styleNode, { childList: true });
        };
        ScopedCSS.prototype.rewrite = function (rules, prefix) {
            var _this = this;
            if (prefix === void 0) { prefix = ''; }
            var css = '';
            rules.forEach(function (rule) {
                switch (rule.type) {
                    case RuleType.STYLE:
                        css += _this.ruleStyle(rule, prefix);
                        break;
                    case RuleType.MEDIA:
                        css += _this.ruleMedia(rule, prefix);
                        break;
                    case RuleType.SUPPORTS:
                        css += _this.ruleSupport(rule, prefix);
                        break;
                    default:
                        css += "" + rule.cssText;
                        break;
                }
            });
            return css;
        };
        // handle case:
        // .app-main {}
        // html, body {}
        // eslint-disable-next-line class-methods-use-this
        ScopedCSS.prototype.ruleStyle = function (rule, prefix) {
            var rootSelectorRE = /((?:[^\w\-.#]|^)(body|html|:root))/gm;
            var rootCombinationRE = /(html[^\w{[]+)/gm;
            var selector = rule.selectorText.trim();
            var cssText = rule.cssText;
            // handle html { ... }
            // handle body { ... }
            // handle :root { ... }
            if (selector === 'html' || selector === 'body' || selector === ':root') {
                return cssText.replace(rootSelectorRE, prefix);
            }
            // handle html body { ... }
            // handle html > body { ... }
            if (rootCombinationRE.test(rule.selectorText)) {
                var siblingSelectorRE = /(html[^\w{]+)(\+|~)/gm;
                // since html + body is a non-standard rule for html
                // transformer will ignore it
                if (!siblingSelectorRE.test(rule.selectorText)) {
                    cssText = cssText.replace(rootCombinationRE, '');
                }
            }
            // handle grouping selector, a,span,p,div { ... }
            cssText = cssText.replace(/^[\s\S]+{/, function (selectors) {
                return selectors.replace(/(^|,\n?)([^,]+)/g, function (item, p, s) {
                    // handle div,body,span { ... }
                    if (rootSelectorRE.test(item)) {
                        return item.replace(rootSelectorRE, function (m) {
                            // do not discard valid previous character, such as body,html or *:not(:root)
                            var whitePrevChars = [',', '('];
                            if (m && whitePrevChars.includes(m[0])) {
                                return "" + m[0] + prefix;
                            }
                            // replace root selector with prefix
                            return prefix;
                        });
                    }
                    return "" + p + prefix + " " + s.replace(/^ */, '');
                });
            });
            return cssText;
        };
        // handle case:
        // @media screen and (max-width: 300px) {}
        ScopedCSS.prototype.ruleMedia = function (rule, prefix) {
            var css = this.rewrite(arrayify(rule.cssRules), prefix);
            return "@media " + rule.conditionText + " {" + css + "}";
        };
        // handle case:
        // @supports (display: grid) {}
        ScopedCSS.prototype.ruleSupport = function (rule, prefix) {
            var css = this.rewrite(arrayify(rule.cssRules), prefix);
            return "@supports " + rule.conditionText + " {" + css + "}";
        };
        ScopedCSS.ModifiedTag = 'Symbol(style-modified-qiankun)';
        return ScopedCSS;
    }());
    var processor;
    var process$1 = function (appWrapper, stylesheetElement, appName) {
        // lazy singleton pattern
        if (!processor) {
            processor = new ScopedCSS();
        }
        if (stylesheetElement.tagName === 'LINK') {
            console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
        }
        var mountDOM = appWrapper;
        if (!mountDOM) {
            return;
        }
        var tag = (mountDOM.tagName || '').toLowerCase();
        if (tag && stylesheetElement.tagName === 'STYLE') {
            var prefix = tag + "[" + QiankunCSSRewriteAttr + "=\"" + appName + "\"]";
            processor.process(stylesheetElement, prefix);
        }
    };

    var rawPublicPath = window.__INJECTED_PUBLIC_PATH_BY_LEGIONS__;
    function getAddOn(global, publicPath) {
        if (publicPath === void 0) { publicPath = '/'; }
        var hasMountedOnce = false;
        return {
            beforeLoad: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        // eslint-disable-next-line no-param-reassign
                        global.__INJECTED_PUBLIC_PATH_BY_LEGIONS__ = publicPath;
                        return [2 /*return*/];
                    });
                });
            },
            beforeMount: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (hasMountedOnce) {
                            // eslint-disable-next-line no-param-reassign
                            global.__INJECTED_PUBLIC_PATH_BY_LEGIONS__ = publicPath;
                        }
                        return [2 /*return*/];
                    });
                });
            },
            beforeUnmount: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (rawPublicPath === undefined) {
                            // eslint-disable-next-line no-param-reassign
                            delete global.__INJECTED_PUBLIC_PATH_BY_LEGIONS__;
                        }
                        else {
                            // eslint-disable-next-line no-param-reassign
                            global.__INJECTED_PUBLIC_PATH_BY_LEGIONS__ = rawPublicPath;
                        }
                        hasMountedOnce = true;
                        return [2 /*return*/];
                    });
                });
            },
        };
    }

    function getAddOn$1(global) {
        return {
            beforeLoad: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        // eslint-disable-next-line no-param-reassign
                        global.__POWERED_BY_LEGIONS__ = true;
                        return [2 /*return*/];
                    });
                });
            },
            beforeMount: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        // eslint-disable-next-line no-param-reassign
                        global.__POWERED_BY_LEGIONS__ = true;
                        return [2 /*return*/];
                    });
                });
            },
            beforeUnmount: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        // eslint-disable-next-line no-param-reassign
                        delete global.__POWERED_BY_LEGIONS__;
                        return [2 /*return*/];
                    });
                });
            },
        };
    }

    function getAddOns(global, publicPath) {
        return mergeWith__default['default']({}, getAddOn$1(global), getAddOn(global, publicPath), function (v1, v2) { return concat__default['default'](v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []); });
    }

    var globalState = {};
    var deps = {};
    // 触发全局监听
    function emitGlobal(state, prevState) {
        Object.keys(deps).forEach(function (id) {
            if (deps[id] instanceof Function) {
                deps[id](cloneDeep__default['default'](state), cloneDeep__default['default'](prevState));
            }
        });
    }
    function initGlobalState(state) {
        if (state === void 0) { state = {}; }
        if (state === globalState) {
            console.warn('[legions] state has not changed！');
        }
        else {
            var prevGlobalState = cloneDeep__default['default'](globalState);
            globalState = cloneDeep__default['default'](state);
            emitGlobal(globalState, prevGlobalState);
        }
        return getMicroAppStateActions("global-" + +new Date(), true);
    }
    function getMicroAppStateActions(id, isMaster) {
        return {
            /**
             * onGlobalStateChange 全局依赖监听
             *
             * 收集 setState 时所需要触发的依赖
             *
             * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
             *
             * 这么设计是为了减少全局监听滥用导致的内存爆炸
             *
             * 依赖数据结构为：
             * {
             *   {id}: callback
             * }
             *
             * @param callback
             * @param fireImmediately
             */
            onGlobalStateChange: function (callback, fireImmediately) {
                if (!(callback instanceof Function)) {
                    console.error('[legions] callback must be function!');
                    return;
                }
                if (deps[id]) {
                    console.warn("[legions] '" + id + "' global listener already exists before this, new listener will overwrite it.");
                }
                deps[id] = callback;
                var cloneState = cloneDeep__default['default'](globalState);
                if (fireImmediately) {
                    callback(cloneState, cloneState);
                }
            },
            /**
             * setGlobalState 更新 store 数据
             *
             * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
             * 2. 修改 store 并触发全局监听
             *
             * @param state
             */
            setGlobalState: function (state) {
                if (state === void 0) { state = {}; }
                if (state === globalState) {
                    console.warn('[legions] state has not changed！');
                    return false;
                }
                var changeKeys = [];
                var prevGlobalState = cloneDeep__default['default'](globalState);
                globalState = cloneDeep__default['default'](Object.keys(state).reduce(function (_globalState, changeKey) {
                    var _a;
                    if (isMaster || _globalState.hasOwnProperty(changeKey)) {
                        changeKeys.push(changeKey);
                        return Object.assign(_globalState, (_a = {},
                            _a[changeKey] = state[changeKey],
                            _a));
                    }
                    console.warn("[legions] '" + changeKey + "' not declared when init state\uFF01");
                    return _globalState;
                }, globalState));
                if (changeKeys.length === 0) {
                    console.warn('[legions] state has not changed！');
                    return false;
                }
                emitGlobal(globalState, prevGlobalState);
                return true;
            },
            // 注销该应用下的依赖
            offGlobalStateChange: function () {
                delete deps[id];
                return true;
            },
        };
    }

    var documentAttachProxyMap = new WeakMap();
    var functionBoundedValueMap = new WeakMap();
    function getTargetValue(target, value) {
        /*
            仅绑定 isCallable && !isBoundedFunction && !isConstructable 的函数对象，如 window.console、window.atob 这类。目前没有完美的检测方式，这里通过 prototype 中是否还有可枚举的拓展方法的方式来判断
            @warning 这里不要随意替换成别的判断方式，因为可能触发一些 edge case（比如在 lodash.isFunction 在 iframe 上下文中可能由于调用了 top window 对象触发的安全异常）
           */
        if (isCallable(value) &&
            !isBoundedFunction(value) &&
            !isConstructable(value)) {
            var cachedBoundValue = functionBoundedValueMap.get(value);
            if (cachedBoundValue) {
                return cachedBoundValue;
            }
            var boundValue = value.bind(target);
            // some callable function has custom fields, we need to copy the enumerable props to boundValue. such as moment function.
            // use for..in rather than Object.keys.forEach for performance reason
            // eslint-disable-next-line guard-for-in,no-restricted-syntax
            for (var key in value) {
                // 当函数上面存在属性时，需要遍历所有属性
                boundValue[key] = value[key];
            }
            // copy prototype, for performance reason, we use in operator to check rather than hasOwnProperty
            if ('prototype' in value)
                boundValue.prototype = value.prototype; // 原型拷贝
            functionBoundedValueMap.set(value, boundValue);
            return boundValue;
        }
        return value;
    }

    /**
     * copy from https://www.npmjs.com/package/qiankun
     */
    var activeSandboxCount = 0;
    /**
     * fastest(at most time) unique array method
     * @see https://jsperf.com/array-filter-unique/30
     */
    function uniq(array) {
        return array.filter(function filter(element) {
            return element in this ? false : (this[element] = true);
        }, {});
    }
    var unscopables = {
        undefined: true,
        Array: true,
        Object: true,
        String: true,
        Boolean: true,
        Math: true,
        eval: true,
        Number: true,
        Symbol: true,
        parseFloat: true,
        Float32Array: true,
    };
    var rawObjectDefineProperty = Object.defineProperty;
    var variableWhiteListInDev = 
    //@ts-ignore
    process.env.NODE_ENV === 'development'
        ? ['__REACT_ERROR_OVERLAY_GLOBAL_HOOK__']
        : [];
    var variableWhiteList = __spread([
        'System',
        '__cjsWrapper'
    ], variableWhiteListInDev);
    function createFakeWindow(global) {
        // map always has the fastest performance in has check scenario
        // see https://jsperf.com/array-indexof-vs-set-has/23
        var propertiesWithGetter = new Map();
        var fakeWindow = {};
        /*
         copy the non-configurable property of global to fakeWindow
         see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
         > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
         */
        Object.getOwnPropertyNames(global)
            .filter(function (p) {
            var descriptor = Object.getOwnPropertyDescriptor(global, p);
            return !(descriptor === null || descriptor === void 0 ? void 0 : descriptor.configurable);
        })
            .forEach(function (p) {
            var descriptor = Object.getOwnPropertyDescriptor(global, p);
            if (descriptor) {
                var hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get');
                /*
                 make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
                 see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
                 > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
                 */
                if (p === 'top' ||
                    p === 'parent' ||
                    p === 'self' ||
                    p === 'window' ||
                    //@ts-ignore
                    (process.env.NODE_ENV === 'test' &&
                        (p === 'mockTop' || p === 'mockSafariTop'))) {
                    descriptor.configurable = true;
                    /*
                     The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
                     Example:
                      Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
                      Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
                     */
                    if (!hasGetter) {
                        descriptor.writable = true;
                    }
                }
                if (hasGetter)
                    propertiesWithGetter.set(p, true);
                // freeze the descriptor to avoid being modified by zone.js
                // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71
                rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor));
            }
        });
        return {
            fakeWindow: fakeWindow,
            propertiesWithGetter: propertiesWithGetter,
        };
    }
    // check window contructor function， like Object Array
    var ProxySandbox = /** @class */ (function () {
        function ProxySandbox(props) {
            if (props === void 0) { props = { name: '' }; }
            this.eventListeners = {};
            this.timeoutIds = [];
            this.intervalIds = [];
            /* private propertyAdded = {};
          
            private originalValues = {}; */
            /** window 值变更记录 */
            this.updatedValueSet = new Set();
            /** 沙箱的名字 */
            this.name = '';
            /** 沙箱的类型 */
            this.type = SandBoxType.Proxy;
            /** 沙箱是否在运行中 */
            this.sandboxRunning = true;
            if (!window.Proxy) {
                console.warn('proxy sandbox is not support by current browser');
            } /*  else {
              PROXY = window.Proxy;
            } */
            //@ts-ignore
            this.sandbox = null;
            this.name = props.name;
            this.createProxySandbox();
        }
        ProxySandbox.prototype.active = function () {
            if (!this.sandboxRunning)
                activeSandboxCount++;
            this.sandboxRunning = true;
        };
        ProxySandbox.prototype.inactive = function () {
            var _this = this;
            //@ts-ignore
            if (process.env.NODE_ENV !== 'production') {
                console.info("[legions:sandbox] " + this.name + " modified global properties restore...", __spread(this.updatedValueSet.keys()));
            }
            if (--activeSandboxCount === 0) {
                variableWhiteList.forEach(function (p) {
                    if (_this.sandbox.hasOwnProperty(p)) {
                        // @ts-ignore
                        delete window[p];
                    }
                });
            }
            this.sandboxRunning = false;
        };
        ProxySandbox.prototype.createProxySandbox = function () {
            var 
            /* propertyAdded, originalValues,  */
            updatedValueSet = this.updatedValueSet;
            var self = this;
            var rawWindow = window;
            var _a = createFakeWindow(rawWindow), fakeWindow = _a.fakeWindow, propertiesWithGetter = _a.propertiesWithGetter; // 生成一份伪造的window
            var descriptorTargetMap = new Map();
            var hasOwnProperty = function (key) {
                return fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key);
            };
            var sandbox = new window.Proxy(fakeWindow, {
                set: function (target, p, value) {
                    if (self.sandboxRunning) {
                        // eslint-disable-next-line no-prototype-builtins
                        if (variableWhiteList.indexOf(p) !== -1) {
                            // @ts-ignore
                            rawWindow[p] = value;
                        }
                        // eslint-disable-next-line no-param-reassign
                        //@ts-ignore
                        target[p] = value;
                        updatedValueSet.add(p);
                    }
                    return true;
                },
                get: function (target, p) {
                    if (p === Symbol.unscopables) {
                        // 加固，防止逃逸
                        return unscopables;
                    }
                    // see https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js#L13
                    if (p === 'window' || p === 'self') {
                        return sandbox;
                    }
                    if (p === 'top' || p === 'parent') {
                        // if your master app in an iframe context, allow these props escape the sandbox
                        if (rawWindow === rawWindow.parent) {
                            return sandbox;
                        }
                        return rawWindow[p];
                    }
                    // proxy hasOwnProperty, in case of proxy.hasOwnProperty value represented as originalWindow.hasOwnProperty
                    if (p === 'hasOwnProperty') {
                        // eslint-disable-next-line no-prototype-builtins
                        /* return (key: PropertyKey) =>
                          //@ts-ignore
                          !!target[key] || rawWindow.hasOwnProperty(key); */
                        return hasOwnProperty;
                    }
                    // mark the symbol to document while accessing as document.createElement could know is invoked by which sandbox for dynamic append patcher
                    if (p === 'document') {
                        documentAttachProxyMap.set(document, sandbox);
                        // remove the mark in next tick, thus we can identify whether it in micro app or not
                        // this approach is just a workaround, it could not cover all the complex scenarios, such as the micro app runs in the same task context with master in som case
                        // fixme if you have any other good ideas
                        nextTick(function () { return documentAttachProxyMap.delete(document); });
                        return document;
                    }
                    var value = propertiesWithGetter.has(p)
                        ? rawWindow[p]
                        : target[p] || rawWindow[p];
                    return getTargetValue(rawWindow, value);
                },
                has: function (target, p) {
                    return p in unscopables || p in target || p in rawWindow;
                },
                getOwnPropertyDescriptor: function (target, p) {
                    /*
                     as the descriptor of top/self/window/mockTop in raw window are configurable but not in proxy target, we need to get it from target to avoid TypeError
                     see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor
                     > A property cannot be reported as non-configurable, if it does not exists as an own property of the target object or if it exists as a configurable own property of the target object.
                     */
                    if (target.hasOwnProperty(p)) {
                        var descriptor = Object.getOwnPropertyDescriptor(target, p);
                        descriptorTargetMap.set(p, 'target');
                        return descriptor;
                    }
                    if (rawWindow.hasOwnProperty(p)) {
                        var descriptor = Object.getOwnPropertyDescriptor(rawWindow, p);
                        descriptorTargetMap.set(p, 'rawWindow');
                        // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object
                        if (descriptor && !descriptor.configurable) {
                            descriptor.configurable = true;
                        }
                        return descriptor;
                    }
                    return undefined;
                },
                // trap to support iterator with sandbox
                ownKeys: function (target) {
                    return uniq(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)));
                },
                defineProperty: function (target, p, attributes) {
                    var from = descriptorTargetMap.get(p);
                    /*
                     Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
                     otherwise it would cause a TypeError with illegal invocation.
                     */
                    switch (from) {
                        case 'rawWindow':
                            return Reflect.defineProperty(rawWindow, p, attributes);
                        default:
                            return Reflect.defineProperty(target, p, attributes);
                    }
                },
                deleteProperty: function (target, p) {
                    if (target.hasOwnProperty(p)) {
                        // @ts-ignore
                        delete target[p];
                        updatedValueSet.delete(p);
                        return true;
                    }
                    return true;
                },
            });
            this.sandbox = sandbox;
        };
        ProxySandbox.prototype.getSandbox = function () {
            return this.sandbox;
        };
        return ProxySandbox;
    }());

    /**
     * copy from https://www.npmjs.com/package/qiankun
     */
    function iter(obj, callbackFn) {
        // eslint-disable-next-line guard-for-in, no-restricted-syntax
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                callbackFn(prop);
            }
        }
    }
    /**
     * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
     */
    var SnapshotSandbox = /** @class */ (function () {
        function SnapshotSandbox(name) {
            this.sandboxRunning = true;
            this.modifyPropsMap = {};
            this.name = name;
            this.sandbox = window;
            this.type = SandBoxType.Snapshot;
        }
        SnapshotSandbox.prototype.active = function () {
            var _this = this;
            // 记录当前快照
            this.windowSnapshot = {};
            iter(window, function (prop) {
                _this.windowSnapshot[prop] = window[prop];
            });
            // 恢复之前的变更
            Object.keys(this.modifyPropsMap).forEach(function (p) {
                window[p] = _this.modifyPropsMap[p];
            });
            this.sandboxRunning = true;
        };
        SnapshotSandbox.prototype.inactive = function () {
            var _this = this;
            this.modifyPropsMap = {};
            iter(window, function (prop) {
                if (window[prop] !== _this.windowSnapshot[prop]) {
                    // 记录变更，恢复环境
                    _this.modifyPropsMap[prop] = window[prop];
                    window[prop] = _this.windowSnapshot[prop];
                }
            });
            //@ts-ignore
            if (process.env.NODE_ENV !== 'production') {
                console.info("[legions:sandbox] " + this.name + " origin window restore...", Object.keys(this.modifyPropsMap));
            }
            this.sandboxRunning = false;
        };
        return SnapshotSandbox;
    }());

    /**
     * @author Kuitos
     * @since 2019-10-21
     */
    var rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
    var rawHeadRemoveChild = HTMLHeadElement.prototype.removeChild;
    var rawBodyAppendChild = HTMLBodyElement.prototype.appendChild;
    var rawBodyRemoveChild = HTMLBodyElement.prototype.removeChild;
    var rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
    var rawRemoveChild = HTMLElement.prototype.removeChild;
    var SCRIPT_TAG_NAME = 'SCRIPT';
    var LINK_TAG_NAME = 'LINK';
    var STYLE_TAG_NAME = 'STYLE';
    function isHijackingTag(tagName) {
        return ((tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === LINK_TAG_NAME ||
            (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === STYLE_TAG_NAME ||
            (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === SCRIPT_TAG_NAME);
    }
    /**
     * Check if a style element is a styled-component liked.
     * A styled-components liked element is which not have textContext but keep the rules in its styleSheet.cssRules.
     * Such as the style element generated by styled-components and emotion.
     * @param element
     */
    function isStyledComponentsLike(element) {
        var _a, _b;
        return (!element.textContent &&
            (((_a = element.sheet) === null || _a === void 0 ? void 0 : _a.cssRules.length) || ((_b = getStyledElementCSSRules(element)) === null || _b === void 0 ? void 0 : _b.length)));
    }
    function patchCustomEvent(e, elementGetter) {
        Object.defineProperties(e, {
            srcElement: {
                get: elementGetter,
            },
            target: {
                get: elementGetter,
            },
        });
        return e;
    }
    function manualInvokeElementOnLoad(element) {
        // we need to invoke the onload event manually to notify the event listener that the script was completed
        // here are the two typical ways of dynamic script loading
        // 1. element.onload callback way, which webpack and loadjs used, see https://github.com/muicss/loadjs/blob/master/src/loadjs.js#L138
        // 2. addEventListener way, which toast-loader used, see https://github.com/pyrsmk/toast/blob/master/src/Toast.ts#L64
        var loadEvent = new CustomEvent('load');
        var patchedEvent = patchCustomEvent(loadEvent, function () { return element; });
        if (isFunction__default['default'](element.onload)) {
            //@ts-ignore
            element.onload(patchedEvent);
        }
        else {
            element.dispatchEvent(patchedEvent);
        }
    }
    function manualInvokeElementOnError(element) {
        var errorEvent = new CustomEvent('error');
        var patchedEvent = patchCustomEvent(errorEvent, function () { return element; });
        if (isFunction__default['default'](element.onerror)) {
            //@ts-ignore
            element.onerror(patchedEvent);
        }
        else {
            element.dispatchEvent(patchedEvent);
        }
    }
    function convertLinkAsStyle(element, postProcess, fetchFn) {
        if (fetchFn === void 0) { fetchFn = legionsImportHtmlEntry.fetch; }
        var styleElement = document.createElement('style');
        var href = element.href;
        // add source link element href
        styleElement.dataset.qiankunHref = href;
        fetchFn(href)
            .then(function (res) { return res.text(); })
            .then(function (styleContext) {
            styleElement.appendChild(document.createTextNode(styleContext));
            postProcess(styleElement);
            manualInvokeElementOnLoad(element);
        })
            .catch(function () { return manualInvokeElementOnError(element); });
        return styleElement;
    }
    var styledComponentCSSRulesMap = new WeakMap();
    var dynamicScriptAttachedCommentMap = new WeakMap();
    var dynamicLinkAttachedInlineStyleMap = new WeakMap();
    function recordStyledComponentsCSSRules(styleElements) {
        styleElements.forEach(function (styleElement) {
            /*
             With a styled-components generated style element, we need to record its cssRules for restore next re-mounting time.
             We're doing this because the sheet of style element is going to be cleaned automatically by browser after the style element dom removed from document.
             see https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
             */
            if (styleElement instanceof HTMLStyleElement && isStyledComponentsLike(styleElement)) {
                if (styleElement.sheet) {
                    // record the original css rules of the style element for restore
                    styledComponentCSSRulesMap.set(styleElement, styleElement.sheet.cssRules);
                }
            }
        });
    }
    function getStyledElementCSSRules(styledElement) {
        return styledComponentCSSRulesMap.get(styledElement);
    }
    function getOverwrittenAppendChildOrInsertBefore(opts) {
        return function appendChildOrInsertBefore(newChild, refChild) {
            var _a;
            var element = newChild;
            var rawDOMAppendOrInsertBefore = opts.rawDOMAppendOrInsertBefore, isInvokedByMicroApp = opts.isInvokedByMicroApp, containerConfigGetter = opts.containerConfigGetter;
            if (!isHijackingTag(element.tagName) || !isInvokedByMicroApp(element)) {
                return rawDOMAppendOrInsertBefore.call(this, element, refChild);
            }
            if (element.tagName) {
                var containerConfig = containerConfigGetter(element);
                var appName_1 = containerConfig.appName, appWrapperGetter = containerConfig.appWrapperGetter, proxy = containerConfig.proxy, strictGlobal = containerConfig.strictGlobal, dynamicStyleSheetElements = containerConfig.dynamicStyleSheetElements, scopedCSS = containerConfig.scopedCSS, excludeAssetFilter = containerConfig.excludeAssetFilter;
                switch (element.tagName) {
                    case LINK_TAG_NAME:
                    case STYLE_TAG_NAME: {
                        var stylesheetElement = newChild;
                        var href = stylesheetElement.href;
                        if (excludeAssetFilter && href && excludeAssetFilter(href)) {
                            return rawDOMAppendOrInsertBefore.call(this, element, refChild);
                        }
                        var mountDOM_1 = appWrapperGetter();
                        if (scopedCSS) {
                            // exclude link elements like <link rel="icon" href="favicon.ico">
                            var linkElementUsingStylesheet = ((_a = element.tagName) === null || _a === void 0 ? void 0 : _a.toUpperCase()) === LINK_TAG_NAME &&
                                element.rel === 'stylesheet' &&
                                element.href;
                            if (linkElementUsingStylesheet) {
                                stylesheetElement = convertLinkAsStyle(element, function (styleElement) { return process$1(mountDOM_1, styleElement, appName_1); }, legionsImportHtmlEntry.fetch);
                                dynamicLinkAttachedInlineStyleMap.set(element, stylesheetElement);
                            }
                            else {
                                process$1(mountDOM_1, stylesheetElement, appName_1);
                            }
                        }
                        // eslint-disable-next-line no-shadow
                        dynamicStyleSheetElements.push(stylesheetElement);
                        var referenceNode = mountDOM_1.contains(refChild) ? refChild : null;
                        return rawDOMAppendOrInsertBefore.call(mountDOM_1, stylesheetElement, referenceNode);
                    }
                    case SCRIPT_TAG_NAME: {
                        var _b = element, src = _b.src, text = _b.text;
                        // some script like jsonp maybe not support cors which should't use execScripts
                        if (excludeAssetFilter && src && excludeAssetFilter(src)) {
                            return rawDOMAppendOrInsertBefore.call(this, element, refChild);
                        }
                        var mountDOM = appWrapperGetter();
                        var referenceNode = mountDOM.contains(refChild) ? refChild : null;
                        if (src) {
                            legionsImportHtmlEntry.execScripts(null, [src], proxy);
                            var dynamicScriptCommentElement = document.createComment("dynamic script " + src + " replaced by legions");
                            dynamicScriptAttachedCommentMap.set(element, dynamicScriptCommentElement);
                            return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicScriptCommentElement, referenceNode);
                        }
                        // inline script never trigger the onload and onerror event
                        legionsImportHtmlEntry.execScripts(null, ["<script>" + text + "</script>"], proxy);
                        var dynamicInlineScriptCommentElement = document.createComment('dynamic inline script replaced by legions');
                        dynamicScriptAttachedCommentMap.set(element, dynamicInlineScriptCommentElement);
                        return rawDOMAppendOrInsertBefore.call(mountDOM, dynamicInlineScriptCommentElement, referenceNode);
                    }
                }
            }
            return rawDOMAppendOrInsertBefore.call(this, element, refChild);
        };
    }
    function getNewRemoveChild(headOrBodyRemoveChild, appWrapperGetterGetter) {
        return function removeChild(child) {
            var tagName = child.tagName;
            if (!isHijackingTag(tagName))
                return headOrBodyRemoveChild.call(this, child);
            try {
                var attachedElement = void 0;
                switch (tagName) {
                    case LINK_TAG_NAME: {
                        attachedElement = dynamicLinkAttachedInlineStyleMap.get(child) || child;
                        break;
                    }
                    case SCRIPT_TAG_NAME: {
                        attachedElement = dynamicScriptAttachedCommentMap.get(child) || child;
                        break;
                    }
                    default: {
                        attachedElement = child;
                    }
                }
                // container may had been removed while app unmounting if the removeChild action was async
                var appWrapperGetter = appWrapperGetterGetter(child);
                var container = appWrapperGetter();
                if (container.contains(attachedElement)) {
                    return rawRemoveChild.call(container, attachedElement);
                }
            }
            catch (e) {
                console.warn(e);
            }
            return headOrBodyRemoveChild.call(this, child);
        };
    }
    function patchHTMLDynamicAppendPrototypeFunctions(isInvokedByMicroApp, containerConfigGetter) {
        // Just overwrite it while it have not been overwrite
        if (HTMLHeadElement.prototype.appendChild === rawHeadAppendChild &&
            HTMLBodyElement.prototype.appendChild === rawBodyAppendChild &&
            HTMLHeadElement.prototype.insertBefore === rawHeadInsertBefore) {
            HTMLHeadElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
                rawDOMAppendOrInsertBefore: rawHeadAppendChild,
                containerConfigGetter: containerConfigGetter,
                isInvokedByMicroApp: isInvokedByMicroApp,
            });
            HTMLBodyElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
                rawDOMAppendOrInsertBefore: rawBodyAppendChild,
                containerConfigGetter: containerConfigGetter,
                isInvokedByMicroApp: isInvokedByMicroApp,
            });
            HTMLHeadElement.prototype.insertBefore = getOverwrittenAppendChildOrInsertBefore({
                rawDOMAppendOrInsertBefore: rawHeadInsertBefore,
                containerConfigGetter: containerConfigGetter,
                isInvokedByMicroApp: isInvokedByMicroApp,
            });
        }
        // Just overwrite it while it have not been overwrite
        if (HTMLHeadElement.prototype.removeChild === rawHeadRemoveChild &&
            HTMLBodyElement.prototype.removeChild === rawBodyRemoveChild) {
            HTMLHeadElement.prototype.removeChild = getNewRemoveChild(rawHeadRemoveChild, function (element) { return containerConfigGetter(element).appWrapperGetter; });
            HTMLBodyElement.prototype.removeChild = getNewRemoveChild(rawBodyRemoveChild, function (element) { return containerConfigGetter(element).appWrapperGetter; });
        }
        return function unpatch() {
            HTMLHeadElement.prototype.appendChild = rawHeadAppendChild;
            HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;
            HTMLBodyElement.prototype.appendChild = rawBodyAppendChild;
            HTMLBodyElement.prototype.removeChild = rawBodyRemoveChild;
            HTMLHeadElement.prototype.insertBefore = rawHeadInsertBefore;
        };
    }
    function rebuildCSSRules(styleSheetElements, reAppendElement) {
        styleSheetElements.forEach(function (stylesheetElement) {
            // re-append the dynamic stylesheet to sub-app container
            reAppendElement(stylesheetElement);
            /*
            get the stored css rules from styled-components generated element, and the re-insert rules for them.
            note that we must do this after style element had been added to document, which stylesheet would be associated to the document automatically.
            check the spec https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
             */
            if (stylesheetElement instanceof HTMLStyleElement && isStyledComponentsLike(stylesheetElement)) {
                var cssRules = getStyledElementCSSRules(stylesheetElement);
                if (cssRules) {
                    // eslint-disable-next-line no-plusplus
                    for (var i = 0; i < cssRules.length; i++) {
                        var cssRule = cssRules[i];
                        stylesheetElement.sheet.insertRule(cssRule.cssText);
                    }
                }
            }
        });
    }

    /**
     * @author Kuitos
     * @since 2020-10-13
     */
    var bootstrappingPatchCount = 0;
    var mountingPatchCount = 0;
    /**
     * Just hijack dynamic head append, that could avoid accidentally hijacking the insertion of elements except in head.
     * Such a case: ReactDOM.createPortal(<style>.test{color:blue}</style>, container),
     * this could made we append the style element into app wrapper but it will cause an error while the react portal unmounting, as ReactDOM could not find the style in body children list.
     * @param appName
     * @param appWrapperGetter
     * @param proxy
     * @param mounting
     * @param scopedCSS
     * @param excludeAssetFilter
     */
    function patchLooseSandbox(appName, appWrapperGetter, proxy, mounting, scopedCSS, excludeAssetFilter) {
        if (mounting === void 0) { mounting = true; }
        if (scopedCSS === void 0) { scopedCSS = false; }
        var dynamicStyleSheetElements = [];
        var unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(
        /*
          check if the currently specified application is active
          While we switch page from qiankun app to a normal react routing page, the normal one may load stylesheet dynamically while page rendering,
          but the url change listener must to wait until the current call stack is flushed.
          This scenario may cause we record the stylesheet from react routing page dynamic injection,
          and remove them after the url change triggered and qiankun app is unmouting
          see https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js#L222-L230
         */
        function () { return singleSpa.checkActivityFunctions(window.location).some(function (name) { return name === appName; }); }, function () { return ({
            appName: appName,
            appWrapperGetter: appWrapperGetter,
            proxy: proxy,
            strictGlobal: false,
            scopedCSS: scopedCSS,
            dynamicStyleSheetElements: dynamicStyleSheetElements,
            excludeAssetFilter: excludeAssetFilter,
        }); });
        if (!mounting)
            bootstrappingPatchCount++;
        if (mounting)
            mountingPatchCount++;
        return function free() {
            // bootstrap patch just called once but its freer will be called multiple times
            if (!mounting && bootstrappingPatchCount !== 0)
                bootstrappingPatchCount--;
            if (mounting)
                mountingPatchCount--;
            var allMicroAppUnmounted = mountingPatchCount === 0 && bootstrappingPatchCount === 0;
            // release the overwrite prototype after all the micro apps unmounted
            if (allMicroAppUnmounted)
                unpatchDynamicAppendPrototypeFunctions();
            recordStyledComponentsCSSRules(dynamicStyleSheetElements);
            // As now the sub app content all wrapped with a special id container,
            // the dynamic style sheet would be removed automatically while unmoutting
            return function rebuild() {
                rebuildCSSRules(dynamicStyleSheetElements, function (stylesheetElement) {
                    // Using document.head.appendChild ensures that appendChild invocation can also directly use the HTMLHeadElement.prototype.appendChild method which is overwritten at mounting phase
                    return document.head.appendChild.call(appWrapperGetter(), stylesheetElement);
                });
                // As the patcher will be invoked every mounting phase, we could release the cache for gc after rebuilding
                if (mounting) {
                    dynamicStyleSheetElements = [];
                }
            };
        };
    }

    /**
     * @author Kuitos
     * @since 2020-10-13
     */
    var rawDocumentCreateElement = Document.prototype.createElement;
    var proxyAttachContainerConfigMap = new WeakMap();
    var elementAttachContainerConfigMap = new WeakMap();
    function patchDocumentCreateElement() {
        if (Document.prototype.createElement === rawDocumentCreateElement) {
            Document.prototype.createElement = function createElement(tagName, options) {
                var element = rawDocumentCreateElement.call(this, tagName, options);
                if (isHijackingTag(tagName)) {
                    var attachProxy = documentAttachProxyMap.get(this);
                    if (attachProxy) {
                        var proxyContainerConfig = proxyAttachContainerConfigMap.get(attachProxy);
                        if (proxyContainerConfig) {
                            elementAttachContainerConfigMap.set(element, proxyContainerConfig);
                        }
                    }
                }
                return element;
            };
        }
        return function unpatch() {
            Document.prototype.createElement = rawDocumentCreateElement;
        };
    }
    var bootstrappingPatchCount$1 = 0;
    var mountingPatchCount$1 = 0;
    function patchStrictSandbox(appName, appWrapperGetter, proxy, mounting, scopedCSS, excludeAssetFilter) {
        if (mounting === void 0) { mounting = true; }
        if (scopedCSS === void 0) { scopedCSS = false; }
        var containerConfig = proxyAttachContainerConfigMap.get(proxy);
        if (!containerConfig) {
            containerConfig = {
                appName: appName,
                proxy: proxy,
                appWrapperGetter: appWrapperGetter,
                dynamicStyleSheetElements: [],
                strictGlobal: true,
                excludeAssetFilter: excludeAssetFilter,
                scopedCSS: scopedCSS,
            };
            proxyAttachContainerConfigMap.set(proxy, containerConfig);
        }
        // all dynamic style sheets are stored in proxy container
        var dynamicStyleSheetElements = containerConfig.dynamicStyleSheetElements;
        var unpatchDocumentCreate = patchDocumentCreateElement();
        var unpatchDynamicAppendPrototypeFunctions = patchHTMLDynamicAppendPrototypeFunctions(function (element) { return elementAttachContainerConfigMap.has(element); }, function (element) { return elementAttachContainerConfigMap.get(element); });
        if (!mounting)
            bootstrappingPatchCount$1++;
        if (mounting)
            mountingPatchCount$1++;
        return function free() {
            // bootstrap patch just called once but its freer will be called multiple times
            if (!mounting && bootstrappingPatchCount$1 !== 0)
                bootstrappingPatchCount$1--;
            if (mounting)
                mountingPatchCount$1--;
            var allMicroAppUnmounted = mountingPatchCount$1 === 0 && bootstrappingPatchCount$1 === 0;
            // release the overwrite prototype after all the micro apps unmounted
            if (allMicroAppUnmounted) {
                unpatchDynamicAppendPrototypeFunctions();
                unpatchDocumentCreate();
            }
            proxyAttachContainerConfigMap.delete(proxy);
            recordStyledComponentsCSSRules(dynamicStyleSheetElements);
            // As now the sub app content all wrapped with a special id container,
            // the dynamic style sheet would be removed automatically while unmoutting
            return function rebuild() {
                rebuildCSSRules(dynamicStyleSheetElements, function (stylesheetElement) {
                    return rawHeadAppendChild.call(appWrapperGetter(), stylesheetElement);
                });
            };
        };
    }

    function hijack() {
        // FIXME umi unmount feature request
        // @see http://gitlab.alipay-inc.com/bigfish/bigfish/issues/1154
        var rawHistoryListen = function () {
            var _ = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _[_i] = arguments[_i];
            }
            return noop__default['default'];
        };
        var historyListeners = [];
        var historyUnListens = [];
        if (window.g_history &&
            isFunction__default['default'](window.g_history.listen)) {
            rawHistoryListen = window.g_history.listen.bind(window.g_history);
            window.g_history.listen = function (listener) {
                historyListeners.push(listener);
                var unListen = rawHistoryListen(listener);
                historyUnListens.push(unListen);
                return function () {
                    unListen();
                    historyUnListens.splice(historyUnListens.indexOf(unListen), 1);
                    historyListeners.splice(historyListeners.indexOf(listener), 1);
                };
            };
        }
        return function free() {
            var rebuild = noop__default['default'];
            /*
             还存在余量 listener 表明未被卸载，存在两种情况
             1. 应用在 unmout 时未正确卸载 listener
             2. listener 是应用 mount 之前绑定的，
             第二种情况下应用在下次 mount 之前需重新绑定该 listener
             */
            if (historyListeners.length) {
                rebuild = function () {
                    // 必须使用 window.g_history.listen 的方式重新绑定 listener，从而能保证 rebuild 这部分也能被捕获到，否则在应用卸载后无法正确的移除这部分副作用
                    historyListeners.forEach(function (listener) {
                        return window.g_history.listen(listener);
                    });
                };
            }
            // 卸载余下的 listener
            historyUnListens.forEach(function (unListen) { return unListen(); });
            // restore
            if (window.g_history &&
                isFunction__default['default'](window.g_history.listen)) {
                window.g_history.listen = rawHistoryListen;
            }
            return rebuild;
        };
    }

    function hijack$1() {
        var rawWindowInterval = window.setInterval.bind(window);
        var rawWindowTimeout = window.setTimeout.bind(window);
        var timerIds = [];
        var intervalIds = [];
        window.setInterval = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // @ts-ignore
            var intervalId = rawWindowInterval.apply(void 0, __spread(args));
            intervalIds.push(intervalId);
            return intervalId;
        };
        window.setTimeout = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            // @ts-ignore
            var timerId = rawWindowTimeout.apply(void 0, __spread(args));
            timerIds.push(timerId);
            return timerId;
        };
        return function free() {
            var _this = this;
            window.setInterval = rawWindowInterval;
            window.setTimeout = rawWindowTimeout;
            timerIds.forEach(function (id) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: 
                        // 延迟 timeout 的清理，因为可能会有动画还没完成
                        return [4 /*yield*/, sleep(500)];
                        case 1:
                            // 延迟 timeout 的清理，因为可能会有动画还没完成
                            _a.sent();
                            window.clearTimeout(id);
                            return [2 /*return*/];
                    }
                });
            }); });
            intervalIds.forEach(function (id) {
                window.clearInterval(id);
            });
            return noop__default['default'];
        };
    }

    function hijack$2() {
        var listenerMap = new Map();
        var rawAddEventListener = window.addEventListener;
        var rawRemoveEventListener = window.removeEventListener;
        window.addEventListener = function (type, listener, options) {
            var listeners = listenerMap.get(type) || [];
            listenerMap.set(type, __spread(listeners, [listener]));
            return rawAddEventListener.call(window, type, listener, options);
        };
        window.removeEventListener = function (type, listener, options) {
            var storedTypeListeners = listenerMap.get(type);
            if (storedTypeListeners &&
                storedTypeListeners.length &&
                storedTypeListeners.indexOf(listener) !== -1) {
                storedTypeListeners.splice(storedTypeListeners.indexOf(listener), 1);
            }
            return rawRemoveEventListener.call(window, type, listener, options);
        };
        return function free() {
            listenerMap.forEach(function (listeners, type) {
                return listeners.forEach(function (listener) { return window.removeEventListener(type, listener); });
            });
            window.addEventListener = rawAddEventListener.bind(window);
            window.removeEventListener = rawRemoveEventListener.bind(window);
            return noop__default['default'];
        };
    }

    function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
        var _a;
        var _b;
        var basePatchers = [
            function () { return hijack$1(); },
            function () { return hijack$2(); },
            function () { return hijack(); },
        ];
        var patchersInSandbox = (_a = {},
            _a[SandBoxType.Proxy] = __spread(basePatchers, [
                function () { return patchStrictSandbox(appName, elementGetter, sandbox.sandbox, true, scopedCSS, excludeAssetFilter); },
            ]),
            _a[SandBoxType.Snapshot] = __spread(basePatchers, [
                function () { return patchLooseSandbox(appName, elementGetter, sandbox.sandbox, true, scopedCSS, excludeAssetFilter); },
            ]),
            _a);
        return (_b = patchersInSandbox[sandbox.type]) === null || _b === void 0 ? void 0 : _b.map(function (patch) { return patch(); });
    }
    function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter) {
        var _a;
        var _b;
        var patchersInSandbox = (_a = {},
            _a[SandBoxType.Proxy] = [
                function () { return patchStrictSandbox(appName, elementGetter, sandbox.sandbox, false, scopedCSS, excludeAssetFilter); },
            ],
            _a[SandBoxType.Snapshot] = [
                function () { return patchLooseSandbox(appName, elementGetter, sandbox.sandbox, false, scopedCSS, excludeAssetFilter); },
            ],
            _a);
        return (_b = patchersInSandbox[sandbox.type]) === null || _b === void 0 ? void 0 : _b.map(function (patch) { return patch(); });
    }

    function createSandbox(appName, elementGetter, scopedCSS, excludeAssetFilter) {
        var sandbox;
        if (window.Proxy) {
            sandbox = new ProxySandbox({ name: appName });
        }
        else {
            sandbox = new SnapshotSandbox(appName);
        }
        // mounting freers are one-off and should be re-init at every mounting time
        var mountingFreers = [];
        var sideEffectsRebuilders = [];
        /* const bootstrappingFreers = hijackAtBootstrapping(appName, sandbox.sandbox); */ // 0.0.5 版本代码
        var bootstrappingFreers = patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter);
        return {
            proxy: sandbox.sandbox,
            /**
             * 沙箱被 mount
             * 可能是从 bootstrap 状态进入的 mount
             * 也可能是从 unmount 之后再次唤醒进入 mount
             */
            mount: function () {
                return __awaiter(this, void 0, void 0, function () {
                    var sideEffectsRebuildersAtBootstrapping, sideEffectsRebuildersAtMounting;
                    return __generator(this, function (_a) {
                        sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(0, bootstrappingFreers.length);
                        sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(bootstrappingFreers.length);
                        // must rebuild the side effects which added at bootstrapping firstly to recovery to nature state
                        if (sideEffectsRebuildersAtBootstrapping.length) {
                            sideEffectsRebuildersAtBootstrapping.forEach(function (rebuild) { return rebuild(); });
                        }
                        /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */
                        /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */
                        sandbox.active();
                        /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
                        // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用
                        if (window.Proxy) {
                            // 在不支持Proxy浏览器环境，比如IE11及以下，执行此行代码会导致切换应用时，执行异常，暂时还未查出原因，先临时这样处理
                            /* mountingFreers.push(...hijackAtMounting(appName, sandbox.sandbox)); */ // 0.0.5 版本代码
                            mountingFreers.push.apply(mountingFreers, __spread(patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter)));
                        }
                        /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
                        // 存在 rebuilder 则表明有些副作用需要重建
                        if (sideEffectsRebuildersAtMounting.length) {
                            sideEffectsRebuildersAtMounting.forEach(function (rebuild) { return rebuild(); });
                        }
                        // clean up rebuilders
                        sideEffectsRebuilders = [];
                        return [2 /*return*/];
                    });
                });
            },
            /**
             * 恢复 global 状态，使其能回到应用加载之前的状态
             */
            unmount: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        // record the rebuilders of window side effects (event listeners or timers)
                        // note that the frees of mounting phase are one-off as it will be re-init at next mounting
                        sideEffectsRebuilders = __spread(bootstrappingFreers, mountingFreers).map(function (free) { return free(); });
                        sandbox.inactive();
                        return [2 /*return*/];
                    });
                });
            },
        };
    }

    function assertElementExist(element, msg) {
        if (!element) {
            if (msg) {
                throw new Error(msg);
            }
            throw new Error('[legions] element not existed!');
        }
    }
    function execHooksChain(hooks, app, global) {
        if (global === void 0) { global = window; }
        if (hooks.length) {
            return hooks.reduce(function (chain, hook) { return chain.then(function () { return hook(app, global); }); }, Promise.resolve());
        }
        return Promise.resolve();
    }
    function getAppWrapperGetter(appName, appInstanceId, useLegacyRender, strictStyleIsolation, scopedCSS, elementGetter) {
        return function () {
            if (useLegacyRender) {
                if (strictStyleIsolation)
                    throw new Error('[legions]: strictStyleIsolation can not be used with legacy render!');
                if (scopedCSS)
                    throw new Error('[legions]: experimentalStyleIsolation can not be used with legacy render!');
                var appWrapper = document.getElementById(getWrapperId(appInstanceId));
                assertElementExist(appWrapper, "[legions] Wrapper element for " + appName + " with instance " + appInstanceId + " is not existed!");
                return appWrapper;
            }
            var element = elementGetter();
            assertElementExist(element, "[legions] Wrapper element for " + appName + " with instance " + appInstanceId + " is not existed!");
            if (strictStyleIsolation) {
                return element.shadowRoot;
            }
            return element;
        };
    }
    var rawAppendChild = HTMLElement.prototype.appendChild;
    var rawRemoveChild$1 = HTMLElement.prototype.removeChild;
    function getRender(appName, appContent, legacyRender) {
        var render = function (_a, phase) {
            var element = _a.element, loading = _a.loading, container = _a.container;
            if (legacyRender) {
                //@ts-ignore
                if (process.env.NODE_ENV !== 'production') {
                    console.warn('[legions] Custom rendering function is deprecated, you can use the container element setting instead!');
                }
                return legacyRender({ loading: loading, appContent: element ? appContent : '' });
            }
            var containerElement = getContainer(container);
            // The container might have be removed after micro app unmounted.
            // Such as the micro app unmount lifecycle called by a react componentWillUnmount lifecycle, after micro app unmounted, the react component might also be removed
            if (phase !== 'unmounted') {
                var errorMsg = (function () {
                    switch (phase) {
                        case 'loading':
                        case 'mounting':
                            return "[legions] Target container with " + container + " not existed while " + appName + " " + phase + "!";
                        case 'mounted':
                            return "[legions] Target container with " + container + " not existed after " + appName + " " + phase + "!";
                        default:
                            return "[legions] Target container with " + container + " not existed while " + appName + " rendering!";
                    }
                })();
                assertElementExist(containerElement, errorMsg);
            }
            if (containerElement && !containerElement.contains(element)) {
                // clear the container
                while (containerElement.firstChild) {
                    rawRemoveChild$1.call(containerElement, containerElement.firstChild);
                }
                // append the element to container if it exist
                if (element) {
                    rawAppendChild.call(containerElement, element);
                }
            }
            return undefined;
        };
        return render;
    }
    var supportShadowDOM = 
    // @ts-ignore
    document.head.attachShadow || document.head.createShadowRoot;
    function createElement(appContent, strictStyleIsolation, scopedCSS, appName) {
        var containerElement = document.createElement('div');
        containerElement.innerHTML = appContent;
        // appContent always wrapped with a singular div
        var appElement = containerElement.firstChild;
        if (strictStyleIsolation) {
            if (!supportShadowDOM) {
                console.warn('[legions]: As current browser not support shadow dom, your strictStyleIsolation configuration will be ignored!');
            }
            else {
                var innerHTML = appElement.innerHTML;
                appElement.innerHTML = '';
                var shadow = void 0;
                if (appElement.attachShadow) {
                    shadow = appElement.attachShadow({ mode: 'open' });
                }
                else {
                    // createShadowRoot was proposed in initial spec, which has then been deprecated
                    shadow = appElement.createShadowRoot();
                }
                shadow.innerHTML = innerHTML;
            }
        }
        if (scopedCSS) {
            var attr = appElement.getAttribute(QiankunCSSRewriteAttr);
            if (!attr) {
                appElement.setAttribute(QiankunCSSRewriteAttr, appName);
            }
            var styleNodes = appElement.querySelectorAll('style') || [];
            forEach__default['default'](styleNodes, function (stylesheetElement) {
                process$1(appElement, stylesheetElement, appName);
            });
        }
        return appElement;
    }
    function validateSingularMode(validate, app) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, typeof validate === 'function' ? validate(app) : !!validate];
            });
        });
    }
    function getLifecyclesFromExports(scriptExports, appName, global) {
        if (validateExportLifecycle(scriptExports)) {
            return scriptExports;
        }
        //@ts-ignore
        if (process.env.NODE_ENV !== 'production') {
            console.warn("[legions] lifecycle not found from " + appName + " entry exports, fallback to get from window['" + appName + "']");
        }
        // fallback to global variable who named with ${appName} while module exports not found
        var globalVariableExports = global[appName];
        if (validateExportLifecycle(globalVariableExports)) {
            return globalVariableExports;
        }
        throw new Error("[legions] You need to export lifecycle functions in " + appName + " entry");
    }
    var prevAppUnmountedDeferred;
    function loadApp(app, configuration, lifeCycles) {
        if (configuration === void 0) { configuration = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var entry, appName, appInstanceId, markName, _a, singular, _b, sandbox, excludeAssetFilter, importEntryOpts, _c, template, execScripts, assetPublicPath, getExternalScripts, getScripts, appContent, strictStyleIsolation, scopedCSS, initialAppWrapperElement, initialContainer, legacyRender, render, initialAppWrapperGetter, global, mountSandbox, unmountSandbox, sandboxInstance, _d, _e, beforeUnmount, _f, afterUnmount, _g, afterMount, _h, beforeMount, _j, beforeLoad, scriptExports, _k, bootstrap, mount, unmount, update, _l, onGlobalStateChange, setGlobalState, offGlobalStateChange, syncAppWrapperElement2Sandbox, parcelConfigGetter;
            var _this = this;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        entry = app.entry, appName = app.name;
                        appInstanceId = appName + "_" + +new Date() + "_" + Math.floor(Math.random() * 1000);
                        markName = "[legions] App " + appInstanceId + " Loading";
                        //@ts-ignore
                        if (process.env.NODE_ENV !== 'production') {
                            performanceMark(markName);
                        }
                        _a = configuration.singular, singular = _a === void 0 ? false : _a, _b = configuration.sandbox, sandbox = _b === void 0 ? true : _b, excludeAssetFilter = configuration.excludeAssetFilter, importEntryOpts = __rest(configuration, ["singular", "sandbox", "excludeAssetFilter"]);
                        return [4 /*yield*/, legionsImportHtmlEntry.importHTML(entry, importEntryOpts)];
                    case 1:
                        _c = _m.sent(), template = _c.template, execScripts = _c.execScripts, assetPublicPath = _c.assetPublicPath, getExternalScripts = _c.getExternalScripts, getScripts = _c.getScripts;
                        new MicroApps$1().bootstrap({
                            container: app['container'],
                            entry: app.entry,
                            name: appName
                        }, {
                            getExternalScripts: getExternalScripts,
                            getScripts: getScripts
                        });
                        return [4 /*yield*/, validateSingularMode(singular, app)];
                    case 2:
                        if (!_m.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, (prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise)];
                    case 3:
                        _m.sent();
                        _m.label = 4;
                    case 4:
                        appContent = getDefaultTplWrapper(appInstanceId, appName)(template);
                        strictStyleIsolation = typeof sandbox === 'object' && !!sandbox.strictStyleIsolation;
                        scopedCSS = isEnableScopedCSS(sandbox);
                        initialAppWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appName);
                        initialContainer = 'container' in app ? app.container : undefined;
                        legacyRender = 'render' in app ? app.render : undefined;
                        render = getRender(appName, appContent, legacyRender);
                        // 第一次加载设置应用可见区域 dom 结构
                        // 确保每次应用加载前容器 dom 结构已经设置完毕
                        render({
                            element: initialAppWrapperElement,
                            loading: true,
                            container: initialContainer,
                        }, 'loading');
                        initialAppWrapperGetter = getAppWrapperGetter(appName, appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () { return initialAppWrapperElement; });
                        global = window;
                        mountSandbox = function () { return Promise.resolve(); };
                        unmountSandbox = function () { return Promise.resolve(); };
                        if (sandbox) {
                            sandboxInstance = createSandbox(appName, initialAppWrapperGetter, scopedCSS, excludeAssetFilter);
                            // 用沙箱的代理对象作为接下来使用的全局对象
                            global = sandboxInstance.proxy;
                            mountSandbox = sandboxInstance.mount;
                            unmountSandbox = sandboxInstance.unmount;
                        }
                        _d = mergeWith__default['default']({}, getAddOns(global, assetPublicPath), lifeCycles, function (v1, v2) {
                            return concat__default['default'](v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
                        }), _e = _d.beforeUnmount, beforeUnmount = _e === void 0 ? [] : _e, _f = _d.afterUnmount, afterUnmount = _f === void 0 ? [] : _f, _g = _d.afterMount, afterMount = _g === void 0 ? [] : _g, _h = _d.beforeMount, beforeMount = _h === void 0 ? [] : _h, _j = _d.beforeLoad, beforeLoad = _j === void 0 ? [] : _j;
                        return [4 /*yield*/, execHooksChain(toArray(beforeLoad), app, global)];
                    case 5:
                        _m.sent();
                        return [4 /*yield*/, execScripts(global)];
                    case 6:
                        scriptExports = _m.sent();
                        _k = getLifecyclesFromExports(scriptExports, appName, global), bootstrap = _k.bootstrap, mount = _k.mount, unmount = _k.unmount, update = _k.update;
                        _l = getMicroAppStateActions(appInstanceId), onGlobalStateChange = _l.onGlobalStateChange, setGlobalState = _l.setGlobalState, offGlobalStateChange = _l.offGlobalStateChange;
                        syncAppWrapperElement2Sandbox = function (element) {
                            return (initialAppWrapperElement = element);
                        };
                        parcelConfigGetter = function (remountContainer) {
                            if (remountContainer === void 0) { remountContainer = initialContainer; }
                            var appWrapperElement = initialAppWrapperElement;
                            var appWrapperGetter = getAppWrapperGetter(appName, appInstanceId, !!legacyRender, strictStyleIsolation, scopedCSS, function () { return appWrapperElement; });
                            var parcelConfig = {
                                name: appInstanceId,
                                bootstrap: bootstrap,
                                mount: [
                                    function () { return __awaiter(_this, void 0, void 0, function () {
                                        var marks;
                                        return __generator(this, function (_a) {
                                            //@ts-ignore
                                            if (process.env.NODE_ENV !== 'production') {
                                                marks = performance.getEntriesByName(markName, 'mark');
                                                // mark length is zero means the app is remounting
                                                if (!marks.length) {
                                                    performanceMark(markName);
                                                }
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); },
                                    function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, validateSingularMode(singular, app)];
                                                case 1:
                                                    if ((_a.sent()) &&
                                                        prevAppUnmountedDeferred) {
                                                        return [2 /*return*/, prevAppUnmountedDeferred.promise];
                                                    }
                                                    return [2 /*return*/, undefined];
                                            }
                                        });
                                    }); },
                                    // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
                                    function () { return __awaiter(_this, void 0, void 0, function () {
                                        var useNewContainer;
                                        return __generator(this, function (_a) {
                                            useNewContainer = remountContainer !== initialContainer;
                                            if (useNewContainer || !appWrapperElement) {
                                                // element will be destroyed after unmounted, we need to recreate it if it not exist
                                                // or we try to remount into a new container
                                                appWrapperElement = createElement(appContent, strictStyleIsolation, scopedCSS, appName);
                                                syncAppWrapperElement2Sandbox(appWrapperElement);
                                            }
                                            render({
                                                element: appWrapperElement,
                                                loading: true,
                                                container: remountContainer,
                                            }, 'mounting');
                                            return [2 /*return*/];
                                        });
                                    }); },
                                    mountSandbox,
                                    // exec the chain after rendering to keep the behavior with beforeLoad
                                    function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, execHooksChain(toArray(beforeMount), app, global)];
                                    }); }); },
                                    function (props) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, mount(__assign(__assign({}, props), { container: appWrapperGetter(), setGlobalState: setGlobalState,
                                                    onGlobalStateChange: onGlobalStateChange }))];
                                        });
                                    }); },
                                    // finish loading after app mounted
                                    function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, render({
                                                    element: appWrapperElement,
                                                    loading: false,
                                                    container: remountContainer,
                                                }, 'mounted')];
                                        });
                                    }); },
                                    function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, execHooksChain(toArray(afterMount), app, global)];
                                    }); }); },
                                    // initialize the unmount defer after app mounted and resolve the defer after it unmounted
                                    function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, validateSingularMode(singular, app)];
                                                case 1:
                                                    if (_a.sent()) {
                                                        prevAppUnmountedDeferred = new Deferred();
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                    function () { return __awaiter(_this, void 0, void 0, function () {
                                        var measureName;
                                        return __generator(this, function (_a) {
                                            //@ts-ignore
                                            if (process.env.NODE_ENV !== 'production') {
                                                measureName = "[legions] App " + appInstanceId + " Loading Consuming";
                                                performanceMeasure(measureName, markName);
                                            }
                                            return [2 /*return*/];
                                        });
                                    }); },
                                ],
                                unmount: [
                                    function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, execHooksChain(toArray(beforeUnmount), app, global)];
                                    }); }); },
                                    function (props) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, unmount(__assign(__assign({}, props), { container: appWrapperGetter() }))];
                                    }); }); },
                                    unmountSandbox,
                                    function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                        return [2 /*return*/, execHooksChain(toArray(afterUnmount), app, global)];
                                    }); }); },
                                    function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            render({ element: null, loading: false, container: remountContainer }, 'unmounted');
                                            offGlobalStateChange(appInstanceId);
                                            // for gc
                                            appWrapperElement = null;
                                            syncAppWrapperElement2Sandbox(appWrapperElement);
                                            return [2 /*return*/];
                                        });
                                    }); },
                                    function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, validateSingularMode(singular, app)];
                                                case 1:
                                                    if ((_a.sent()) &&
                                                        prevAppUnmountedDeferred) {
                                                        prevAppUnmountedDeferred.resolve();
                                                    }
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); },
                                ],
                            };
                            if (typeof update === 'function') {
                                parcelConfig.update = update;
                            }
                            return parcelConfig;
                        };
                        return [2 /*return*/, parcelConfigGetter];
                }
            });
        });
    }

    var frameworkConfiguration = {};
    var frameworkStartedDefer = new Deferred();
    var microApps$2 = [];
    function registerMicroApps(apps, lifeCycles) {
        var _this = this;
        // Each app only needs to be registered once
        var unregisteredApps = apps.filter(function (app) { return !microApps$2.some(function (registeredApp) { return registeredApp.name === app.name; }); });
        microApps$2 = __spread(microApps$2, unregisteredApps);
        unregisteredApps.forEach(function (app) {
            var name = app.name, activeRule = app.activeRule, _a = app.loader, loader = _a === void 0 ? noop__default['default'] : _a, props = app.props, _b = app.isMerge, isMerge = _b === void 0 ? false : _b, appConfig = __rest(app, ["name", "activeRule", "loader", "props", "isMerge"]);
            singleSpa.registerApplication({
                name: name,
                app: function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, mount, otherMicroAppConfigs;
                    var _this = this;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                loader(true);
                                return [4 /*yield*/, frameworkStartedDefer.promise];
                            case 1:
                                _b.sent();
                                return [4 /*yield*/, loadApp(__assign({ name: name, props: props }, appConfig), __assign(__assign({}, frameworkConfiguration), { isMerge: isMerge }), lifeCycles)];
                            case 2:
                                _a = (_b.sent())(), mount = _a.mount, otherMicroAppConfigs = __rest(_a, ["mount"]);
                                return [2 /*return*/, __assign({ mount: __spread([
                                            function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, loader(true)];
                                            }); }); }
                                        ], toArray(mount), [
                                            function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                return [2 /*return*/, loader(false)];
                                            }); }); },
                                        ]) }, otherMicroAppConfigs)];
                        }
                    });
                }); },
                activeWhen: activeRule,
                customProps: props,
            });
        });
    }
    var appConfigPromiseGetterMap = new Map();
    function loadMicroApp(app, configuration, lifeCycles) {
        var _this = this;
        var props = app.props, name = app.name;
        var getContainerXpath = function (container) {
            var containerElement = getContainer(container);
            if (containerElement) {
                return getXPathForElement(containerElement, document);
            }
            return undefined;
        };
        var wrapParcelConfigForRemount = function (config) {
            return __assign(__assign({}, config), { 
                // empty bootstrap hook which should not run twice while it calling from cached micro app
                bootstrap: function () { return Promise.resolve(); } });
        };
        /**
         * using name + container xpath as the micro app instance id,
         * it means if you rendering a micro app to a dom which have been rendered before,
         * the micro app would not load and evaluate its lifecycles again
         */
        var memorizedLoadingFn = function () { return __awaiter(_this, void 0, void 0, function () {
            var $$cacheLifecycleByAppName, container, parcelConfigGetterPromise, _a, xpath, parcelConfigGetterPromise, _b, parcelConfigObjectGetterPromise, xpath;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        $$cacheLifecycleByAppName = (configuration !== null && configuration !== void 0 ? configuration : frameworkConfiguration).$$cacheLifecycleByAppName;
                        container = 'container' in app ? app.container : undefined;
                        if (!container) return [3 /*break*/, 4];
                        if (!$$cacheLifecycleByAppName) return [3 /*break*/, 2];
                        parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name);
                        if (!parcelConfigGetterPromise) return [3 /*break*/, 2];
                        _a = wrapParcelConfigForRemount;
                        return [4 /*yield*/, parcelConfigGetterPromise];
                    case 1: return [2 /*return*/, _a.apply(void 0, [(_c.sent())(container)])];
                    case 2:
                        xpath = getContainerXpath(container);
                        if (!xpath) return [3 /*break*/, 4];
                        parcelConfigGetterPromise = appConfigPromiseGetterMap.get(name + "-" + xpath);
                        if (!parcelConfigGetterPromise) return [3 /*break*/, 4];
                        _b = wrapParcelConfigForRemount;
                        return [4 /*yield*/, parcelConfigGetterPromise];
                    case 3: return [2 /*return*/, _b.apply(void 0, [(_c.sent())(container)])];
                    case 4:
                        parcelConfigObjectGetterPromise = loadApp(app, configuration !== null && configuration !== void 0 ? configuration : frameworkConfiguration, lifeCycles);
                        if (container) {
                            if ($$cacheLifecycleByAppName) {
                                appConfigPromiseGetterMap.set(name, parcelConfigObjectGetterPromise);
                            }
                            else {
                                xpath = getContainerXpath(container);
                                if (xpath)
                                    appConfigPromiseGetterMap.set(name + "-" + xpath, parcelConfigObjectGetterPromise);
                            }
                        }
                        return [4 /*yield*/, parcelConfigObjectGetterPromise];
                    case 5: return [2 /*return*/, (_c.sent())(container)];
                }
            });
        }); };
        return singleSpa.mountRootParcel(memorizedLoadingFn, __assign({ domElement: document.createElement('div') }, props));
    }
    function start(opts) {
        if (opts === void 0) { opts = {}; }
        frameworkConfiguration = __assign({ prefetch: true, singular: true, sandbox: true }, opts);
        var prefetch = frameworkConfiguration.prefetch, sandbox = frameworkConfiguration.sandbox, singular = frameworkConfiguration.singular, urlRerouteOnly = frameworkConfiguration.urlRerouteOnly, importEntryOpts = __rest(frameworkConfiguration, ["prefetch", "sandbox", "singular", "urlRerouteOnly"]);
        if (prefetch) {
            doPrefetchStrategy(microApps$2, prefetch, importEntryOpts);
        }
        if (sandbox) {
            if (!window.Proxy) {
                console.warn('[legions] Miss window.Proxy, proxySandbox will degenerate into snapshotSandbox');
                frameworkConfiguration.sandbox =
                    typeof sandbox === 'object'
                        ? __assign(__assign({}, sandbox), { loose: true }) : { loose: true };
                if (!singular) {
                    console.warn('[legions] Setting singular as false may cause unexpected behavior while your browser not support window.Proxy');
                }
            }
        }
        singleSpa.start({ urlRerouteOnly: urlRerouteOnly });
        frameworkStartedDefer.resolve();
    }

    var firstMountLogLabel = '[legions] first app mounted';
    //@ts-ignore
    if (process.env.NODE_ENV !== 'production') {
        console.time(firstMountLogLabel);
    }
    function setDefaultMountApp(defaultAppLink) {
        // can not use addEventListener once option for ie support
        window.addEventListener('single-spa:no-app-change', function listener() {
            var mountedApps = singleSpa.getMountedApps();
            if (!mountedApps.length) {
                singleSpa.navigateToUrl(defaultAppLink);
            }
            window.removeEventListener('single-spa:no-app-change', listener);
        });
    }
    function runAfterFirstMounted(effect) {
        // can not use addEventListener once option for ie support
        window.addEventListener('single-spa:first-mount', function listener() {
            //@ts-ignore
            if (process.env.NODE_ENV !== 'production') {
                console.timeEnd(firstMountLogLabel);
            }
            effect();
            window.removeEventListener('single-spa:first-mount', listener);
        });
    }
    function runDefaultMountEffects(defaultAppLink) {
        console.warn('[legions] runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead');
        setDefaultMountApp(defaultAppLink);
    }

    function addGlobalUncaughtErrorHandler(errorHandler) {
        window.addEventListener('error', errorHandler);
        window.addEventListener('unhandledrejection', errorHandler);
    }
    function removeGlobalUncaughtErrorHandler(errorHandler) {
        window.removeEventListener('error', errorHandler);
        window.removeEventListener('unhandledrejection', errorHandler);
    }

    Object.defineProperty(exports, 'addErrorHandler', {
        enumerable: true,
        get: function () {
            return singleSpa.addErrorHandler;
        }
    });
    Object.defineProperty(exports, 'getMountedApps', {
        enumerable: true,
        get: function () {
            return singleSpa.getMountedApps;
        }
    });
    Object.defineProperty(exports, 'removeErrorHandler', {
        enumerable: true,
        get: function () {
            return singleSpa.removeErrorHandler;
        }
    });
    exports.MicroApps = MicroApps;
    exports.MountedMicroApps = MicroApps$1;
    exports.addGlobalUncaughtErrorHandler = addGlobalUncaughtErrorHandler;
    exports.initGlobalState = initGlobalState;
    exports.loadMicroApp = loadMicroApp;
    exports.prefetchApps = prefetchImmediately;
    exports.registerMicroApps = registerMicroApps;
    exports.removeGlobalUncaughtErrorHandler = removeGlobalUncaughtErrorHandler;
    exports.runAfterFirstMounted = runAfterFirstMounted;
    exports.runDefaultMountEffects = runDefaultMountEffects;
    exports.setDefaultMountApp = setDefaultMountApp;
    exports.start = start;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
