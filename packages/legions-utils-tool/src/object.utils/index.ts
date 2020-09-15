import { normalize } from '../utils/utils';
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
/* export const get = (p: string | number[],o) => p.reduce((xs,x) => (xs && xs[x]) ? xs[x] : null,o) */
/**  获取指定对象属性 不存在返回 null*/
export const get = (p: (string | number)[]) => <T = {}>(o: Object): T =>
  //@ts-ignore
  p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);

export function proxyGetters(target, obj, keys) {
  keys.map(key => {
    Object.defineProperty(target, key, {
      get: () => obj[key],
    });
  });
}

export function promiseTry(fn: Function) {
  return new Promise((resolve, reject) => {
    try {
      resolve(fn());
    } catch (err) {
      reject(err);
    }
  });
}
