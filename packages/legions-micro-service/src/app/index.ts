import { onloadScript, isObject } from '../utils';
import { checkBrowser } from '../utils/browser';
let microApps: {
  name: string;
  entry: string;
  container: string;
  appId: string;
  styleId: string;
  loading?: boolean;
  render?: () => void;
}[] = []; // {name:'',entry:'url',container:'DOMid',appId:'',styleId:'',loading:true}
let scriptResources = {}; // {'entry':{scripts:[],scriptCache:[],sandbox:[],excludeSandboxFiles:[]}}
let isImportHTML = false;
let externalOnloadScript: { url: string; code: string }[] = []; // [{url:'',code:''}] 已加载过外部资源列表
let isPassCheckBrowser = false;
let currentEnvironment = 'normal'; // 'normal'|'sandbox'  正常环境或沙盒
export class MicroApps {
  importHTML = `https://qa-zy.hoolinks.com/static/plugin/import-html-entry.min.js?version=${new Date().getTime()}`;
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
    importHTML?: string;
    excludeFiles?: string[];
    isMerge?: boolean;
  }) {
    if (options && isObject(options)) {
      if (options['importHTML']) {
        this.importHTML = options['importHTML'];
        //@ts-ignore
        delete options['importHTML'];
      }
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
      /* unregisteredApps.forEach((app) => {
                this.mounted(app)
            }) */
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
    function renderStyles(styles = []) {
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
      //@ts-ignore
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
            Promise.all(promiseLoadScript).then(values => {
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
            });
          }
        });
      });
    }
    /** 环境准备，加载import-html-entry.js，创建模块渲染节点，创建样式节点 */

    let wrap =
      document.getElementById(container) ||
      document.getElementsByClassName(container);
    let style = document.createElement('div');
    let app = document.createElement('div');
    /* script.src = 'https://hoolinks.com/static/common/plugins/import-html-entry.js'; */

    style.id = styleId;
    app.id = appId;
    if (apps.loading) {
      app.innerHTML =
        '<div class="preloader"><div class="cs-loader"><div class="cs-loader-inner"><label> ●</label><label> ●</label><label> ●</label><label> ●</label><label> ●</label><label> ●</label></div></div></div><style type="text/css">.reactSandboxWrap{position:relative;min-height: 100%;}.tab-right{padding: 0!important;}.preloader{position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;background:#1890ff;z-index:9999;transition:opacity .65s}.preloader-hidden-add{opacity:1;display:block}.preloader-hidden-add-active{opacity:0}.preloader-hidden{display:none}.cs-loader{position:absolute;top:0;left:0;height:100%;width:100%}.cs-loader-inner{transform:translateY(-50%);top:50%;position:absolute;width:100%;color:#fff;text-align:center}.cs-loader-inner label{font-size:20px;opacity:0;display:inline-block}@keyframes lol{0%{opacity:0;transform:translateX(-300px)}33%{opacity:1;transform:translateX(0)}66%{opacity:1;transform:translateX(0)}100%{opacity:0;transform:translateX(300px)}}.cs-loader-inner label:nth-child(6){animation:lol 3s infinite ease-in-out}.cs-loader-inner label:nth-child(5){animation:lol 3s .1s infinite ease-in-out}.cs-loader-inner label:nth-child(4){animation:lol 3s .2s infinite ease-in-out}.cs-loader-inner label:nth-child(3){animation:lol 3s .3s infinite ease-in-out}.cs-loader-inner label:nth-child(2){animation:lol 3s .4s infinite ease-in-out}.cs-loader-inner label:nth-child(1){animation:lol 3s .5s infinite ease-in-out}</style>';
    }
    /** 插入app节点和样式节点 */
    if (wrap) {
      if (wrap instanceof HTMLCollection) {
        if (wrap[0]) {
          !document.getElementById(style.id) && wrap[0].appendChild(style);
          !document.getElementById(app.id) && wrap[0].appendChild(app);
        } else {
          !document.getElementById(style.id) &&
            document.body.appendChild(style);
          !document.getElementById(app.id) && document.body.appendChild(app);
        }
      } else {
        //@ts-ignore
        !document.getElementById(style.id) && wrap.appendChild(style);
        //@ts-ignore
        !document.getElementById(app.id) && wrap.appendChild(app);
      }
    } else {
      !document.getElementById(style.id) && document.body.appendChild(style);
      !document.getElementById(app.id) && document.body.appendChild(app);
    }

    if (window['importHTML'] && isImportHTML) {
      main.call(that);
    } else {
      if (window['importHTML']) {
        let scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
          let script = scripts[i];
          if (
            script &&
            script.getAttribute('src') &&
            //@ts-ignore
            script
              .getAttribute('src')
              .indexOf(
                'https://hoolinks.com/static/common/plugins/import-html-entry.js'
              ) > -1
          ) {
            let url = script.getAttribute('src');
            // @ts-ignore
            script.parentNode.removeChild(script);
            delete window['importHTML'];
          }
        }
      }
      let script = document.createElement('script');
      script.src = this.importHTML;
      document.getElementsByTagName('head')[0].appendChild(script);
      /* document.body.appendChild(script); */
      /** 等待js加载完毕后执行主体脚本 */
      //@ts-ignore
      script.onload = script.onreadystatechange = function () {
        //@ts-ignore
        if (!this.readyState || /^(loaded|complete)$/.test(this.readyState)) {
          isImportHTML = true;
          main.call(that);
        }
      };
    }
  }
}
