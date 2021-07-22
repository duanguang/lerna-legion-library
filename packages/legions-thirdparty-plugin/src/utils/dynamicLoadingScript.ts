import { findWindow } from './findWindow';

/** 动态加载JS资源 */
export function dynamicLoadingScript<T = {}>(options: {
  /** 创建资源节点的唯一ID */
  scriptId: string;
  src: string;
  /** 全局变量名称 */
  library: string;
  loaded?: (value: T | null) => void;
}) {
  if (options) {
    let LegionstValue = findWindow(options.library);
    const onload = function () {
      let script = document.createElement('script');
      script.src = options.src;
      script.id = options.scriptId || 'legions-plugin-sdk';
      const s = script;
      if (!!document.getElementById(script.id)) {
        //@ts-ignore
        s = document.getElementById(script.id);
      } else {
        document.body.appendChild(script);
      }
      s.addEventListener('load', function () {
        //@ts-ignore
        if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
          LegionstValue = findWindow(options.library);
          if (typeof options.loaded === 'function') {
            // @ts-ignore
            options.loaded(LegionstValue);
          }
          const plugin = PluginList.get(options.src);
          if (plugin) {
            plugin.value = LegionstValue;
            plugin.onLoadedList.map(item => {
              if (typeof item === 'function') {
                item(LegionstValue);
              }
            });
            plugin.onLoadedList = [];
            PluginList.set(options.src, plugin);
          }
        }
      });
    };
    const sdkElemnet = document.getElementById(options.scriptId);
    if (!sdkElemnet && !LegionstValue) {
      onload();
    } else if (sdkElemnet && !LegionstValue) {
      console.warn('定义了相同节点ID,检查scriptId 值');
    }
  }
}
const PluginList = new Map<
  string,
  {
    value: any;
    scriptId: string;
    src: string;
    onLoadedList: Array<(value: any) => void>;
  }
>();

const _LegionsPlugins = (options: {
  onLoaded?: (value: any) => void;
  scriptId: string;
  src: string;
  library: string;
}) => {
  let _legions = PluginList.get(options.src);
  if (_legions) {
    if (options && typeof options.onLoaded === 'function') {
      options.onLoaded && options.onLoaded(_legions.value); // 如果资源已经加载完成，传入的回调函数立即执行
    }
  } else {
    let legions = null;
    try {
      if (
        window[options.library] &&
        Object.keys(window[options.library]).length > 0
      ) {
        legions = window[options.library];
      } else if (
        window.parent[options.library] &&
        Object.keys(window.parent[options.library]).length > 0
      ) {
        legions = window.parent[options.library];
      }
    } catch (e) {
      legions = window[options.library];
    } finally {
      if (!legions) {
        // 主要用于存储legions-plugin-sdk 加载完成时，需要执行的回调函数队列信息
        let pluginLoadedList: Array<(value: any) => void> = [];
        if (options && typeof options.onLoaded === 'function') {
          // 当资源还未加载完成时，所有调用该函数的回调，全部写入待执行队列，在资源加载完成，在依次执行
          pluginLoadedList.push(options.onLoaded);
        }
        PluginList.set(options.src, {
          value: null,
          scriptId: options.scriptId,
          src: options.src,
          onLoadedList: pluginLoadedList,
        });
        const { onLoaded, ...props } = options;
        dynamicLoadingScript(props);
      }
    }
  }
};
/**全局变量LegionsPlugins执行函数
 * 回调函数执行时机，如果SDK资源未加载，则在资源加载完成时执行。如果资源已经准备妥当，则直接执行回调
 *
 */
export function LegionsPluginsExecute(
  onExecute: (legions: any) => void,
  options: {
    scriptId: string;
    src: string;
    library: string;
  }
) {
  _LegionsPlugins({
    onLoaded: value => {
      onExecute && onExecute(value);
    },
    ...options,
  });
}
