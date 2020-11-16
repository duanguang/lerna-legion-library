export declare const QiankunCSSRewriteAttr = "data-legions";
export declare class ScopedCSS {
    private static ModifiedTag;
    private sheet;
    private swapNode;
    constructor();
    process(styleNode: HTMLStyleElement, prefix?: string): void;
    private rewrite;
    private ruleStyle;
    private ruleMedia;
    private ruleSupport;
}
export declare const process: (appWrapper: HTMLElement, stylesheetElement: HTMLStyleElement | HTMLLinkElement, appName: string) => void;
