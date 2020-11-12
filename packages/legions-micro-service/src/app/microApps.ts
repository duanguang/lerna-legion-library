import { onloadScript, isObject } from '../utils/app';
import { checkBrowser } from '../utils/browser';
import { importHTML } from 'legions-import-html-entry';
import { Unpacked } from '../interfaces';
let microApps: {
  name: string;
  entry: string;
  container: string;
  appId: string;
  styleId: string;
  loading?: boolean;
  render?: () => void;
}[] = []; // {name:'',entry:'url',container:'DOMid',appId:'',styleId:'',loading:true}
interface IScriptResources {
  [key: string]: {
    scripts: string[];
    scriptCache: { key: string; code: string }[];
    sandbox: string[];
    styles: string[];
    excludeSandboxFiles: { url: string; code: string }[];
    importHtmlentryResult: Unpacked<ReturnType<typeof importHTML>>;
    /** 外部资源加载Promise结果 */
    externalOnloadScriptPromise: Promise<any>[];
  };
}
let scriptResources: IScriptResources = {}; // {'entry':{scripts:[],scriptCache:[],sandbox:[],excludeSandboxFiles:[]}}
/* let isImportHTML = false; */
let externalOnloadScript: { url: string; code: string }[] = []; // [{url:'',code:''}] 已加载过外部资源列表
let isPassCheckBrowser = false;
let currentEnvironment = 'normal'; // 'normal'|'sandbox'  正常环境或沙盒
export class MicroApps {
  importHTMLOptions: {
    excludeFiles: string[];
    isMerge: boolean;
  } = {
    excludeFiles: [],
    isMerge: false,
  };
  /**
     *Creates an instance of MicroApps.
     * @param {*} options  {
                excludeFiles:['vendor.dll.65dbcc8352253775138423bdeb0f0cdf.js'],
                importHTML:'',
				isMerge:false}
     * @memberof MicroApps
     */
  constructor(options: {
    /* importHTML?: string; */
    excludeFiles?: string[];
    isMerge?: boolean;
  }) {
    if (options && isObject(options)) {
      /* if (options['importHTML']) {
        this.importHTML = options['importHTML'];
        //@ts-ignore
        delete options['importHTML'];
      } */
      this.importHTMLOptions = {
        excludeFiles: options['excludeFiles'] || [],
        isMerge: options['isMerge'] || false,
      };
    }
  }
  static getStore() {
    return {
      apps: microApps,
      scriptResources: scriptResources,
      currentEnvironment,
      externalOnloadScript: externalOnloadScript,
    };
  }
  getApps() {
    return {
      apps: microApps,
      scriptResources: scriptResources,
      currentEnvironment,
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
  addRender(app: { name: string; render: () => void }) {
    microApps.forEach(item => {
      if (item.name === app.name && !item.render) {
        item.render = app.render;
      }
    });
  }
  mounted(apps: {
    appId: string;
    container: string;
    styleId: string;
    entry: string;
    name: string;
    loading?: boolean;
    render?: () => void;
  }) {
    const that = this;
    if (!isPassCheckBrowser) {
      //@ts-ignore
      isPassCheckBrowser = checkBrowser();
    }
    let sourceUrl = apps['entry'];
    let appId = apps.appId;
    const container = apps.container || 'reactSandboxWrap';
    if (!appId) {
      console.error('请先设置应用appId信息');
      return;
    }
    if (!sourceUrl) {
      console.error('请先设置应用入口地址entry信息');
      return;
    }
    let styleId = apps.styleId;
    let isCheckRegister = () => {
      const oldApps = this.isRegister(apps);
      if (!oldApps) {
        microApps = [...microApps, apps];
      } else {
        apps = oldApps[0];
      }
    };
    isCheckRegister.call(that);
    function renderStyles(styles: string[] = []) {
      styles.forEach(function (item) {
        var style = document.createElement('style');
        var styleWrap = document.getElementById(styleId);
        style.innerHTML = item;
        //@ts-ignore
        styleWrap.appendChild(style);
      });
    }
    function main() {
      /* if (reactSandboxList && reactSandboxList.indexOf(sourceUrl)>-1) return; */
      if (scriptResources && scriptResources.hasOwnProperty(sourceUrl)) {
        currentEnvironment = 'sandbox';
        apps.render && apps.render();
        renderStyles(scriptResources[sourceUrl]['styles']);
        return;
      }
      importHTML(
        sourceUrl,
        /* {
				excludeFiles:['vendor.dll.js'],
				isMerge:false,
			} */ that.importHTMLOptions ||
          {}
      ).then(function (res) {
        /** 添加标记，防止重复加载 */
        res.getExternalScripts().then(exports => {
          if (res.getScripts) {
            /** // {excludeFiles:{url:['']},
             * scripts:{url:[]}} */
            const scriptList = res.getScripts();
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
              importHtmlentryResult: res,
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
            let promiseLoadScript: Promise<any>[] = [];
            excludeFiles.forEach(item => {
              var fn = function () {
                let p = new Promise((resolve, reject) => {
                  onloadScript(item.url, () => {
                    scriptResources[sourceUrl].scriptCache.forEach(s => {
                      if (s.key === item.url) {
                        externalOnloadScript.push({
                          url: item.url,
                          code: s.code,
                        });
                        resolve(externalOnloadScript);
                      }
                    });
                  });
                });
                promiseLoadScript.push(p);
              };
              if (!externalOnloadScript.length) {
                // 如果外部加载资源项为空，则直接加载资源
                fn();
              } else {
                externalOnloadScript.forEach(entry => {
                  const _index = entry.url.indexOf(item.url); // 判定资源名称及资源代码字符串是否一致，如果一样，则表示资源已经加载过，不需要重复加载
                  if (_index < 0 && entry.code !== item.code) {
                    fn();
                  }
                });
              }
            });
            scriptResources[
              sourceUrl
            ].externalOnloadScriptPromise = promiseLoadScript;
            /* Promise.all(
              scriptResources[sourceUrl].externalOnloadScriptPromise
            ).then(values => {
              res.execScripts().then(() => {
                isCheckRegister.call(that);
                currentEnvironment = 'sandbox';
                apps.render && apps.render();
              });
              res.getExternalStyleSheets().then(function (exports) {
                if (scriptResources[sourceUrl]['styles'].length) {
                  scriptResources[sourceUrl]['styles'] = [];
                }
                exports.forEach(function (item) {
                  scriptResources[sourceUrl]['styles'].push(item);
                  let style = document.createElement('style');
                  let styleWrap = document.getElementById(styleId);
                  style.innerHTML = item;
                  //@ts-ignore
                  styleWrap.appendChild(style);
                });
              });
            }); */
          }
        });
      });
    }

    main.call(that);
  }
}
