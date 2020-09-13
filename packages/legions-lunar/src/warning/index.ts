export function warning(condition: boolean, format: string) {
  var __DEV__ = process.env.NODE_ENV === 'dev';
  if (__DEV__) {
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

const warned = {};
export function warningOnce(condition, format) {
  if (!warned[format]) {
    warning(condition, format);
    warned[format] = !condition;
  }
}
