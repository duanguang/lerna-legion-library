const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
module.exports = {
  external: [],
  rollupPlugin: {
    babel: false,
    typescript: {
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '**/*.js', '*.js'],
    },
    replace: {
      __DEV__: `(process.env.NODE_ENV !== 'production')`,
    },
  },
  extendPlugins: [],
  entitys: [
    /* {
      name: 'iifeprod',
      input: resolves('src/index.js'),
      file: resolves('dist/legions-import-html-entry.iife.js'),
      format: 'iife',
      compress: false,
      env: 'production',
      banner: ' legions-import-html-entry',
      outputName: 'legionsImportHTML',
    }, */
    {
      name: 'umdprod',
      input: resolves('src/index.js'),
      file: resolves('lib/legions-import-html-entry.umd.js'),
      format: 'umd',
      compress: false,
      //  env: 'production',
      banner: ' legions-import-html-entry',
      outputName: 'legionsImportHTML',
    },
  ],
};
