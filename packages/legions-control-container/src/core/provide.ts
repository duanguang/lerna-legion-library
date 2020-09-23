import { provide } from 'inversify-binding-decorators';
import interfaces from 'inversify-binding-decorators/dts/interfaces/interfaces';
import {
  interfaces as inversifyInterfaces,
  decorate,
  ContainerModule,
} from 'inversify';
import { legionsContainer } from './inversify.config';
const METADATA_KEY = {
  provide: 'inversify-binding-decorators:provide',
};
/** 自动往容器里面注册类实例信息
 *  与provide 区别在于 ,不需要手动调用legionsContainer.load(buildProviderModule());
 */
export function fullProvider(
  serviceIdentifier: inversifyInterfaces.ServiceIdentifier<any>,
  force?: boolean
) {
  return function (target: any) {
    decorate(provide(serviceIdentifier, force), target);
    const provideMetadata: interfaces.ProvideSyntax[] =
      Reflect.getMetadata(METADATA_KEY.provide, Reflect) || [];
    const Metadata = provideMetadata.find(
      item => item.implementationType === target
    );
    if (Metadata && !legionsContainer.isBound(serviceIdentifier)) {
      const warriors = new ContainerModule((bind: inversifyInterfaces.Bind) => {
        Metadata.constraint(bind, Metadata.implementationType);
      });
      legionsContainer.load(warriors);
    }
    return target;
  };
}
