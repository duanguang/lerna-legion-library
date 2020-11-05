import { interfaces } from '../../main-decorators/dts/';
declare function getDecorators(
  container: interfaces.Container,
  doCache?: boolean
): {
  lazyInject: (
    serviceIdentifier:
      | string
      | symbol
      | interfaces.Newable<any>
      | interfaces.Abstract<any>
  ) => (proto: any, key: string) => void;
  lazyInjectNamed: (
    serviceIdentifier:
      | string
      | symbol
      | interfaces.Newable<any>
      | interfaces.Abstract<any>,
    named: string
  ) => (proto: any, key: string) => void;
  lazyInjectTagged: (
    serviceIdentifier:
      | string
      | symbol
      | interfaces.Newable<any>
      | interfaces.Abstract<any>,
    key: string,
    value: any
  ) => (proto: any, propertyName: string) => void;
  lazyMultiInject: (
    serviceIdentifier:
      | string
      | symbol
      | interfaces.Newable<any>
      | interfaces.Abstract<any>
  ) => (proto: any, key: string) => void;
};
export default getDecorators;
