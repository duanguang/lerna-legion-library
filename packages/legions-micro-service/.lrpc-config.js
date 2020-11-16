const path = require('path');
const resolves = _path => path.join(process.cwd(),_path);
const { entitys,all} =require('./script/entiy')
const { babel,external,commonjs} =require('./script/rollupPlugin')
const PACKAGE = process.env.PACKAGE;
module.exports = {
  external: external[PACKAGE],
  rollupPlugin: {
  /* babel: false, */
    ...babel[PACKAGE],
    ...commonjs[PACKAGE],
    typescript: {
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '**/*.js', '*.js'],
    },
    replace: {
      __DEV__: `(process.env.NODE_ENV !== 'production')`,
    },
  },
  extendPlugins: [],
  entitys: [
    ...(entitys.hasOwnProperty(process.env.PACKAGE)
      ? entitys[process.env.PACKAGE]
      : all),
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
