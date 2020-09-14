/**
 * legions-lunar v0.0.3
 * (c) 2020 duanguang
 * @license MIT
 */
import { map, partial } from 'lodash';
import { autorun } from 'mobx';

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

/**
 *
 * 订阅数据，在数据变化时，可以处理一些副作用，当你不需要监听时，请及时调用取消调用进行销毁
 * @param {...Array<any>} funcs 数组内第一个参数一定为函数类型
 * @returns {Array<Function>}
 * @memberof StoreBase
 */

function schedule() {
  var funcs = [];

  for (var _i = 0; _i < arguments.length; _i++) {
    funcs[_i] = arguments[_i];
  }

  var subscription = map(map(funcs, function (args) {
    return partial.apply(void 0, __spread(args));
  }), autorun);
  return {
    unsubscribe: subscription[0]
  };
}

export { schedule };
