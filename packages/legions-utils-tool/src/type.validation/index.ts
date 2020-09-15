/* export function isObject(value: any) {
  return Object(value) === value;
} */
export const isObject = (obj: object) =>
  obj && typeof obj === 'object' && !Array.isArray(obj);
export function isUndefined(value: any) {
  return value === undefined;
}
export function isNull(value: any) {
  return value === null;
}
export function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}
export function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]';
}
export function isNullUndefined(val) {
  return val === null || val === void 0;
}
