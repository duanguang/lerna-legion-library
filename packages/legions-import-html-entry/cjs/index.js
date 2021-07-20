/**
  *  legions-import-html-entry v0.0.5
  * (c) 2021 duanguang
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var whatwgFetch = require('whatwg-fetch');

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2019-02-25
 */
var isIE = navigator.userAgent.indexOf('Trident') !== -1;
var firstGlobalProp, secondGlobalProp, lastGlobalProp;
function getGlobalProp(global) {
    var cnt = 0;
    var lastProp;
    var hasIframe = false;
    for (var p in global) {
        if (!global.hasOwnProperty(p) ||
            (!isNaN(p) && p < global.length) ||
            (isIE && global[p] && global[p].parent === window))
            continue;
        // 遍历 iframe，检查 window 上的属性值是否是 iframe，是则跳过后面的 first 和 second 判断
        for (var i = 0; i < window.frames.length && !hasIframe; i++) {
            var frame = window.frames[i];
            if (frame === global[p]) {
                hasIframe = true;
                break;
            }
        }
        if (!hasIframe &&
            ((cnt === 0 && p !== firstGlobalProp) ||
                (cnt === 1 && p !== secondGlobalProp)))
            return p;
        cnt++;
        lastProp = p;
    }
    if (lastProp !== lastGlobalProp)
        return lastProp;
}
function noteGlobalProps(global) {
    // alternatively Object.keys(global).pop()
    // but this may be faster (pending benchmarks)
    firstGlobalProp = secondGlobalProp = undefined;
    for (var p in global) {
        try {
            if (!global.hasOwnProperty(p) ||
                (!isNaN(p) && p < global.length) ||
                (isIE && global[p] && global[p].parent === window))
                continue;
            if (!firstGlobalProp)
                firstGlobalProp = p;
            else if (!secondGlobalProp)
                secondGlobalProp = p;
            lastGlobalProp = p;
        }
        catch (er) {
            continue;
        }
    }
    return lastGlobalProp;
}
function getInlineCode(match) {
    var start = match.indexOf('>') + 1;
    var end = match.lastIndexOf('<');
    return match.substring(start, end);
}
function IEVersion() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
    var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
    if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp['$1']);
        if (fIEVersion == 7) {
            return 7;
        }
        else if (fIEVersion == 8) {
            return 8;
        }
        else if (fIEVersion == 9) {
            return 9;
        }
        else if (fIEVersion == 10) {
            return 10;
        }
        else {
            return 6; //IE版本<=7
        }
    }
    else if (isEdge) {
        return 'edge'; //edge
    }
    else if (isIE11) {
        return 11; //IE11
    }
    else {
        return -1; //不是ie浏览器
    }
}
function transHttpUrl(url, timestamp) {
    var arr = url.split('?');
    var version = timestamp ? '&version=' + timestamp + '' : '';
    if (arr.length > 1) {
        var _query = arr[1] + version;
        if (arr.length > 2) {
            var query = '?' + arr[2] + version;
            return arr[0] + '?' + arr[1] + query;
        }
        return arr[0] + '?' + _query;
    }
    else {
        var version = timestamp ? '?version=' + timestamp + '' : '';
        var _query = url + version;
        return _query;
    }
}

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-09-03 15:04
 */
/* import 'core-js/modules/es.string.ends-with'; */
var ALL_SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
var SCRIPT_TAG_REGEX = /<(script)\s+((?!type=('|')text\/ng-template\3).)*?>.*?<\/\1>/i;
var SCRIPT_SRC_REGEX = /.*\ssrc=('|")(\S+)\1.*/;
var SCRIPT_ENTRY_REGEX = /.*\sentry\s*.*/;
var SCRIPT_ASYNC_REGEX = /.*\sasync\s*.*/;
var LINK_TAG_REGEX = /<(link)\s+.*?>/gi;
var LINK_IGNORE_REGEX = /.*ignore\s*.*/;
var STYLE_TAG_REGEX = /<style[^>]*>[\s\S]*?<\/style>/gi;
var STYLE_TYPE_REGEX = /\s+rel=("|')stylesheet\1.*/;
var STYLE_HREF_REGEX = /.*\shref=('|")(\S+)\1.*/;
var STYLE_IGNORE_REGEX = /<style(\s+|\s+.+\s+)ignore(\s*|\s+.*)>/i;
var HTML_COMMENT_REGEX = /<!--([\s\S]*?)-->/g;
var SCRIPT_IGNORE_REGEX = /<script(\s+|\s+.+\s+)ignore(\s*|\s+.*)>/i;
function hasProtocol(url) {
    return (url.startsWith('//') ||
        url.startsWith('http://') ||
        url.startsWith('https://'));
}
function getBaseDomain(url) {
    var isIE = navigator.userAgent.indexOf('Trident') !== -1;
    if (isIE) {
        var reg = new RegExp('/' + '$');
        return reg.test(url) ? url.substr(0, url.length - 1) : url;
    }
    return url.endsWith('/') ? url.substr(0, url.length - 1) : url;
}
var genLinkReplaceSymbol = function (linkHref) {
    return '<!-- link ' + linkHref + ' replaced by import-html-entry -->';
};
/* export var genScriptReplaceSymbol = scriptSrc => `<!-- script ${scriptSrc} replaced by import-html-entry -->`;
export var inlineScriptReplaceSymbol = `<!-- inline scripts replaced by import-html-entry -->`; */
var genScriptReplaceSymbol = function (scriptSrc) {
    return '<!-- script ' + scriptSrc + ' replaced by import-html-entry -->';
};
var inlineScriptReplaceSymbol = '<!-- inline scripts replaced by import-html-entry -->';
var genIgnoreAssetReplaceSymbol = function (url) {
    return ('<!-- ignore asset ' + url || 'file' + ' replaced by import-html-entry -->');
};
/**
 * parse the script link from the template
 * TODO
 *    1. collect stylesheets
 *    2. use global eval to evaluate the inline scripts
 *        see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_varructor_and_function_declaration
 *        see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
 * @param tpl
 * @param domain
 * @stripStyles whether to strip the css links
 * @returns {{template: void | string | *, scripts: *[], entry: *}}
 */
function processTpl(tpl, domain) {
    var scripts = [];
    var styles = [];
    var entry = null;
    var template = tpl
        /*
            remove html comment first
            */
        .replace(HTML_COMMENT_REGEX, '')
        .replace(LINK_TAG_REGEX, function (match) {
        /*
              change the css link
              */
        var styleType = !!match.match(STYLE_TYPE_REGEX);
        if (styleType) {
            var styleHref = match.match(STYLE_HREF_REGEX);
            var styleIgnore = match.match(LINK_IGNORE_REGEX);
            if (styleHref) {
                var href = styleHref && styleHref[2];
                var newHref = href;
                if (href && !hasProtocol(href)) {
                    // 处理一下使用相对路径的场景
                    newHref =
                        getBaseDomain(domain) +
                            (href.startsWith('/') ? href : '/' + href + '');
                }
                if (styleIgnore) {
                    return genIgnoreAssetReplaceSymbol(newHref);
                }
                styles.push(newHref);
                return genLinkReplaceSymbol(newHref);
            }
        }
        /* var preloadOrPrefetchType = match.match(LINK_PRELOAD_OR_PREFETCH_REGEX) && match.match(LINK_HREF_REGEX);
              if (preloadOrPrefetchType) {
                  var [, , linkHref] = match.match(LINK_HREF_REGEX);
                  return genLinkReplaceSymbol(linkHref, true);
              } */
        return match;
    })
        .replace(STYLE_TAG_REGEX, function (match) {
        if (STYLE_IGNORE_REGEX.test(match)) {
            return genIgnoreAssetReplaceSymbol('style file');
        }
        return match;
    })
        .replace(ALL_SCRIPT_REGEX, function (match) {
        var scriptIgnore = match.match(SCRIPT_IGNORE_REGEX);
        // in order to keep the exec order of all javascripts
        // if it is a external script
        if (SCRIPT_TAG_REGEX.test(match) && match.match(SCRIPT_SRC_REGEX)) {
            /*
                    collect scripts and replace the ref
                    */
            var matchedScriptEntry = match.match(SCRIPT_ENTRY_REGEX);
            var matchedScriptSrcMatch = match.match(SCRIPT_SRC_REGEX);
            var matchedScriptSrc = matchedScriptSrcMatch && matchedScriptSrcMatch[2];
            if (entry && matchedScriptEntry) {
                throw new SyntaxError('You should not set multiply entry script!');
            }
            else {
                // append the domain while the script not have an protocol prefix
                if (matchedScriptSrc && !hasProtocol(matchedScriptSrc)) {
                    matchedScriptSrc =
                        getBaseDomain(domain) +
                            (matchedScriptSrc.startsWith('/')
                                ? matchedScriptSrc
                                : '/' + matchedScriptSrc + '');
                }
                entry = entry || (matchedScriptEntry && matchedScriptSrc);
            }
            if (scriptIgnore) {
                return genIgnoreAssetReplaceSymbol(matchedScriptSrc || 'js file');
            }
            if (matchedScriptSrc) {
                var asyncScript = !!match.match(SCRIPT_ASYNC_REGEX);
                /* scripts.push(matchedScriptSrc); */
                scripts.push(asyncScript
                    ? { async: true, src: matchedScriptSrc }
                    : matchedScriptSrc);
                return genScriptReplaceSymbol(matchedScriptSrc);
            }
            return match;
        }
        else {
            if (scriptIgnore) {
                return genIgnoreAssetReplaceSymbol('js file');
            }
            // if it is an inline script
            var code = getInlineCode(match);
            // remove script blocks when all of these lines are comments.
            var isPureCommentBlock = code.split(/[\r\n]+/).every(function (line) {
                return !line.trim() || line.trim().startsWith('//');
            });
            if (!isPureCommentBlock) {
                scripts.push(match);
            }
            return inlineScriptReplaceSymbol;
        }
    });
    scripts = scripts.filter(function (script) {
        // filter empty script
        return !!script;
    });
    return {
        template: template,
        scripts: scripts,
        styles: styles,
        // set the last script as entry if have not set
        entry: entry || scripts[scripts.length - 1],
    };
}

var styleCache = {};
var scriptCache = {};
var excludeFilesCache = {}; // 排除在沙箱之外代码文件列表
var embedHTMLCache = {};
var isMergeCache = {};
function getDomain(url) {
    try {
        // URL 构造函数不支持使用 // 前缀的 url
        var href = new URL(url.startsWith('//') ? '' + location.protocol + '' + url + '' : url);
        return href.origin;
    }
    catch (e) {
        return '';
    }
}
function getExecutableScript(scriptText, proxy) {
    /* window.proxy = proxy; */
    var isIE = window.ActiveXObject || 'ActiveXObject' in window;
    if (isIE) {
        return (';(function(window, self){;' +
            scriptText +
            '\n}).bind(window.proxy)(window.proxy, window.proxy);');
    }
    // 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
    // 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy
    var globalWindow = (0, eval)('window');
    globalWindow.proxy = proxy;
    /* return strictGlobal
      ? ';(function(window, self){with(window){;' +
          scriptText +
          '\n}}).bind(window.proxy)(window.proxy, window.proxy);'
      : ';(function(window, self){;' +
          scriptText +
          '\n}).bind(window.proxy)(window.proxy, window.proxy);'; */
    return (';(function(window, self){with(window){;' +
        scriptText +
        '\n}}).bind(window.proxy)(window.proxy, window.proxy);');
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
            html = html.replace(genLinkReplaceSymbol(styleSrc), '<style>/* ' + styleSrc + ' */' + styleSheets[i] + '</style>');
            return html;
        }, embedHTML);
        return embedHTML;
    });
}
// for prefetch
function getExternalStyleSheets(styles) {
    return Promise.all(styles.map(function (styleLink) {
        if (styleLink.startsWith('<')) {
            // if it is inline style
            return getInlineCode(styleLink);
        }
        else {
            // external styles
            return (styleCache[styleLink] ||
                (styleCache[styleLink] = whatwgFetch.fetch(styleLink).then(function (response) {
                    return response.text();
                })));
        }
    }));
}
// for prefetch
function getExternalScripts(scripts) {
    return Promise.all(scripts.map(function (script) {
        if (script.startsWith('<')) {
            // if it is inline script
            return getInlineCode(script);
        }
        else {
            // external script
            return (scriptCache[script] ||
                (scriptCache[script] = whatwgFetch.fetch(script).then(function (response) {
                    return response.text().then(function (result) {
                        return { scriptsText: result, scripts: script };
                    });
                })));
        }
    }));
}
/**
 *
 *
 * @param {*} entryMain 主JS脚本资源链接
 * @param {*} scripts ['JS脚本资源']
 * @param {*} [proxy=window]
 * @param {*} keys 模块URL ，一般是指入口资源链接
 * @returns
 */
function execScripts(entryMain, scripts, proxy, keys) {
    if (proxy === void 0) { proxy = window; }
    return getExternalScripts(scripts).then(function (scriptsText) {
        /* proxy = window; */ //entryMain 主JS脚本资源链接
        window.proxy = proxy; //scriptsText=[{scripts:'JS资源URL',scriptsText:'JS资源代码字符‘}]
        /* var geval = eval; */
        var entry = [];
        var strictGlobal = false;
        var geval = function (inlineScript) {
            var rawCode = inlineScript;
            var code = getExecutableScript(rawCode, proxy);
            (0, eval)(code);
        };
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
            if (excludeFilesCache[keys] &&
                Object.prototype.toString.call(excludeFilesCache[keys]) ===
                    '[object Array]' &&
                excludeFilesCache[keys].length) {
                for (var i = 0; i < excludeFilesCache[keys].length; i++) {
                    if (scriptSrc.indexOf(excludeFilesCache[keys][i]) < 0) {
                        entry.push(inlineScript);
                    }
                }
            }
            else {
                entry.push(inlineScript);
            }
            noteGlobalProps(proxy);
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
                    }
                    else {
                        /* geval(getExecutableScript(inlineScript, proxy)); */ // 躺平坑在启用
                        geval('' + inlineScript + '\n');
                        var exports = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
                        resolve(exports);
                    }
                }
                catch (e) {
                    console.error('error occurs while executing the entry ' + scriptSrc + '}');
                    /* console.error(e); */
                    throw e;
                }
            }
            else {
                if (typeof inlineScript === 'string') {
                    try {
                        if (isExcludeFile(scriptSrc)) {
                            /* geval(''+inlineScript+'\n'); */
                        }
                        else {
                            /*  geval(getExecutableScript(inlineScript, proxy)); */
                            geval('' + inlineScript + '\n');
                        }
                        /* geval(';(function(window){;'+inlineScript+'\n}).bind(window.proxy)(window.proxy);'); */
                    }
                    catch (e) {
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
                        /* geval(getExecutableScript(entry.join(' '), proxy)); */
                        /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
                        /* geval(';(function(window){;'+entry.join(' ')+'\n})(window.proxy);'); */
                        geval(entry.join(' '));
                    }
                    else {
                        /* geval(getExecutableScript(entry.join(' '),proxy)); */
                        geval(entry.join(' '));
                        /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
                    }
                    /* var exports = proxy[getGlobalProp(proxy)] || {}; */
                    resolve(strictGlobal ? proxy : window);
                }
                else {
                    geval(entry.join(' '));
                    /* geval(getExecutableScript(entry.join(' '), proxy)); */
                    // geval(';(function(window){;'+entry.join(' ')+'\n})(window);');
                    var exports = proxy[getGlobalProp(strictGlobal ? proxy : window)] || {};
                    resolve(exports);
                }
            }
            catch (e) {
                console.error('error occurs while executing the entry ' + entry.join(' ') + '');
                console.error(e);
            }
        }
        function schedule(i, resolvePromise) {
            if (i < scripts.length) {
                var scriptSrc = scripts[i];
                var inlineScript = scriptsText[i]['scriptsText'];
                if (isMergeCache[keys]) {
                    // 收集需要合并执行的js代码
                    collectInlineScript(scriptSrc, inlineScript);
                    schedule(i + 1, resolvePromise);
                }
                else {
                    exec(scriptSrc, inlineScript, resolvePromise);
                    if (!entryMain && i === scripts.length - 1) {
                        resolvePromise();
                    }
                    else {
                        schedule(i + 1, resolvePromise);
                    }
                }
            }
            else {
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
function importHTML(url, options) {
    /* var getPublicPath = defaultGetPublicPath; */
    if (options && typeof options === 'object') {
        isMergeCache[url] = true;
        if (options.excludeFiles !== undefined &&
            Array.isArray(options.excludeFiles)) {
            excludeFilesCache[url] = options.excludeFiles; // 排除在沙箱之外的js文件列表
        }
        if (options.isMerge !== undefined && typeof options.isMerge === 'boolean') {
            isMergeCache[url] = options.isMerge;
        }
        /* getPublicPath = options.getPublicPath || options.getDomain || defaultGetPublicPath; */
    }
    return (embedHTMLCache[url] ||
        /* (embedHTMLCache[url] = axios.get(url+'?version='+Date.parse(new Date().toString())+'') */
        (embedHTMLCache[url] = whatwgFetch.fetch(transHttpUrl(url, Date.parse(new Date().toString())))
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
                    assetPublicPath: assetPublicPath,
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
                        if (excludeFiles &&
                            Object.prototype.toString.call(excludeFiles) ===
                                '[object Array]') {
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
        })));
}
function importEntry(entry) {
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
    }
    else {
        throw new SyntaxError('entry scripts or styles should be array!');
    }
}

Object.defineProperty(exports, 'fetch', {
  enumerable: true,
  get: function () {
    return whatwgFetch.fetch;
  }
});
exports.execScripts = execScripts;
exports.importEntry = importEntry;
exports.importHTML = importHTML;
