/**
 * legions-thirdparty-plugin v0.0.1
 * (c) 2020 duanguang
 * @license MIT
 */
var legionsThirdpartyPlugin = (function (exports) {
  'use strict';

  //@ts-ignore
  var supportsSymbol = typeof Symbol === 'function';
  var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== 'undefined'
      ? Symbol.iterator
      : '@@iterator';
  function CreateMapPolyfill() {
      var cacheSentinel = {};
      var arraySentinel = [];
      var MapIterator = (function () {
          function MapIterator(keys, values, selector) {
              //@ts-ignore
              this._index = 0;
              //@ts-ignore
              this._keys = keys;
              //@ts-ignore
              this._values = values;
              //@ts-ignore
              this._selector = selector;
          }
          MapIterator.prototype['@@iterator'] = function () {
              return this;
          };
          MapIterator.prototype[iteratorSymbol] = function () {
              return this;
          };
          MapIterator.prototype.next = function () {
              var index = this._index;
              if (index >= 0 && index < this._keys.length) {
                  var result = this._selector(this._keys[index], this._values[index]);
                  if (index + 1 >= this._keys.length) {
                      this._index = -1;
                      this._keys = arraySentinel;
                      this._values = arraySentinel;
                  }
                  else {
                      this._index++;
                  }
                  return { value: result, done: false };
              }
              return { value: undefined, done: true };
          };
          MapIterator.prototype.throw = function (error) {
              if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
              }
              throw error;
          };
          MapIterator.prototype.return = function (value) {
              if (this._index >= 0) {
                  this._index = -1;
                  this._keys = arraySentinel;
                  this._values = arraySentinel;
              }
              return { value: value, done: true };
          };
          return MapIterator;
      })();
      return (function () {
          function Map() {
              //@ts-ignore
              this._keys = [];
              //@ts-ignore
              this._values = [];
              //@ts-ignore
              this._cacheKey = cacheSentinel;
              //@ts-ignore
              this._cacheIndex = -2;
          }
          Object.defineProperty(Map.prototype, 'size', {
              get: function () {
                  return this._keys.length;
              },
              enumerable: true,
              configurable: true,
          });
          Map.prototype.has = function (key) {
              return this._find(key, /*insert*/ false) >= 0;
          };
          Map.prototype.get = function (key) {
              var index = this._find(key, /*insert*/ false);
              return index >= 0 ? this._values[index] : undefined;
          };
          Map.prototype.set = function (key, value) {
              var index = this._find(key, /*insert*/ true);
              this._values[index] = value;
              return this;
          };
          Map.prototype.delete = function (key) {
              var index = this._find(key, /*insert*/ false);
              if (index >= 0) {
                  var size = this._keys.length;
                  for (var i = index + 1; i < size; i++) {
                      this._keys[i - 1] = this._keys[i];
                      this._values[i - 1] = this._values[i];
                  }
                  this._keys.length--;
                  this._values.length--;
                  if (key === this._cacheKey) {
                      this._cacheKey = cacheSentinel;
                      this._cacheIndex = -2;
                  }
                  return true;
              }
              return false;
          };
          Map.prototype.clear = function () {
              this._keys.length = 0;
              this._values.length = 0;
              this._cacheKey = cacheSentinel;
              this._cacheIndex = -2;
          };
          Map.prototype.keys = function () {
              return new MapIterator(this._keys, this._values, getKey);
          };
          Map.prototype.values = function () {
              return new MapIterator(this._keys, this._values, getValue);
          };
          Map.prototype.entries = function () {
              return new MapIterator(this._keys, this._values, getEntry);
          };
          Map.prototype['@@iterator'] = function () {
              return this.entries();
          };
          Map.prototype[iteratorSymbol] = function () {
              return this.entries();
          };
          Map.prototype._find = function (key, insert) {
              if (this._cacheKey !== key) {
                  this._cacheIndex = this._keys.indexOf((this._cacheKey = key));
              }
              if (this._cacheIndex < 0 && insert) {
                  this._cacheIndex = this._keys.length;
                  this._keys.push(key);
                  this._values.push(undefined);
              }
              return this._cacheIndex;
          };
          return Map;
      })();
      function getKey(key, _) {
          return key;
      }
      function getValue(_, value) {
          return value;
      }
      function getEntry(key, value) {
          return [key, value];
      }
  }

  var els = [];
  var usePolyfill =
    typeof process === 'object' &&
    process.env &&
    process.env['REFLECT_METADATA_USE_MAP_POLYFILL'] === 'true';
  var _Map =
    !usePolyfill &&
    typeof Map === 'function' &&
    typeof Map.prototype.entries === 'function'
      ? Map
      : CreateMapPolyfill();
  var elMap = new _Map();
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
