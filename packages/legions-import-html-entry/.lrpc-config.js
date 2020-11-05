const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
module.exports = {
  external: [],
  rollupPlugin: {
    babel: false,
    typescript: {
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '**/*.js', '*.js'],
    },
  },
  extendPlugins: [],
  entitys: [
    {
      name: 'iifeprod',
      input: resolves('src/index.js'),
      file: resolves('dist/legions-import-html-entry.iife.js'),
      format: 'iife',
      compress: false,
      banner: ' legions-import-html-entry',
      outputName: 'importHTML',
    },
    {
      name: 'umdprod',
      input: resolves('src/index.js'),
      file: resolves('dist/legions-import-html-entry.umd.js'),
      format: 'umd',
      compress: false,
      banner: ' legions-import-html-entry',
      outputName: 'importHTML',
    },
  ],
};
