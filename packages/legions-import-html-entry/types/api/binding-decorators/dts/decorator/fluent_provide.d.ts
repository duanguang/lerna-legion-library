import interfaces from '../interfaces/interfaces';
import { interfaces as inversifyInterfaces } from '../../../main-decorators/dts';
declare function fluentProvide(
  serviceIdentifier: inversifyInterfaces.ServiceIdentifier<any>
): interfaces.ProvideInWhenOnSyntax<any>;
export default fluentProvide;
