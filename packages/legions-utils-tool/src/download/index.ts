//@ts-ignore
function fallback(urls) {
  let i = 0;

  (function createIframe() {
    let frame = document.createElement('iframe');
    frame.style.display = 'none';
    frame.src = urls[i++];
    document.documentElement.appendChild(frame);

    // the download init has to be sequential otherwise IE only use the first
    let interval = setInterval(function () {
      if (
        //@ts-ignore
        frame.contentWindow.document.readyState === 'complete' ||
        //@ts-ignore
        frame.contentWindow.document.readyState === 'interactive'
      ) {
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
  let a = document.createElement('a');
  a.href = url;

  return location.hostname === a.hostname && location.protocol === a.protocol;
}

function downloading(url) {
  let a = document.createElement('a');
  a.download = '';
  a.href = url;
  // firefox doesn't support `a.click()`...
  a.dispatchEvent(new MouseEvent('click'));
}
export function download(urls: string[]) {
  if (!urls) {
    throw new Error('`urls` required');
  }

  if (typeof document.createElement('a').download === 'undefined') {
    return fallback(urls);
  }

  let delay = 0;
  //@ts-ignore
  urls.forEach(function (url) {
    // the download init has to be sequential for firefox if the urls are not on the same domain
    if (isFirefox() && !sameDomain(url)) {
      return setTimeout(downloading.bind(null, url), 100 * ++delay);
    }
    setTimeout(downloading.bind(null, url), 100 * ++delay);
  });
}
