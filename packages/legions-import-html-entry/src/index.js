import processTpl, { genLinkReplaceSymbol } from './process-tpl';
import {
  getGlobalProp /* defaultGetPublicPath */,
  getInlineCode,
  noteGlobalProps,
  requestIdleCallback,
  IEVersion,
  transHttpUrl,
} from './utils';
var styleCache = {};
var scriptCache = {};
var excludeFilesCache = {}; // 排除在沙箱之外代码文件列表
var embedHTMLCache = {};
var isMergeCache = {};
/* var fetch = window.fetch.bind(window); */
import { fetch } from 'whatwg-fetch';
import 'core-js/modules/es.string.starts-with';
export { fetch };
function getDomain(url) {
  try {
    // URL 构造函数不支持使用 // 前缀的 url
    var href = new URL(
      url.startsWith('//') ? '' + location.protocol + '' + url + '' : url
    );
    return href.origin;
  } catch (e) {
    return '';
  }
}
function getExecutableScript(scriptText, proxy) {
  window.proxy = proxy;
  var isIE = window.ActiveXObject || 'ActiveXObject' in window;
  if (isIE) {
    return (
      ';(function(window, self){;' +
      scriptText +
      '\n}).bind(window.proxy)(window.proxy, window.proxy);'
    );
  }
  return (
    ';(function(window, self){with(window){;' +
    scriptText +
    '\n}}).bind(window.proxy)(window.proxy, window.proxy);'
  );
}
/**
 * convert external css link to inline style for performance optimization
 * @param template
 * @param styles
 * @return embedHTML
 */
function getEmbedHTML(template, styles) {
  var embedHTML = template;

  return getExternalStyleSheets(styles).then(function (styleSheets) {
    embedHTML = styles.reduce(function (html, styleSrc, i) {
      html = html.replace(
        genLinkReplaceSymbol(styleSrc),
        '<style>/* ' + styleSrc + ' */' + styleSheets[i] + '</style>'
      );
      return html;
    }, embedHTML);
    return embedHTML;
  });
}

// for prefetch
function getExternalStyleSheets(styles) {
  return Promise.all(
    styles.map(function (styleLink) {
      if (styleLink.startsWith('<')) {
        // if it is inline style
        return getInlineCode(styleLink);
      } else {
        // external styles
        return (
          styleCache[styleLink] ||
          (styleCache[styleLink] = fetch(styleLink).then(function (response) {
            return response.text();
          }))
        );
      }
    })
  );
}

function getExternalHtml(htmls) {
  return Promise.all(function (htmls) {
    return htmls;
  });
}

// for prefetch
function getExternalScripts(scripts) {
  return Promise.all(
    scripts.map(function (script) {
      if (script.startsWith('<')) {
        // if it is inline script
        return getInlineCode(script);
      } else {
        // external script
        return (
          scriptCache[script] ||
          (scriptCache[script] = fetch(script).then(function (response) {
            return response.text().then(result => {
              return { scriptsText: result, scripts: script };
            });
          }))
        );
      }
    })
  );
}

function execScripts(entryMain, scripts, proxy, keys) {
  return getExternalScripts(scripts).then(function (scriptsText) {
    proxy = window;
    window.proxy = proxy;
    var geval = eval;
    var entry = [];
    function isExcludeFile(scriptSrc) {
      if (excludeFilesCache[keys] && excludeFilesCache[keys].length) {
        for (var i = 0; i < excludeFilesCache[keys].length; i++) {
          if (scriptSrc.indexOf(excludeFilesCache[keys][i]) > -1) {
            return true;
          }
        }
        return false;
      }
      return false;
    }

    /**
     * 收集全部html 里面全部JS字符串并进行合并
     *
     */
    function collectInlineScript(scriptSrc, inlineScript, resolve) {
      var markName = 'Evaluating script ' + scriptSrc + '';
      var measureName = 'Evaluating Time Consuming: ' + scriptSrc + '';

      if (process.env.NODE_ENV === 'development') {
        performance.mark(markName);
      }
      if (
        excludeFilesCache[keys] &&
        Object.prototype.toString.call(excludeFilesCache[keys]) ===
          '[object Array]' &&
        excludeFilesCache[keys].length
      ) {
        for (var i = 0; i < excludeFilesCache[keys].length; i++) {
          if (scriptSrc.indexOf(excludeFilesCache[keys][i]) < 0) {
            entry.push(inlineScript);
          }
        }
      } else {
        entry.push(inlineScript);
      }
      noteGlobalProps();
      /*  var exports = proxy[getGlobalProp()] || {};
      resolve(exports); */

      if (process.env.NODE_ENV === 'development') {
        performance.measure(measureName, markName);
        performance.clearMarks(markName);
        performance.clearMeasures(measureName);
      }
    }
    function exec(scriptSrc, inlineScript, resolve) {
      var markName = 'Evaluating script ' + scriptSrc + '';
      var measureName = 'Evaluating Time Consuming: ' + scriptSrc + '';

      if (process.env.NODE_ENV === 'development') {
        performance.mark(markName);
      }

      if (scriptSrc === entryMain) {
        noteGlobalProps();

        try {
          /* geval(';(function(window){;'+inlineScript+'\n}).bind(window.proxy)(window.proxy);'); */
          if (isExcludeFile(scriptSrc)) {
            /* geval(''+inlineScript+'\n'); */
          } else {
            geval(getExecutableScript(inlineScript, proxy));
          }
        } catch (e) {
          console.error(
            'error occurs while executing the entry ' + scriptSrc + '}'
          );
          /* console.error(e); */
          throw e;
        }

        var exports = proxy[getGlobalProp(proxy)] || {};
        resolve(exports);
      } else {
        if (typeof inlineScript === 'string') {
          try {
            if (isExcludeFile(scriptSrc)) {
              /* geval(''+inlineScript+'\n'); */
            } else {
              geval(getExecutableScript(inlineScript, proxy));
            }

            /* geval(';(function(window){;'+inlineScript+'\n}).bind(window.proxy)(window.proxy);'); */
          } catch (e) {
            console.error('error occurs while executing ' + scriptSrc + '');
            /* console.error(e); */
            throw e;
          }
        }
      }

      if (process.env.NODE_ENV === 'development') {
        performance.measure(measureName, markName);
        performance.clearMarks(markName);
        performance.clearMeasures(measureName);
      }
    }
    function collectExec(resolve) {
      try {
        var isIE = window.ActiveXObject || 'ActiveXObject' in window;
        if (isIE) {
          if (IEVersion() < 11) {
            geval(getExecutableScript(entry.join(' '), proxy));
            /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
            /* geval(';(function(window){;'+entry.join(' ')+'\n})(window.proxy);'); */
          } else {
            geval(getExecutableScript(entry.join(' '), proxy));
            /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
          }
          /* var exports = proxy[getGlobalProp(proxy)] || {}; */
          resolve(proxy);
        } else {
          /* compileCode(''+entry.join(' ')+'').bind(window.proxy)(window.proxy); */
          geval(getExecutableScript(entry.join(' '), proxy));
          // geval(';(function(window){;'+entry.join(' ')+'\n})(window);');
          var exports = proxy[getGlobalProp(proxy)] || {};
          resolve(exports);
        }
      } catch (e) {
        console.error(
          'error occurs while executing the entry ' + entry.join(' ') + ''
        );
        console.error(e);
      }
    }
    function schedule(i, resolvePromise) {
      if (i < scripts.length) {
        var scriptSrc = scripts[i];
        var inlineScript = scriptsText[i]['scriptsText'];
        if (isMergeCache[keys]) {
          // 收集需要合并执行的js代码
          collectInlineScript(scriptSrc, inlineScript, resolvePromise);
          schedule(i + 1, resolvePromise);
        } else {
          exec(scriptSrc, inlineScript, resolvePromise);
          if (!entryMain && i === scripts.length - 1) {
            resolvePromise();
          } else {
            schedule(i + 1, resolvePromise);
          }
        }
      } else {
        if (isMergeCache[keys]) {
          collectExec(resolvePromise);
        }
      }
    }
    return new Promise(function (resolve) {
      return schedule(0, resolve);
    });
  });
}

export function importHTML(url, options) {
  /* var getPublicPath = defaultGetPublicPath; */
  if (options && typeof options === 'object') {
    isMergeCache[url] = true;
    if (
      options.excludeFiles !== undefined &&
      Array.isArray(options.excludeFiles)
    ) {
      excludeFilesCache[url] = options.excludeFiles; // 排除在沙箱之外的js文件列表
    }
    if (options.isMerge !== undefined && typeof options.isMerge === 'boolean') {
      isMergeCache[url] = options.isMerge;
    }
    /* getPublicPath = options.getPublicPath || options.getDomain || defaultGetPublicPath; */
  }

  return (
    embedHTMLCache[url] ||
    /* (embedHTMLCache[url] = axios.get(url+'?version='+Date.parse(new Date().toString())+'') */
    (embedHTMLCache[url] = fetch(
      transHttpUrl(url, Date.parse(new Date().toString()))
    )
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        var assetPublicPath = getDomain(url) + '/';
        var result = processTpl(html, getDomain(url));
        var template = result.template;
        var scripts = result.scripts;
        var entry = result.entry;
        var styles = result.styles;
        var scriptList = {};
        scriptList[url] = scripts;
        return getEmbedHTML(template, styles).then(function (embedHTML) {
          return {
            template: embedHTML,
            assetPublicPath,
            getExternalScripts: function () {
              return getExternalScripts(scripts);
            },
            getExternalStyleSheets: function () {
              return getExternalStyleSheets(styles);
            },
            execScripts: function (proxy) {
              if (!scripts.length) {
                return Promise.resolve();
              }
              return execScripts(entry, scripts, proxy, url);
            },
            setExcludeFilesCache: function (entry, excludeFiles) {
              if (entry && typeof entry === 'string') {
                console.error('entry 入口文件不能为空');
                return;
              }
              if (
                excludeFiles &&
                Object.prototype.toString.call(excludeFiles) ===
                  '[object Array]'
              ) {
                excludeFilesCache[entry] = excludeFiles;
              }
            },
            getScripts: function () {
              return {
                scripts: scriptList,
                excludeFiles: excludeFilesCache,
              };
            },
          };
        });
      }))
  );
}

export function importEntry(entry) {
  /* var getPublicPath =  defaultGetPublicPath; */
  if (!entry) {
    throw new SyntaxError('entry should not be empty!');
  }

  // html entry
  if (typeof entry === 'string') {
    return importHTML(entry);
  }

  // config entry
  if (Array.isArray(entry.scripts) || Array.isArray(entry.styles)) {
    /* 		var { scripts = [], styles = [], html = '' } = entry; */
    var scripts = entry.scripts || [];
    var styles = entry.styles || [];
    var html = entry.html || '';
    return getEmbedHTML(html, styles).then(function (embedHTML) {
      return {
        template: embedHTML,
        assetPublicPath: '/',
        getExternalScripts: function () {
          return getExternalScripts(scripts);
        },
        getExternalStyleSheets: function () {
          return getExternalStyleSheets(styles);
        },
        execScripts: function (proxy) {
          return execScripts(scripts[scripts.length - 1], scripts, proxy);
        },
      };
    });
  } else {
    throw new SyntaxError('entry scripts or styles should be array!');
  }
}
