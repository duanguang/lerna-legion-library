import { IReport } from './report';
import { ILegionsPluginDataOrigin } from './data.origin';
import { findWindow } from '../utils/findWindow';
interface IAppStore {
  apps: {
    appId: string;
    styleId: string;
    name: string;
    render: () => void;
    entry: string;
    container: string;
  }[];
  scriptResources: {
    [x: string]: {
      excludeSandboxFiles: { code: string; url: string }[];
      sandbox: string[];
      scriptCache: { code: string; key: string }[];
      scripts: string[];
      styles: string[];
    };
  };
  currentEnvironment: 'normal' | 'sandbox';
  externalOnloadScript: { url: string; code: string }[];
}
interface ClassOf<T> {
  new (...args: any[]): T;
}
declare class MicroApps {
  /**
   *Creates an instance of MicroApps.
   * @param {*} options  {
              excludeFiles:['vendor.dll.65dbcc8352253775138423bdeb0f0cdf.js'],
              importHTML:'',
      isMerge:false}
   * @memberof MicroApps
   */
  constructor(options: {
    isMerge: boolean;
    /* 排除在沙箱运行的资源*/
    excludeFiles: string[];
    /** url */
    importHTML: string;
  });
  static getStore(): IAppStore;
  getApps(): IAppStore;
  /* isRegister(apps: any): void;
  register(apps: any): void;
  addRender(app: any): void; */
  mounted(apps?: {
    entry: string;
    name: string;
    appId: string;
    styleId: string;
    /** 容易 */
    container: string;
  }): void;
}
interface IlegionsPlugin<DataOrigin = {}> {
  BrowserMatch: {
    getBrowser: () => {
      browser: string;
      desc: string;
      version: string;
    };
    getOS: () => string;
    getDigits: () => string;
    init: () => void;
    OS?: string;
    browser?: string;
    version?: string;
  };
  DataOrigin: {
    add: <T, K extends keyof T>(key: keyof Partial<T>, value: T[K]) => void;
    has: <T>(key: keyof Partial<T>) => boolean;
    get: <T, K extends keyof T>(
      key: keyof Partial<T & ILegionsPluginDataOrigin & DataOrigin>
    ) => T[K];
    update: <T, K extends keyof T>(key: keyof Partial<T>, value: T[K]) => void;
  };
  onloadScript: (src: string, onLoad?: Function) => void;
  checkBrowser: () => boolean;
  PostMessageUtils: {
    receiveMessage: (receive: Function) => void;
    sendMessageToChildrenWin: (options: {
      data: Object;
      childrenId: string;
      origin: string;
    }) => void;
    sendMessageToParentWin: (options: { data: Object; origin: string }) => void;
  };
  Report: IReport;
  MicroApps: ClassOf<MicroApps> & typeof MicroApps;
}

let legionsPluginLoadedList: Array<() => void> = []; // 主要用于存储legions-plugin-sdk 加载完成时，需要执行的回调函数队列信息
function onLoadScript(
  options: {
    onLoaded?: () => void;
    src?: string;
    notification?: () => void;
  } = {}
) {
  let id = 'legions-plugin-sdk';
  const LegionstValue = findWindow('legionsPlugins');
  if (!LegionstValue && !document.getElementById(id)) {
    let script = document.createElement('script');
    script.id = id;
    const version = Date.parse(new Date().toString());
    if (options && typeof options.src === 'string' && options.src) {
      script.src = options.src;
    } else {
      script.src =
        process.env.environment === 'production'
          ? `https://hoolinks.com/static/common/plugins/legions-plugin-sdk.min.js?v=${version}`
          : `https://qa-zy.hoolinks.com/static/plugin/legions-plugin-sdk.js?v=${version}`;
    }
    document.body.appendChild(script);
    // @ts-ignore
    script.onload = script.onreadystatechange = function () {
      // tslint:disable-next-line: no-invalid-this
      //@ts-ignore
      if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
        let legions = legionsPlugins();
        addBrowserMessage(legions, options.notification);
        if (options && typeof options.onLoaded === 'function') {
          options.onLoaded && options.onLoaded();
        }
        legionsPluginLoadedList.map(item => {
          item();
        });
        legionsPluginLoadedList = [];
      }
    };
  }
}
function addBrowserMessage(legions: IlegionsPlugin, notification?: () => void) {
  if (!legions) {
    return;
  }
  if (
    legions.DataOrigin.has<ILegionsPluginDataOrigin>('openBrowserUpdateMessage')
  ) {
    return;
  }
  legions.DataOrigin.add('openBrowserUpdateMessage', () => {
    const keys = 'isOpenBrowserUpdateMessage';
    if (!legions.DataOrigin.get(keys)) {
      if (typeof notification === 'function') {
        notification();
      }
      if (legions.DataOrigin.has(keys)) {
        legions.DataOrigin.update(keys, true);
      } else {
        legions.DataOrigin.add(keys, true);
      }
    }
  });
}
const _LegionsPlugins = () => {
  let _legions = null;
  let getLegions = (
    options: {
      onLoaded?: () => void;
      src?: string;
      notification?: () => void;
    } = {}
  ) => {
    if (_legions) {
      if (options && typeof options.onLoaded === 'function') {
        options.onLoaded && options.onLoaded(); // 如果资源已经加载完成，传入的回调函数立即执行
      }
      //@ts-ignore
      addBrowserMessage(_legions);
      return _legions;
    }
    let legions = null;
    try {
      if (
        window['legionsPlugins'] &&
        Object.keys(window['legionsPlugins']).length > 0
      ) {
        legions = window['legionsPlugins'];
      } else if (
        window.parent['legionsPlugins'] &&
        Object.keys(window.parent['legionsPlugins']).length > 0
      ) {
        legions = window.parent['legionsPlugins'];
      }
    } catch (e) {
      legions = window['legionsPlugins'];
    } finally {
      if (!legions) {
        if (options && typeof options.onLoaded === 'function') {
          // 当资源还未加载完成时，所有调用该函数的回调，全部写入待执行队列，在资源加载完成，在依次执行
          legionsPluginLoadedList.push(options.onLoaded);
        }
        onLoadScript(options);
      }
    }
    _legions = legions;
    return _legions;
  };
  return getLegions;
};
/** 公共SDK方法，包含用户浏览器信息,写入公共方法 */
//@ts-ignore
export const legionsPlugins: (options?: {
  onLoaded?: () => void;
  src?: string;
  notification?: () => void;
}) => IlegionsPlugin = _LegionsPlugins();

/**全局变量LegionsPlugins执行函数
 * 回调函数执行时机，如果SDK资源未加载，则在资源加载完成时执行。如果资源已经准备妥当，则直接执行回调
 *
 */
export function LegionsPluginsExecute(
  onExecute: (legions: IlegionsPlugin) => void
) {
  legionsPlugins({
    onLoaded: () => {
      const legions = legionsPlugins();
      if (legions) {
        onExecute && onExecute(legions);
      }
    },
  });
}


