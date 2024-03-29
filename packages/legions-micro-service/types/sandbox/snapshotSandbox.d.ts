import { SandBoxType } from '../utils';
/**
 * 基于 diff 方式实现的沙箱，用于不支持 Proxy 的低版本浏览器
 */
export default class SnapshotSandbox {
    sandbox: WindowProxy;
    name: string;
    type: SandBoxType;
    sandboxRunning: boolean;
    private windowSnapshot;
    private modifyPropsMap;
    constructor(name: string);
    active(): void;
    inactive(): void;
}
