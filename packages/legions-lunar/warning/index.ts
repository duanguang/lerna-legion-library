/**
 * legions-lunar v0.0.4
 * (c) 2020 duanguang
 * @license MIT
 */
function warning(condition, format) {
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
var warned = {};
function warningOnce(condition, format) {
  if (!warned[format]) {
    warning(condition, format);
    warned[format] = !condition;
  }
}

export { warning, warningOnce };
