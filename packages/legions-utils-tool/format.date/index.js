/**
 * legions-utils-tool v0.0.7
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('legions-utils-tool/invariant')) :
  typeof define === 'function' && define.amd ? define(['exports', 'legions-utils-tool/invariant'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsUtilsTool = {}, global.invariant));
}(this, (function (exports, invariant) { 'use strict';

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
      invariant.invariant(date instanceof Date, 'date is not date type');
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
                  return (m.length > 2 ? '星期' : '周') + week[val];
              for (var j = 0, len = val.length; j < m.length - len; j++)
                  val = '0' + val;
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
          date.setMilliseconds(obj.S); // 如果设置了毫秒
      return date;
  }
  /**
   * 将一个日期格式化成友好格式，比如，1分钟以内的返回“刚刚”，
   * 当天的返回时分，当年的返回月日，否则，返回年月日
   * @param {Object} date
   */
  function formatDateToFriendly(date) {
      date = date || new Date();
      date =
          typeof date === 'number' || typeof date === 'string'
              ? new Date(date)
              : date;
      invariant.invariant(date instanceof Date, 'date is not date type');
      var now = new Date();
      if (now.getTime() - date.getTime() < 60 * 1000)
          return '刚刚'; // 1分钟以内视作“刚刚”
      var temp = formatDate(date, 'yyyy年M月d');
      if (temp == formatDate(now, 'yyyy年M月d'))
          return formatDate(date, 'HH:mm');
      if (date.getFullYear() == now.getFullYear())
          return formatDate(date, 'M月d日');
      return temp;
  }
  /**
   * 将一段时长转换成友好格式，如：
   * 147->“2分27秒”
   * 1581->“26分21秒”
   * 15818->“4小时24分”
   * @param {Object} second
   */
  function formatDurationToFriendly(second) {
      invariant.invariant(typeof second === 'number', 'second: object type should is number');
      if (second < 60)
          return second + '秒';
      else if (second < 60 * 60)
          return (second - (second % 60)) / 60 + '分' + (second % 60) + '秒';
      else if (second < 60 * 60 * 24)
          return ((second - (second % 3600)) / 60 / 60 +
              '小时' +
              Math.round((second % 3600) / 60) +
              '分');
      return (second / 60 / 60 / 24).toFixed(1) + '天';
  }
  /**
   * 将时间转换成MM:SS形式
   */
  function formatTimeToFriendly(second) {
      var m = Math.floor(second / 60);
      // @ts-ignore
      m = m < 10 ? '0' + m : m;
      var s = second % 60;
      // @ts-ignore
      s = s < 10 ? '0' + s : s;
      return m + ':' + s;
  }
  /**
   * 判断某一年是否是闰年
   * @param year 可以是一个date类型，也可以是一个int类型的年份，不传默认当前时间
   */
  function isLeapYear(year) {
      if (year === undefined)
          year = new Date();
      if (year instanceof Date)
          year = year.getFullYear();
      return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
  }
  /**
   * 获取某一年某一月的总天数，没有任何参数时获取当前月份的
   * 方式一：getMonthDays();
   * 方式二：getMonthDays(new Date());
   * 方式三：getMonthDays(2013, 12);
   */
  function getMonthDays(date, month) {
      var y, m;
      if (date == undefined)
          date = new Date();
      if (date instanceof Date) {
          y = date.getFullYear();
          m = date.getMonth();
      }
      else if (typeof date == 'number') {
          y = date;
          // @ts-ignore
          m = month - 1;
      }
      var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 非闰年的一年中每个月份的天数
      //如果是闰年并且是2月
      if (m == 1 && isLeapYear(y))
          return days[m] + 1;
      return days[m];
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
      invariant.invariant(date instanceof Date, 'date is not date type');
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

  exports.countDays = countDays;
  exports.formatDate = formatDate;
  exports.formatDateToFriendly = formatDateToFriendly;
  exports.formatDurationToFriendly = formatDurationToFriendly;
  exports.formatTimeToFriendly = formatTimeToFriendly;
  exports.getLastDay = getLastDay;
  exports.getMonthDays = getMonthDays;
  exports.isLeapYear = isLeapYear;
  exports.parseDate = parseDate;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
