import { FrameworkConfiguration } from '../interfaces';
export declare function sleep(ms: number): Promise<unknown>;
/**
 * run a callback after next tick
 * @param cb
 */
export declare function nextTick(cb: () => void): void;
export declare function toArray<T>(array: T | T[]): T[];
export declare function getDefaultTplWrapper(id: string, name: string): (tpl: string) => string;
export declare function getWrapperId(id: string): string;
export declare function isEnableScopedCSS(sandbox: FrameworkConfiguration['sandbox']): boolean;
declare class Deferred<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
    constructor();
}
export { Deferred };
export declare function performanceMark(markName: string): void;
export declare function performanceMeasure(measureName: string, markName: string): void;
export declare function getContainer(container: string | HTMLElement): HTMLElement | null;
/** 校验子应用导出的 生命周期 对象是否正确 */
export declare function validateExportLifecycle(exports: any): any;
export declare enum SandBoxType {
    Proxy = "Proxy",
    /** 暂时不用 */
    Snapshot = "Snapshot",
    LegacyProxy = "LegacyProxy"
}
export interface SandBox {
    /** 沙箱的名字 */
    name: string;
    /** 沙箱的类型 */
    type: SandBoxType;
    /** 沙箱导出的代理实体 */
    proxy: WindowProxy;
    /** 沙箱是否在运行中 */
    sandboxRunning: boolean;
    /** 启动沙箱 */
    active(): void;
    /** 关闭沙箱 */
    inactive(): void;
}
export declare const isCallable: (fn: any) => boolean;
export declare function isBoundedFunction(fn: CallableFunction): boolean | undefined;
export declare function isConstructable(fn: () => any | FunctionConstructor): boolean | undefined;
