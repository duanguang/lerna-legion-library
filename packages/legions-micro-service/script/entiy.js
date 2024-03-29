/*
 * @Author: duanguang
 * @Date: 2020-11-16 13:57:05
 * @LastEditTime: 2021-07-21 00:39:09
 * @LastEditors: duanguang
 * @Description: 
 * @FilePath: /lerna-legion-library/packages/legions-micro-service/script/entiy.js
 * @「扫去窗上的尘埃，才可以看到窗外的美景。」
 */
const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
const browser = [
  {
    name: 'iife',
    input: resolves('src/index.ts'),
    file: resolves('dist/legions-micro-service.iife.min.js'),
    format: 'iife',
    compress: false,
    env: 'production',
    banner: 'legions-micro-service',
    outputName: 'legionsMicroservice',
  },
];
const umd = [
  {
    name: 'umd',
    input: resolves('src/index.ts'),
    file: resolves('umd/index.js'),
    format: 'umd',
    compress: true,
    banner: ' legions-micro-service',
    outputName: 'legionsMicroService',
  },
];
const es = [
  {
    name: 'es',
    input: resolves('src/index.ts'),
    file: resolves('es/index.js'),
    format: 'es',
    /* compress: true, */
    banner: ' legions-micro-service',
    outputName: 'legionsMicroService',
  },
];
const entitys = {
  browser,
  umd,
  es,
};
let all = [];
Object.keys(entitys).map(key => {
  all.push(...entitys[key]);
});
module.exports = {
  entitys,
  all,
};
