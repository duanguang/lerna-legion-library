import interfaces from '../interfaces/interfaces';
import { interfaces as inversifyInterfaces } from '../../../main-decorators/dts';
declare class ProvideInSyntax<T> implements interfaces.ProvideInSyntax<T> {
  private _bindingInSyntax;
  private _provideDoneSyntax;
  constructor(
    bindingInSyntax: (
      bind: inversifyInterfaces.Bind,
      target: any
    ) => inversifyInterfaces.BindingInSyntax<T>,
    provideDoneSyntax: interfaces.ProvideDoneSyntax
  );
  inSingletonScope(): interfaces.ProvideWhenOnSyntax<T>;
  inTransientScope(): interfaces.ProvideWhenOnSyntax<T>;
  done(force?: boolean): (target: any) => any;
}
export default ProvideInSyntax;