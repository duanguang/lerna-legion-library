/** DOM节点绑定事件 */
export declare const on: (element: Element, event: string, handler: () => void, useCapture?: boolean) => void;
/** 卸载DOM元素节点事件 */
export declare const off: (element: Element, event: string, handler: () => void, useCapture?: boolean) => void;
