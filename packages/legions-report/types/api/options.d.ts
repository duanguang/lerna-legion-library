interface options {
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
}
