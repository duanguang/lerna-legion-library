export class Report extends Events {
  constructor(options: {
    /** 上报数据的属性名，用于服务器获取数据 */
    dataKey: 'err_msg'; // 上报数据的属性名，用于服务器获取数据
    // tslint:disable-next-line: comment-format
    /** mergeReport 是否合并上报， false 关闭， true 启动（默认） */
    mergeReport: boolean; // mergeReport 是否合并上报， false 关闭， true 启动（默认）
    /**当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认） */
    delay: number; // 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
    /** 指定错误上报地址 */
    url: string; // 指定错误上报地址
    // tslint:disable-next-line: comment-format
    /** post请求路径 */
    postPath: string; //
    /**抽样上报，1~0 之间数值，1为100%上报（默认 1） */
    random: number; // 抽样上报，1~0 之间数值，1为100%上报（默认 1）
  });
  config: any;
  queue: {
    get: never[];
    post: never[];
  };
  getUrl: any;
  postUrl: any;
  isRegisterMonitoring: boolean;
  reportByGet(data: any): void;
  reportByPost(data: any): void;
  sendData(type: any, data: any): void;
  delayReport(cb: any): void;
  catchData(type: any, data: any): any;
  postRequest(): Promise<any>;
  _getParames(type: any): any;
  _postParames(type: any): any;
  report(cb: any): void;
  watch(appSystem?: string, environment?: string): void;
}
import Events from './utils/events';
