import { Freer } from '../interfaces';
export declare function hijackAtMounting(appName: string, proxy: Window): Freer[];
export declare function hijackAtBootstrapping(appName: string, proxy: Window): Freer[];
