import { interfaces as inversifyInterfaces } from '../../../main-decorators/dts';
declare function provide(
  serviceIdentifier: inversifyInterfaces.ServiceIdentifier<any>,
  force?: boolean
): (target: any) => any;
export default provide;
