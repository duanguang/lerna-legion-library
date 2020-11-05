import 'reflect-metadata';
import { Weapon, ThrowableWeapon } from './interfaces';
export declare class Katana implements Weapon {
    hit(): string;
}
export declare class Shuriken implements ThrowableWeapon {
    throw(): string;
}
export declare class Ninja {
    protected katana: Weapon;
    protected shuriken: ThrowableWeapon;
    constructor(katana: Weapon, shuriken: ThrowableWeapon);
    fight(): string;
    sneak(): string;
}
