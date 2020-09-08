import { IlegionsThirdpartyPlugin } from '../types/api';
interface IPlugin {
    name: 'excel' | 'html2canvas' | 'jsBarcode' | 'clipboard' | 'dexie';
    url: string;
}
export declare class LegionsThirdpartyPlugin {
    use(plugin: IPlugin[] | IPlugin): void;
    subscribe(name: IPlugin['name'] | IPlugin['name'][], callback: () => void): void;
    get plugins(): IlegionsThirdpartyPlugin;
}
export declare const legionsThirdpartyPlugin: LegionsThirdpartyPlugin;
export { focusBind } from './focus-outside';
