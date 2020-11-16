import { SandBoxType } from '../utils';
import 'reflect-metadata';
export interface SandboxProps {
    multiMode?: boolean;
    name: string;
}
export interface SandboxContructor {
    new (): ProxySandbox;
}
export default class ProxySandbox {
    /** 沙箱导出的代理实体 */
    sandbox: Window;
    private eventListeners;
    private timeoutIds;
    private intervalIds;
    /** window 值变更记录 */
    private updatedValueSet;
    /** 沙箱的名字 */
    name: string;
    /** 沙箱的类型 */
    type: SandBoxType;
    /** 沙箱是否在运行中 */
    sandboxRunning: boolean;
    constructor(props?: SandboxProps);
    active(): void;
    inactive(): void;
    createProxySandbox(): void;
    getSandbox(): Window;
}
