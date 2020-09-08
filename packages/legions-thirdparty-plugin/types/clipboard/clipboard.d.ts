export = Clipboard;
export = Clipboard;
/**
 * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
 * @param {Object} options
 */
declare function Clipboard(trigger: string | HTMLElement | HTMLCollection | NodeList, options: any): any;
declare namespace Clipboard {
    export { node, nodeList, string, fn, __esModule, ClipboardJS };
}
declare function node(value: any): boolean;
declare function nodeList(value: any): boolean;
declare function string(value: any): boolean;
declare function fn(value: any): boolean;
declare var __esModule: boolean;
declare var ClipboardJS: any;
