function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}
export const PostMessageUtils = {
  receiveMessage: receive => {
    window.addEventListener(
      'message',
      function (e) {
        if (receive && typeof receive === 'function') {
          receive(e);
        }
      },
      false
    );
  },

  /**
   * 发送消息到子窗口
   *
   * @param {*} options
   * @memberof PostMessageUtils
   */
  sendMessageToChildrenWin(options) {
    options = options || {};
    if (!isObject(options)) {
      options = {};
    }
    options.data = options.data || '';
    options.origin = options.origin || '*';
    options.childrenId = options.childrenId || '';
    if (!options.childrenId) {
      console.error('请传入子窗口DOM元素id');
      return;
    }
    let iframeWin = document.getElementById(options.childrenId);
    if (!iframeWin) {
      console.error('找不到子窗口DOM元素,请检查id 是否正确');
      return;
    }
    //@ts-ignore
    iframeWin.contentWindow.postMessage(options.data, options.origin);
  },
  /**
   * 发送消息到父窗口
   *
   * @param {*} options
   * @memberof PostMessageUtils
   */
  sendMessageToParentWin(options) {
    options = options || {};
    if (!isObject(options)) {
      options = {};
    }
    options.data = options.data || '';
    options.origin = options.origin || '*';
    let parentWin = window.parent || window.top;
    if (!parentWin) {
      console.error('找不到子窗口DOM元素,请检查id 是否正确');
      return;
    }
    parentWin.postMessage(options.data, options.origin);
  },
};
