import { IlegionsThirdpartyPlugin } from '../types/api';
const PLUGINS = {
  excel: 'legionsThirdpartyExcelPlugin',
};
const LEGIONS_THIRDPARTY_PLUGIN: IlegionsThirdpartyPlugin = {
  //@ts-ignore
  excel: null,
  //@ts-ignore
  html2canvas: null,
  //@ts-ignore
  jsBarcode: null,
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
  name: 'excel';
  url?: string;
}
export class LegionsThirdpartyPlugin {
  use(plugin: IPlugin[] | IPlugin) {
    if (Array.isArray(plugin)) {
      plugin.map(item => {
        onLoadScript(item);
      });
    }
  }
  get plugins() {
    return LEGIONS_THIRDPARTY_PLUGIN;
  }
}
export const legionsThirdpartyPlugin = new LegionsThirdpartyPlugin();
