import { FrameworkConfiguration } from '../interfaces';
import isFunction from 'lodash/isFunction';
import snakeCase from 'lodash/snakeCase';
export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * run a callback after next tick
 * @param cb
 */
export function nextTick(cb: () => void): void {
  Promise.resolve().then(cb);
}
export function toArray<T>(array: T | T[]): T[] {
  return Array.isArray(array) ? array : [array];
}
export function getDefaultTplWrapper(id: string, name: string) {
  return (tpl: string) =>
    `<div id="${getWrapperId(id)}" data-name="${name}">${tpl}</div>`;
}

export function getWrapperId(id: string) {
  return `__legions_microapp_wrapper_for_${snakeCase(id)}__`;
}
export function isEnableScopedCSS(sandbox: FrameworkConfiguration['sandbox']) {
  if (typeof sandbox !== 'object') {
    return false;
  }

  if (sandbox.strictStyleIsolation) {
    return false;
  }

  return !!sandbox.experimentalStyleIsolation;
}
class Deferred<T> {
  promise: Promise<T>;

  resolve!: (value?: T | PromiseLike<T>) => void;

  reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
export { Deferred };

const supportsUserTiming =
  typeof performance !== 'undefined' &&
  typeof performance.mark === 'function' &&
  typeof performance.clearMarks === 'function' &&
  typeof performance.measure === 'function' &&
  typeof performance.clearMeasures === 'function';

export function performanceMark(markName: string) {
  if (supportsUserTiming) {
    performance.mark(markName);
  }
}
export function performanceMeasure(measureName: string, markName: string) {
  if (
    supportsUserTiming &&
    performance.getEntriesByName(markName, 'mark').length
  ) {
    performance.measure(measureName, markName);
    performance.clearMarks(markName);
    performance.clearMeasures(measureName);
  }
}

export function getContainer(
  container: string | HTMLElement
): HTMLElement | null {
  return typeof container === 'string'
    ? document.querySelector(container)
    : container;
}

/** 校验子应用导出的 生命周期 对象是否正确 */
export function validateExportLifecycle(exports: any) {
  const { bootstrap, mount, unmount } = exports ?? {};
  return isFunction(bootstrap) && isFunction(mount) && isFunction(unmount);
}
export enum SandBoxType {
  Proxy = 'Proxy',
  /** 暂时不用 */
  Snapshot = 'Snapshot',
  LegacyProxy = 'LegacyProxy',
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

const naughtySafari =
  typeof document.all === 'function' && typeof document.all === 'undefined';
export const isCallable = naughtySafari
  ? (fn: any) => typeof fn === 'function' && typeof fn !== 'undefined'
  : (fn: any) => typeof fn === 'function';

const boundedMap = new WeakMap<CallableFunction, boolean>();
export function isBoundedFunction(fn: CallableFunction) {
  if (boundedMap.has(fn)) {
    return boundedMap.get(fn);
  }
  /*
   indexOf is faster than startsWith
   see https://jsperf.com/string-startswith/72
   */
  const bounded =
    fn.name.indexOf('bound ') === 0 && !fn.hasOwnProperty('prototype');
  boundedMap.set(fn, bounded);
  return bounded;
}

const constructableMap = new WeakMap<Function, boolean>();
export function isConstructable(fn: () => any | FunctionConstructor) {
  if (constructableMap.has(fn)) {
    return constructableMap.get(fn);
  }

  const constructableFunctionRegex = /^function\b\s[A-Z].*/;
  const classRegex = /^class\b/;

  // 有 prototype 并且 prototype 上有定义一系列非 constructor 属性，则可以认为是一个构造函数
  const constructable =
    (fn.prototype &&
      fn.prototype.constructor === fn &&
      Object.getOwnPropertyNames(fn.prototype).length > 1) ||
    constructableFunctionRegex.test(fn.toString()) ||
    classRegex.test(fn.toString());
  constructableMap.set(fn, constructable);
  return constructable;
}
