/**
  *  legions-import-html-entry v0.0.5
  * (c) 2020 duanguang
  * @license MIT
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('core-js/modules/es6.weak-map')) :
	typeof define === 'function' && define.amd ? define(['exports', 'core-js/modules/es6.weak-map'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.importHTML = {}));
}(this, (function (exports) { 'use strict';

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
	        if (!hasIframe && (cnt === 0 && p !== firstGlobalProp || cnt === 1 && p !== secondGlobalProp))
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

	/**
	 * @author Kuitos
	 * @homepage https://github.com/kuitos/
	 * @since 2018-09-03 15:04
	 */
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
	    return url.startsWith('//') || url.startsWith('http://') || url.startsWith('https://');
	}
	function getBaseDomain(url) {
	    var isIE = navigator.userAgent.indexOf('Trident') !== -1;
	    if (isIE) {
	        var reg = new RegExp('/' + "$");
	        return reg.test(url) ? url.substr(0, url.length - 1) : url;
	    }
	    return url.endsWith('/') ? url.substr(0, url.length - 1) : url;
	}
	var genLinkReplaceSymbol = function (linkHref) { return '<!-- link ' + linkHref + ' replaced by import-html-entry -->'; };
	/* export var genScriptReplaceSymbol = scriptSrc => `<!-- script ${scriptSrc} replaced by import-html-entry -->`;
	export var inlineScriptReplaceSymbol = `<!-- inline scripts replaced by import-html-entry -->`; */
	var genScriptReplaceSymbol = function (scriptSrc) { return '<!-- script ' + scriptSrc + ' replaced by import-html-entry -->'; };
	var inlineScriptReplaceSymbol = '<!-- inline scripts replaced by import-html-entry -->';
	var genIgnoreAssetReplaceSymbol = function (url) { return '<!-- ignore asset ' + url || 'file' + ' replaced by import-html-entry -->'; };
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
	                    newHref = getBaseDomain(domain) + (href.startsWith('/') ? href : '/' + href + '');
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
	                    matchedScriptSrc = getBaseDomain(domain) + (matchedScriptSrc.startsWith('/') ? matchedScriptSrc : '/' + matchedScriptSrc + '');
	                }
	                entry = entry || matchedScriptEntry && matchedScriptSrc;
	            }
	            if (scriptIgnore) {
	                return genIgnoreAssetReplaceSymbol(matchedScriptSrc || 'js file');
	            }
	            if (matchedScriptSrc) {
	                var asyncScript = !!match.match(SCRIPT_ASYNC_REGEX);
	                /* scripts.push(matchedScriptSrc); */
	                scripts.push(asyncScript ? { async: true, src: matchedScriptSrc } : matchedScriptSrc);
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
	            var isPureCommentBlock = code.split(/[\r\n]+/).every(function (line) { return !line.trim() || line.trim().startsWith('//'); });
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

	var global =
	  (typeof globalThis !== 'undefined' && globalThis) ||
	  (typeof self !== 'undefined' && self) ||
	  (typeof global !== 'undefined' && global);

	var support = {
	  searchParams: 'URLSearchParams' in global,
	  iterable: 'Symbol' in global && 'iterator' in Symbol,
	  blob:
	    'FileReader' in global &&
	    'Blob' in global &&
	    (function() {
	      try {
	        new Blob();
	        return true
	      } catch (e) {
	        return false
	      }
	    })(),
	  formData: 'FormData' in global,
	  arrayBuffer: 'ArrayBuffer' in global
	};

	function isDataView(obj) {
	  return obj && DataView.prototype.isPrototypeOf(obj)
	}

	if (support.arrayBuffer) {
	  var viewClasses = [
	    '[object Int8Array]',
	    '[object Uint8Array]',
	    '[object Uint8ClampedArray]',
	    '[object Int16Array]',
	    '[object Uint16Array]',
	    '[object Int32Array]',
	    '[object Uint32Array]',
	    '[object Float32Array]',
	    '[object Float64Array]'
	  ];

	  var isArrayBufferView =
	    ArrayBuffer.isView ||
	    function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    };
	}

	function normalizeName(name) {
	  if (typeof name !== 'string') {
	    name = String(name);
	  }
	  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
	    throw new TypeError('Invalid character in header field name')
	  }
	  return name.toLowerCase()
	}

	function normalizeValue(value) {
	  if (typeof value !== 'string') {
	    value = String(value);
	  }
	  return value
	}

	// Build a destructive iterator for the value list
	function iteratorFor(items) {
	  var iterator = {
	    next: function() {
	      var value = items.shift();
	      return {done: value === undefined, value: value}
	    }
	  };

	  if (support.iterable) {
	    iterator[Symbol.iterator] = function() {
	      return iterator
	    };
	  }

	  return iterator
	}

	function Headers(headers) {
	  this.map = {};

	  if (headers instanceof Headers) {
	    headers.forEach(function(value, name) {
	      this.append(name, value);
	    }, this);
	  } else if (Array.isArray(headers)) {
	    headers.forEach(function(header) {
	      this.append(header[0], header[1]);
	    }, this);
	  } else if (headers) {
	    Object.getOwnPropertyNames(headers).forEach(function(name) {
	      this.append(name, headers[name]);
	    }, this);
	  }
	}

	Headers.prototype.append = function(name, value) {
	  name = normalizeName(name);
	  value = normalizeValue(value);
	  var oldValue = this.map[name];
	  this.map[name] = oldValue ? oldValue + ', ' + value : value;
	};

	Headers.prototype['delete'] = function(name) {
	  delete this.map[normalizeName(name)];
	};

	Headers.prototype.get = function(name) {
	  name = normalizeName(name);
	  return this.has(name) ? this.map[name] : null
	};

	Headers.prototype.has = function(name) {
	  return this.map.hasOwnProperty(normalizeName(name))
	};

	Headers.prototype.set = function(name, value) {
	  this.map[normalizeName(name)] = normalizeValue(value);
	};

	Headers.prototype.forEach = function(callback, thisArg) {
	  for (var name in this.map) {
	    if (this.map.hasOwnProperty(name)) {
	      callback.call(thisArg, this.map[name], name, this);
	    }
	  }
	};

	Headers.prototype.keys = function() {
	  var items = [];
	  this.forEach(function(value, name) {
	    items.push(name);
	  });
	  return iteratorFor(items)
	};

	Headers.prototype.values = function() {
	  var items = [];
	  this.forEach(function(value) {
	    items.push(value);
	  });
	  return iteratorFor(items)
	};

	Headers.prototype.entries = function() {
	  var items = [];
	  this.forEach(function(value, name) {
	    items.push([name, value]);
	  });
	  return iteratorFor(items)
	};

	if (support.iterable) {
	  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
	}

	function consumed(body) {
	  if (body.bodyUsed) {
	    return Promise.reject(new TypeError('Already read'))
	  }
	  body.bodyUsed = true;
	}

	function fileReaderReady(reader) {
	  return new Promise(function(resolve, reject) {
	    reader.onload = function() {
	      resolve(reader.result);
	    };
	    reader.onerror = function() {
	      reject(reader.error);
	    };
	  })
	}

	function readBlobAsArrayBuffer(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsArrayBuffer(blob);
	  return promise
	}

	function readBlobAsText(blob) {
	  var reader = new FileReader();
	  var promise = fileReaderReady(reader);
	  reader.readAsText(blob);
	  return promise
	}

	function readArrayBufferAsText(buf) {
	  var view = new Uint8Array(buf);
	  var chars = new Array(view.length);

	  for (var i = 0; i < view.length; i++) {
	    chars[i] = String.fromCharCode(view[i]);
	  }
	  return chars.join('')
	}

	function bufferClone(buf) {
	  if (buf.slice) {
	    return buf.slice(0)
	  } else {
	    var view = new Uint8Array(buf.byteLength);
	    view.set(new Uint8Array(buf));
	    return view.buffer
	  }
	}

	function Body() {
	  this.bodyUsed = false;

	  this._initBody = function(body) {
	    /*
	      fetch-mock wraps the Response object in an ES6 Proxy to
	      provide useful test harness features such as flush. However, on
	      ES5 browsers without fetch or Proxy support pollyfills must be used;
	      the proxy-pollyfill is unable to proxy an attribute unless it exists
	      on the object before the Proxy is created. This change ensures
	      Response.bodyUsed exists on the instance, while maintaining the
	      semantic of setting Request.bodyUsed in the constructor before
	      _initBody is called.
	    */
	    this.bodyUsed = this.bodyUsed;
	    this._bodyInit = body;
	    if (!body) {
	      this._bodyText = '';
	    } else if (typeof body === 'string') {
	      this._bodyText = body;
	    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	      this._bodyBlob = body;
	    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	      this._bodyFormData = body;
	    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	      this._bodyText = body.toString();
	    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	      this._bodyArrayBuffer = bufferClone(body.buffer);
	      // IE 10-11 can't handle a DataView body.
	      this._bodyInit = new Blob([this._bodyArrayBuffer]);
	    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	      this._bodyArrayBuffer = bufferClone(body);
	    } else {
	      this._bodyText = body = Object.prototype.toString.call(body);
	    }

	    if (!this.headers.get('content-type')) {
	      if (typeof body === 'string') {
	        this.headers.set('content-type', 'text/plain;charset=UTF-8');
	      } else if (this._bodyBlob && this._bodyBlob.type) {
	        this.headers.set('content-type', this._bodyBlob.type);
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
	      }
	    }
	  };

	  if (support.blob) {
	    this.blob = function() {
	      var rejected = consumed(this);
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return Promise.resolve(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as blob')
	      } else {
	        return Promise.resolve(new Blob([this._bodyText]))
	      }
	    };

	    this.arrayBuffer = function() {
	      if (this._bodyArrayBuffer) {
	        var isConsumed = consumed(this);
	        if (isConsumed) {
	          return isConsumed
	        }
	        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
	          return Promise.resolve(
	            this._bodyArrayBuffer.buffer.slice(
	              this._bodyArrayBuffer.byteOffset,
	              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
	            )
	          )
	        } else {
	          return Promise.resolve(this._bodyArrayBuffer)
	        }
	      } else {
	        return this.blob().then(readBlobAsArrayBuffer)
	      }
	    };
	  }

	  this.text = function() {
	    var rejected = consumed(this);
	    if (rejected) {
	      return rejected
	    }

	    if (this._bodyBlob) {
	      return readBlobAsText(this._bodyBlob)
	    } else if (this._bodyArrayBuffer) {
	      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	    } else if (this._bodyFormData) {
	      throw new Error('could not read FormData body as text')
	    } else {
	      return Promise.resolve(this._bodyText)
	    }
	  };

	  if (support.formData) {
	    this.formData = function() {
	      return this.text().then(decode)
	    };
	  }

	  this.json = function() {
	    return this.text().then(JSON.parse)
	  };

	  return this
	}

	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	function normalizeMethod(method) {
	  var upcased = method.toUpperCase();
	  return methods.indexOf(upcased) > -1 ? upcased : method
	}

	function Request(input, options) {
	  if (!(this instanceof Request)) {
	    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
	  }

	  options = options || {};
	  var body = options.body;

	  if (input instanceof Request) {
	    if (input.bodyUsed) {
	      throw new TypeError('Already read')
	    }
	    this.url = input.url;
	    this.credentials = input.credentials;
	    if (!options.headers) {
	      this.headers = new Headers(input.headers);
	    }
	    this.method = input.method;
	    this.mode = input.mode;
	    this.signal = input.signal;
	    if (!body && input._bodyInit != null) {
	      body = input._bodyInit;
	      input.bodyUsed = true;
	    }
	  } else {
	    this.url = String(input);
	  }

	  this.credentials = options.credentials || this.credentials || 'same-origin';
	  if (options.headers || !this.headers) {
	    this.headers = new Headers(options.headers);
	  }
	  this.method = normalizeMethod(options.method || this.method || 'GET');
	  this.mode = options.mode || this.mode || null;
	  this.signal = options.signal || this.signal;
	  this.referrer = null;

	  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	    throw new TypeError('Body not allowed for GET or HEAD requests')
	  }
	  this._initBody(body);

	  if (this.method === 'GET' || this.method === 'HEAD') {
	    if (options.cache === 'no-store' || options.cache === 'no-cache') {
	      // Search for a '_' parameter in the query string
	      var reParamSearch = /([?&])_=[^&]*/;
	      if (reParamSearch.test(this.url)) {
	        // If it already exists then set the value with the current time
	        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime());
	      } else {
	        // Otherwise add a new '_' parameter to the end with the current time
	        var reQueryString = /\?/;
	        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime();
	      }
	    }
	  }
	}

	Request.prototype.clone = function() {
	  return new Request(this, {body: this._bodyInit})
	};

	function decode(body) {
	  var form = new FormData();
	  body
	    .trim()
	    .split('&')
	    .forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=');
	        var name = split.shift().replace(/\+/g, ' ');
	        var value = split.join('=').replace(/\+/g, ' ');
	        form.append(decodeURIComponent(name), decodeURIComponent(value));
	      }
	    });
	  return form
	}

	function parseHeaders(rawHeaders) {
	  var headers = new Headers();
	  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
	  // https://tools.ietf.org/html/rfc7230#section-3.2
	  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
	  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
	    var parts = line.split(':');
	    var key = parts.shift().trim();
	    if (key) {
	      var value = parts.join(':').trim();
	      headers.append(key, value);
	    }
	  });
	  return headers
	}

	Body.call(Request.prototype);

	function Response(bodyInit, options) {
	  if (!(this instanceof Response)) {
	    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
	  }
	  if (!options) {
	    options = {};
	  }

	  this.type = 'default';
	  this.status = options.status === undefined ? 200 : options.status;
	  this.ok = this.status >= 200 && this.status < 300;
	  this.statusText = 'statusText' in options ? options.statusText : '';
	  this.headers = new Headers(options.headers);
	  this.url = options.url || '';
	  this._initBody(bodyInit);
	}

	Body.call(Response.prototype);

	Response.prototype.clone = function() {
	  return new Response(this._bodyInit, {
	    status: this.status,
	    statusText: this.statusText,
	    headers: new Headers(this.headers),
	    url: this.url
	  })
	};

	Response.error = function() {
	  var response = new Response(null, {status: 0, statusText: ''});
	  response.type = 'error';
	  return response
	};

	var redirectStatuses = [301, 302, 303, 307, 308];

	Response.redirect = function(url, status) {
	  if (redirectStatuses.indexOf(status) === -1) {
	    throw new RangeError('Invalid status code')
	  }

	  return new Response(null, {status: status, headers: {location: url}})
	};

	var DOMException = global.DOMException;
	try {
	  new DOMException();
	} catch (err) {
	  DOMException = function(message, name) {
	    this.message = message;
	    this.name = name;
	    var error = Error(message);
	    this.stack = error.stack;
	  };
	  DOMException.prototype = Object.create(Error.prototype);
	  DOMException.prototype.constructor = DOMException;
	}

	function fetch(input, init) {
	  return new Promise(function(resolve, reject) {
	    var request = new Request(input, init);

	    if (request.signal && request.signal.aborted) {
	      return reject(new DOMException('Aborted', 'AbortError'))
	    }

	    var xhr = new XMLHttpRequest();

	    function abortXhr() {
	      xhr.abort();
	    }

	    xhr.onload = function() {
	      var options = {
	        status: xhr.status,
	        statusText: xhr.statusText,
	        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	      };
	      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
	      var body = 'response' in xhr ? xhr.response : xhr.responseText;
	      setTimeout(function() {
	        resolve(new Response(body, options));
	      }, 0);
	    };

	    xhr.onerror = function() {
	      setTimeout(function() {
	        reject(new TypeError('Network request failed'));
	      }, 0);
	    };

	    xhr.ontimeout = function() {
	      setTimeout(function() {
	        reject(new TypeError('Network request failed'));
	      }, 0);
	    };

	    xhr.onabort = function() {
	      setTimeout(function() {
	        reject(new DOMException('Aborted', 'AbortError'));
	      }, 0);
	    };

	    function fixUrl(url) {
	      try {
	        return url === '' && global.location.href ? global.location.href : url
	      } catch (e) {
	        return url
	      }
	    }

	    xhr.open(request.method, fixUrl(request.url), true);

	    if (request.credentials === 'include') {
	      xhr.withCredentials = true;
	    } else if (request.credentials === 'omit') {
	      xhr.withCredentials = false;
	    }

	    if ('responseType' in xhr) {
	      if (support.blob) {
	        xhr.responseType = 'blob';
	      } else if (
	        support.arrayBuffer &&
	        request.headers.get('Content-Type') &&
	        request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
	      ) {
	        xhr.responseType = 'arraybuffer';
	      }
	    }

	    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
	      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
	        xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
	      });
	    } else {
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value);
	      });
	    }

	    if (request.signal) {
	      request.signal.addEventListener('abort', abortXhr);

	      xhr.onreadystatechange = function() {
	        // DONE (success or failure)
	        if (xhr.readyState === 4) {
	          request.signal.removeEventListener('abort', abortXhr);
	        }
	      };
	    }

	    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
	  })
	}

	fetch.polyfill = true;

	if (!global.fetch) {
	  global.fetch = fetch;
	  global.Headers = Headers;
	  global.Request = Request;
	  global.Response = Response;
	}

	var styleCache = {};
	var scriptCache = {};
	var isWith = false;
	var excludeFilesCache = {}; // 排除在沙箱之外代码文件列表
	var embedHTMLCache = {};
	var isMergeCache = {};
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
	    window.proxy = proxy;
	    var isIE = window.ActiveXObject || 'ActiveXObject' in window;
	    if (isIE) {
	        return (';(function(window, self){;' +
	            scriptText +
	            '\n}).bind(window.proxy)(window.proxy, window.proxy);');
	    }
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
	                (styleCache[styleLink] = fetch(styleLink).then(function (response) {
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
	                (scriptCache[script] = fetch(script).then(function (response) {
	                    return { scriptsText: response.text(), scripts: script };
	                })));
	        }
	    }));
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
	            if (excludeFilesCache[keys] &&
	                Object.prototype.toString.call(excludeFilesCache[keys]) ===
	                    '[object Array]') {
	                for (var i = 0; i < excludeFilesCache[keys].length; i++) {
	                    if (scriptSrc.indexOf(excludeFilesCache[keys][i]) < 0) {
	                        entry.push(inlineScript);
	                    }
	                }
	            }
	            else {
	                entry.push(inlineScript);
	            }
	            noteGlobalProps();
	            var exports = proxy[getGlobalProp()] || {};
	            resolve(exports);
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
	                        geval(getExecutableScript(inlineScript, proxy));
	                    }
	                }
	                catch (e) {
	                    console.error('error occurs while executing the entry ' + scriptSrc + '}');
	                    /* console.error(e); */
	                    throw e;
	                }
	                var exports = proxy[getGlobalProp(proxy)] || {};
	                resolve(exports);
	            }
	            else {
	                if (typeof inlineScript === 'string') {
	                    try {
	                        if (isExcludeFile(scriptSrc)) {
	                            /* geval(''+inlineScript+'\n'); */
	                        }
	                        else {
	                            geval(getExecutableScript(inlineScript, proxy));
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
	        function collectExec() {
	            try {
	                var isIE = window.ActiveXObject || 'ActiveXObject' in window;
	                if (isIE) {
	                    if (IEVersion() < 11) {
	                        geval(getExecutableScript(entry.join(' '), proxy));
	                        /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
	                        /* geval(';(function(window){;'+entry.join(' ')+'\n})(window.proxy);'); */
	                    }
	                    else {
	                        /* var compileCodes= function(src) {
	                                        var code = new Function('sandbox', src)
	                                        return function(sandbox) {
	                                            return code(sandbox)
	                                        }
	                                    }
	                                    compileCodes(''+entry.join(' ')+'')(window.proxy); */
	                        geval(getExecutableScript(entry.join(' '), proxy));
	                        /* geval(';(function(window){;'+entry.join(' ')+'\n}).bind(window.proxy)(window.proxy);'); */
	                    }
	                }
	                else {
	                    /* compileCode(''+entry.join(' ')+'').bind(window.proxy)(window.proxy); */
	                    geval(getExecutableScript(entry.join(' '), proxy));
	                    // geval(';(function(window){;'+entry.join(' ')+'\n})(window);');
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
	                    collectInlineScript(scriptSrc, inlineScript, resolvePromise);
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
	                    collectExec();
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
	        if (options.isWith !== undefined) {
	            isWith = options.isWith;
	        }
	        if (options.excludeFiles !== undefined &&
	            Array.isArray(options.excludeFiles)) {
	            excludeFilesCache[url] = options.excludeFiles; // 排除在沙箱之外的js文件列表
	        }
	        if (options.isMerge !== undefined && typeof options.isMerge === 'boolean') {
	            isMergeCache[url] = options.isMerge;
	        }
	        /* getPublicPath = options.getPublicPath || options.getDomain || defaultGetPublicPath; */
	    }
	    var transHttpUrl = function (url, timestamp) {
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
	    };
	    return (embedHTMLCache[url] ||
	        /* (embedHTMLCache[url] = axios.get(url+'?version='+Date.parse(new Date().toString())+'') */
	        (embedHTMLCache[url] = fetch(transHttpUrl(url, Date.parse(new Date().toString())))
	            .then(function (response) {
	            return response.text();
	        })
	            .then(function (html) {
	            /* var assetPublicPath = getPublicPath(url); */
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
	                    /* assetPublicPath, */
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
	                /* assetPublicPath: getPublicPath('/'), */
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

	exports.default = importHTML;
	exports.importEntry = importEntry;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
