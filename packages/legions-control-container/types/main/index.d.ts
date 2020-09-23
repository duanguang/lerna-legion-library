import 'reflect-metadata';
export { injectable, interfaces, inject } from '../api/main-decorators/dts';
import { buildProviderModule } from '../api/binding-decorators/dts';
export { provide, fluentProvide } from '../api/binding-decorators/dts';
export { fullProvider } from '../api/core/provide';
export { legionsContainer, lazyInject } from '../api/core/inversify.config';
export { buildProviderModule };
export declare function loadProviderModule(): void;
