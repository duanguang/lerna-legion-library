declare const CONTEXTS: {
    /** 弹出提示交互窗口方法名称 */
    message: symbol;
    modal: symbol;
};
declare const LOADLIST: {
    name: Symbol;
    value: any;
}[];
declare class LegionsMobxDecoratorContext {
    mount(name: Symbol, value: any): void;
    get contexts(): {
        name: Symbol;
        value: any;
    }[];
    getContext(name: Symbol): {
        name: Symbol;
        value: any;
    } | null;
}
