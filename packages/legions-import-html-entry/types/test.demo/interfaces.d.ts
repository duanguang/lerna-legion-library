export declare const Warrior: unique symbol;
export declare const Weapon: unique symbol;
export declare const ThrowableWeapon: unique symbol;
export interface Warrior {
    fight(): string;
    sneak(): string;
}
export interface Weapon {
    hit(): string;
}
export interface ThrowableWeapon {
    throw(): string;
}
