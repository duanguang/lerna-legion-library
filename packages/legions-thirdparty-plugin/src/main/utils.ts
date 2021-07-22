import { IlegionsThirdpartyPlugin } from "../../api";

export function createObj(): IlegionsThirdpartyPlugin {
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
      //@ts-ignore
      focusOutside: null,
    };
}
export const proxyGetters = function (
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