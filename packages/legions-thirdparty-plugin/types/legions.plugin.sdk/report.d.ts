export interface IReport {
    new (options: {
        /**
         * 上报数据的属性名，用于服务器获取数据
         *
         * @type {string}
         */
        dataKey: string;
        /**
         * mergeReport 是否合并上报， false 关闭， true 启动（默认）
         *
         * @type {boolean}
         */
        mergeReport?: boolean;
        /**
         *
         * 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
         * @type {number}
         */
        delay?: number;
        /**
         *
         * 指定错误上报地址
         * @type {string}
         */
        url: string;
        /**
         *
         * post请求路径
         * @type {string}
         */
        postPath: string;
        /**
         * 抽样上报，1~0 之间数值，1为100%上报（默认 1）
         *
         * @type {number}
         */
        random?: number;
    }): IReportMethods;
}
interface IReportMethods {
    watch: (appSystem: string, environment: string) => void;
}
export {};
