export function debounce(func: Function, delay: number) {
  var timeout;
  return function () {
    clearTimeout(timeout);
    //@ts-ignore
    var context = this,
      args = arguments;
    timeout = setTimeout(function () {
      func.apply(context, args);
    }, delay);
  };
}
