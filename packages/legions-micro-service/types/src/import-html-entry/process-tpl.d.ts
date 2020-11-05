/**
 * parse the script link from the template
 * TODO
 *    1. collect stylesheets
 *    2. use global eval to evaluate the inline scripts
 *        see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Difference_between_Function_varructor_and_function_declaration
 *        see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Do_not_ever_use_eval!
 * @param tpl
 * @param domain
 * @stripStyles whether to strip the css links
 * @returns {{template: void | string | *, scripts: *[], entry: *}}
 */
export default function processTpl(tpl: any, domain: any): {
    template: void | string | any;
    scripts: any[];
    entry: any;
};
export function genLinkReplaceSymbol(linkHref: any): string;
export function genScriptReplaceSymbol(scriptSrc: any): string;
export var inlineScriptReplaceSymbol: string;
export function genIgnoreAssetReplaceSymbol(url: any): string;
