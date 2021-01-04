const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
const browser = [
  {
    name: 'umdprod',
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
    name: 'umdprod',
    input: resolves('src/index.ts'),
    file: resolves('dist/legions-micro-service.umd.js'),
    format: 'umd',
    compress: true,
    banner: ' legions-micro-service',
    outputName: 'legionsMicroService',
  },
];
const entitys = {
  browser,
  umd,
};
let all = [];
Object.keys(entitys).map(key => {
  all.push(...entitys[key]);
});
module.exports = {
  entitys,
  all,
};
