import { MicroAppStateActions } from '../interfaces';
export declare function initGlobalState(state?: Record<string, any>): MicroAppStateActions;
export declare function getMicroAppStateActions(id: string, isMaster?: boolean): MicroAppStateActions;
