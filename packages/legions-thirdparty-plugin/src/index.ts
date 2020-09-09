import { IlegionsThirdpartyPlugin } from '../types/api';
const PLUGINS = {
  excel: 'legionsThirdpartyExcelPlugin',
  html2canvas: 'legionsThirdpartyHtml2canvasPlugin',
  jsBarcode: 'legionsThirdpartyJsbarcodePlugin',
  clipboard: 'legionsThirdpartyClipboardPlugin',
  dexie: 'legionsThirdpartyDexiePlugin',
};
function createObj(): IlegionsThirdpartyPlugin {
  return {
    //@ts-ignore
    excel: null,
    //@ts-ignore
    html2canvas: null,
    //@ts-ignore
    jsBarcode: null,
    //@ts-ignore
    clipboard: null,
    //@ts-ignore
    dexie: null,
  };
}
const LEGIONS_THIRDPARTY_PLUGIN: IlegionsThirdpartyPlugin = createObj();
const PROXY_LEGIONS_THIRPARTY_PLUGIN: IlegionsThirdpartyPlugin = createObj();
const proxyGetters = function (
  proxytarget: IlegionsThirdpartyPlugin,
  orginSource: IlegionsThirdpartyPlugin
) {
  Object.keys(orginSource).forEach(key => {
    Object.defineProperty(proxytarget, key, {
      configurable: false,
      get: () => {
        //@ts-ignore
        if (!orginSource[key] && process.env.NODE_ENV !== 'production') {
          console.error(
            `${key}:Property has no value yet,it is possible that the Plugin is not ready, Please install at the entrance(legionsThirdpartyPlugin.use({name:'${key}',url:''}))`
          );
        }
        return orginSource[key];
      },
    });
  });
};

proxyGetters(PROXY_LEGIONS_THIRPARTY_PLUGIN, LEGIONS_THIRDPARTY_PLUGIN);
function onLoadScript(plugin: IPlugin) {
  let id = `legions-${plugin.name}`;
  if (
    !window[PLUGINS[plugin.name]] &&
    !window.parent[PLUGINS[plugin.name]] &&
    !document.getElementById(id)
  ) {
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
        if (plugin.name === 'jsBarcode') {
          LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
            window[PLUGINS[plugin.name]]['JsBarcode'];
        } else if (plugin.name === 'dexie') {
          LEGIONS_THIRDPARTY_PLUGIN[plugin.name] =
            window[PLUGINS[plugin.name]]['DexieUtils'];
        } else {
          LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = window[PLUGINS[plugin.name]];
        }
      }
    };
  } else {
    const globalValue =
      window[PLUGINS[plugin.name]] || window.parent[PLUGINS[plugin.name]];
    if (plugin.name === 'jsBarcode') {
      LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = globalValue['JsBarcode'];
    } else if (plugin.name === 'dexie') {
      LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = globalValue['DexieUtils'];
    } else {
      LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = globalValue;
    }
  }
}

interface IPlugin {
  name: 'excel' | 'html2canvas' | 'jsBarcode' | 'clipboard' | 'dexie';
  url: string;
}
export class LegionsThirdpartyPlugin {
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
  subscribe(name: IPlugin['name'] | IPlugin['name'][], callback: () => void) {
    if (typeof name === 'string') {
      if (!LEGIONS_THIRDPARTY_PLUGIN[name]) {
        const timeid = setInterval(() => {
          if (LEGIONS_THIRDPARTY_PLUGIN[name]) {
            callback();
            clearInterval(timeid);
          }
        }, 150);
      } else {
        callback();
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
        }, 150);
      }
    }
  }
  get plugins() {
    return PROXY_LEGIONS_THIRPARTY_PLUGIN;
  }
}
export const legionsThirdpartyPlugin = new LegionsThirdpartyPlugin();
export { focusBind } from './focus-outside';
