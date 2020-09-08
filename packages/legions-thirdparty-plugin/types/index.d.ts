import { IlegionsThirdpartyPlugin } from '../types/api';
interface IPlugin {
    name: 'excel' | 'html2canvas' | 'jsBarcode' | 'clipboard';
    url?: string;
}
export declare class LegionsThirdpartyPlugin {
    use(plugin: IPlugin[] | IPlugin): void;
    get plugins(): IlegionsThirdpartyPlugin;
}
export declare const legionsThirdpartyPlugin: LegionsThirdpartyPlugin;
export { focusBind } from './focus-outside';
