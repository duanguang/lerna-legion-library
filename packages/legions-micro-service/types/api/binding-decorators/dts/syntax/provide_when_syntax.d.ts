import interfaces from '../interfaces/interfaces';
import { interfaces as inversifyInterfaces } from '../../../main-decorators/dts';
declare class ProvideWhenSyntax<T> implements interfaces.ProvideWhenSyntax<T> {
  private _bindingWhenSyntax;
  private _provideDoneSyntax;
  constructor(
    bindingWhenSyntax: (
      bind: inversifyInterfaces.Bind,
      target: any
    ) => inversifyInterfaces.BindingWhenSyntax<T>,
    provideDoneSyntax: interfaces.ProvideDoneSyntax
  );
  when(
    constraint: (request: inversifyInterfaces.Request) => boolean
  ): interfaces.ProvideOnSyntax<T>;
  whenTargetNamed(name: string): interfaces.ProvideOnSyntax<T>;
  whenTargetTagged(tag: string, value: any): interfaces.ProvideOnSyntax<T>;
  whenInjectedInto(parent: Function | string): interfaces.ProvideOnSyntax<T>;
  whenParentNamed(name: string): interfaces.ProvideOnSyntax<T>;
  whenParentTagged(tag: string, value: any): interfaces.ProvideOnSyntax<T>;
  whenAnyAncestorIs(ancestor: Function | string): interfaces.ProvideOnSyntax<T>;
  whenNoAncestorIs(ancestor: Function | string): interfaces.ProvideOnSyntax<T>;
  whenAnyAncestorNamed(name: string): interfaces.ProvideOnSyntax<T>;
  whenAnyAncestorTagged(tag: string, value: any): interfaces.ProvideOnSyntax<T>;
  whenNoAncestorNamed(name: string): interfaces.ProvideOnSyntax<T>;
  whenNoAncestorTagged(tag: string, value: any): interfaces.ProvideOnSyntax<T>;
  whenAnyAncestorMatches(
    constraint: (request: inversifyInterfaces.Request) => boolean
  ): interfaces.ProvideOnSyntax<T>;
  whenNoAncestorMatches(
    constraint: (request: inversifyInterfaces.Request) => boolean
  ): interfaces.ProvideOnSyntax<T>;
  done(force?: boolean): (target: any) => any;
}
export default ProvideWhenSyntax;
