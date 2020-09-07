export function isObject(value: any) {
  return Object(value) === value;
}
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
