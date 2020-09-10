"use strict";
exports.__esModule = true;
var PLUGINS = {
    excel: 'legionsThirdpartyExcelPlugin',
    html2canvas: 'legionsThirdpartyHtml2canvasPlugin',
    jsBarcode: 'legionsThirdpartyJsbarcodePlugin',
    clipboard: 'legionsThirdpartyClipboardPlugin',
    dexie: 'legionsThirdpartyDexiePlugin'
};
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
        dexie: null
    };
}
var LEGIONS_THIRDPARTY_PLUGIN = createObj();
var PROXY_LEGIONS_THIRPARTY_PLUGIN = createObj();
var proxyGetters = function (proxytarget, orginSource) {
    Object.keys(orginSource).forEach(function (key) {
        Object.defineProperty(proxytarget, key, {
            configurable: false,
            get: function () {
                //@ts-ignore
                if (!orginSource[key] && process.env.NODE_ENV !== 'production') {
                    console.error(key + ":Property has no value yet,it is possible that the Plugin is not ready, Please install at the entrance(legionsThirdpartyPlugin.use({name:'" + key + "',url:''}))");
                }
                return orginSource[key];
            }
        });
    });
};
proxyGetters(PROXY_LEGIONS_THIRPARTY_PLUGIN, LEGIONS_THIRDPARTY_PLUGIN);
function onLoadScript(plugin) {
    var id = "legions-" + plugin.name;
    if (!window[PLUGINS[plugin.name]] &&
        !window.parent[PLUGINS[plugin.name]] &&
        !document.getElementById(id)) {
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
                if (plugin.name === 'jsBarcode') {
                    LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
                        window[PLUGINS[plugin.name]]['JsBarcode'];
                }
                else if (plugin.name === 'dexie') {
                    LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
                        window[PLUGINS[plugin.name]]['DexieUtils'];
                }
                else {
                    LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = window[PLUGINS[plugin.name]];
                }
            }
        };
    }
    else {
        var globalValue = window[PLUGINS[plugin.name]] || window.parent[PLUGINS[plugin.name]];
        if (plugin.name === 'jsBarcode') {
            LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = globalValue['JsBarcode'];
        }
        else if (plugin.name === 'dexie') {
            LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = globalValue['DexieUtils'];
        }
        else {
            LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = globalValue;
        }
    }
}
var LegionsThirdpartyPlugin = (function () {
    function LegionsThirdpartyPlugin() {
    }
    LegionsThirdpartyPlugin.prototype.use = function (plugin) {
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
    LegionsThirdpartyPlugin.prototype.subscribe = function (name, callback) {
        if (typeof name === 'string') {
            if (!LEGIONS_THIRDPARTY_PLUGIN[name]) {
                var timeid_1 = setInterval(function () {
                    if (LEGIONS_THIRDPARTY_PLUGIN[name]) {
                        callback();
                        clearInterval(timeid_1);
                    }
                }, 150);
            }
            else {
                callback();
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
                var timeid_2 = setInterval(function () {
                    name.map(function (item) {
                        list_1.push({ name: item, value: LEGIONS_THIRDPARTY_PLUGIN[item] });
                    });
                    if (list_1.every(function (item) { return item.value; })) {
                        callback();
                        clearInterval(timeid_2);
                    }
                    else {
                        list_1 = [];
                    }
                }, 150);
            }
        }
    };
    Object.defineProperty(LegionsThirdpartyPlugin.prototype, "plugins", {
        get: function () {
            return PROXY_LEGIONS_THIRPARTY_PLUGIN;
        },
        enumerable: true,
        configurable: true
    });
    return LegionsThirdpartyPlugin;
}());
exports.LegionsThirdpartyPlugin = LegionsThirdpartyPlugin;
exports.legionsThirdpartyPlugin = new LegionsThirdpartyPlugin();
var focus_outside_1 = require("./focus-outside");
exports.focusBind = focus_outside_1.focusBind;
var p = new Promise(function (resolve) { });
