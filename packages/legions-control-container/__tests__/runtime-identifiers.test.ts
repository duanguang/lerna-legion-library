/*
 * @Author: duanguang
 * @Date: 2020-09-22 09:59:44
 * @Last Modified by: duanguang
 * @Last Modified time: 2020-09-22 11:31:21
 */
import { injectable, inject, Container, targetName } from 'inversify';
import 'reflect-metadata';
import { interfaces } from 'inversify';

/**类作为运行时标识符 */
test('Should be able to use classes as runtime identifiers', () => {
  @injectable()
  class Katana {
    public hit() {
      return 'cut!';
    }
  }

  @injectable()
  class Shuriken {
    public throw() {
      return 'hit!';
    }
  }

  @injectable()
  class Ninja {
    private _katana: Katana;
    private _shuriken: Shuriken;

    public constructor(katana: Katana, shuriken: Shuriken) {
      this._katana = katana;
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
  container.bind<Ninja>(Ninja).to(Ninja);
  container.bind<Katana>(Katana).to(Katana);
  container.bind<Shuriken>(Shuriken).to(Shuriken);

  const ninja = container.get<Ninja>(Ninja);
  expect(ninja.fight()).toEqual('cut!');
  expect(ninja.sneak()).toEqual('hit!');
});

/** 符号作为运行时标识符 */
test('Should be able to use Symbols as runtime identifiers', () => {
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

  const TYPES = {
    Katana: Symbol.for('Katana'),
    Ninja: Symbol.for('Ninja'),
    Shuriken: Symbol.for('Shuriken'),
  };

  @injectable()
  class Ninja implements Ninja {
    private _katana: Katana;
    private _shuriken: Shuriken;

    public constructor(
      @inject(TYPES.Katana) katana: Katana,
      @inject(TYPES.Shuriken) shuriken: Shuriken
    ) {
      this._katana = katana;
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
  container.bind<Ninja>(TYPES.Ninja).to(Ninja);
  container.bind<Katana>(TYPES.Katana).to(Katana);
  container.bind<Shuriken>(TYPES.Shuriken).to(Shuriken);

  const ninja = container.get<Ninja>(TYPES.Ninja);

  expect(ninja.fight()).toEqual('cut!');
  expect(ninja.sneak()).toEqual('hit!');
});

/** 类对自身的注入 */
test('Should support the injection of classes to itself', () => {
  const heroName = 'superman';

  @injectable()
  class Hero {
    public name: string;
    public constructor() {
      this.name = heroName;
    }
  }

  const container = new Container();
  container.bind(Hero).toSelf();
  const hero = container.get<Hero>(Hero);

  expect(hero.name).toEqual(heroName);
});

describe('injection', () => {
  /** 常量注入 */
  it('Should support the injection of constant values', () => {
    interface Warrior {
      name: string;
    }

    const TYPES = {
      Warrior: 'Warrior',
    };

    const heroName = 'superman';

    @injectable()
    class Hero implements Warrior {
      public name: string;
      public constructor() {
        this.name = heroName;
      }
    }

    const container = new Container();
    container.bind<Warrior>(TYPES.Warrior).toConstantValue(new Hero());
    const hero = container.get<Warrior>(TYPES.Warrior);

    expect(hero.name).toEqual(heroName);
  });
  it('Should support the injection of dynamic values', () => {
    interface UseDate {
      doSomething(): Date;
    }

    @injectable()
    class UseDate implements UseDate {
      public currentDate: Date;
      public constructor(@inject('Date') currentDate: Date) {
        this.currentDate = currentDate;
      }
      public doSomething() {
        return this.currentDate;
      }
    }

    const container = new Container();
    container.bind<UseDate>('UseDate').to(UseDate);
    container
      .bind<Date>('Date')
      .toDynamicValue((context: interfaces.Context) => new Date());

    const subject1 = container.get<UseDate>('UseDate');
    const subject2 = container.get<UseDate>('UseDate');
    expect(subject1.doSomething() === subject2.doSomething()).toEqual(false);

    container.unbind('Date');
    container.bind<Date>('Date').toConstantValue(new Date());

    const subject3 = container.get<UseDate>('UseDate');
    const subject4 = container.get<UseDate>('UseDate');
    expect(subject3.doSomething() === subject4.doSomething()).toEqual(true);
  });

  it('Should support the injection of Functions', () => {
    const ninjaId = 'Ninja';
    const longDistanceWeaponId = 'LongDistanceWeapon';
    const shortDistanceWeaponFactoryId = 'ShortDistanceWeaponFactory';

    type ShortDistanceWeaponFactory = () => ShortDistanceWeapon;

    interface KatanaBlade {}

    @injectable()
    class KatanaBlade implements KatanaBlade {}

    interface KatanaHandler {}

    @injectable()
    class KatanaHandler implements KatanaHandler {}

    interface ShortDistanceWeapon {
      handler: KatanaHandler;
      blade: KatanaBlade;
    }
    @injectable()
    class Katana implements ShortDistanceWeapon {
      public handler: KatanaHandler;
      public blade: KatanaBlade;
      public constructor(handler: KatanaHandler, blade: KatanaBlade) {
        this.handler = handler;
        this.blade = blade;
      }
    }

    interface LongDistanceWeapon {}
    @injectable()
    class Shuriken implements LongDistanceWeapon {}

    interface Warrior {
      shortDistanceWeaponFactory: ShortDistanceWeaponFactory;
      longDistanceWeapon: LongDistanceWeapon;
    }
    @injectable()
    class Ninja implements Warrior {
      public shortDistanceWeaponFactory: ShortDistanceWeaponFactory;
      public longDistanceWeapon: LongDistanceWeapon;
      public constructor(
        @inject(shortDistanceWeaponFactoryId)
        @targetName('katana')
        shortDistanceWeaponFactory: ShortDistanceWeaponFactory,

        @inject(longDistanceWeaponId)
        @targetName('shuriken')
        longDistanceWeapon: LongDistanceWeapon
      ) {
        this.shortDistanceWeaponFactory = shortDistanceWeaponFactory;
        this.longDistanceWeapon = longDistanceWeapon;
      }
    }
    const container = new Container();
    container.bind<Ninja>(ninjaId).to(Ninja);
    container.bind<LongDistanceWeapon>(longDistanceWeaponId).to(Shuriken);

    const katanaFactory = function () {
      return new Katana(new KatanaHandler(), new KatanaBlade());
    };
    container
      .bind<ShortDistanceWeaponFactory>(shortDistanceWeaponFactoryId)
      .toFunction(katanaFactory); // IMPORTANT!
    const ninja = container.get<Ninja>(ninjaId);
    expect(ninja instanceof Ninja).toEqual(true);
    expect(typeof ninja.shortDistanceWeaponFactory === 'function').toEqual(
      true
    );
    expect(ninja.shortDistanceWeaponFactory() instanceof Katana).toEqual(true);
    expect(
      ninja.shortDistanceWeaponFactory().handler instanceof KatanaHandler
    ).toEqual(true);
    expect(
      ninja.shortDistanceWeaponFactory().blade instanceof KatanaBlade
    ).toEqual(true);
    expect(ninja.longDistanceWeapon instanceof Shuriken).toEqual(true);
  });
});
