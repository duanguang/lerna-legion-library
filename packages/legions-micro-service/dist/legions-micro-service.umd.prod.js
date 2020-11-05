/**
  *  legions-micro-service v0.0.5
  * (c) 2020 duanguang
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsMicroService = {}));
}(this, (function (exports) { 'use strict';

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
    var isImportHTML = false;
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
            this.importHTML = "https://qa-zy.hoolinks.com/static/plugin/import-html-entry.min.js?version=" + new Date().getTime();
            this.importHTMLOptions = {
                excludeFiles: [],
                isMerge: false,
            };
            if (options && isObject(options)) {
                if (options['importHTML']) {
                    this.importHTML = options['importHTML'];
                    //@ts-ignore
                    delete options['importHTML'];
                }
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
                /* unregisteredApps.forEach((app) => {
                          this.mounted(app)
                      }) */
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
                //@ts-ignore
                importHTML(sourceUrl, 
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
            if (window['importHTML'] && isImportHTML) {
                main.call(that);
            }
            else {
                if (window['importHTML']) {
                    var scripts = document.getElementsByTagName('script');
                    for (var i = 0; i < scripts.length; i++) {
                        var script_1 = scripts[i];
                        if (script_1 &&
                            script_1.getAttribute('src') &&
                            //@ts-ignore
                            script_1
                                .getAttribute('src')
                                .indexOf('https://hoolinks.com/static/common/plugins/import-html-entry.js') > -1) {
                            var url = script_1.getAttribute('src');
                            // @ts-ignore
                            script_1.parentNode.removeChild(script_1);
                            delete window['importHTML'];
                        }
                    }
                }
                var script = document.createElement('script');
                script.src = this.importHTML;
                document.getElementsByTagName('head')[0].appendChild(script);
                /* document.body.appendChild(script); */
                /** 等待js加载完毕后执行主体脚本 */
                //@ts-ignore
                script.onload = script.onreadystatechange = function () {
                    //@ts-ignore
                    if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
                        isImportHTML = true;
                        main.call(that);
                    }
                };
            }
        };
        return MicroApps;
    }());

    /**
     * es6-proxy-polyfill
     * @version 2.1.0
     * @author Ambit-Tsai <ambit_tsai@qq.com>
     * @license Apache-2.0
     * @see {@link https://github.com/ambit-tsai/es6-proxy-polyfill#readme}
     */
    var t="[[ProxyTarget]]",n="[[Get]]",r="[[Set]]",e="[[Call]]",o=Object.defineProperty,i=Object.defineProperties,u=Object.getPrototypeOf,c=Object.getOwnPropertyDescriptor,a=!!i&&s(i),f$1=a?Object.__proto__?u:function(t){return "function"==typeof t?t.__proto__||{}:u(t)}:function(t){return _isVbObject(t)&&_getVbInternalOf(t).__proto__||{}};function s(t){return "function"==typeof t&&/\[native code\]/.test(t.toString())}function p(t,n){if(this instanceof p)return l(new y(t,n));h("Constructor Proxy requires 'new'");}function l(f){var s=f[t];return "function"==typeof s?function(n){var r=n[t];function o(){return this instanceof o?n["[[Construct]]"](arguments,o):n[e](this,arguments)}if(o.prototype=r.prototype,a){var c=j(n),f=O(u(r),c);for(var s in g(o,f),c=x(r,n))d(o,s)&&delete c[s];i(o,c);}else P(o,r);return o}(f):s instanceof Array?function(e){var i,f,s=e[t];a&&((i=j(e)).concat.get=function(){var t=e[n]("concat",this);return t===Array.prototype.concat?t.bind(s):t},f=O(u(s),i));return (i=x(s,e)).length.set=function(n){var i=n-s.length;e[r]("length",n,this),i&&function(n,r,e){var i=e[t];if(n>0)for(var u=i.length,a=u-n;a<u;++a){var f=c(r,a);f?o(i,a,f):i[a]=undefined,f=w(i,a,e),o(r,a,f);}else for(var s=(a=i.length)-n;a<s;++a)delete r[a];}(i,this,e);},O(f,i)}(f):function(n){var r,e,o=n[t];a&&(r=j(n),e=O(u(o),r));return r=x(o,n),O(e,r)}(f)}function y(n,r){v(n)&&v(r)||h("Cannot create proxy with a non-object as target or handler"),"REVOKED"===(f$1(n).__PROXY__||f$1(r).__PROXY__)&&h("Cannot create proxy with a revoked proxy as target or handler"),this[t]=n,this["[[ProxyHandler]]"]=r;}function _(t,n){t||h("Cannot perform '"+n+"' on a proxy that has been revoked");}function h(t){throw new TypeError(t)}function v(t){return !!t&&("object"==typeof t||"function"==typeof t)}function d(t,n){return Object.prototype.hasOwnProperty.call(t,n)}p.revocable=function(n,r){this instanceof p.revocable&&h("Proxy.revocable is not a constructor");var e=new y(n,r),o=l(e);return {proxy:o,revoke:function(){e[t]=undefined,e["[[ProxyHandler]]"]=undefined,a||(f$1(o).__PROXY__="REVOKED");}}},y.prototype[n]=function(n,r){var e=this["[[ProxyHandler]]"];return _(e,"get"),null==e.get?this[t][n]:"function"==typeof e.get?e.get(this[t],n,r):void h("Trap 'get' is not a function: "+e.get)},y.prototype[r]=function(n,r,e){var o=this["[[ProxyHandler]]"];if(_(o,"set"),null==o.set)this[t][n]=r;else if("function"==typeof o.set){o.set(this[t],n,r,e)||h("Trap 'set' returned false for property '"+n+"'");}else h("Trap 'set' is not a function: "+o.set);},y.prototype[e]=function(n,r){var e=this["[[ProxyHandler]]"];return _(e,"apply"),null==e.apply?this[t].apply(n,r):"function"==typeof e.apply?e.apply(this[t],n,r):void h("Trap 'apply' is not a function: "+e.apply)},y.prototype["[[Construct]]"]=function(n,r){var e,o=this["[[ProxyHandler]]"];if(_(o,"construct"),null==o.construct?e=function(t,n){for(var r=[],e=0,o=n.length;e<o;++e)r.push("args["+e+"]");return new Function("Ctor","args","return new Ctor("+r.join(", ")+")")(t,n)}(this[t],n):"function"==typeof o.construct?e=o.construct(this[t],n,r):h("Trap 'construct' is not a function: "+o.construct),v(e))return e;h("Trap 'construct' returned non-object: "+e);};var b=Object.getOwnPropertyNames||function(t){var n=[];for(var r in t)d(t,r)&&n.push(r);return n},g=s(Object.setPrototypeOf)?Object.setPrototypeOf:Object.__proto__?function(t,n){return t.__proto__=n,t}:function(t,n){return o(t,"__proto__",{value:n})},O=a?Object.create:function(t,n){var r=i({},n);if(_isVbObject(r)){var e={__PROXY__:undefined};_getVbInternalOf(r).__proto__=e;}return r},P=Object.assign||function(t,n){for(var r in n)d(n,r)&&(t[r]=n[r]);return t};function j(n){for(var r={},e=n[t];e=u(e);){var o=x(e,n);P(r,o);}return r.__PROXY__={get:function(){return n[t]?undefined:"REVOKED"}},r}function x(t,n){for(var r=b(t),e={},o=r.length-1;o>=0;--o)e[r[o]]=w(t,r[o],n);return e}function w(t,e,o){var i=c(t,e);return {get:function(){return o[n](e,this)},set:function(t){o[r](e,t,this);},enumerable:i.enumerable,configurable:i.configurable}}var C="undefined"==typeof Proxy?p:Proxy;

    // check window contructor function， like Object Array
    function isConstructor(fn) {
        // generator function and has own prototype properties
        var hasConstructor = fn.prototype &&
            fn.prototype.constructor === fn &&
            Object.getOwnPropertyNames(fn.prototype).length > 1;
        // unnecessary to call toString if it has contructor function
        var functionStr = !hasConstructor && fn.toString();
        var upperCaseRegex = /^function\s+[A-Z]/;
        return (hasConstructor ||
            // upper case
            upperCaseRegex.test(functionStr) ||
            // ES6 class, window function do not have this case
            functionStr.slice(0, 5) === 'class');
    }
    // get function from original window, such as scrollTo, parseInt
    function isWindowFunction(func) {
        return func && typeof func === 'function' && !isConstructor(func);
    }
    var Sandbox = /** @class */ (function () {
        function Sandbox(props) {
            if (props === void 0) { props = {}; }
            this.multiMode = false;
            this.eventListeners = {};
            this.timeoutIds = [];
            this.intervalIds = [];
            this.propertyAdded = {};
            this.originalValues = {};
            var multiMode = props.multiMode;
            if (!window.Proxy) {
                console.warn('proxy sandbox is not support by current browser');
                this.sandboxDisabled = true;
            }
            // enable multiMode in case of create mulit sandbox in same time
            //@ts-ignore
            this.multiMode = multiMode;
            //@ts-ignore
            this.sandbox = null;
        }
        Sandbox.prototype.createProxySandbox = function () {
            var _this = this;
            var _a = this, propertyAdded = _a.propertyAdded, originalValues = _a.originalValues, multiMode = _a.multiMode;
            var proxyWindow = Object.create(null);
            var originalWindow = window;
            var originalAddEventListener = window.addEventListener;
            var originalRemoveEventListener = window.removeEventListener;
            var originalSetInerval = window.setInterval;
            var originalSetTimeout = window.setTimeout;
            // hijack addEventListener
            proxyWindow.addEventListener = function (eventName, fn) {
                var rest = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    rest[_i - 2] = arguments[_i];
                }
                var listeners = _this.eventListeners[eventName] || [];
                listeners.push(fn);
                return originalAddEventListener.apply(originalWindow, __spread([
                    eventName,
                    fn
                ], rest));
            };
            // hijack removeEventListener
            proxyWindow.removeEventListener = function (eventName, fn) {
                var rest = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    rest[_i - 2] = arguments[_i];
                }
                var listeners = _this.eventListeners[eventName] || [];
                if (listeners.includes(fn)) {
                    listeners.splice(listeners.indexOf(fn), 1);
                }
                return originalRemoveEventListener.apply(originalWindow, __spread([
                    eventName,
                    fn
                ], rest));
            };
            // hijack setTimeout
            proxyWindow.setTimeout = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var timerId = originalSetTimeout.apply(void 0, __spread(args));
                _this.timeoutIds.push(timerId);
                return timerId;
            };
            // hijack setInterval
            proxyWindow.setInterval = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var intervalId = originalSetInerval.apply(void 0, __spread(args));
                _this.intervalIds.push(intervalId);
                return intervalId;
            };
            var sandbox = new C(proxyWindow, {
                set: function (target, p, value) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (!originalWindow.hasOwnProperty(p)) {
                        // recorde value added in sandbox
                        propertyAdded[p] = value;
                        // eslint-disable-next-line no-prototype-builtins
                    }
                    else if (!originalValues.hasOwnProperty(p)) {
                        // if it is already been setted in orignal window, record it's original value
                        originalValues[p] = originalWindow[p];
                    }
                    // set new value to original window in case of jsonp, js bundle which will be execute outof sandbox
                    if (!multiMode) {
                        originalWindow[p] = value;
                    }
                    // eslint-disable-next-line no-param-reassign
                    target[p] = value;
                    return true;
                },
                get: function (target, p) {
                    if (p === Symbol.unscopables) {
                        return undefined;
                    }
                    //@ts-ignore
                    if (['top', 'window', 'self', 'globalThis'].includes(p)) {
                        return sandbox;
                    }
                    // proxy hasOwnProperty, in case of proxy.hasOwnProperty value represented as originalWindow.hasOwnProperty
                    if (p === 'hasOwnProperty') {
                        // eslint-disable-next-line no-prototype-builtins
                        return function (key) {
                            return !!target[key] || originalWindow.hasOwnProperty(key);
                        };
                    }
                    var targetValue = target[p];
                    if (targetValue) {
                        // case of addEventListener, removeEventListener, setTimeout, setInterval setted in sandbox
                        return targetValue;
                    }
                    else {
                        var value = originalWindow[p];
                        if (isWindowFunction(value)) {
                            // fix Illegal invocation
                            return value.bind(originalWindow);
                        }
                        else {
                            // case of window.clientWidth、new window.Object()
                            return value;
                        }
                    }
                },
                has: function (target, p) {
                    return p in target || p in originalWindow;
                },
            });
            this.sandbox = sandbox;
        };
        Sandbox.prototype.getSandbox = function () {
            return this.sandbox;
        };
        Sandbox.prototype.execScriptInSandbox = function (script) {
            if (!this.sandboxDisabled) {
                // create sandbox before exec script
                if (!this.sandbox) {
                    this.createProxySandbox();
                }
                try {
                    var execScript = "with (sandbox) {;" + script + "\n}";
                    // eslint-disable-next-line no-new-func
                    var code = new Function('sandbox', execScript).bind(this.sandbox);
                    // run code with sandbox
                    code(this.sandbox);
                }
                catch (error) {
                    console.error("error occurs when execute script in sandbox: " + error);
                    throw error;
                }
            }
        };
        Sandbox.prototype.clear = function () {
            var _this = this;
            if (!this.sandboxDisabled) {
                // remove event listeners
                Object.keys(this.eventListeners).forEach(function (eventName) {
                    (_this.eventListeners[eventName] || []).forEach(function (listener) {
                        window.removeEventListener(eventName, listener);
                    });
                });
                // clear timeout
                this.timeoutIds.forEach(function (id) { return window.clearTimeout(id); });
                this.intervalIds.forEach(function (id) { return window.clearInterval(id); });
                // recover original values
                Object.keys(this.originalValues).forEach(function (key) {
                    window[key] = _this.originalValues[key];
                });
                Object.keys(this.propertyAdded).forEach(function (key) {
                    delete window[key];
                });
            }
        };
        return Sandbox;
    }());

    exports.MicroApps = MicroApps;
    exports.Sandbox = Sandbox;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
