import { MicroApps } from './app';
import { MicroApps as MountedMicroApps } from './app/microApps';
import { getMountedApps } from 'single-spa';
import { start, registerMicroApps, loadMicroApp } from './app/apis';
import { setDefaultMountApp,runDefaultMountEffects,runAfterFirstMounted } from './app/effects';
import { initGlobalState } from './app/globalState';
export { addErrorHandler,removeErrorHandler,addGlobalUncaughtErrorHandler,removeGlobalUncaughtErrorHandler } from './app/errorHandler';
export { prefetchImmediately as prefetchApps } from './core/prefetch';
export {
  MicroApps,
  start,
  loadMicroApp,
  MountedMicroApps,
  registerMicroApps,
  setDefaultMountApp,
  getMountedApps,
  initGlobalState,
  runDefaultMountEffects,
  runAfterFirstMounted,
};
