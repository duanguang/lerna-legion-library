import { Freer } from '../interfaces';
import hijackHistoryListener from './historyListener';
import hijackTimer from './timer';
import hijackWindowListener from './windowListener';
import hijackDynamicAppend from './dynamicHeadAppend';
import noop from 'lodash/noop';
export function hijackAtMounting(appName: string, proxy: Window): Freer[] {
  return [
    hijackTimer(),
    hijackWindowListener(),
    hijackHistoryListener(),
    hijackDynamicAppend(appName, proxy),
  ];
}

export function hijackAtBootstrapping(appName: string, proxy: Window): Freer[] {
  return [
    //@ts-ignore
    process.env.NODE_ENV === 'production'
      ? hijackDynamicAppend(appName, proxy, false)
      : () => () => noop,
  ];
}
