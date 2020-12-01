import { Freer } from '../../interfaces';
import ProxySandbox from '../proxySandbox';
import SnapshotSandbox from 'sandbox/snapshotSandbox';
export declare function patchAtMounting(appName: string, elementGetter: () => HTMLElement | ShadowRoot, sandbox: ProxySandbox | SnapshotSandbox, scopedCSS: boolean, excludeAssetFilter?: Function): Freer[];
export declare function patchAtBootstrapping(appName: string, elementGetter: () => HTMLElement | ShadowRoot, sandbox: ProxySandbox | SnapshotSandbox, scopedCSS: boolean, excludeAssetFilter?: Function): Freer[];
