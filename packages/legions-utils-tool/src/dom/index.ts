/** DOM节点绑定事件 */
export const on = (function () {
  //@ts-ignore
  if (document.addEventListener) {
    return function (
      element: Element,
      event: string,
      handler: () => void,
      useCapture = false
    ) {
      if (element && event && handler) {
        element.addEventListener(event, handler, useCapture);
      }
    };
  } else {
    return function (element: Element, event: string, handler: () => void) {
      if (element && event && handler) {
        //@ts-ignore
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();
/** 卸载DOM元素节点事件 */
export const off = (function () {
  // @ts-ignore
  if (document.removeEventListener) {
    return function (
      element: Element,
      event: string,
      handler: () => void,
      useCapture = false
    ) {
      if (element && event) {
        element.removeEventListener(event, handler, useCapture);
      }
    };
  } else {
    return function (element: Element, event: string, handler: () => void) {
      if (element && event) {
        // @ts-ignore
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();
