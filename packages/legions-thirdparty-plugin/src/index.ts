import { IlegionsThirdpartyPlugin } from '../types/api';
const PLUGINS = {
  excel: 'legionsThirdpartyExcelPlugin',
  html2canvas: 'legionsThirdpartyHtml2canvasPlugin',
  jsBarcode: 'legionsThirdpartyJsbarcodePlugin',
  clipboard: 'legionsThirdpartyClipboardPlugin',
  dexie: 'legionsThirdpartyDexiePlugin',
};
const LEGIONS_THIRDPARTY_PLUGIN: IlegionsThirdpartyPlugin = {
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
    script.src = `${plugin.url}v=${version}`;
    document.body.appendChild(script);
    // @ts-ignore
    script.onload = script.onreadystatechange = function () {
      // tslint:disable-next-line: no-invalid-this
      //@ts-ignore
      if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
        LEGIONS_THIRDPARTY_PLUGIN[plugin.name] = window[PLUGINS[plugin.name]];
      }
    };
  }
}

interface IPlugin {
  name: 'excel' | 'html2canvas' | 'jsBarcode' | 'clipboard';
  url?: string;
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
  get plugins() {
    return LEGIONS_THIRDPARTY_PLUGIN;
  }
}
export const legionsThirdpartyPlugin = new LegionsThirdpartyPlugin();
export { focusBind } from './focus-outside';
