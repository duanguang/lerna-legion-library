import { Container } from 'inversify';
declare const legionsContainer: Container;
declare let 
/** @internal */
lazyInject: (serviceIdentifier: import("inversify/dts/interfaces/interfaces").interfaces.ServiceIdentifier<any>) => (proto: any, key: string) => void;
export { legionsContainer, lazyInject };
