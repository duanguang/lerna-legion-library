import { IlegionsThirdpartyPlugin } from '../../api';
import { LEGIONS_THIRDPARTY_PLUGIN, PLUGINS, PROXY_LEGIONS_THIRPARTY_PLUGIN, TypePluginName,THIRDPARTY_PLUGINS } from './plugin.config';
import { proxyGetters } from './utils';
import { EventHub } from './eventHub';
interface IPlugin {
  name: TypePluginName;
  url: string;
}
proxyGetters(PROXY_LEGIONS_THIRPARTY_PLUGIN, LEGIONS_THIRDPARTY_PLUGIN);
function onLoadScript(plugin: IPlugin) {
  let id = `legions-${plugin.name}`;
  let LegionstValue = null;
  try {
    LegionstValue = window.parent[THIRDPARTY_PLUGINS[plugin.name]];
  } catch (e) {
    LegionstValue = null;
  }
  if (!LegionstValue) {
    LegionstValue = window[THIRDPARTY_PLUGINS[plugin.name]];
  }
  if (!LegionstValue && !document.getElementById(id)) {
    let script = document.createElement('script');
    script.id = id;
    const version = Date.parse(new Date().toString());
    script.src = `${plugin.url}?v=${version}`;
    document.body.appendChild(script);
    // @ts-ignore
    script.onload = script.onreadystatechange = function () {
      // tslint:disable-next-line: no-invalid-this
      //@ts-ignore
      if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
        if (window[THIRDPARTY_PLUGINS[plugin.name]]) {
          if (plugin.name === 'jsBarcode') {
            LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
              window[THIRDPARTY_PLUGINS[plugin.name]]['JsBarcode'];
          } else if (plugin.name === 'dexie') {
            LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
              window[THIRDPARTY_PLUGINS[plugin.name]]['DexieUtils'];
          } else {
            LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
              window[THIRDPARTY_PLUGINS[plugin.name]];
          }
          EventContainer.emit(plugin.name);
          EventContainer.off(plugin.name);
        }
      }
    };
  } else {
    if (LegionstValue) {
      /** 修复在节点和值都不存在时才去请求插件，
      导致在并发环境中,其中一个请求已经创建节点请求资源,但资源还未回来，
      导致条件判定不成立，误认为已经有值，直接取值导致异常 */
      if (plugin.name === 'jsBarcode') {
        LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = LegionstValue['JsBarcode'];
      } else if (plugin.name === 'dexie') {
        LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = LegionstValue['DexieUtils'];
      } else {
        LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = LegionstValue;
      }
    }
  }
}

const EventContainer = new EventHub();
export class ThirdpartyPlugin {
  use(plugin: IPlugin[] | IPlugin) {
    if (typeof plugin === 'object') {
      if (Array.isArray(plugin)) {
        plugin.map(item => {
          onLoadScript(item);
        });
      } else {
        onLoadScript(plugin);
      }
    }
  }
  /** 订阅某个插件数据,在有结果时，执行回调函数
   *
   * 注意 如果在使用插件数据时，非常明确插件数据有值，就不需要订阅执行
   *
   * 主要应用场景插件发起异步请求时，无法确定其返回具体时间,这时依赖插件数据做的事件必须等其准备才能去执行
   *
   * name参数为字符串时，订阅单个数据
   *
   * name参数为字符串数组时，使用场景为你的回调函数依赖多个插件值，这时才去使用，然而大多数情况我们是用不上，因此有需要就传数组
   */
  subscribe(name: IPlugin['name'] | IPlugin['name'][], callback: () => void) {
    if (typeof name === 'string') {
      if (LEGIONS_THIRDPARTY_PLUGIN[name]) {
        callback();
      } else {
        EventContainer.on(name, callback);
      }
    } else if (Object.prototype.toString.call(name) === '[object Array]') {
      let list: { name: IPlugin['name']; value: any }[] = [];
      name.map(item => {
        list.push({ name: item, value: LEGIONS_THIRDPARTY_PLUGIN[item] });
      });
      if (list.every(item => item.value)) {
        callback();
      } else {
        list = [];
        const timeid = setInterval(() => {
          name.map(item => {
            list.push({ name: item, value: LEGIONS_THIRDPARTY_PLUGIN[item] });
          });
          if (list.every(item => item.value)) {
            callback();
            clearInterval(timeid);
          } else {
            list = [];
          }
        }, 400);
      }
    }
  }
  get plugins() {
    return PROXY_LEGIONS_THIRPARTY_PLUGIN;
  }
}
export const runScriptsSdk = new ThirdpartyPlugin();