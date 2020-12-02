import { getMountedApps,navigateToUrl } from 'single-spa';
const firstMountLogLabel = '[legions] first app mounted';
//@ts-ignore
if (process.env.NODE_ENV !== 'production') {
  console.time(firstMountLogLabel);
}
export function setDefaultMountApp(defaultAppLink: string) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:no-app-change', function listener() {
    const mountedApps = getMountedApps();
    if (!mountedApps.length) {
      navigateToUrl(defaultAppLink);
    }

    window.removeEventListener('single-spa:no-app-change', listener);
  });
}

export function runAfterFirstMounted(effect: () => void) {
  // can not use addEventListener once option for ie support
  window.addEventListener('single-spa:first-mount',function listener() {
    //@ts-ignore
    if (process.env.NODE_ENV !== 'production') {
      console.timeEnd(firstMountLogLabel);
    }

    effect();

    window.removeEventListener('single-spa:first-mount', listener);
  });
}

export function runDefaultMountEffects(defaultAppLink: string) {
  console.warn(
    '[legions] runDefaultMountEffects will be removed in next version, please use setDefaultMountApp instead',
  );
  setDefaultMountApp(defaultAppLink);
}