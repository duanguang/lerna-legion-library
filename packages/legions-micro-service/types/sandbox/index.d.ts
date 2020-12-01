export declare function createSandbox(appName: string, elementGetter: () => HTMLElement | ShadowRoot, scopedCSS: boolean, excludeAssetFilter?: (url: string) => boolean): {
    proxy: Window;
    /**
     * 沙箱被 mount
     * 可能是从 bootstrap 状态进入的 mount
     * 也可能是从 unmount 之后再次唤醒进入 mount
     */
    mount(): Promise<void>;
    /**
     * 恢复 global 状态，使其能回到应用加载之前的状态
     */
    unmount(): Promise<void>;
};
