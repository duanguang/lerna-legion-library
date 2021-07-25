/**
 * legions-thirdparty-plugin v0.0.9
 * (c) 2021 duanguang
 * @license MIT
 */
function createObj() {
    return {
        //@ts-ignore
        excel: null,
        //@ts-ignore
        html2canvas: null,
        //@ts-ignore
        jsBarcode: null,
        //@ts-ignore
        clipboard: null,
        //@ts-ignore
        dexie: null,
        //@ts-ignore
        focusOutside: null,
    };
}
var proxyGetters = function (proxytarget, orginSource) {
    Object.keys(orginSource).forEach(function (key) {
        Object.defineProperty(proxytarget, key, {
            configurable: false,
            get: function () {
                //@ts-ignore
                if (!orginSource[key] && "development" !== 'production') {
                    console.error(key + ":Property has no value yet,it is possible that the Plugin is not ready, Please install at the entrance(legionsThirdpartyPlugin.use({name:'" + key + "',url:''}))");
                }
                return orginSource[key];
            },
        });
    });
};

/** 插件信息 */
var PLUGINS = ['excel',
    'html2canvas',
    'jsBarcode',
    'clipboard',
    'dexie',
    'focusOutside',];
var LEGIONS_THIRDPARTY_PLUGIN = createObj();
var PROXY_LEGIONS_THIRPARTY_PLUGIN = createObj();
/** 第三方插件信息 */
var THIRDPARTY_PLUGINS = {
    excel: 'legionsThirdpartyExcelPlugin',
    html2canvas: 'legionsThirdpartyHtml2canvasPlugin',
    jsBarcode: 'legionsThirdpartyJsbarcodePlugin',
    clipboard: 'legionsThirdpartyClipboardPlugin',
    dexie: 'legionsThirdpartyDexiePlugin',
    focusOutside: 'legionsThirdpartyFocusOutsidePlugin',
};

// 兼容 IE 8 的 indexOf
function indexOf(arr, item) {
  if (arr === undefined) return -1;
  let index = -1;
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] === item) {
      index = i;
      break;
    }
  }
  return index;
}

var EventHub = /** @class */ (function () {
    function EventHub() {
        //@ts-ignore
        this.cache = {};
    }
    EventHub.prototype.on = function (evenName, fn) {
        if (PLUGINS.findIndex(function (item) { return item === evenName; }) > -1) {
            if (typeof fn !== 'function') {
                console.warn('callback not an executable function');
                return;
            }
            this.cache[evenName] = this.cache[evenName] || [];
            this.cache[evenName].push(fn);
        }
        else {
            console.warn('输入的插件不在可使用队列');
        }
    };
    EventHub.prototype.emit = function (evenName, fn) {
        if (this.cache[evenName] &&
            Object.prototype.toString.call(this.cache[evenName]) === '[object Array]') {
            if (typeof fn === 'function') {
                var index = indexOf(this.cache[evenName], fn);
                if (index === -1)
                    return;
                fn();
            }
            else {
                this.cache[evenName].forEach(function (fn) { return fn(); });
            }
        }
    };
    EventHub.prototype.off = function (eventName, fn) {
        if (this.cache[eventName] &&
            Object.prototype.toString.call(this.cache[eventName]) === '[object Array]') {
            if (fn && typeof fn === 'function') {
                var index = indexOf(this.cache[eventName], fn);
                if (index === -1)
                    return;
                this.cache[eventName].splice(index, 1);
            }
            else {
                this.cache[eventName] = [];
            }
        }
    };
    return EventHub;
}());

proxyGetters(PROXY_LEGIONS_THIRPARTY_PLUGIN, LEGIONS_THIRDPARTY_PLUGIN);
function onLoadScript(plugin) {
    var id = "legions-" + plugin.name;
    var LegionstValue = null;
    try {
        LegionstValue = window.parent[THIRDPARTY_PLUGINS[plugin.name]];
    }
    catch (e) {
        LegionstValue = null;
    }
    if (!LegionstValue) {
        LegionstValue = window[THIRDPARTY_PLUGINS[plugin.name]];
    }
    if (!LegionstValue && !document.getElementById(id)) {
        var script = document.createElement('script');
        script.id = id;
        var version = Date.parse(new Date().toString());
        script.src = plugin.url + "?v=" + version;
        document.body.appendChild(script);
        // @ts-ignore
        script.onload = script.onreadystatechange = function () {
            // tslint:disable-next-line: no-invalid-this
            //@ts-ignore
            if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
                if (window[THIRDPARTY_PLUGINS[plugin.name]]) {
                    if (plugin.name === 'jsBarcode') {
                        LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
                            window[THIRDPARTY_PLUGINS[plugin.name]]['JsBarcode'];
                    }
                    else if (plugin.name === 'dexie') {
                        LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
                            window[THIRDPARTY_PLUGINS[plugin.name]]['DexieUtils'];
                    }
                    else {
                        LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
                            window[THIRDPARTY_PLUGINS[plugin.name]];
                    }
                    EventContainer.emit(plugin.name);
                    EventContainer.off(plugin.name);
                }
            }
        };
    }
    else {
        if (LegionstValue) {
            /** 修复在节点和值都不存在时才去请求插件，
            导致在并发环境中,其中一个请求已经创建节点请求资源,但资源还未回来，
            导致条件判定不成立，误认为已经有值，直接取值导致异常 */
            if (plugin.name === 'jsBarcode') {
                LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = LegionstValue['JsBarcode'];
            }
            else if (plugin.name === 'dexie') {
                LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = LegionstValue['DexieUtils'];
            }
            else {
                LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = LegionstValue;
            }
        }
    }
}
var EventContainer = new EventHub();
var ThirdpartyPlugin = /** @class */ (function () {
    function ThirdpartyPlugin() {
    }
    ThirdpartyPlugin.prototype.use = function (plugin) {
        if (typeof plugin === 'object') {
            if (Array.isArray(plugin)) {
                plugin.map(function (item) {
                    onLoadScript(item);
                });
            }
            else {
                onLoadScript(plugin);
            }
        }
    };
    /** 订阅某个插件数据,在有结果时，执行回调函数
     *
     * 注意 如果在使用插件数据时，非常明确插件数据有值，就不需要订阅执行
     *
     * 主要应用场景插件发起异步请求时，无法确定其返回具体时间,这时依赖插件数据做的事件必须等其准备才能去执行
     *
     * name参数为字符串时，订阅单个数据
     *
     * name参数为字符串数组时，使用场景为你的回调函数依赖多个插件值，这时才去使用，然而大多数情况我们是用不上，因此有需要就传数组
     */
    ThirdpartyPlugin.prototype.subscribe = function (name, callback) {
        if (typeof name === 'string') {
            if (LEGIONS_THIRDPARTY_PLUGIN[name]) {
                callback();
            }
            else {
                EventContainer.on(name, callback);
            }
        }
        else if (Object.prototype.toString.call(name) === '[object Array]') {
            var list_1 = [];
            name.map(function (item) {
                list_1.push({ name: item, value: LEGIONS_THIRDPARTY_PLUGIN[item] });
            });
            if (list_1.every(function (item) { return item.value; })) {
                callback();
            }
            else {
                list_1 = [];
                var timeid_1 = setInterval(function () {
                    name.map(function (item) {
                        list_1.push({ name: item, value: LEGIONS_THIRDPARTY_PLUGIN[item] });
                    });
                    if (list_1.every(function (item) { return item.value; })) {
                        callback();
                        clearInterval(timeid_1);
                    }
                    else {
                        list_1 = [];
                    }
                }, 400);
            }
        }
    };
    Object.defineProperty(ThirdpartyPlugin.prototype, "plugins", {
        get: function () {
            return PROXY_LEGIONS_THIRPARTY_PLUGIN;
        },
        enumerable: false,
        configurable: true
    });
    return ThirdpartyPlugin;
}());
var runScriptsSdk = new ThirdpartyPlugin();

/** 查找window 变量值，优先查找父级元素，如果没有找到 */
function findWindow(name) {
    var LegionstValue = null;
    try {
        LegionstValue = window.parent[name];
    }
    catch (e) {
        LegionstValue = null;
    }
    if (!LegionstValue) {
        LegionstValue = window[name];
    }
    return LegionstValue;
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

// 主要用于存储legions-plugin-sdk 加载完成时，需要执行的回调函数队列信息
var pluginLoadedList = [];
/** 动态加载JS资源 */
function dynamicLoadingScript(options) {
    if (options) {
        var scriptId_1 = options.scriptId || options.library;
        var LegionstValue_1 = findWindow(options.library);
        var onload_1 = function () {
            var script = document.createElement('script');
            script.src = options.src;
            script.id = scriptId_1;
            var s = script;
            if (!!document.getElementById(script.id)) {
                //@ts-ignore
                s = document.getElementById(script.id);
            }
            else {
                document.body.appendChild(script);
            }
            s.addEventListener('load', function () {
                //@ts-ignore
                if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
                    LegionstValue_1 = findWindow(options.library);
                    if (typeof options.onLoaded === 'function') {
                        // @ts-ignore
                        options.onLoaded(LegionstValue_1);
                    }
                }
            });
        };
        var sdkElemnet = document.getElementById(scriptId_1);
        if (!sdkElemnet && !LegionstValue_1) {
            onload_1();
        }
        else if (sdkElemnet && !LegionstValue_1) {
            console.warn('定义了相同节点ID,检查scriptId 值');
        }
    }
}
var PluginList = new Map();
var _LegionsPlugins = function (options) {
    var _legions = PluginList.get(options.src);
    if (_legions) {
        if (options && typeof options.onLoaded === 'function') {
            options.onLoaded && options.onLoaded(_legions.value); // 如果资源已经加载完成，传入的回调函数立即执行
        }
    }
    else {
        var legions = null;
        try {
            if (window[options.library] &&
                Object.keys(window[options.library]).length > 0) {
                legions = window[options.library];
            }
            else if (window.parent[options.library] &&
                Object.keys(window.parent[options.library]).length > 0) {
                legions = window.parent[options.library];
            }
        }
        catch (e) {
            legions = window[options.library];
        }
        finally {
            if (!legions) {
                if (options && typeof options.onLoaded === 'function') {
                    // 当资源还未加载完成时，所有调用该函数的回调，全部写入待执行队列，在资源加载完成，在依次执行
                    pluginLoadedList.push(options.onLoaded);
                }
                options.onLoaded; var props = __rest(options, ["onLoaded"]);
                dynamicLoadingScript(__assign(__assign({}, props), { onLoaded: function (value) {
                        PluginList.set(options.src, {
                            value: value,
                            scriptId: options.scriptId || options.library,
                            src: options.src,
                        });
                        pluginLoadedList.map(function (item) {
                            if (typeof item === 'function') {
                                item(value);
                            }
                        });
                        pluginLoadedList = [];
                    } }));
            }
        }
    }
};
/**
 * 获取动态加载外部JS变量
 *
 * 回调函数执行时机，如果SDK资源未加载，则在资源加载完成时执行。
 * 如果资源已经准备妥当，则直接执行回调
 *
 */
function runDynamicScripts(options) {
    options.onExecute; var props = __rest(options, ["onExecute"]);
    _LegionsPlugins(__assign({ onLoaded: function (value) {
            options.onExecute && options.onExecute(value);
        } }, props));
}

export { dynamicLoadingScript, findWindow, runDynamicScripts, runScriptsSdk };
