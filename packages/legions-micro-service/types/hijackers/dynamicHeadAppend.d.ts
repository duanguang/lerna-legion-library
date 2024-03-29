import { Freer } from '../interfaces';
declare const styledComponentSymbol: unique symbol;
declare global {
    interface HTMLStyleElement {
        [styledComponentSymbol]?: CSSRuleList;
    }
}
/**
 * Just hijack dynamic head append, that could avoid accidentally hijacking the insertion of elements except in head.
 * Such a case: ReactDOM.createPortal(<style>.test{color:blue}</style>, container),
 * this could made we append the style element into app wrapper but it will cause an error while the react portal unmounting, as ReactDOM could not find the style in body children list.
 * @param appName
 * @param proxy
 * @param mounting
 */
export default function hijack(appName: string, proxy: Window, mounting?: boolean): Freer;
export {};
