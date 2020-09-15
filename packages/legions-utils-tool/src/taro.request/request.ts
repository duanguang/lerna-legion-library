import axios from 'axios';
import { invariant } from '../invariant';
const DefaultOption = {
  processData: false,
  dataType: 'json',
  'content-type': 'application/json',
};
export function setHeaders(options) {
  invariant(typeof options === 'object', 'options: options should be a object');
  options = options || {};
  options.url = options.url || '';
  invariant(options.url, 'options.url: options.url should not a empty');
  return {
    'api-target': options.url,
  };
}
export function get(url, prams, options) {
  if (prams) {
    // @ts-ignore
    prams._ = Date.parse(new Date()); // 设置请求不缓存
  }
  let headers = Object.assign(DefaultOption, options);
  return axios
    .get(url, { params: prams, headers: headers })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      let res = error.response || {};
      return res.data;
    });
}
export function post(url, prams, options) {
  let headers = Object.assign(DefaultOption, options);
  return axios
    .post(url, prams, { headers: headers })
    .then(res => {
      return res.data;
    })
    .catch(error => {
      let res = error.response || {};
      return res.data;
    });
}
