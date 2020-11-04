# `legions-control-container`

> TODO: IoC 容器使用类构造函数来标识并注入其依赖项

## Install

```
npm i legions-control-container --save
```

## Usage

### TypeScript 环境中使用

- 配置信息(tsconfig.json)

```js
{
    "compileOnSave": true,
    "buildOnSave": true,
    "targetHasForOf": true,
    "targetHasGenerators": true,
    "targetHasIterables": true,
    "compilerOptions": {
        "baseUrl": "/",
        "types": [ "node"],
        "module": "es2015",
        "target": "es5",
        "allowSyntheticDefaultImports": true,
        "lib": [
            "dom",
            "es5",
            "es6",
            "es7",
            "es2015", "es2017"
        ],
        "jsx": "react",
        "sourceMap": false,
        /* "emitDecoratorMetadata": true, */
        "experimentalDecorators": true,
        "moduleResolution": "node",
        "isolatedModules": false,
        "downlevelIteration": true,
        "pretty": true
    },
    "exclude": [
        "dist",
        "node_modules",
        "examples",
    ],
    "include": [
        "src/**/*",
    ]
}

```

---

- 使用字符串或 symbol 类型作为标识符

```js
import { fullProvider,lazyInject,inject} from 'legions-control-container';
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

---

- 使用类作为标识符
  - 修改 tsconfig.json
  ```js
  {
    "compileOnSave": true,
    "buildOnSave": true,
    "targetHasForOf": true,
    "targetHasGenerators": true,
    "targetHasIterables": true,
    "compilerOptions": {
        "baseUrl": "/",
        "types": [ "node"],
        "module": "es2015",
        "target": "es5",
        "allowSyntheticDefaultImports": true,
        "lib": [
            "dom",
            "es5",
            "es6",
            "es7",
            "es2015", "es2017"
        ],
        "jsx": "react",
        "sourceMap": false,
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "moduleResolution": "node",
        "isolatedModules": false,
        "downlevelIteration": true,
        "pretty": true
    },
    "exclude": [
        "dist",
        "node_modules",
        "examples",
    ],
    "include": [
        "src/**/*",
    ]
  }
  ```

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

### Babel 环境中使用

如果在 Babel 环境中使用，则无法使用类作为标识符

**参考 TypeScript 中 字符串或 symbol 作为标识符用法，不需要使用 tsconfig.json 文件**

**需要添加 Babel transform-decorators-legacy 插件用来解析修饰器语法**
