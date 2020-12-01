const path = require('path');
const resolves = _path => path.join(process.cwd(),_path);
const browser = [{
  name: 'iifeprod',
  input: resolves('src/index.js'),
  file: resolves('dist/legions-import-html-entry.iife.js'),
  format: 'iife',
  compress: false,
  env: 'production',
  banner: ' legions-import-html-entry',
  outputName: 'legionsImportHTML',
}]
const umd = [{
  name: 'umdprod',
  input: resolves('src/index.js'),
  file: resolves('lib/legions-import-html-entry.umd.js'),
  format: 'umd',
  compress: false,
  //  env: 'production',
  banner: ' legions-import-html-entry',
  outputName: 'legionsImportHTML',
}];
const entitys = {
browser,
umd,
}
let all = [];
Object.keys(entitys).map(key => {
  all.push(...entitys[key]);
});
module.exports = {
    entitys,
    all
}