import 'reflect-metadata';
export { injectable, interfaces, inject, decorate } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
export { provide, fluentProvide } from 'inversify-binding-decorators';
import { legionsContainer } from './core/inversify.config';
export { fullProvider } from './core/provide';

export { legionsContainer, lazyInject } from './core/inversify.config';
export { buildProviderModule };
export function loadProviderModule() {
  legionsContainer.load(buildProviderModule());
}
