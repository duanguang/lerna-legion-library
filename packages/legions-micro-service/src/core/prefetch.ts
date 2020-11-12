import { getAppStatus, getMountedApps, NOT_LOADED } from 'single-spa';
import { Entry, importHTML, ImportEntryOpts } from 'legions-import-html-entry';
import { AppMetadata, PrefetchStrategy } from '../interfaces';
type RequestIdleCallbackHandle = any;
type RequestIdleCallbackOptions = {
  timeout: number;
};
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
};
declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }

  interface Navigator {
    connection: {
      saveData: boolean;
      effectiveType: string;
      type:
        | 'bluetooth'
        | 'cellular'
        | 'ethernet'
        | 'none'
        | 'wifi'
        | 'wimax'
        | 'other'
        | 'unknown';
    };
  }
}
const requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(cb: CallableFunction) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

const isSlowNetwork = navigator.connection
  ? navigator.connection.saveData ||
    (navigator.connection.type !== 'wifi' &&
      navigator.connection.type !== 'ethernet' &&
      /(2|3)g/.test(navigator.connection.effectiveType))
  : false;

/**
 * prefetch assets, do nothing while in mobile network
 * @param entry
 * @param opts
 */
function prefetch(entry: string, opts?: ImportEntryOpts): void {
  if (!navigator.onLine || isSlowNetwork) {
    // Don't prefetch if in a slow network or offline
    return;
  }

  requestIdleCallback(async () => {
    const { getExternalScripts, getExternalStyleSheets } = await importHTML(
      entry,
      opts
    );
    requestIdleCallback(getExternalStyleSheets);
    requestIdleCallback(getExternalScripts);
  });
}

function prefetchAfterFirstMounted(
  apps: AppMetadata[],
  opts?: ImportEntryOpts
): void {
  window.addEventListener('single-spa:first-mount', function listener() {
    const notLoadedApps = apps.filter(
      app => getAppStatus(app.name) === NOT_LOADED
    );

    //@ts-ignore
    if (process.env.NODE_ENV === 'development') {
      const mountedApps = getMountedApps();
      console.log(
        `[legions] prefetch starting after ${mountedApps} mounted...`,
        notLoadedApps
      );
    }
    console.log(notLoadedApps, apps, 'notLoadedApps');
    notLoadedApps.forEach(({ entry }) => prefetch(entry, opts));

    window.removeEventListener('single-spa:first-mount', listener);
  });
}

export function prefetchImmediately(
  apps: AppMetadata[],
  opts?: ImportEntryOpts
): void {
  //@ts-ignore
  if (process.env.NODE_ENV === 'development') {
    console.log('[qiankun] prefetch starting for apps...', apps);
  }

  apps.forEach(({ entry }) => prefetch(entry, opts));
}

export function doPrefetchStrategy(
  apps: AppMetadata[],
  prefetchStrategy: PrefetchStrategy,
  importEntryOpts?: ImportEntryOpts
) {
  const appsName2Apps = (names: string[]): AppMetadata[] =>
    apps.filter(app => names.includes(app.name));
  if (Array.isArray(prefetchStrategy)) {
    prefetchAfterFirstMounted(
      appsName2Apps(prefetchStrategy as string[]),
      importEntryOpts
    );
  } else {
    switch (prefetchStrategy) {
      case true:
        prefetchAfterFirstMounted(apps, importEntryOpts);
        break;

      case 'all':
        prefetchImmediately(apps, importEntryOpts);
        break;

      default:
        break;
    }
  }
}
