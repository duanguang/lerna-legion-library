import { Container } from '../main-decorators/dts';
declare const legionsContainer: Container;
declare let /** @internal */
  lazyInject: (
    serviceIdentifier: import('../main-decorators/dts/interfaces/interfaces').interfaces.ServiceIdentifier<
      any
    >
  ) => (proto: any, key: string) => void;
export { legionsContainer, lazyInject };
