import { SandBoxType } from '../utils';
import { Freer, Rebuilder } from '../interfaces';
import ProxySandbox from './proxySandbox';
/**
 * 生成应用运行时沙箱
 *
 * 沙箱分两个类型：
 * 1. app 环境沙箱
 *  app 环境沙箱是指应用初始化过之后，应用会在什么样的上下文环境运行。每个应用的环境沙箱只会初始化一次，因为子应用只会触发一次 bootstrap 。
 *  子应用在切换时，实际上切换的是 app 环境沙箱。
 * 2. render 沙箱
 *  子应用在 app mount 开始前生成好的的沙箱。每次子应用切换过后，render 沙箱都会重现初始化。
 *
 * 这么设计的目的是为了保证每个子应用切换回来之后，还能运行在应用 bootstrap 之后的环境下。
 *
 * @param appName
 */
import { hijackAtBootstrapping, hijackAtMounting } from '../hijackers';
import SnapshotSandbox from './snapshotSandbox';
import { patchAtBootstrapping, patchAtMounting } from './patchers';
export function createSandbox(appName: string, elementGetter: () => HTMLElement | ShadowRoot,scopedCSS: boolean,excludeAssetFilter?: (url: string) => boolean) {
  let sandbox: ProxySandbox | SnapshotSandbox;
  if (window.Proxy) {
    sandbox = new ProxySandbox({ name: appName });
  } else {
    sandbox = new SnapshotSandbox(appName);
  }
  // mounting freers are one-off and should be re-init at every mounting time
  let mountingFreers: Freer[] = [];

  let sideEffectsRebuilders: Rebuilder[] = [];
  /* const bootstrappingFreers = hijackAtBootstrapping(appName, sandbox.sandbox); */ // 0.0.5 版本代码
  const bootstrappingFreers = patchAtBootstrapping(appName,elementGetter,sandbox,scopedCSS,excludeAssetFilter);
  return {
    proxy: sandbox.sandbox,

    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    async mount() {
      const sideEffectsRebuildersAtBootstrapping = sideEffectsRebuilders.slice(
        0,
        bootstrappingFreers.length
      );
      const sideEffectsRebuildersAtMounting = sideEffectsRebuilders.slice(
        bootstrappingFreers.length
      );
      // must rebuild the side effects which added at bootstrapping firstly to recovery to nature state
      if (sideEffectsRebuildersAtBootstrapping.length) {
        sideEffectsRebuildersAtBootstrapping.forEach(rebuild => rebuild());
      }
      /* ------------------------------------------ 因为有上下文依赖（window），以下代码执行顺序不能变 ------------------------------------------ */

      /* ------------------------------------------ 1. 启动/恢复 沙箱------------------------------------------ */
      sandbox.active();

      /* ------------------------------------------ 2. 开启全局变量补丁 ------------------------------------------*/
      // render 沙箱启动时开始劫持各类全局监听，尽量不要在应用初始化阶段有 事件监听/定时器 等副作用
      if (window.Proxy) {
        // 在不支持Proxy浏览器环境，比如IE11及以下，执行此行代码会导致切换应用时，执行异常，暂时还未查出原因，先临时这样处理
        /* mountingFreers.push(...hijackAtMounting(appName, sandbox.sandbox)); */// 0.0.5 版本代码
        mountingFreers.push(...patchAtMounting(appName,elementGetter, sandbox,scopedCSS,excludeAssetFilter));
      }

      /* ------------------------------------------ 3. 重置一些初始化时的副作用 ------------------------------------------*/
      // 存在 rebuilder 则表明有些副作用需要重建
      if (sideEffectsRebuildersAtMounting.length) {
        sideEffectsRebuildersAtMounting.forEach(rebuild => rebuild());
      }

      // clean up rebuilders
      sideEffectsRebuilders = [];
    },

    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    async unmount() {
      // record the rebuilders of window side effects (event listeners or timers)
      // note that the frees of mounting phase are one-off as it will be re-init at next mounting
      sideEffectsRebuilders = [
        ...bootstrappingFreers,
        ...mountingFreers,
      ].map(free => free());
      sandbox.inactive();
    },
  };
}
