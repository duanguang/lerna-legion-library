/**
 * legions-utils-tool v0.0.5
 * (c) 2020 duanguang
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.legionsUtilsTool = {}));
}(this, (function (exports) { 'use strict';

  //@ts-ignore
  function fallback(urls) {
      var i = 0;
      (function createIframe() {
          var frame = document.createElement('iframe');
          frame.style.display = 'none';
          frame.src = urls[i++];
          document.documentElement.appendChild(frame);
          // the download init has to be sequential otherwise IE only use the first
          var interval = setInterval(function () {
              if (
              //@ts-ignore
              frame.contentWindow.document.readyState === 'complete' ||
                  //@ts-ignore
                  frame.contentWindow.document.readyState === 'interactive') {
                  clearInterval(interval);
                  // Safari needs a timeout
                  setTimeout(function () {
                      //@ts-ignore
                      frame.parentNode.removeChild(frame);
                  }, 1000);
                  if (i < urls.length) {
                      createIframe();
                  }
              }
          }, 100);
      })();
  }
  function isFirefox() {
      // sad panda :(
      return /Firefox\//i.test(navigator.userAgent);
  }
  function sameDomain(url) {
      var a = document.createElement('a');
      a.href = url;
      return location.hostname === a.hostname && location.protocol === a.protocol;
  }
  function download(urls) {
      if (!urls) {
          throw new Error('`urls` required');
      }
      if (typeof document.createElement('a').download === 'undefined') {
          return fallback(urls);
      }
      var delay = 0;
      //@ts-ignore
      urls.forEach(function (url) {
          // the download init has to be sequential for firefox if the urls are not on the same domain
          if (isFirefox() && !sameDomain(url)) {
              return setTimeout(download.bind(null, url), 100 * ++delay);
          }
          setTimeout(download.bind(null, url), 100 * ++delay);
      });
  }

  exports.download = download;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
