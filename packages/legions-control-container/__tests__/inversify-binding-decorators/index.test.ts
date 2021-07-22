import { injectable, Container, inject } from 'inversify';
import { provide, buildProviderModule } from 'inversify-binding-decorators';
import 'reflect-metadata';
import { Katana } from '../../api.test/Katana';
import { Shuriken } from '../../api.test/Shuriken';
describe('inversify-binding-decorators', () => {
  it('Should be able to declare bindings using string literals as identifiers', () => {
    let container = new Container();

    interface Warrior {
      katana: Weapon;
      shuriken: ThrowableWeapon;
      fight(): string;
      sneak(): string;
    }

    interface Weapon {
      hit(): string;
    }

    interface ThrowableWeapon {
      throw(): string;
    }

    let TYPE = {
      ThrowableWeapon: 'ThrowableWeapon',
      Warrior: 'Warrior',
      Weapon: 'Weapon',
    };
    @provide(TYPE.Weapon)
    class Katana implements Weapon {
      public hit() {
        return 'cut!';
      }
    }

    @provide(TYPE.ThrowableWeapon)
    class Shuriken implements ThrowableWeapon {
      public throw() {
        return 'hit!';
      }
    }

    @provide(TYPE.Warrior)
    class Ninja implements Warrior {
      public katana: Weapon;
      public shuriken: ThrowableWeapon;

      public constructor(
        @inject(TYPE.Weapon) katana: Weapon,
        @inject(TYPE.ThrowableWeapon) shuriken: ThrowableWeapon
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }

      public fight() {
        return this.katana.hit();
      }
      public sneak() {
        return this.shuriken.throw();
      }
    }
    container.load(buildProviderModule());
    let ninja = container.get<Warrior>(TYPE.Warrior);
    expect(ninja instanceof Ninja).toEqual(true);
    expect(ninja.katana instanceof Katana).toEqual(true);
    expect(ninja.shuriken instanceof Shuriken).toEqual(true);
    expect(ninja.fight()).toEqual('cut!');
    expect(ninja.sneak()).toEqual('hit!');
  });
  it('Should be able to declare bindings using classes as identifiers', () => {
    let container = new Container();

    @provide(Katana)
    class Katana {
      public hit() {
        return 'cut!';
      }
    }

    @provide(Shuriken)
    class Shuriken {
      public throw() {
        return 'hit!';
      }
    }

    @provide(Ninja)
    class Ninja {
      public katana: Katana;
      public shuriken: Shuriken;

      public constructor(katana: Katana, shuriken: Shuriken) {
        this.katana = katana;
        this.shuriken = shuriken;
      }

      public fight() {
        return this.katana.hit();
      }
      public sneak() {
        return this.shuriken.throw();
      }
    }

    container.load(buildProviderModule());
    let ninja = container.get<Ninja>(Ninja);

    expect(ninja instanceof Ninja).toEqual(true);
    expect(ninja.katana instanceof Katana).toEqual(true);
    expect(ninja.shuriken instanceof Shuriken).toEqual(true);
    expect(ninja.fight()).toEqual('cut!');
    expect(ninja.sneak()).toEqual('hit!');
  });
  it('Should be able to declare bindings using classes as identifiers111', () => {
    let container = new Container();
    @provide(Ninja)
    class Ninja {
      public katana: Katana;
      public shuriken: Shuriken;

      public constructor(katana: Katana, shuriken: Shuriken) {
        this.katana = katana;
        this.shuriken = shuriken;
      }

      public fight() {
        return this.katana.hit();
      }
      public sneak() {
        return this.shuriken.throw();
      }
    }

    container.load(buildProviderModule());
    let ninja = container.get<Ninja>(Ninja);
    expect(ninja instanceof Ninja).toEqual(true);
    expect(ninja.katana instanceof Katana).toEqual(true);
    expect(ninja.shuriken instanceof Shuriken).toEqual(true);
    expect(ninja.fight()).toEqual('cutKatana!');
    expect(ninja.sneak()).toEqual('hit!');
  });
});
