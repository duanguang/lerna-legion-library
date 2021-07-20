/* import { fullProvider as provide } from '../../index'; */
import { fullProvider as provide } from '../../../dist/legions-control-container.umd';
import { TYPE } from '../contants';

export interface WeaponProvider {
  hit(): string;
}

@provide(TYPE.Weapon)
export class KatanaProvider implements WeaponProvider {
  public hit() {
    return 'cut!';
  }
}
