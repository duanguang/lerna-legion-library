/**
 * egg-decoratorers v0.0.3
 * (c) 2020 duanguang
 * @license MIT
 */
import { reaction } from 'mobx';
import { getInjector } from 'brain-store';
import { ObservablePromiseModel } from 'brain-store-utils';
import { message, Modal } from 'antd';
import React from 'react';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var NProgress = {};

NProgress.version = '0.2.0';

var Settings = (NProgress.settings = {
  minimum: 0.08,
  easing: 'linear',
  positionUsing: '',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  showSpinner: true,
  barSelector: '[role="bar"]',
  spinnerSelector: '[role="spinner"]',
  parent: 'body',
  template:
    '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
});

/**
 * Updates configuration.
 *
 *     NProgress.configure({
 *       minimum: 0.1
 *     });
 */
NProgress.configure = function (options) {
  var key, value;
  for (key in options) {
    value = options[key];
    if (value !== undefined && options.hasOwnProperty(key))
      Settings[key] = value;
  }

  return this;
};

/**
 * Last number.
 */

NProgress.status = null;

/**
 * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
 *
 *     NProgress.set(0.4);
 *     NProgress.set(1.0);
 */

NProgress.set = function (n) {
  var started = NProgress.isStarted();

  n = clamp(n, Settings.minimum, 1);
  NProgress.status = n === 1 ? null : n;

  var progress = NProgress.render(!started),
    bar = progress.querySelector(Settings.barSelector),
    speed = Settings.speed,
    ease = Settings.easing;

  progress.offsetWidth; /* Repaint */

  queue(function (next) {
    // Set positionUsing if it hasn't already been set
    if (Settings.positionUsing === '')
      Settings.positionUsing = NProgress.getPositioningCSS();

    // Add transition
    css(bar, barPositionCSS(n, speed, ease));

    if (n === 1) {
      // Fade out
      css(progress, {
        transition: 'none',
        opacity: 1,
      });
      progress.offsetWidth; /* Repaint */

      setTimeout(function () {
        css(progress, {
          transition: 'all ' + speed + 'ms linear',
          opacity: 0,
        });
        setTimeout(function () {
          NProgress.remove();
          next();
        }, speed);
      }, speed);
    } else {
      setTimeout(next, speed);
    }
  });

  return this;
};

NProgress.isStarted = function () {
  return typeof NProgress.status === 'number';
};

/**
 * Shows the progress bar.
 * This is the same as setting the status to 0%, except that it doesn't go backwards.
 *
 *     NProgress.start();
 *
 */
NProgress.start = function () {
  if (!NProgress.status) NProgress.set(0);

  var work = function () {
    setTimeout(function () {
      if (!NProgress.status) return;
      NProgress.trickle();
      work();
    }, Settings.trickleSpeed);
  };

  if (Settings.trickle) work();

  return this;
};

/**
 * Hides the progress bar.
 * This is the *sort of* the same as setting the status to 100%, with the
 * difference being `done()` makes some placebo effect of some realistic motion.
 *
 *     NProgress.done();
 *
 * If `true` is passed, it will show the progress bar even if its hidden.
 *
 *     NProgress.done(true);
 */

NProgress.done = function (force) {
  if (!force && !NProgress.status) return this;

  return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
};

/**
 * Increments by a random amount.
 */

NProgress.inc = function (amount) {
  var n = NProgress.status;

  if (!n) {
    return NProgress.start();
  } else if (n > 1) {
    return;
  } else {
    if (typeof amount !== 'number') {
      if (n >= 0 && n < 0.2) {
        amount = 0.1;
      } else if (n >= 0.2 && n < 0.5) {
        amount = 0.04;
      } else if (n >= 0.5 && n < 0.8) {
        amount = 0.02;
      } else if (n >= 0.8 && n < 0.99) {
        amount = 0.005;
      } else {
        amount = 0;
      }
    }

    n = clamp(n + amount, 0, 0.994);
    return NProgress.set(n);
  }
};

NProgress.trickle = function () {
  return NProgress.inc();
};

/**
 * Waits for all supplied jQuery promises and
 * increases the progress as the promises resolve.
 *
 * @param $promise jQUery Promise
 */
(function () {
  var initial = 0,
    current = 0;

  NProgress.promise = function ($promise) {
    if (!$promise || $promise.state() === 'resolved') {
      return this;
    }

    if (current === 0) {
      NProgress.start();
    }

    initial++;
    current++;

    $promise.always(function () {
      current--;
      if (current === 0) {
        initial = 0;
        NProgress.done();
      } else {
        NProgress.set((initial - current) / initial);
      }
    });

    return this;
  };
})();

/**
 * (Internal) renders the progress bar markup based on the `template`
 * setting.
 */

NProgress.render = function (fromStart) {
  if (NProgress.isRendered()) return document.getElementById('nprogress');

  addClass(document.documentElement, 'nprogress-busy');

  var progress = document.createElement('div');
  progress.id = 'nprogress';
  progress.innerHTML = Settings.template;

  var bar = progress.querySelector(Settings.barSelector),
    perc = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
    parent = document.querySelector(Settings.parent),
    spinner;

  css(bar, {
    transition: 'all 0 linear',
    transform: 'translate3d(' + perc + '%,0,0)',
  });

  if (!Settings.showSpinner) {
    spinner = progress.querySelector(Settings.spinnerSelector);
    spinner && removeElement(spinner);
  }

  if (parent != document.body) {
    addClass(parent, 'nprogress-custom-parent');
  }

  parent.appendChild(progress);
  return progress;
};

/**
 * Removes the element. Opposite of render().
 */

NProgress.remove = function () {
  removeClass(document.documentElement, 'nprogress-busy');
  removeClass(
    document.querySelector(Settings.parent),
    'nprogress-custom-parent'
  );
  var progress = document.getElementById('nprogress');
  progress && removeElement(progress);
};

/**
 * Checks if the progress bar is rendered.
 */

NProgress.isRendered = function () {
  return !!document.getElementById('nprogress');
};

/**
 * Determine which positioning CSS rule to use.
 */

NProgress.getPositioningCSS = function () {
  // Sniff on document.body.style
  var bodyStyle = document.body.style;

  // Sniff prefixes
  var vendorPrefix =
    'WebkitTransform' in bodyStyle
      ? 'Webkit'
      : 'MozTransform' in bodyStyle
      ? 'Moz'
      : 'msTransform' in bodyStyle
      ? 'ms'
      : 'OTransform' in bodyStyle
      ? 'O'
      : '';

  if (vendorPrefix + 'Perspective' in bodyStyle) {
    // Modern browsers with 3D support, e.g. Webkit, IE10
    return 'translate3d';
  } else if (vendorPrefix + 'Transform' in bodyStyle) {
    // Browsers without 3D support, e.g. IE9
    return 'translate';
  } else {
    // Browsers without translate() support, e.g. IE7-8
    return 'margin';
  }
};

/**
 * Helpers
 */

function clamp(n, min, max) {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

/**
 * (Internal) converts a percentage (`0..1`) to a bar translateX
 * percentage (`-100%..0%`).
 */

function toBarPerc(n) {
  return (-1 + n) * 100;
}

/**
 * (Internal) returns the correct CSS for changing the bar's
 * position given an n percentage, and speed and ease from Settings
 */

function barPositionCSS(n, speed, ease) {
  var barCSS;

  if (Settings.positionUsing === 'translate3d') {
    barCSS = { transform: 'translate3d(' + toBarPerc(n) + '%,0,0)' };
  } else if (Settings.positionUsing === 'translate') {
    barCSS = { transform: 'translate(' + toBarPerc(n) + '%,0)' };
  } else {
    barCSS = { 'margin-left': toBarPerc(n) + '%' };
  }

  barCSS.transition = 'all ' + speed + 'ms ' + ease;

  return barCSS;
}

/**
 * (Internal) Queues a function to be executed.
 */

var queue = (function () {
  var pending = [];

  function next() {
    var fn = pending.shift();
    if (fn) {
      fn(next);
    }
  }

  return function (fn) {
    pending.push(fn);
    if (pending.length == 1) next();
  };
})();

/**
 * (Internal) Applies css properties to an element, similar to the jQuery
 * css method.
 *
 * While this helper does assist with vendor prefixed property names, it
 * does not perform any manipulation of values prior to setting styles.
 */

var css = (function () {
  var cssPrefixes = ['Webkit', 'O', 'Moz', 'ms'],
    cssProps = {};

  function camelCase(string) {
    return string
      .replace(/^-ms-/, 'ms-')
      .replace(/-([\da-z])/gi, function (match, letter) {
        return letter.toUpperCase();
      });
  }

  function getVendorProp(name) {
    var style = document.body.style;
    if (name in style) return name;

    var i = cssPrefixes.length,
      capName = name.charAt(0).toUpperCase() + name.slice(1),
      vendorName;
    while (i--) {
      vendorName = cssPrefixes[i] + capName;
      if (vendorName in style) return vendorName;
    }

    return name;
  }

  function getStyleProp(name) {
    name = camelCase(name);
    return cssProps[name] || (cssProps[name] = getVendorProp(name));
  }

  function applyCss(element, prop, value) {
    prop = getStyleProp(prop);
    element.style[prop] = value;
  }

  return function (element, properties) {
    var args = arguments,
      prop,
      value;

    if (args.length == 2) {
      for (prop in properties) {
        value = properties[prop];
        if (value !== undefined && properties.hasOwnProperty(prop))
          applyCss(element, prop, value);
      }
    } else {
      applyCss(element, args[1], args[2]);
    }
  };
})();

/**
 * (Internal) Determines if an element or space separated list of class names contains a class name.
 */

function hasClass(element, name) {
  var list = typeof element == 'string' ? element : classList(element);
  return list.indexOf(' ' + name + ' ') >= 0;
}

/**
 * (Internal) Adds a class to an element.
 */

function addClass(element, name) {
  var oldList = classList(element),
    newList = oldList + name;

  if (hasClass(oldList, name)) return;

  // Trim the opening space.
  element.className = newList.substring(1);
}

/**
 * (Internal) Removes a class from an element.
 */

function removeClass(element, name) {
  var oldList = classList(element),
    newList;

  if (!hasClass(element, name)) return;

  // Replace the class name.
  newList = oldList.replace(' ' + name + ' ', ' ');

  // Trim the opening and closing spaces.
  element.className = newList.substring(1, newList.length - 1);
}

/**
 * (Internal) Gets a space separated list of the class names on the element.
 * The list is wrapped with a single space on each end to facilitate finding
 * matches within the list.
 */

function classList(element) {
  return (' ' + ((element && element.className) || '') + ' ').replace(
    /\s+/gi,
    ' '
  );
}

/**
 * (Internal) Removes an element from the DOM.
 */

function removeElement(element) {
  element && element.parentNode && element.parentNode.removeChild(element);
}

var invariant = require('invariant');
/**
* 操作数据后，根据接口结果自动弹出提示信息
*T:组件实例
* S：Store实例约束
* @export
* @param {IAutoMessage} options
*/
function submittingAutoMessage(options) {
    return function (target, key, descriptor) {
        var oldValue = descriptor.value;
        options.store = options.store || 'store';
        options.type = options.type || 'message';
        descriptor.ReactionList = [];
        descriptor.value = function () {
            var _this = this;
            var that = this;
            var props = that.props || {};
            var viewStore = props[options.store];
            if (typeof options.store !== 'string') {
                var stores = getInjector();
                viewStore = stores.getState(options.store);
            }
            invariant(viewStore, "submittingAutoMessage[" + target.constructor.name + "-\u81EA\u52A8\u5F39\u51FA\u63D0\u793A\u64CD\u4F5C\u4FE1\u606F]:\u60A8\u7684\u7EC4\u4EF6\u5B9E\u4F8B\u6CA1\u6709store\u53D8\u91CF,\u8BF7\u68C0\u67E5\u662F\u5426\u7ED1\u5B9Astore");
            var __mobxDecorators = viewStore['__mobxDecorators'] || viewStore['__mobxInitializedProps'];
            invariant(__mobxDecorators && __mobxDecorators[options.state], "submittingAutoMessage[" + target.constructor.name + "-\u81EA\u52A8\u5F39\u51FA\u63D0\u793A\u64CD\u4F5C\u4FE1\u606F]:\u60A8\u7684\u7EC4\u4EF6\u5B9E\u4F8Bstore\u5BF9\u8C61\u4E0A\u9700\u8981\u76D1\u542C\u7684\u5C5E\u6027\u6CA1\u6709\u88AB@observable\u5305\u88F9,\u8BF7\u53C2\u7167observable[mobx]\u7528\u6CD5");
            if (__mobxDecorators && __mobxDecorators[options.state]) {
                if (descriptor.ReactionList.length === 0) {
                    var Reaction = reaction(function () {
                        if (viewStore) {
                            var store = __assign({}, viewStore[options.state]);
                            return store;
                        }
                    }, function (store, reaction) {
                        invariant(viewStore[options.state] instanceof ObservablePromiseModel, "submittingAutoMessage[\u81EA\u52A8\u5F39\u51FA\u63D0\u793A\u64CD\u4F5C\u4FE1\u606F-" + target.constructor.name + "]:\u60A8\u5728store\u5BF9\u8C61\u91CC\u9762\u9700\u8981\u76D1\u542C\u7684state\u539F\u578B\u4E0D\u662FObservablePromiseModel");
                        if (store) {
                            options.showProgressBar && NProgress.start();
                            if (store.state === 'resolved') {
                                if (store.value.success) {
                                    store.value && store.value.message && message.success(React.createElement("pre", { style: { display: 'inline-block' } }, store.value && store.value.message));
                                }
                                else {
                                    if (options.type === 'message') {
                                        store.value && store.value.message && message.error(React.createElement("pre", { style: { display: 'inline-block' } }, store.value && store.value.message), 4);
                                    }
                                    else {
                                        Modal.error({
                                            title: "" + (options.modalTitle || '操作反馈信息'),
                                            content: (React.createElement("div", { style: { maxHeight: '120px', overflowY: 'scroll', padding: '10px 0' } },
                                                React.createElement("pre", { style: { display: 'inline-block' } }, store.value && store.value.message))),
                                        });
                                    }
                                }
                                store.clear && store.clear();
                                options.sideEffect && options.sideEffect(_this);
                                descriptor.ReactionList = [];
                                options.showProgressBar && NProgress.done();
                                reaction.dispose();
                            }
                        }
                    });
                    descriptor.ReactionList.push(Reaction);
                }
            }
            return oldValue.apply(this, arguments);
        };
        return descriptor;
    };
}

export { NProgress, submittingAutoMessage };
