import { injectable, inject, Container, ContainerModule } from 'inversify';
import 'reflect-metadata';
import { interfaces } from 'inversify';
const NOT_REGISTERED = 'No matching bindings found for serviceIdentifier:';
describe('container', () => {
  it('Should support Container modules', () => {
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

    @injectable()
    class Ninja implements Ninja {
      private _katana: Katana;
      private _shuriken: Shuriken;

      public constructor(
        @inject('Katana') katana: Katana,
        @inject('Shuriken') shuriken: Shuriken
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
    const warriors = new ContainerModule((bind: interfaces.Bind) => {
      bind<Ninja>('Ninja').to(Ninja);
    });

    const weapons = new ContainerModule((bind: interfaces.Bind) => {
      bind<Katana>('Katana').to(Katana);
      bind<Shuriken>('Shuriken').to(Shuriken);
    });
    const container = new Container();

    // load
    container.load(warriors, weapons);
    const ninja = container.get<Ninja>('Ninja');
    expect(ninja.fight()).toEqual('cut!');
    expect(ninja.sneak()).toEqual('hit!');

    const tryGetNinja = () => {
      container.get('Ninja');
    };
    const tryGetKatana = () => {
      container.get('Katana');
    };
    const tryGetShuruken = () => {
      container.get('Shuriken');
    };

    // unload
    container.unload(warriors);
    expect(tryGetNinja).toThrow(NOT_REGISTERED);
    expect(tryGetKatana).not.toThrow();
    expect(tryGetShuruken).not.toThrow();

    container.unload(weapons);
    expect(tryGetNinja).toThrow(NOT_REGISTERED);
    expect(tryGetKatana).toThrow(NOT_REGISTERED);
    expect(tryGetShuruken).toThrow(NOT_REGISTERED);
  });

  it('Should support control over the scope of the dependencies(依赖范围控制)', () => {
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
      private _usageCount: number;
      public constructor() {
        this._usageCount = 0;
      }
      public hit() {
        this._usageCount = this._usageCount + 1;
        return `This katana was used ${this._usageCount} times!`;
      }
    }

    @injectable()
    class Shuriken implements Shuriken {
      private _shurikenCount: number;
      public constructor() {
        this._shurikenCount = 10;
      }
      public throw() {
        this._shurikenCount = this._shurikenCount - 1;
        return `Only ${this._shurikenCount} items left!`;
      }
    }

    @injectable()
    class Ninja implements Ninja {
      private _katana: Katana;
      private _shuriken: Shuriken;

      public constructor(
        @inject('Katana') katana: Katana,
        @inject('Shuriken') shuriken: Shuriken
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
    container.bind<Ninja>('Ninja').to(Ninja);
    container.bind<Katana>('Katana').to(Katana).inSingletonScope(); // 开启单例模式
    container.bind<Shuriken>('Shuriken').to(Shuriken);

    const ninja1 = container.get<Ninja>('Ninja');
    expect(ninja1.fight()).toEqual('This katana was used 1 times!');
    expect(ninja1.fight()).toEqual('This katana was used 2 times!');
    expect(ninja1.sneak()).toEqual('Only 9 items left!');
    expect(ninja1.sneak()).toEqual('Only 8 items left!');

    const ninja2 = container.get<Ninja>('Ninja');
    expect(ninja2.fight()).toEqual('This katana was used 3 times!'); // 单例模式，每次从容器里面取出来的值都是之前对象
    expect(ninja2.sneak()).toEqual('Only 9 items left!'); // 非单例模式，每次获取容器值，都是一个新的对象
  });
});
