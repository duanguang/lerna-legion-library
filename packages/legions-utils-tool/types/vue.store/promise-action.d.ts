export declare class PromiseAction {
    constructor(options: any);
    init(dispatch: any, type: string): this;
    set(dispatch: any, type: string, promise: Promise<any>): this;
    commit(promise: Promise<any>, callBackFunc: Function): this;
}
