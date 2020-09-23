/* import { fullProvider as provide, inject, lazyInject } from '../../index'; */
import {
  fullProvider as provide,
  inject,
  lazyInject,
} from '../../../dist/legions-control-container.umd';
import { TYPE } from '../contants';
import { WeaponProvider } from './katana.Provider';
import { ThrowableWeaponfullProvider } from './Shuriken.Provider';
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
