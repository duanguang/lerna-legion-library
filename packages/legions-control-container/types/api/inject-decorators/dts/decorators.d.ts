import { interfaces } from '../../main-decorators/dts';
declare function makePropertyInjectDecorator(
  container: interfaces.Container,
  doCache: boolean
): (
  serviceIdentifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>
) => (proto: any, key: string) => void;
declare function makePropertyInjectNamedDecorator(
  container: interfaces.Container,
  doCache: boolean
): (
  serviceIdentifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>,
  named: string
) => (proto: any, key: string) => void;
declare function makePropertyInjectTaggedDecorator(
  container: interfaces.Container,
  doCache: boolean
): (
  serviceIdentifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>,
  key: string,
  value: any
) => (proto: any, propertyName: string) => void;
declare function makePropertyMultiInjectDecorator(
  container: interfaces.Container,
  doCache: boolean
): (
  serviceIdentifier:
    | string
    | symbol
    | interfaces.Newable<any>
    | interfaces.Abstract<any>
) => (proto: any, key: string) => void;
export {
  makePropertyInjectDecorator,
  makePropertyMultiInjectDecorator,
  makePropertyInjectTaggedDecorator,
  makePropertyInjectNamedDecorator,
};