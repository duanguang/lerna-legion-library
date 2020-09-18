/**
 * legions-utils-tool v0.0.7
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('legions-utils-tool/type.validation')) :
  typeof define === 'function' && define.amd ? define(['exports', 'legions-utils-tool/type.validation'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsUtilsTool = {}, global.type_validation));
}(this, (function (exports, type_validation) { 'use strict';

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
              },
          ],
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
      if (type_validation.isObject(number))
          return '';
      var isNegative = number < 0;
      number = Math.abs(number);
      var isInfinity = number === Infinity;
      if (!isInfinity && !isFinite(number))
          return '';
      var numStr = number + '', formatedText = '', hasExponent = false, parts = [];
      if (isInfinity)
          formatedText = '\u221e';
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
          if (type_validation.isUndefined(fractionSize)) {
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
              formatedText += decimalSep + fraction.substr(0, fractionSize);
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
  /**
   * 获取字符串长度
   *
   * @export
   * @param {*} str
   * @returns
   */
  function getStringLen(str) {
      var len = 0;
      str = str || '';
      if (str && typeof str !== 'object') {
          str = str.toString();
          if (typeof str === 'string') {
              for (var i = 0; i < str.length; i++) {
                  if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                      len += 2;
                  }
                  else {
                      len++;
                  }
              }
          }
      }
      return len;
  }

  exports.amount = amount;
  exports.formatLocaleString = formatLocaleString;
  exports.formatTrim = formatTrim;
  exports.getStringLen = getStringLen;
  exports.isJSON = isJSON;
  exports.number = number;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
