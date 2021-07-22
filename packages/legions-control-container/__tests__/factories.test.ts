import { injectable, inject, Container } from 'inversify';
import 'reflect-metadata';
import { interfaces } from 'inversify';
interface Ninja {
  fight(): string;
  sneak(): string;
}

interface Katana {
  hit(): string;
}

interface Shuriken {
  throw(): string;
}
@injectable()
class Katana implements Katana {
  public hit() {
    return 'cut!';
  }
}
@injectable()
class Shuriken implements Shuriken {
  public throw() {
    return 'hit!';
  }
}
test('Should support the injection of user defined factories(是否支持工厂方法注入)', () => {
  @injectable()
  class NinjaWithUserDefinedFactory implements Ninja {
    private _katana: Katana;
    private _shuriken: Shuriken;

    public constructor(
      @inject('Factory1<Katana>') katanaFactory: () => Katana,
      @inject('Shuriken') shuriken: Shuriken
    ) {
      this._katana = katanaFactory();
      this._shuriken = shuriken;
    }

    public fight() {
      return this._katana.hit();
    }
    public sneak() {
      return this._shuriken.throw();
    }
  }
  const container = new Container();
  container.bind<Ninja>('Ninja').to(NinjaWithUserDefinedFactory);
  container.bind<Shuriken>('Shuriken').to(Shuriken);
  container.bind<Katana>('Katana').to(Katana);
  container
    .bind<interfaces.Factory<Katana>>('Factory1<Katana>')
    .toFactory<Katana>(context => () =>
      context.container.get<Katana>('Katana')
    );
  const ninja = container.get<Ninja>('Ninja');
  expect(ninja.fight()).toEqual('cut!');
});
