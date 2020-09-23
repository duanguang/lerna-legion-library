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
export declare class NinjaProvider implements WarriorProvider {
    katana: WeaponProvider;
    shuriken: ThrowableWeaponfullProvider;
    katanaLazyInject: WeaponProvider;
    shurikenLazyInject: ThrowableWeaponfullProvider;
    constructor(katana: WeaponProvider, shuriken: ThrowableWeaponfullProvider);
    fight(): string;
    sneak(): string;
    fightLazyInject(): string;
    sneakLazyInject(): string;
}
