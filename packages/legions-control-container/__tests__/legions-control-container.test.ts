import {
  injectable,
  inject,
  lazyInject,
  buildProviderModule,
  provide,
  fullProvider,
  legionsContainer,
  loadProviderModule,
} from '../src';
/* import {
  injectable,
  inject,
  lazyInject,
  buildProviderModule,
  provide,
  fullProvider,
  legionsContainer,
  loadProviderModule,
} from '../src/index'; */
import 'reflect-metadata';
import {
  NinjaProvider,
  WarriorProvider,
} from '../api.test/container.provider/Ninja.Provider';
import { TYPE } from '../api.test/contants';
import { KatanaProvider } from '../api.test/container.provider/katana.Provider';
import { ShurikenfullProvider } from '../api.test/container.provider/Shuriken.Provider';
describe('legions-control-container.test', () => {
  /* it('Should be able to declare bindings using string literals as identifiers', () => {
    let ninja = legionsContainer.get<WarriorProvider>(TYPE.Warrior);
    expect(ninja instanceof NinjaProvider).toEqual(true);
    expect(ninja.katana instanceof KatanaProvider).toEqual(true);
    expect(ninja.shuriken instanceof ShurikenfullProvider).toEqual(true);
    expect(ninja.fight()).toEqual('cut!');
    expect(ninja.sneak()).toEqual('hit!');
    expect(ninja.fightLazyInject()).toEqual('cut!');
    expect(ninja.sneakLazyInject()).toEqual('hit!');
  }); */
  it('Should be able to declare bindings using classes as identifiers', () => {
    @fullProvider(Katana)
    class Katana {
      public hit() {
        return 'cut!';
      }
    }

    @fullProvider(Shuriken)
    class Shuriken {
      public throw() {
        return 'hit!';
      }
    }

    @fullProvider(Ninja)
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

    let ninja = legionsContainer.get<Ninja>(Ninja);

    expect(ninja instanceof Ninja).toEqual(true);
    expect(ninja.katana instanceof Katana).toEqual(true);
    expect(ninja.shuriken instanceof Shuriken).toEqual(true);
    expect(ninja.fight()).toEqual('cut!');
    expect(ninja.sneak()).toEqual('hit!');
  });
  it('Should be able to declare bindings using string or symbol as identifiers', () => {
    @fullProvider(TYPE.Weapon)
    class Katana {
      public hit() {
        return 'cut!';
      }
    }

    @fullProvider(TYPE.ThrowableWeapon)
    class Shuriken {
      public throw() {
        return 'hit!';
      }
    }

    @fullProvider(TYPE.Warrior)
    class Ninja {
      public katana: Katana;
      public shuriken: Shuriken;

      public constructor(
        @inject(TYPE.Weapon) katana: Katana,
        @inject(TYPE.ThrowableWeapon) shuriken: Shuriken
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

    let ninja = legionsContainer.get<Ninja>(TYPE.Warrior);

    expect(ninja instanceof Ninja).toEqual(true);
    expect(ninja.katana instanceof Katana).toEqual(true);
    expect(ninja.shuriken instanceof Shuriken).toEqual(true);
    expect(ninja.fight()).toEqual('cut!');
    expect(ninja.sneak()).toEqual('hit!');
  });
});
