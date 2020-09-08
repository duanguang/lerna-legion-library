/**
 * legions-thirdparty-plugin v0.0.5
 * (c) 2020 duanguang
 * @license MIT
 */
var legionsThirdpartyPlugin = (function (exports) {
  'use strict';

  var els = [];
  var elMap = new Map();
  var defaultClass = 'focus-outside';

  function isNotFocusable(el) {
    return isNaN(parseInt(el.getAttribute('tabindex')));
  }

  function setFocusable(el) {
    el.setAttribute('tabindex', -1);
  }

  function getNode(target) {
    return els.find(function (el) { return el.contains(target) || el === target; });
  }

  function addClass(el, name) {
    var classList = el.className.split(' ');
    if (classList.indexOf(name) > -1) { return; }
    classList.push(name);
    el.className = classList.join(' ');
  }

  function focusinHandler(ref) {
    var target = ref.target;

    var node = getNode(target);
    if (!node) { return; }
    var ref$1 = findNodeMap(elMap.entries(), node) || {};
    var el = ref$1.el;
    var nodeList = ref$1.nodeList;
    if (!el) { return; }
    clearTimeout(nodeList.timerId);
  }

  function focusoutHandler(ref) {
    var target = ref.target;

    var node = getNode(target);
    if (!node) { return; }
    var ref$1 = findNodeMap(elMap.entries(), node) || {};
    var el = ref$1.el;
    var key = ref$1.key;
    var nodeList = ref$1.nodeList;
    if (!el) { return; }
    nodeList.timerId = setTimeout(key, 10);
  }

  function findNodeMap(entries, node) {
    var result = {};
    elMap.forEach(function (value, keys) {
      //console.log(keys,value)
      var key = keys;
      var nodeList = value;
      var el = nodeList.find(function (item) { return item.node === node; });
      if (el) {
        result = {
          key: key,
          nodeList: nodeList,
          el: el,
        };
      }
    });
    return result;
    /*   for (let i = 0; i < entries.length; i++) {
      
      const [key, nodeList] = entries[i]
      const el = nodeList.find(item => item.node === node)
      if (el) return { key, nodeList, el }
    } */
  }

  function focusBind(el, callback, className) {
    if (className) { defaultClass = className; }
    if (els.indexOf(el) < 0) { els.push(el); }
    if (elMap.has(callback)) {
      var nodeList = elMap.get(callback);
      nodeList.push({
        node: el,
        oldTabIndex: el.getAttribute('tabindex'),
      });
    } else {
      elMap.set(callback, [
        {
          node: el,
          oldTabIndex: el.getAttribute('tabindex'),
        } ]);
    }
    if (isNotFocusable(el)) { setFocusable(el); }
    addClass(el, defaultClass);
    el.addEventListener('focusin', focusinHandler);
    el.addEventListener('focusout', focusoutHandler);
  }

  var PLUGINS = {
      excel: 'legionsThirdpartyExcelPlugin',
      html2canvas: 'legionsThirdpartyHtml2canvasPlugin',
      jsBarcode: 'legionsThirdpartyJsbarcodePlugin',
      clipboard: 'legionsThirdpartyClipboardPlugin',
      dexie: 'legionsThirdpartyDexiePlugin',
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
      //@ts-ignore
      dexie: null,
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
  exports.focusBind = focusBind;
  exports.legionsThirdpartyPlugin = legionsThirdpartyPlugin;

  return exports;

}({}));
