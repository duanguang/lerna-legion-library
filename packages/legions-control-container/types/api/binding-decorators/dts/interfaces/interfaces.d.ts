import { interfaces as inversifyInterfaces } from '../../../main-decorators/dts';
declare namespace interfaces {
  type BindConstraint = (bind: inversifyInterfaces.Bind, target: any) => any;
  interface ProvideSyntax {
    constraint: BindConstraint;
    implementationType: any;
  }
  interface ProvideDoneSyntax {
    done(force?: boolean): (target: any) => any;
  }
  interface ProvideInSyntax<T> extends ProvideDoneSyntax {
    inSingletonScope(): ProvideWhenOnSyntax<T>;
    inTransientScope(): ProvideWhenOnSyntax<T>;
  }
  interface ProvideInWhenOnSyntax<T>
    extends ProvideInSyntax<T>,
      ProvideWhenSyntax<T>,
      ProvideOnSyntax<T> {}
  interface ProvideOnSyntax<T> extends ProvideDoneSyntax {
    onActivation(
      fn: (context: inversifyInterfaces.Context, injectable: T) => T
    ): ProvideWhenSyntax<T>;
  }
  interface ProvideWhenSyntax<T> extends ProvideDoneSyntax {
    when(
      constraint: (request: inversifyInterfaces.Request) => boolean
    ): ProvideOnSyntax<T>;
    whenTargetNamed(name: string): ProvideOnSyntax<T>;
    whenTargetTagged(tag: string, value: any): ProvideOnSyntax<T>;
    whenInjectedInto(parent: Function | string): ProvideOnSyntax<T>;
    whenParentNamed(name: string): ProvideOnSyntax<T>;
    whenParentTagged(tag: string, value: any): ProvideOnSyntax<T>;
    whenAnyAncestorIs(ancestor: Function | string): ProvideOnSyntax<T>;
    whenNoAncestorIs(ancestor: Function | string): ProvideOnSyntax<T>;
    whenAnyAncestorNamed(name: string): ProvideOnSyntax<T>;
    whenAnyAncestorTagged(tag: string, value: any): ProvideOnSyntax<T>;
    whenNoAncestorNamed(name: string): ProvideOnSyntax<T>;
    whenNoAncestorTagged(tag: string, value: any): ProvideOnSyntax<T>;
    whenAnyAncestorMatches(
      constraint: (request: inversifyInterfaces.Request) => boolean
    ): ProvideOnSyntax<T>;
    whenNoAncestorMatches(
      constraint: (request: inversifyInterfaces.Request) => boolean
    ): ProvideOnSyntax<T>;
  }
  interface ProvideWhenOnSyntax<T>
    extends ProvideWhenSyntax<T>,
      ProvideOnSyntax<T> {}
}
export default interfaces;
