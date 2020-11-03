import 'reflect-metadata';

export { injectable, interfaces, inject } from 'inversify';

import { buildProviderModule } from 'inversify-binding-decorators';

export { provide, fluentProvide } from 'inversify-binding-decorators';

//@ts-ignore
export { fullProvider } from '../types/api/core/provide';

export {
  legionsContainer,
  lazyInject, //@ts-ignore
} from '../types/api/core/inversify.config';

export { buildProviderModule };

export declare function loadProviderModule(): void;
