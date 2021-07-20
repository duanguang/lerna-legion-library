/**
  *  legions-control-container v0.0.6
  * (c) 2021 duanguang
  * @license MIT
  */
import 'reflect-metadata';
import { Container, decorate, ContainerModule } from 'inversify';
export { decorate, inject, injectable } from 'inversify';
import { provide, buildProviderModule } from 'inversify-binding-decorators';
export { buildProviderModule, fluentProvide, provide } from 'inversify-binding-decorators';
import getDecorators from 'inversify-inject-decorators';

var legionsContainer = new Container({
    skipBaseClassChecks: true,
});
var /** @internal */
lazyInject = getDecorators(legionsContainer).lazyInject;

var METADATA_KEY = {
    provide: 'inversify-binding-decorators:provide',
};
/** 自动往容器里面注册类实例信息
 *  与provide 区别在于 ,不需要手动调用legionsContainer.load(buildProviderModule());
 */
function fullProvider(serviceIdentifier, force) {
    return function (target) {
        decorate(provide(serviceIdentifier, force), target);
        var provideMetadata = Reflect.getMetadata(METADATA_KEY.provide, Reflect) || [];
        var Metadata = provideMetadata.find(function (item) { return item.implementationType === target; });
        if (Metadata && !legionsContainer.isBound(serviceIdentifier)) {
            var warriors = new ContainerModule(function (bind) {
                Metadata.constraint(bind, Metadata.implementationType);
            });
            legionsContainer.load(warriors);
        }
        return target;
    };
}

function loadProviderModule() {
    legionsContainer.load(buildProviderModule());
}

export { fullProvider, lazyInject, legionsContainer, loadProviderModule };
