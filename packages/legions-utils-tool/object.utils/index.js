/**
 * legions-utils-tool v0.0.6
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsUtilsTool = {}));
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

    function normalize(s) {
      s = s || '';
      s = s.toString();
      return s
        .replace(/(\d\d)(\/)(\d\d)(\/)(\d\d\d\d)/g, '$5-$3-$1')
        .replace(/(\d{1,2}\.\d\d\.\d\d)\s([AP]M)/g, (_, t, m) => {
          var p = t.split('.').map(Number);
          if (p[0] === 12) {
            p[0] = 0;
          }
          if (m === 'PM') {
            p[0] += 12;
          }
          return p.map(v => v.toString().padStart(2, '0')).join(':');
        });
    }

    /**
     * 对字符串进行自然排序
     *
     * @export
     * @param {[]} source 需要排序的数据对象
     * @param {string} sortKey 如果是字符串数组 不需要传递，如果是对象数组，请传递需要排序的字段名称
     * @returns
     */
    function sort(source, sortKey) {
        var data = __spread(source);
        var unresultObject = data.every(function (item) { return typeof item !== 'object'; });
        var resultObject = data.every(function (item) { return typeof item === 'object' && !Array.isArray(item); });
        if (unresultObject) {
            // 如果不是对象
            data.sort(function (a, b) {
                return normalize(a).localeCompare(normalize(b), undefined, {
                    numeric: true,
                    sensitivity: 'base',
                });
            });
        }
        if (resultObject) {
            data = source.map(function (item) {
                return __assign({}, item);
            });
            data.sort(function (a, b) {
                return normalize(a[sortKey]).localeCompare(normalize(b[sortKey]), undefined, {
                    numeric: true,
                    sensitivity: 'base',
                });
            });
        }
        return data;
    }
    /** 通用排序compareFunction */
    function compare(a, b) {
        return normalize(a).localeCompare(normalize(b), undefined, {
            numeric: true,
            sensitivity: 'base',
        });
    }
    /**
     * 排除指定对象属性
     *
     * @export
     * @param {Object} exclude 需要排除的对象属性
     * @param {Object} source 源对象
     * @returns
     */
    function excludeObj(exclude, source) {
        //@ts-ignore
        var newObj = null;
        // @ts-ignore
        newObj = {};
        Object.keys(source).forEach(function (key) {
            if (!(exclude[key] && source[key] === exclude[key])) {
                newObj[key] = source[key];
            }
        });
        return newObj;
    }
    /* export const get = (p: string | number[],o) => p.reduce((xs,x) => (xs && xs[x]) ? xs[x] : null,o) */
    /**  获取指定对象属性 不存在返回 null*/
    var get = function (p) { return function (o) {
        //@ts-ignore
        return p.reduce(function (xs, x) { return (xs && xs[x] ? xs[x] : null); }, o);
    }; };
    function proxyGetters(target, obj, keys) {
        keys.map(function (key) {
            Object.defineProperty(target, key, {
                get: function () { return obj[key]; },
            });
        });
    }
    function promiseTry(fn) {
        return new Promise(function (resolve, reject) {
            try {
                resolve(fn());
            }
            catch (err) {
                reject(err);
            }
        });
    }

    exports.compare = compare;
    exports.excludeObj = excludeObj;
    exports.get = get;
    exports.promiseTry = promiseTry;
    exports.proxyGetters = proxyGetters;
    exports.sort = sort;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
