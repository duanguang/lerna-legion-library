/**
  *  legions-control-container v0.0.6
  * (c) 2021 duanguang
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('reflect-metadata');
var inversify = require('inversify');
var inversifyBindingDecorators = require('inversify-binding-decorators');
var getDecorators = require('inversify-inject-decorators');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var getDecorators__default = /*#__PURE__*/_interopDefaultLegacy(getDecorators);

var legionsContainer = new inversify.Container({
    skipBaseClassChecks: true,
});
var /** @internal */
lazyInject = getDecorators__default['default'](legionsContainer).lazyInject;

var METADATA_KEY = {
    provide: 'inversify-binding-decorators:provide',
};
/** 自动往容器里面注册类实例信息
 *  与provide 区别在于 ,不需要手动调用legionsContainer.load(buildProviderModule());
 */
function fullProvider(serviceIdentifier, force) {
    return function (target) {
        inversify.decorate(inversifyBindingDecorators.provide(serviceIdentifier, force), target);
        var provideMetadata = Reflect.getMetadata(METADATA_KEY.provide, Reflect) || [];
        var Metadata = provideMetadata.find(function (item) { return item.implementationType === target; });
        if (Metadata && !legionsContainer.isBound(serviceIdentifier)) {
            var warriors = new inversify.ContainerModule(function (bind) {
                Metadata.constraint(bind, Metadata.implementationType);
            });
            legionsContainer.load(warriors);
        }
        return target;
    };
}

function loadProviderModule() {
    legionsContainer.load(inversifyBindingDecorators.buildProviderModule());
}

Object.defineProperty(exports, 'decorate', {
  enumerable: true,
  get: function () {
    return inversify.decorate;
  }
});
Object.defineProperty(exports, 'inject', {
  enumerable: true,
  get: function () {
    return inversify.inject;
  }
});
Object.defineProperty(exports, 'injectable', {
  enumerable: true,
  get: function () {
    return inversify.injectable;
  }
});
Object.defineProperty(exports, 'buildProviderModule', {
  enumerable: true,
  get: function () {
    return inversifyBindingDecorators.buildProviderModule;
  }
});
Object.defineProperty(exports, 'fluentProvide', {
  enumerable: true,
  get: function () {
    return inversifyBindingDecorators.fluentProvide;
  }
});
Object.defineProperty(exports, 'provide', {
  enumerable: true,
  get: function () {
    return inversifyBindingDecorators.provide;
  }
});
exports.fullProvider = fullProvider;
exports.lazyInject = lazyInject;
exports.legionsContainer = legionsContainer;
exports.loadProviderModule = loadProviderModule;
