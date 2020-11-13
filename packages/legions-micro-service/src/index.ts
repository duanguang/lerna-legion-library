import { MicroApps } from './app';
import { MicroApps as MountedMicroApps } from './app/microApps';
import { getMountedApps } from 'single-spa';
import { start, registerMicroApps, loadMicroApp } from './app/apis';
import { setDefaultMountApp } from './app/effects';

export {
  MicroApps,
  start,
  loadMicroApp,
  MountedMicroApps,
  registerMicroApps,
  setDefaultMountApp,
  getMountedApps,
};
