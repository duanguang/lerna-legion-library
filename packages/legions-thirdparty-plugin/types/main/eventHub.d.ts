import { TypePluginName } from "./plugin.config";
declare type ICache = {
    [p in keyof TypePluginName]?: Function[];
};
export declare class EventHub {
    cache: ICache;
    on(evenName: TypePluginName, fn: () => void): void;
    emit(evenName: TypePluginName, fn?: () => void): void;
    off(eventName: TypePluginName, fn?: () => void): void;
}
export {};
