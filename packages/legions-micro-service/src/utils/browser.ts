export function checkBrowser() {
  /**浏览器升级提示**/
  let d = document.createElement('div');
  d.innerHTML =
    '<style>.btn{display:inline-block;padding:6px 12px;margin-bottom:0;font-size:14px;font-weight:400;line-height:1.42857143;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;background-image:none;border:1px solid transparent;border-radius:4px;} a.btn {display: inline-block;background-color: #0885f2;color: #ffffff;line-height:16px;border: 1px solid #0885f2;outline: none;cursor: pointer;border-radius: 2px;cursor:pointer;} a.btn:hover {color:#fff;}</style> <div  id = "updateBrowseBoxVersion" style = "position: fixed;top: 0;left:0px;width: 100%;color: red;border-bottom: 1px solid #b1b4b9;padding-left: 10px;" class="update-browse-tips" > 您的浏览器版本过低，可能无法正常使用部分功能，请升级。推荐使用谷歌，火狐浏览器<a class="btn btn-update" target="_blank" href="http://browsehappy.osfipin.com/">立即升级</a></div > ';
  let func = function () {
    const updateBrowseBoxVersion = document.getElementById(
      'updateBrowseBoxVersion'
    );
    if (updateBrowseBoxVersion !== null) {
      return;
    }
    let s = document.getElementsByTagName('body')[0];
    if ('undefined' == typeof s) {
      //@ts-ignore
      setTimeout(f, 10);
    } else {
      s.insertBefore(d, s.firstChild);
    }
  };
  /**IE10及其以下提示*/
  if (
    !('WebSocket' in window && 2 === window.WebSocket.CLOSING) ||
    window.navigator.userAgent.indexOf('MSIE') >= 1
  ) {
    /* if('continue' == window.sessionStorage.getItem('UPDATE_BROWSE_TIPS')) return;
          let handlerContinue = "document.getElementById('updateBrowseBox').parentNode.removeChild(document.getElementById('updateBrowseBox'));window.sessionStorage.setItem('UPDATE_BROWSE_TIPS', 'continue')"; */
    func();
    return false;
  }
  return true;
}
