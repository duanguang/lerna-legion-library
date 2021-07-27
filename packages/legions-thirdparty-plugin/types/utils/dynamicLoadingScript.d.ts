/** 动态加载JS资源 */
export declare function dynamicLoadingScript<T = {}>(options: {
    /** 创建资源节点的唯一ID */
    scriptId?: string;
    src: string;
    /** 全局变量名称 */
    library: string;
    onLoaded?: (value: T | null) => void;
}): void;
/**
 * 获取动态加载外部JS变量
 *
 * 回调函数执行时机，如果SDK资源未加载，则在资源加载完成时执行。
 * 如果资源已经准备妥当，则直接执行回调
 *
 */
export declare function runDynamicScripts(options: {
    /** 创建script 标签id 信息
     *
     * 默认可不传，不传时以library 值覆盖
     */
    scriptId?: string;
    /** 加载外部JS URL */
    src: string;
    /** 挂载在window上变量名 */
    library: string;
    onExecute: (legions: any) => void;
}): void;
