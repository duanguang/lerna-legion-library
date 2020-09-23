import 'reflect-metadata';
export { injectable, interfaces, inject } from './api/main-decorators/dts';
import { buildProviderModule } from 'inversify-binding-decorators';
export { provide, fluentProvide } from 'inversify-binding-decorators';
export { fullProvider } from './core/provide';
export { legionsContainer, lazyInject } from './core/inversify.config';
export { buildProviderModule };
export declare function loadProviderModule(): void;
