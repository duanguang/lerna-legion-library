import { Container } from 'inversify';
declare const legionsContainer: Container;
declare let 
/** @internal */
lazyInject: (serviceIdentifier: string | symbol | import("inversify/lib/interfaces/interfaces").interfaces.Newable<any> | import("inversify/lib/interfaces/interfaces").interfaces.Abstract<any>) => (proto: any, key: string) => void;
export { legionsContainer, lazyInject };
