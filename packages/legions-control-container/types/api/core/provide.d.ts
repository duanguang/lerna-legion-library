import { interfaces as inversifyInterfaces } from '../main-decorators/dts';
/** 自动往容器里面注册类实例信息
 *  与provide 区别在于 ,不需要手动调用legionsContainer.load(buildProviderModule());
 */
export declare function fullProvider(
  serviceIdentifier: inversifyInterfaces.ServiceIdentifier<any>,
  force?: boolean
): (target: any) => any;
