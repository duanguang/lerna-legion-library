import { Freer } from '../interfaces';
import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';

export function hijack(): Freer[] {
  return [hijackTimer(), hijackWindowListener(), hijackHistoryListener()];
}
