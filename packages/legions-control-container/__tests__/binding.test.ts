import {
  injectable,
  inject,
  Container,
  named,
  targetName,
  tagged,
} from 'inversify';
import 'reflect-metadata';
import { interfaces } from 'inversify';

describe('binding', () => {
  it('Should support named bindings', () => {
    const name: symbol = Symbol.for('Weak');

    interface Weapon {}

    @injectable()
    class Katana implements Weapon {}

    @injectable()
    class Shuriken implements Weapon {}

    interface Warrior {
      katana: Weapon;
      shuriken: Weapon;
    }

    @injectable()
    class Ninja implements Warrior {
      public katana: Weapon;
      public shuriken: Weapon;
      public constructor(
        @inject('Weapon') @named('strong') katana: Weapon,
        @inject('Weapon') @named(name) shuriken: Weapon
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }
    const container = new Container();
    container.bind<Warrior>('Warrior').to(Ninja);
    container.bind<Weapon>('Weapon').to(Katana).whenTargetNamed('strong');
    container.bind<Weapon>('Weapon').to(Shuriken).whenTargetNamed(name);
    const ninja = container.get<Warrior>('Warrior');
    expect(ninja.katana instanceof Katana).toEqual(true);
    expect(ninja.shuriken instanceof Shuriken).toEqual(true);
  });

  it('Should support contextual bindings and targetName annotation', () => {
    interface Weapon {}

    @injectable()
    class Katana implements Weapon {}

    @injectable()
    class Shuriken implements Weapon {}

    interface Warrior {
      katana: Weapon;
      shuriken: Weapon;
    }

    @injectable()
    class Ninja implements Warrior {
      public katana: Weapon;
      public shuriken: Weapon;
      public constructor(
        @inject('Weapon') @targetName('katana') katana: Weapon,
        @inject('Weapon') @targetName('shuriken') shuriken: Weapon
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const container = new Container();
    container.bind<Warrior>('Warrior').to(Ninja);

    container
      .bind<Weapon>('Weapon')
      .to(Katana)
      .when(
        (request: interfaces.Request) =>
          request !== null &&
          request.target !== null &&
          request.target.name.equals('katana')
      );

    container
      .bind<Weapon>('Weapon')
      .to(Shuriken)
      .when(
        (request: interfaces.Request) =>
          request !== null &&
          request.target !== null &&
          request.target.name.equals('shuriken')
      );

    const ninja = container.get<Warrior>('Warrior');
    expect(ninja.katana instanceof Katana).toEqual(true);
    expect(ninja.shuriken instanceof Shuriken).toEqual(true);
  });
  it('Should be able to resolve a ambiguous binding by providing a named tag', () => {
    interface Weapon {
      name: string;
    }

    @injectable()
    class Katana implements Weapon {
      public name: string;
      public constructor() {
        this.name = 'katana';
      }
    }

    @injectable()
    class Shuriken implements Weapon {
      public name: string;
      public constructor() {
        this.name = 'shuriken';
      }
    }

    const container = new Container();
    container.bind<Weapon>('Weapon').to(Katana).whenTargetNamed('japonese'); // 当没有使用@targetName 指定，可直接指定
    container.bind<Weapon>('Weapon').to(Shuriken).whenTargetNamed('chinese');

    const katana = container.getNamed<Weapon>('Weapon', 'japonese');
    const shuriken = container.getNamed<Weapon>('Weapon', 'chinese');

    expect(katana.name).toEqual('katana');
    expect(shuriken.name).toEqual('shuriken');
  });
  it('Should be able to resolve a ambiguous binding by providing a custom tag', () => {
    interface Weapon {
      name: string;
    }

    @injectable()
    class Katana implements Weapon {
      public name: string;
      public constructor() {
        this.name = 'katana';
      }
    }

    @injectable()
    class Shuriken implements Weapon {
      public name: string;
      public constructor() {
        this.name = 'shuriken';
      }
    }

    const container = new Container();
    container
      .bind<Weapon>('Weapon')
      .to(Katana)
      .whenTargetTagged('faction', 'samurai');
    container
      .bind<Weapon>('Weapon')
      .to(Shuriken)
      .whenTargetTagged('faction', 'ninja');

    const katana = container.getTagged<Weapon>('Weapon', 'faction', 'samurai');
    const shuriken = container.getTagged<Weapon>('Weapon', 'faction', 'ninja');

    expect(katana.name).toEqual('katana');
    expect(shuriken.name).toEqual('shuriken');
  });

  it('Should support tagged bindings', () => {
    enum Tag {
      CanThrow,
    }

    interface Weapon {}

    @injectable()
    class Katana implements Weapon {}

    @injectable()
    class Shuriken implements Weapon {}

    interface Warrior {
      katana: Weapon;
      shuriken: Weapon;
    }

    @injectable()
    class Ninja implements Warrior {
      public katana: Weapon;
      public shuriken: Weapon;
      public constructor(
        @inject('Weapon') @tagged('canThrow', false) katana: Weapon,
        @inject('Weapon') @tagged(Tag.CanThrow, true) shuriken: Weapon
      ) {
        this.katana = katana;
        this.shuriken = shuriken;
      }
    }

    const container = new Container();
    container.bind<Warrior>('Warrior').to(Ninja);
    container
      .bind<Weapon>('Weapon')
      .to(Katana)
      .whenTargetTagged('canThrow', false);
    container
      .bind<Weapon>('Weapon')
      .to(Shuriken)
      .whenTargetTagged(Tag.CanThrow, true);

    const ninja = container.get<Warrior>('Warrior');
    expect(ninja.katana instanceof Katana).toEqual(true);
    expect(ninja.shuriken instanceof Shuriken).toEqual(true);
  });
});
