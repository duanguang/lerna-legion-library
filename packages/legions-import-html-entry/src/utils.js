/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2019-02-25
 */
var isIE = navigator.userAgent.indexOf('Trident') !== -1;
var firstGlobalProp, secondGlobalProp, lastGlobalProp;

export function getGlobalProp(global) {
  var cnt = 0;
  var lastProp;
  var hasIframe = false;
  for (var p in global) {
    if (
      !global.hasOwnProperty(p) ||
      (!isNaN(p) && p < global.length) ||
      (isIE && global[p] && global[p].parent === window)
    )
      continue;

    // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断
    for (var i = 0; i < window.frames.length && !hasIframe; i++) {
      var frame = window.frames[i];
      if (frame === global[p]) {
        hasIframe = true;
        break;
      }
    }
    if (
      !hasIframe &&
      ((cnt === 0 && p !== firstGlobalProp) ||
        (cnt === 1 && p !== secondGlobalProp))
    )
      return p;
    cnt++;
    lastProp = p;
  }
  if (lastProp !== lastGlobalProp) return lastProp;
}

export function noteGlobalProps(global) {
  // alternatively Object.keys(global).pop()
  // but this may be faster (pending benchmarks)
  firstGlobalProp = secondGlobalProp = undefined;
  for (var p in global) {
    try {
      if (
        !global.hasOwnProperty(p) ||
        (!isNaN(p) && p < global.length) ||
        (isIE && global[p] && global[p].parent === window)
      )
        continue;
      if (!firstGlobalProp) firstGlobalProp = p;
      else if (!secondGlobalProp) secondGlobalProp = p;
      lastGlobalProp = p;
    } catch (er) {
      continue;
    }
  }
  return lastGlobalProp;
}

export function getInlineCode(match) {
  var start = match.indexOf('>') + 1;
  var end = match.lastIndexOf('<');
  return match.substring(start, end);
}

/* export function defaultGetPublicPath(url) {
	try {
		// URL 构造函数不支持使用 // 前缀的 url
		const { origin, pathname } = new URL(url.startsWith('//') ? `${location.protocol}${url}` : url, location.href);
		//var { origin, pathname } = new URL(url.startsWith('//') ? ''+location.protocol+url+'' : url, location.href);
		const paths = pathname.split('/');
		// 移除最后一个元素
		paths.pop();
		return ''+origin+paths.join('/')+'/';
	} catch (e) {
		console.warn(e);
		return '';
	}
} */

// RIC and shim for browsers setTimeout() without it
export var requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(cb) {
    var start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

export function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE =
    userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 =
    userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion == 7) {
      return 7;
    } else if (fIEVersion == 8) {
      return 8;
    } else if (fIEVersion == 9) {
      return 9;
    } else if (fIEVersion == 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  } else if (isEdge) {
    return 'edge'; //edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1; //不是ie浏览器
  }
}

export function transHttpUrl(url, timestamp) {
  var arr = url.split('?');
  var version = timestamp ? '&version=' + timestamp + '' : '';
  if (arr.length > 1) {
    var _query = arr[1] + version;
    if (arr.length > 2) {
      var query = '?' + arr[2] + version;
      return arr[0] + '?' + arr[1] + query;
    }
    return arr[0] + '?' + _query;
  } else {
    var version = timestamp ? '?version=' + timestamp + '' : '';
    var _query = url + version;
    return _query;
  }
}
