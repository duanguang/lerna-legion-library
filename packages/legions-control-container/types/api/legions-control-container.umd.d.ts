import 'reflect-metadata';

export { injectable, interfaces, inject } from 'inversify';

import { buildProviderModule } from 'inversify-binding-decorators';

export { provide, fluentProvide } from 'inversify-binding-decorators';

//@ts-ignore
export { fullProvider } from '../types/core/provide';
//@ts-ignore
export { legionsContainer, lazyInject } from '../types/core/inversify.config';

export { buildProviderModule };

export declare function loadProviderModule(): void;
