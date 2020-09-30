import interfaces from '../interfaces/interfaces';
import { interfaces as inversifyInterfaces } from '../../../main-decorators/dts';
declare class ProvideOnSyntax<T> implements interfaces.ProvideOnSyntax<T> {
  private _bindingOnSyntax;
  private _provideDoneSyntax;
  constructor(
    bindingOnSyntax: (
      bind: inversifyInterfaces.Bind,
      target: any
    ) => inversifyInterfaces.BindingOnSyntax<T>,
    provideDoneSyntax: interfaces.ProvideDoneSyntax
  );
  onActivation(
    fn: (context: inversifyInterfaces.Context, injectable: T) => T
  ): interfaces.ProvideWhenSyntax<T>;
  done(force?: boolean): (target: any) => any;
}
export default ProvideOnSyntax;