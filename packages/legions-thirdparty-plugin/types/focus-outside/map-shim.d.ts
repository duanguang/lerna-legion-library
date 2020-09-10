interface IMap {
    set(key: any, value: any): void;
    get(key: any): any;
    has(key: any): boolean;
    delete(key: any): boolean;
    clear(): void;
    find(key: any): any;
    values(): any;
    entries(): any[];
}
export default class Map implements IMap {
    private maps;
    private size;
    find(key: any): any;
    set(key: any, value: any): this;
    get(key: any): any;
    has(key: any): boolean;
    delete(key: any): boolean;
    clear(): void;
    values(): any[];
    entries(): any[];
}
export {};
