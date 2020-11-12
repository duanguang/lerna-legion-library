export function onloadScript(src = '', onLoad = function () {}) {
  if (src) {
    let script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
    //@ts-ignore
    script.onload = script.onreadystatechange = function () {
      //@ts-ignore
      if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
        onLoad && onLoad();
      }
    };
  }
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
