import { importHTML } from 'legions-import-html-entry';
import { Unpacked } from '../interfaces';
let microApps: {
  name: string;
  entry: string;
  container: string;
}[] = []; // {name:'',entry:'url',container:'DOMid',appId:'',styleId:'',loading:true}
interface IScriptResources {
  [key: string]: {
    scripts: string[];
    scriptCache: { key: string; code: string }[];
    sandbox: string[];
    styles: string[];
    excludeSandboxFiles: { url: string; code: string }[];
    /** 外部资源加载Promise结果 */
    externalOnloadScriptPromise: Promise<any>[];
  };
}
let scriptResources: IScriptResources = {}; // {'entry':{scripts:[],scriptCache:[],sandbox:[],excludeSandboxFiles:[]}}
/* let isImportHTML = false; */
let externalOnloadScript: { url: string; code: string }[] = []; // [{url:'',code:''}] 已加载过外部资源列表
export class MicroApps {
  constructor() {}
  static getStore() {
    return {
      apps: microApps,
      scriptResources: scriptResources,
      externalOnloadScript: externalOnloadScript,
    };
  }
  getApps() {
    return {
      apps: microApps,
      scriptResources: scriptResources,
      externalOnloadScript: externalOnloadScript,
    };
  }
  isRegister(apps) {
    const unregisteredApps = microApps.filter(item => item.name === apps.name);
    if (unregisteredApps.length > 0) {
      return unregisteredApps;
    }
    return null;
  }
  register(apps) {
    if (Array.isArray(apps)) {
      const unregisteredApps = apps.filter(
        app => !microApps.some(registeredApp => registeredApp.name === app.name)
      );
      microApps = [...microApps, ...unregisteredApps];
    }
  }

  bootstrap(
    apps: {
      container: string;
      entry: string;
      name: string;
    },
      importHtmlentryResult: {
          getExternalScripts: Unpacked<ReturnType<typeof importHTML>>['getExternalScripts'],
          getScripts:Unpacked<ReturnType<typeof importHTML>>['getScripts'],
    }
  ) {
    const that = this;
    let sourceUrl = apps['entry'];
    let isCheckRegister = () => {
      const oldApps = this.isRegister(apps);
      if (!oldApps) {
          microApps = [...microApps,apps];
          syncMicroApps();
      }
    };
    const syncMicroApps = function () {
      importHtmlentryResult.getExternalScripts().then(exports => {
        if (importHtmlentryResult.getScripts) {
          const scriptList = importHtmlentryResult.getScripts();
          let excludeFiles: { url: string; code: string }[] = [];
          const _scripts = scriptList['scripts'];
          const scriptCache: { key: string; code: string }[] = [];
          if (
            exports &&
            Object.prototype.toString.call(exports) === '[object Array]'
          ) {
            exports.forEach(item => {
              scriptCache.push({
                key: item.scripts,
                code: item['scriptsText'],
              });
            });
          }
          if (scriptList['excludeFiles'].hasOwnProperty(sourceUrl)) {
            scriptList['excludeFiles'][sourceUrl].forEach(item => {
              scriptCache.forEach(entity => {
                const _index = entity.key.indexOf(item);
                if (_index > -1) {
                  excludeFiles.push({ url: entity.key, code: entity.code });
                }
              });
            });
          }

          scriptResources[sourceUrl] = {
            scripts: scriptList['scripts'][sourceUrl],
            scriptCache: scriptCache, //[{key:'',code:''}]
            excludeSandboxFiles: excludeFiles, // [{url:'',code:''}]
            sandbox: [], //['url']
            styles: [],
            externalOnloadScriptPromise: [],
          };
          if (_scripts.hasOwnProperty(sourceUrl)) {
            _scripts[sourceUrl].forEach(item => {
              excludeFiles.forEach(entity => {
                if (entity) {
                  const _index = entity.url.indexOf(item);
                  if (_index < 0) {
                    scriptResources[sourceUrl]['sandbox'].push(item);
                  }
                }
              });
            });
          }
        }
      });
    };
    isCheckRegister.call(that);
  }
}
