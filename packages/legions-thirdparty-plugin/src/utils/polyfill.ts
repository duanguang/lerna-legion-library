//@ts-ignore
var supportsSymbol = typeof Symbol === 'function';
var iteratorSymbol =
  supportsSymbol && typeof Symbol.iterator !== 'undefined'
    ? Symbol.iterator
    : '@@iterator';

export function CreateMapPolyfill() {
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
        } else {
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
