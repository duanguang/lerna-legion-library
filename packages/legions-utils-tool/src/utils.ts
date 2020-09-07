import { normalize } from './utils/utils';
/**
 * 排除指定对象属性
 *
 * @export
 * @param {Object} exclude 需要排除的对象属性
 * @param {Object} source 源对象
 * @returns
 */
export function excludeObj<T = {}>(exclude: Object, source: Object): T {
  //@ts-ignore
  let newObj: T = null;
  // @ts-ignore
  newObj = {};
  Object.keys(source).forEach(key => {
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
export function sort(source: any[], sortKey?: string) {
  let data = [...source];
  const unresultObject = data.every(item => typeof item !== 'object');
  const resultObject = data.every(
    item => typeof item === 'object' && !Array.isArray(item)
  );
  if (unresultObject) {
    // 如果不是对象
    data.sort((a, b) =>
      normalize(a).localeCompare(normalize(b), undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );
  }
  if (resultObject) {
    data = source.map(item => {
      return { ...item };
    });
    data.sort((a, b) =>
      normalize(a[sortKey as string]).localeCompare(
        normalize(b[sortKey as string]),
        undefined,
        {
          numeric: true,
          sensitivity: 'base',
        }
      )
    );
  }

  return data;
}

/** 通用排序compareFunction */
export function compare(a: string, b: string) {
  return normalize(a).localeCompare(normalize(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function warning(condition: boolean, format: string) {
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
      } catch (x) {
        // @ts-ignore
        console.error(x);
      }
    }
  }
}
export const on = (function () {
  //@ts-ignore
  if (document.addEventListener) {
    return function (element, event, handler, useCapture = false) {
      if (element && event && handler) {
        element.addEventListener(event, handler, useCapture);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

export const off = (function () {
  // @ts-ignore
  if (document.removeEventListener) {
    return function (element, event, handler, useCapture = false) {
      if (element && event) {
        element.removeEventListener(event, handler, useCapture);
      }
    };
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/**  获取指定对象属性 不存在返回 null*/
export const get = (p: (string | number)[]) => <T = {}>(o: Object): T =>
  //@ts-ignore
  p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);
