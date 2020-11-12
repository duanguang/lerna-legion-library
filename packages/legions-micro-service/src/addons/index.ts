import { FrameworkLifeCycles } from '../interfaces';
import concat from 'lodash/concat';
import mergeWith from 'lodash/mergeWith';
import getRuntimePublicPathAddOn from './runtimePublicPath';
import getEngineFlagAddon from './engineFlag';

export default function getAddOns<T extends object>(
  global: Window,
  publicPath: string
): FrameworkLifeCycles<T> {
  return mergeWith(
    {},
    getEngineFlagAddon(global),
    getRuntimePublicPathAddOn(global, publicPath),
    (v1, v2) => concat(v1 ?? [], v2 ?? [])
  );
}
