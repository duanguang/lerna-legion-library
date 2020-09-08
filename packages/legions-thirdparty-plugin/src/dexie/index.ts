//@ts-ignore
import Dexie from 'dexie';

export class DexieUtils {
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
  }[] = [];

  static getInstanceDexie(
    key: string
  ): {
    key: string;
    db: Dexie;
    store: string;
    openState: 'pending' | 'complete';
  } {
    const store = this.dexies.find(ws => ws.key && ws.key === key);
    if (store) {
      return {
        key: key,
        db: store.db,
        store: store.store,
        openState: store.openState,
      };
    }
    //@ts-ignore
    return null;
  }

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
  static registerInstanceDexie<K = {}>(
    store: string,
    key: string,
    schema?: { [x in keyof K]?: string }[]
  ) {
    const dbItem = this.getInstanceDexie(key);
    const init = async function (name: string) {
      let db = new Dexie(name);
      if (!(await Dexie.exists(db.name))) {
        db.version(1).stores({});
      }
      if (schema && Array.isArray(schema)) {
        schema.map(item => {
          db.version(1).stores(item);
        });
      }
      await db.open();
      return db;
    };
    if (dbItem && dbItem.db) {
      if (!dbItem.db.isOpen()) {
        init(store).then(result => {
          dbItem.db = result;
          this.dexies = this.dexies.map(item => {
            if (item.key === dbItem.key) {
              return dbItem;
            }
            return item;
          });
        });
      }
    } else {
      if (!this.getInstanceDexie(key)) {
        // const newdb = init(store)
        this.dexies.push({
          key,
          store,
          db: null,
          openState: 'pending',
        });
        init(store).then(result => {
          if (
            this.getInstanceDexie(key) &&
            this.getInstanceDexie(key).openState === 'pending'
          ) {
            this.dexies = this.dexies.map(item => {
              if (item.key === key) {
                return { ...item, db: result, openState: 'complete' };
              }
              return item;
            });
          }
        });
      }
    }
  }
}
