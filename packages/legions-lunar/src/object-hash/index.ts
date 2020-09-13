import * as rawObjectHash from 'object-hash';
export function shortHash(val: any): string {
  return rawObjectHash['MD5'](val, { algorithm: 'md5', encoding: 'base64' });
}
