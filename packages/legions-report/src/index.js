import { assignObject, serializeObj } from './utils';
import { getNetworkType, BrowserMatch } from 'legions-utils-tool/browser';
/* import { warningOnce } from 'legions-utils-tool'; */
import Events from './utils/events';

export class Report extends Events {
  constructor(options) {
    super();
    const config = {
      dataKey: '', //上报数据的属性名，用于服务器获取数据
      mergeReport: true, // mergeReport 是否合并上报， false 关闭， true 启动（默认）
      delay: 1000, // 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
      url: '', // 指定错误上报地址
      getPath: '', // get请求路径
      postPath: '', // post请求路径
      random: 1, // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
    };
    this.config = assignObject(config, options);
    this.queue = {
      get: [],
      post: [],
    };
    this.getUrl = this.config.url + this.config.getPath;
    this.postUrl = this.config.url + this.config.postPath;
    this.isRegisterMonitoring = false;
    BrowserMatch.init();
  }
  reportByGet(data) {
    this.sendData('get', data);
  }
  reportByPost(data) {
    this.sendData('post', data);
  }
  sendData(type, data) {
    if (this.catchData(type, data)) {
      this.delayReport();
    }
  }
  delayReport(cb) {
    if (!this.trigger('beforeReport')) return;
    let delay = this.config.mergeReport ? this.config.delay : 0;
    setTimeout(() => {
      if (!this.trigger('beforeSend')) return;
      this.report(cb);
    }, delay);
  }
  // push数据到pool
  catchData(type, data) {
    var rnd = Math.random();
    if (rnd >= this.config.random) {
      return false;
    }
    this.queue[type].push(data);
    return this.queue[type];
  }
  postRequest() {
    return new Promise(resolve => {
      if (this.queue.post.length === 0) {
        resolve();
      } else {
        const parames = this._postParames('post');
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            resolve(parames);
          }
        };
        xmlhttp.open('POST', this.postUrl, true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        /* const data = {};
              data[this.config.dataKey] = parames; */
        xmlhttp.send(JSON.stringify(parames));
      }
    });
  }
  _getParames(type) {
    const queue = this.queue[type];
    let mergeReport = this.config.mergeReport;
    let curQueue = mergeReport ? queue : [queue.shift()];
    if (mergeReport) this.queue[type] = [];

    let parames = curQueue
      .map(obj => {
        return serializeObj(obj);
      })
      .join('|');
    return parames;
  }
  _postParames(type) {
    const queue = this.queue[type];
    let mergeReport = this.config.mergeReport;
    let curQueue = mergeReport ? queue : [queue.shift()];

    if (mergeReport) this.queue[type] = [];

    let parames = curQueue.map(obj => {
      return obj;
    });
    return parames[0];
  }
  report(cb) {
    Promise.all([this.postRequest()]).then(urls => {
      this.trigger('afterReport');
      cb && cb.call(this, urls);
    });
  }
  watch(appSystem = '', environment = '') {
    const that = this;
    window.onerror = function (event, source, lineno, colno, error) {
      if (!error) {
        return;
      }
      const prams = {
        errorType: 'onerror',
        errorFilename: source,
        errorLineNo: lineno,
        errorColNo: colno,
        errorStack: error.stack,
        errorLevel: '1',
        path: window.location.href,
        errorMessage: error.message,
        errorTimeStamp: new Date().getTime(),
        network: getNetworkType(),
        userAgent: navigator.userAgent,
        device: `${navigator.appName};${navigator.appVersion}`,
        system: JSON.stringify({
          platform: navigator.platform,
          OS: BrowserMatch.OS,
          browser: BrowserMatch.browser,
          version: BrowserMatch.version,
        }),
        environment: environment,
        appSystem: appSystem,
      };
      that.reportByPost(prams, function (data) {
        console.log(data);
      });
    };
    window.addEventListener('unhandledrejection', function (e) {
      // Promise Catch 捕获异常
      e.preventDefault(); // 控制台不显示错误信息
      console.log('捕获到异常：', e);
      /* return true; */
    });
    /* performance.getEntries().forEach(function(item){console.log(item.name)}) */
    window.addEventListener(
      'error',
      error => {
        // 图片资源及脚本请求异常上报
        const errorTarget = event.target;
        if (errorTarget && errorTarget['baseURI'] && error && error.error) {
          const prams = {
            errorType: 'error',
            errorFilename: error.filename,
            errorLineNo: error.lineno,
            errorColNo: error.colno,
            errorStack: error.error.stack,
            errorLevel: '1',
            path: window.location.href,
            errorMessage: `${error.message};;;${errorTarget['outerHTM']};;;${errorTarget['baseURI']}`,
            errorTimeStamp: new Date().getTime(),
            network: getNetworkType(),
            userAgent: navigator.userAgent,
            device: `${navigator.appName};${navigator.appVersion}`,
            system: JSON.stringify({
              platform: navigator.platform,
              OS: BrowserMatch.OS,
              browser: BrowserMatch.browser,
              version: BrowserMatch.version,
            }),
            environment: environment,
            appSystem: appSystem,
          };
          that.reportByPost(prams, function (data) {
            console.log('捕获到异常资源请求：', error + data);
          });
        }
      },
      true
    );
    /**  监控崩溃
     * 在页面加载时（load 事件）在 sessionStorage
     * 记录 good_exit 状态为 pending，如果用户正常退出（beforeunload 事件）状态改为 true，
     * 如果 crash 了，状态依然为 pending，在用户第2次访问网页的时候（第2个load事件），
     * 查看 good_exit 的状态，如果仍然是 pending 就是可以断定上次访问网页崩溃了！
     *
     */
    window.addEventListener('load', function () {
      sessionStorage.setItem('good_exit', 'pending');
      setInterval(function () {
        sessionStorage.setItem('time_before_crash', new Date().toString());
      }, 1000);
    });

    window.addEventListener('beforeunload', function () {
      sessionStorage.setItem('good_exit', 'true');
    });

    if (
      sessionStorage.getItem('good_exit') &&
      sessionStorage.getItem('good_exit') !== 'true'
    ) {
      /*
               insert crash logging code here
           */
      /* alert('Hey, welcome back from your crash, looks like you crashed on: ' + sessionStorage.getItem('time_before_crash')); */
    }

    this.isRegisterMonitoring = true;
  }
}
