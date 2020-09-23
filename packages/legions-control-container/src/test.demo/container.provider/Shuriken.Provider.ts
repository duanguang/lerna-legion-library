/* import { fullProvider as provide } from '../../index'; */
import { fullProvider as provide } from '../../../dist/legions-control-container.umd';
import { TYPE } from '../contants';
export interface ThrowableWeaponfullProvider {
  throw(): string;
}
@provide(TYPE.ThrowableWeapon)
export class ShurikenfullProvider implements ThrowableWeaponfullProvider {
  public throw() {
    return 'hit!';
  }
}
