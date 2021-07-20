const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
const browser = [
  {
    name: 'iife',
    input: resolves('src/index.js'),
    file: resolves('dist/legions-import-html-entry.iife.js'),
    format: 'iife',
    compress: false,
    env: 'production',
    banner: ' legions-import-html-entry',
    outputName: 'legionsImportHTML',
  },
];
const umd = [
  {
    name: 'umd',
    input: resolves('src/index.js'),
    file: resolves('umd/index.js'),
    format: 'umd',
    compress: false,
    //  env: 'production',
    banner: ' legions-import-html-entry',
    outputName: 'legionsImportHTML',
  },
];
const es = [
  {
    name: 'es',
    input: resolves('src/index.js'),
    file: resolves('es/index.js'),
    format: 'es',
    compress: false,
    //  env: 'production',
    banner: ' legions-import-html-entry',
    outputName: 'legionsImportHTML',
  },
];
const cjs = [
  {
    name: 'cjs',
    input: resolves('src/index.js'),
    file: resolves('cjs/index.js'),
    format: 'cjs',
    compress: false,
    //  env: 'production',
    banner: ' legions-import-html-entry',
    outputName: 'legionsImportHTML',
  },
];
const entitys = {
  browser,
  cjs,
  es,
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
