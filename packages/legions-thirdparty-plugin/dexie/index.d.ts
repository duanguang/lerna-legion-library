import Dexie from 'dexie';
export declare class DexieUtils {
    static dexies: {
        key: string;
        db: Dexie;
        /**
         *
         * 打开状态
         * @type {boolean}
         */
        openState: 'pending' | 'complete';
        store: string;
    }[];
    static getInstanceDexie(key: string): {
        key: string;
        db: Dexie;
        store: string;
        openState: 'pending' | 'complete';
    };
    /**
     *
     *
     * @static
     * @template K
     * @param {string} store 数据库名称
     * @param {string} key 连接DB名称
     * @param {{[x in keyof K]?: string}[]} [schema] 创建表
     * @memberof DexieUtils
     */
    static registerInstanceDexie<K = {}>(store: string, key: string, schema?: {
        [x in keyof K]?: string;
    }[]): void;
}
