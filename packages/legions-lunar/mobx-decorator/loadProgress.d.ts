interface IOptions {
    state: string;
    store?: string;
}
/**
 * 进度条自动加载
 *
 * @export
 * @param {IOptions} options
 * @returns
 */
export declare function loadProgress(options: IOptions): (target: any, key: any, descriptor: any) => any;
export {};
