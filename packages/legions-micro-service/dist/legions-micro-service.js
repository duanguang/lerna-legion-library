/**
  *  legions-micro-service v0.0.5
  * (c) 2020 duanguang
  * @license MIT
  */
var legionsPlugins = (function (exports) {
    'use strict';

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

    exports.MicroApps = MicroApps;

    return exports;

}({}));
