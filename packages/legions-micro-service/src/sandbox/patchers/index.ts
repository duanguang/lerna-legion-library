

import { Freer } from '../../interfaces';
import { patchLooseSandbox, patchStrictSandbox } from './dynamicAppend/';
import hijackHistoryListener from '../../hijackers/historyListener';
import hijackTimer from '../../hijackers/timer';
import hijackWindowListener from '../../hijackers/windowListener';
/* import hijackDynamicAppend from './dynamicHeadAppend'; */
import ProxySandbox from '../proxySandbox';
import { SandBoxType } from '../../utils';
import SnapshotSandbox from 'sandbox/snapshotSandbox';
export function patchAtMounting(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  sandbox: ProxySandbox | SnapshotSandbox,
  scopedCSS: boolean,
  excludeAssetFilter?: Function,
): Freer[] {
  const basePatchers = [
    () => hijackTimer(),
    () => hijackWindowListener(),
    () => hijackHistoryListener(),
  ];

  const patchersInSandbox = {
    [SandBoxType.Proxy]: [
      ...basePatchers,
      () => patchStrictSandbox(appName, elementGetter, sandbox.sandbox, true, scopedCSS, excludeAssetFilter),
    ],
    [SandBoxType.Snapshot]: [
      ...basePatchers,
      () => patchLooseSandbox(appName, elementGetter, sandbox.sandbox, true, scopedCSS, excludeAssetFilter),
    ],
  };

  return patchersInSandbox[sandbox.type]?.map((patch) => patch());
}

export function patchAtBootstrapping(
  appName: string,
  elementGetter: () => HTMLElement | ShadowRoot,
  sandbox: ProxySandbox | SnapshotSandbox,
  scopedCSS: boolean,
  excludeAssetFilter?: Function,
): Freer[] {
  const patchersInSandbox = {
    [SandBoxType.Proxy]: [
      () => patchStrictSandbox(appName, elementGetter, sandbox.sandbox, false, scopedCSS, excludeAssetFilter),
    ],
    [SandBoxType.Snapshot]: [
      () => patchLooseSandbox(appName, elementGetter, sandbox.sandbox, false, scopedCSS, excludeAssetFilter),
    ],
  };

  return patchersInSandbox[sandbox.type]?.map((patch) => patch());
}
