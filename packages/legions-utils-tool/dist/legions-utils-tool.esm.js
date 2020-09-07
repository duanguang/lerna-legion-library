/**
 * legions-utils-tool v0.0.5
 * (c) 2020 duanguang
 * @license MIT
 */
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
        var arguments$1 = arguments;

        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments$1[i];
            for (var p in s) { if (Object.prototype.hasOwnProperty.call(s, p)) { t[p] = s[p]; } }
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) { return o; }
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) { ar.push(r.value); }
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) { m.call(i); }
        }
        finally { if (e) { throw e.error; } }
    }
    return ar;
}

function __spread() {
    var arguments$1 = arguments;

    for (var ar = [], i = 0; i < arguments.length; i++)
        { ar = ar.concat(__read(arguments$1[i])); }
    return ar;
}

function normalize(s) {
  s = s || '';
  s = s.toString();
  return s
    .replace(/(\d\d)(\/)(\d\d)(\/)(\d\d\d\d)/g, '$5-$3-$1')
    .replace(/(\d{1,2}\.\d\d\.\d\d)\s([AP]M)/g, function (_, t, m) {
      var p = t.split('.').map(Number);
      if (p[0] === 12) {
        p[0] = 0;
      }
      if (m === 'PM') {
        p[0] += 12;
      }
      return p.map(function (v) { return v.toString().padStart(2, '0'); }).join(':');
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
function warning(condition, format) {
    //@ts-ignore
    if (process.env.NODE_ENV === 'development') {
        if (!condition) {
            if (typeof console !== 'undefined') {
                console.error(format);
                throw new Error(format);
            }
            try {
                // This error was thrown as a convenience so that you can use this stack
                // to find the callsite that caused this warning to fire.
                throw new Error(format);
            }
            catch (x) {
                // @ts-ignore
                console.error(x);
            }
        }
    }
}
var on = (function () {
    //@ts-ignore
    if (document.addEventListener) {
        return function (element, event, handler, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            if (element && event && handler) {
                element.addEventListener(event, handler, useCapture);
            }
        };
    }
    else {
        return function (element, event, handler) {
            if (element && event && handler) {
                element.attachEvent('on' + event, handler);
            }
        };
    }
})();
var off = (function () {
    // @ts-ignore
    if (document.removeEventListener) {
        return function (element, event, handler, useCapture) {
            if (useCapture === void 0) { useCapture = false; }
            if (element && event) {
                element.removeEventListener(event, handler, useCapture);
            }
        };
    }
    else {
        return function (element, event, handler) {
            if (element && event) {
                element.detachEvent('on' + event, handler);
            }
        };
    }
})();
/**  获取指定对象属性 不存在返回 null*/
var get = function (p) { return function (o) {
    //@ts-ignore
    return p.reduce(function (xs, x) { return (xs && xs[x] ? xs[x] : null); }, o);
}; };

/**
 * 获取相应键值缓存信息
 *
 * @export
 * @param {string} key 键名
 * @param {string} defaultValue 默认值
 * @returns {string}
 */
function getStorageItem(key, defaultValue) {
    var localValue = JSON.parse(window.localStorage.getItem(key));
    return localValue ? localValue : defaultValue;
}
/**
 *设置相应键值缓存信息
 *
 * @export
 * @param {*} key 键名
 * @param {*} value 缓存数据
 */
function setStorageItems(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

function isObject(value) {
    return Object(value) === value;
}
function isUndefined(value) {
    return value === undefined;
}

//@ts-ignore
var $locale = {
    NUMBER_FORMATS: {
        CURRENCY_SYM: '$',
        DECIMAL_SEP: '.',
        GROUP_SEP: ',',
        PATTERNS: [
            {
                gSize: 3,
                lgSize: 3,
                maxFrac: 3,
                minFrac: 0,
                minInt: 1,
                negPre: '-',
                negSuf: '',
                posPre: '',
                posSuf: '',
            },
            {
                gSize: 3,
                lgSize: 3,
                maxFrac: 2,
                minFrac: 2,
                minInt: 1,
                negPre: '-\u00a4',
                negSuf: '',
                posPre: '\u00a4',
                posSuf: '',
            } ],
    },
};
/**字符串去除空格
 *
 *
 * @export
 * @param {*} str
 * @returns
 */
function formatTrim(str) {
    if (str) {
        return str.replace(/(^\s+)|(\s+$)/g, '');
    }
    return str;
}
/**千位分割
 *千位分割
 *
 * @export
 * @param {*} num
 * @returns
 */
function formatLocaleString(num) {
    //千位分割
    if (!num) {
        return 0;
    }
    var res = num.toString().replace(/\d+/, function (n) {
        // 先提取整数部分
        return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
            return $1 + ',';
        });
    });
    return res;
}
/**
 *保留指定位数小数
 *
 * @export
 * @param {*} number
 * @param {*} fractionSize
 * @returns
 */
function number(number, fractionSize) {
    var formats = $locale.NUMBER_FORMATS;
    return number == null
        ? number
        : formatNumber(number, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, fractionSize);
}
/**
 *金额保留两位小数
 *
 * @export
 * @param {*} value
 * @returns
 */
function amount(value) {
    return number(value, 2);
}
var DECIMAL_SEP = '.';
function formatNumber(number, pattern, groupSep, decimalSep, fractionSize) {
    if (isObject(number))
        { return ''; }
    var isNegative = number < 0;
    number = Math.abs(number);
    var isInfinity = number === Infinity;
    if (!isInfinity && !isFinite(number))
        { return ''; }
    var numStr = number + '', formatedText = '', hasExponent = false, parts = [];
    if (isInfinity)
        { formatedText = '\u221e'; }
    if (!isInfinity && numStr.indexOf('e') !== -1) {
        var match = numStr.match(/([\d\.]+)e(-?)(\d+)/);
        if (match && match[2] == '-' && match[3] > fractionSize + 1) {
            number = 0;
        }
        else {
            formatedText = numStr;
            hasExponent = true;
        }
    }
    if (!isInfinity && !hasExponent) {
        var fractionLen = (numStr.split(DECIMAL_SEP)[1] || '').length;
        // determine fractionSize if it is not specified
        if (isUndefined(fractionSize)) {
            fractionSize = Math.min(Math.max(pattern.minFrac, fractionLen), pattern.maxFrac);
        }
        // safely round numbers in JS without hitting imprecisions of floating-point arithmetics
        // inspired by:
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
        number = +(Math.round(+(number.toString() + 'e' + fractionSize)).toString() +
            'e' +
            -fractionSize);
        var temp = ('' + number).split(DECIMAL_SEP);
        var whole = temp[0];
        var fraction = temp[1] || '';
        var i, pos = 0, lgroup = pattern.lgSize, group = pattern.gSize;
        if (whole.length >= lgroup + group) {
            pos = whole.length - lgroup;
            for (i = 0; i < pos; i++) {
                if ((pos - i) % group === 0 && i !== 0) {
                    formatedText += groupSep;
                }
                formatedText += whole.charAt(i);
            }
        }
        for (i = pos; i < whole.length; i++) {
            if ((whole.length - i) % lgroup === 0 && i !== 0) {
                formatedText += groupSep;
            }
            formatedText += whole.charAt(i);
        }
        // format fraction part.
        while (fraction.length < fractionSize) {
            fraction += '0';
        }
        if (fractionSize && fractionSize !== '0')
            { formatedText += decimalSep + fraction.substr(0, fractionSize); }
    }
    else {
        if (fractionSize > 0 && number < 1) {
            formatedText = number.toFixed(fractionSize);
            number = parseFloat(formatedText);
            formatedText = formatedText.replace(DECIMAL_SEP, decimalSep);
        }
    }
    if (number === 0) {
        isNegative = false;
    }
    parts.push(
    //@ts-ignore
    isNegative ? pattern.negPre : pattern.posPre, formatedText, isNegative ? pattern.negSuf : pattern.posSuf);
    return parts.join('');
}
/**
 * 判断字符串是否是json
 * @param str 要判断的字符串
 * @returns 返回布尔值
 */
function isJSON(str) {
    var result = false;
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                result = true;
            }
            else {
                result = false;
            }
        }
        catch (e) {
            console.log('error：' + str + '!!!' + e);
            result = false;
        }
    }
    return result;
}

function RegExChk(type, value) {
    var $pintu = value;
    var regex;
    switch (type) {
        //@ts-ignore
        case type instanceof RegExp:
            regex = type;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.required:
            regex = /[^(^\s*)|(\s*$)]/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.chinese:
            regex = /^[\u0391-\uFFE5]+$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.number:
            regex = /^[\d]+$/; //或者/^\d+$/
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.integer:
            regex = /^[-\+]?\d$/; //正负整数
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.plusInteger:
            regex = /^[1-9]\d*$/;
            //regex=/^[+]?\d$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.double:
            regex = /^[-\+]?\d+(\.\d+)?$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.plusDouble:
            regex = /[+]?\d+(\.\d+)?$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.english:
            regex = /^[A-Z a-z]+$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.username:
            regex = /^[a-z]\w{3,}$/i;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.mobile:
            regex = /^1[3|4|5|7|8][0-9]\d{8}$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.phone:
            regex = /^\d{3}-\d{8}|\d{4}-\d{7,8}$/; //手机号
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.email:
            regex = /^[\w\.]+([-]\w+)*@\w+[\.]\w*$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.url:
            regex = /^http|https:\/\/\w+\.\w+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.ip:
            regex = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.qq:
            regex = /^[1-9]\d{4,10}$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.decimal:
            //regex=/^\d+(\.\d+)*$/;
            regex = /^\d+(\.\d{0,2})*$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.amount:
            regex = /^\d{1,12}(\.\d{1,2})?$/;
            return regex.test($pintu);
        //@ts-ignore
        case validatorType.zipCode:
            regex = /^[1-9]\d{5}$/;
            return regex.test($pintu);
        default:
            return false;
    }
}
var validatorType;
(function (validatorType) {
    validatorType[(validatorType['required'] = 0)] = 'required';
    validatorType[(validatorType['chinese'] = 1)] = 'chinese';
    validatorType[(validatorType['number'] = 2)] = 'number';
    validatorType[(validatorType['integer'] = 3)] = 'integer';
    validatorType[(validatorType['plusInteger'] = 4)] = 'plusInteger';
    validatorType[(validatorType['double'] = 5)] = 'double';
    validatorType[(validatorType['plusDouble'] = 6)] = 'plusDouble';
    validatorType[(validatorType['english'] = 7)] = 'english';
    validatorType[(validatorType['username'] = 8)] = 'username';
    validatorType[(validatorType['mobile'] = 9)] = 'mobile';
    validatorType[(validatorType['phone'] = 10)] = 'phone';
    validatorType[(validatorType['email'] = 11)] = 'email';
    validatorType[(validatorType['url'] = 12)] = 'url';
    validatorType[(validatorType['ip'] = 13)] = 'ip';
    validatorType[(validatorType['qq'] = 14)] = 'qq';
    validatorType[(validatorType['decimal'] = 15)] = 'decimal';
    validatorType[(validatorType['zipCode'] = 16)] = 'zipCode';
    validatorType[(validatorType['amount'] = 17)] = 'amount';
    //@ts-ignore
})(validatorType || (validatorType = {}));

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var NODE_ENV = process.env.NODE_ENV;

var invariant = function (condition, format, a, b, c, d, e, f) {
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function () {
          return args[argIndex++];
        })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var invariant_1 = invariant;

/**
 * 将日期格式化成指定格式的字符串
 * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
 * @param fmt 目标字符串格式，支持的字符有：y,M,d,q,w,H,h,m,S，默认：yyyy-MM-dd HH:mm:ss
 * @returns 返回格式化后的日期字符串
 */
function formatDate(date, fmt) {
    date = !date ? new Date() : date;
    date =
        typeof date === 'number' || typeof date === 'string'
            ? new Date(date)
            : date;
    invariant_1(date instanceof Date, 'date is not date type');
    fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
    var obj = {
        y: date.getFullYear(),
        M: date.getMonth() + 1,
        d: date.getDate(),
        q: Math.floor((date.getMonth() + 3) / 3),
        w: date.getDay(),
        H: date.getHours(),
        h: date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
        m: date.getMinutes(),
        s: date.getSeconds(),
        S: date.getMilliseconds(),
    };
    var week = ['天', '一', '二', '三', '四', '五', '六'];
    for (var i in obj) {
        fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
            var val = obj[i] + '';
            if (i == 'w')
                { return (m.length > 2 ? '星期' : '周') + week[val]; }
            for (var j = 0, len = val.length; j < m.length - len; j++)
                { val = '0' + val; }
            return m.length == 1 ? val : val.substring(val.length - m.length);
        });
    }
    return fmt;
}
/**
 * 将字符串解析成日期
 * @param str 输入的日期字符串，如'2014-09-13'
 * @param fmt 字符串格式，默认'yyyy-MM-dd'，支持如下：y、M、d、H、m、s、S，不支持w和q
 * @returns 解析后的Date类型日期
 */
function parseDate(str, fmt) {
    fmt = fmt || 'yyyy-MM-dd';
    var obj = { y: 0, M: 1, d: 0, H: 0, h: 0, m: 0, s: 0, S: 0 };
    fmt.replace(/([^yMdHmsS]*?)(([yMdHmsS])\3*)([^yMdHmsS]*?)/g, function (m, $1, $2, $3, $4, idx, old) {
        str = str.replace(new RegExp($1 + '(\\d{' + $2.length + '})' + $4), function (_m, _$1) {
            obj[$3] = parseInt(_$1);
            return '';
        });
        return '';
    });
    obj.M--; // 月份是从0开始的，所以要减去1
    var date = new Date(obj.y, obj.M, obj.d, obj.H, obj.m, obj.s);
    if (obj.S !== 0)
        { date.setMilliseconds(obj.S); } // 如果设置了毫秒
    return date;
}
/**
 * 计算2日期之间的天数，用的是比较毫秒数的方法
 * 传进来的日期要么是Date类型，要么是yyyy-MM-dd格式的字符串日期
 * @param date1 日期一
 * @param date2 日期二
 */
function countDays(date1, date2) {
    var fmt = 'yyyy-MM-dd';
    // 将日期转换成字符串，转换的目的是去除“时、分、秒”
    if (date1 instanceof Date && date2 instanceof Date) {
        date1 = formatDate(date1, fmt);
        date2 = formatDate(date2, fmt);
    }
    if (typeof date1 === 'string' && typeof date2 === 'string') {
        date1 = parseDate(date1, fmt);
        date2 = parseDate(date2, fmt);
        return (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
    }
    else {
        console.error('参数格式无效！');
        return 0;
    }
}
/**
 *获取指定日期月数最后一天
 *
 * @export
 * @param {*} date
 * @returns
 */
function getLastDay(date) {
    date = date || new Date();
    date =
        typeof date === 'number' || typeof date === 'string'
            ? new Date(date)
            : date;
    invariant_1(date instanceof Date, 'date is not date type');
    var has31 = [1, 3, 5, 7, 8, 10, 12];
    var nowYear = date.getFullYear();
    var nowMonth = date.getMonth() + 1;
    // @ts-ignore
    nowMonth = nowMonth >= 10 ? nowMonth : '0' + nowMonth;
    var nowDay = 0;
    // @ts-ignore
    if (nowMonth === '02') {
        nowDay = nowYear % 4 === 0 && nowYear % 100 !== 0 ? 29 : 28;
    }
    else if (has31.indexOf(Number(nowMonth)) !== -1) {
        nowDay = 31;
    }
    else {
        nowDay = 30;
    }
    return nowYear + "/" + nowMonth + "/" + nowDay;
}

/**
 *设置cookie值
 *
 * @export
 * @param {*} name
 * @param {*} value
 * @param {*} iDay 有效期 数字
 */
function setCookie(name, value, iDay) {
    var oDate = new Date();
    oDate.setDate(oDate.getDate() + iDay);
    document.cookie = name + '=' + value + ';expires=' + oDate;
}
/**
 *获取cookie值
 *
 * @export
 * @param {*} name
 * @returns
 */
function getCookie(name) {
    if (name) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                return arr2[1];
            }
        }
    }
    return document.cookie || '';
}
/**
 *移除cookie
 *
 * @export
 * @param {*} name
 */
function removeCookie(name) {
    //@ts-ignore
    setCookie(name, 1, -1);
}
/**
 *清空
 *
 * @export
 */
function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            { document.cookie =
                keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString(); }
        document.cookie =
            keys[i] +
                '=0;path=/;domain=' +
                document.domain +
                ';expires=' +
                new Date(0).toUTCString();
    }
}

//@ts-ignore
function fallback(urls) {
    var i = 0;
    (function createIframe() {
        var frame = document.createElement('iframe');
        frame.style.display = 'none';
        frame.src = urls[i++];
        document.documentElement.appendChild(frame);
        // the download init has to be sequential otherwise IE only use the first
        var interval = setInterval(function () {
            if (
            //@ts-ignore
            frame.contentWindow.document.readyState === 'complete' ||
                //@ts-ignore
                frame.contentWindow.document.readyState === 'interactive') {
                clearInterval(interval);
                // Safari needs a timeout
                setTimeout(function () {
                    //@ts-ignore
                    frame.parentNode.removeChild(frame);
                }, 1000);
                if (i < urls.length) {
                    createIframe();
                }
            }
        }, 100);
    })();
}
function isFirefox() {
    // sad panda :(
    return /Firefox\//i.test(navigator.userAgent);
}
function sameDomain(url) {
    var a = document.createElement('a');
    a.href = url;
    return location.hostname === a.hostname && location.protocol === a.protocol;
}
function download(urls) {
    if (!urls) {
        throw new Error('`urls` required');
    }
    if (typeof document.createElement('a').download === 'undefined') {
        return fallback(urls);
    }
    var delay = 0;
    //@ts-ignore
    urls.forEach(function (url) {
        // the download init has to be sequential for firefox if the urls are not on the same domain
        if (isFirefox() && !sameDomain(url)) {
            return setTimeout(download.bind(null, url), 100 * ++delay);
        }
        setTimeout(download.bind(null, url), 100 * ++delay);
    });
}

export { RegExChk, amount, clearAllCookie, compare, countDays, download, excludeObj, formatLocaleString, formatTrim, get, getCookie, getLastDay, getStorageItem, isJSON, isObject, isUndefined, number, off, on, removeCookie, setCookie, setStorageItems, sort, validatorType, warning };
