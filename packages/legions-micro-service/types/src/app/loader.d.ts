import { FrameworkConfiguration, FrameworkLifeCycles, LoadableApp } from '../interfaces';
import { ParcelConfigObject } from 'single-spa';
export declare type ParcelConfigObjectGetter = (remountContainer?: string | HTMLElement) => ParcelConfigObject;
export declare function loadApp<T extends object>(app: LoadableApp<T>, configuration?: FrameworkConfiguration, lifeCycles?: FrameworkLifeCycles<T>): Promise<ParcelConfigObjectGetter>;
