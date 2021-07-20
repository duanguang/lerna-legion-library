export const Warrior = Symbol.for('Warrior');
export const Weapon = Symbol.for('Weapon');
export const ThrowableWeapon = Symbol.for('ThrowableWeapon');

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
