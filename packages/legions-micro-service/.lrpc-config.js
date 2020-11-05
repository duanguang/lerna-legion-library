const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
module.exports = {
  external: [
    /*  'legions-utils-tool/type.validation',
    'legions-utils-tool/browser', */
  ],
  rollupPlugin: {
    babel: false,
    typescript: {
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '**/*.js', '*.js'],
    },
  },
  extendPlugins: [],
  entitys: [
    {
      name: 'umdprod',
      input: resolves('src/import-html-entry/index.js'),
      file: resolves('dist/legions-import-html-entry.umd.prod.js'),
      format: 'umd',
      compress: false,
      banner: ' legions-import-html-entry',
      outputName: 'importHTML',
    },
    /* {
      name: 'umdprod',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-micro-service.umd.prod.js'),
      format: 'umd',
      compress: false,
      banner: ' legions-micro-service',
      outputName: 'legionsMicroService',
    },
    {
      name: 'prod',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-micro-service.min.js'),
      format: 'iife',
      compress: true,
      banner: ' legions-micro-service',
      outputName: 'legionsPlugins',
    },
    {
      name: 'umd',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-micro-service.umd.js'),
      format: 'umd',
      compress: false,
      banner: ' legions-micro-service',
      outputName: 'legionsMicroService',
    }, */
  ],
};
