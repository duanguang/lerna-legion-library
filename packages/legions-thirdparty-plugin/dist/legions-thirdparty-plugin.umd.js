/**
 * legions-thirdparty-plugin v0.0.5
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.legionsThirdpartyPlugin = {}));
}(this, (function (exports) { 'use strict';

  var PLUGINS = {
      excel: 'legionsThirdpartyExcelPlugin',
      html2canvas: 'legionsThirdpartyHtml2canvasPlugin',
      jsBarcode: 'legionsThirdpartyJsbarcodePlugin',
      clipboard: 'legionsThirdpartyClipboardPlugin',
  };
  var LEGIONS_THIRDPARTY_PLUGIN = {
      //@ts-ignore
      excel: null,
      //@ts-ignore
      html2canvas: null,
      //@ts-ignore
      jsBarcode: null,
      //@ts-ignore
      clipboard: null,
  };
  function onLoadScript(plugin) {
      var id = "legions-" + plugin.name;
      if (!window[PLUGINS[plugin.name]] &&
          !window.parent[PLUGINS[plugin.name]] &&
          !document.getElementById(id)) {
          var script = document.createElement('script');
          script.id = id;
          var version = Date.parse(new Date().toString());
          script.src = plugin.url + "v=" + version;
          document.body.appendChild(script);
          // @ts-ignore
          script.onload = script.onreadystatechange = function () {
              // tslint:disable-next-line: no-invalid-this
              //@ts-ignore
              if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
                  LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = window[PLUGINS[plugin.name]];
              }
          };
      }
  }
  var LegionsThirdpartyPlugin = /** @class */ (function () {
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
      Object.defineProperty(LegionsThirdpartyPlugin.prototype, "plugins", {
          get: function () {
              return LEGIONS_THIRDPARTY_PLUGIN;
          },
          enumerable: false,
          configurable: true
      });
      return LegionsThirdpartyPlugin;
  }());
  var legionsThirdpartyPlugin = new LegionsThirdpartyPlugin();

  exports.LegionsThirdpartyPlugin = LegionsThirdpartyPlugin;
  exports.legionsThirdpartyPlugin = legionsThirdpartyPlugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
