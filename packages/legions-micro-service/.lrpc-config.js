const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
module.exports = {
  external: [
    /*  'legions-utils-tool/type.validation',
    'legions-utils-tool/browser', */
  ],
  rollupPlugin: {
    /* babel: false, */
    commonjs: {
      namedExports: {
        // 显式指出指定文件导出模块
        'node_modules/legions-import-html-entry/lib/legions-import-html-entry.umd.js': [
          'importHTML',
          'importEntry',
          'execScripts',
        ],
        /*  'node_modules/legions-import-html-entry/lib/legions-import-html-entry.umd.js': [
          'importHTML',
          'importEntry',
        ], */
      },
    },
    typescript: {
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '**/*.js', '*.js'],
    },
    replace: {
      __DEV__: `(process.env.NODE_ENV !== 'production')`,
    },
  },
  extendPlugins: [],
  entitys: [
    {
      name: 'umdprod',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-micro-service.iife.4.js'),
      format: 'iife',
      compress: false,
      env: 'production',
      banner: 'legions-micro-service',
      outputName: 'legionsMicroservice',
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
