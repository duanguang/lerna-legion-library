/**
 * legions-lunar v0.0.3
 * (c) 2020 duanguang
 * @license MIT
 */
import { MD5 } from 'object-hash';

function shortHash(val) {
    return MD5(val, { algorithm: 'md5', encoding: 'base64' });
}

export { shortHash };
