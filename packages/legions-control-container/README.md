# `legions-control-container`

> TODO: IoC 容器使用类构造函数来标识并注入其依赖项

## Usage

```
npm i legions-control-container --save
```

## API

### fullProvider

```js
import {fullProvider,legionsContainer} from 'legions-control-container';
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
```

### lazyInject&inject

```js
import { fullProvider} from 'legions-control-container';
import { TYPE } from '../contants';

export interface WeaponProvider {
  hit(): string;
}

@fullProvider(TYPE.Weapon)
export class KatanaProvider implements WeaponProvider {
  public hit() {
    return 'cut!';
  }
}

export interface ThrowableWeaponfullProvider {
  throw(): string;
}
@provide(TYPE.ThrowableWeapon)
export class ShurikenfullProvider implements ThrowableWeaponfullProvider {
  public throw() {
    return 'hit!';
  }
}

export interface WarriorProvider {
  katana: WeaponProvider;
  shuriken: ThrowableWeaponfullProvider;
  fight(): string;
  sneak(): string;
  fightLazyInject(): string;
  sneakLazyInject(): string;
}
@provide(TYPE.Warrior)
export class NinjaProvider implements WarriorProvider {
  public katana!: WeaponProvider;
  public shuriken!: ThrowableWeaponfullProvider;

  @lazyInject(TYPE.Weapon)
  public katanaLazyInject!: WeaponProvider;
  @lazyInject(TYPE.ThrowableWeapon)
  public shurikenLazyInject!: ThrowableWeaponfullProvider;

  public constructor(
    @inject(TYPE.Weapon) katana: WeaponProvider,
    @inject(TYPE.ThrowableWeapon) shuriken: ThrowableWeaponfullProvider
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
  public fightLazyInject() {
    return this.katanaLazyInject.hit();
  }
  public sneakLazyInject() {
    return this.shurikenLazyInject.throw();
  }
}

let ninja = legionsContainer.get<WarriorProvider>(TYPE.Warrior);
    expect(ninja instanceof NinjaProvider).toEqual(true);
    expect(ninja.katana instanceof KatanaProvider).toEqual(true);
    expect(ninja.shuriken instanceof ShurikenfullProvider).toEqual(true);
    expect(ninja.fight()).toEqual('cut!');
    expect(ninja.sneak()).toEqual('hit!');
    expect(ninja.fightLazyInject()).toEqual('cut!');
    expect(ninja.sneakLazyInject()).toEqual('hit!');
```
