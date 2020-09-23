const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
module.exports = {
  external: ['reflect-metadata'],
  rollupPlugin: {
    babel: false,
  },
  extendPlugins: [],
  entitys: [
    {
      name: 'umdprod',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-control-container.umd.prod.js'),
      format: 'umd',
      compress: true,
      banner: ' legions-control-container',
      outputName: 'legionsControlContainer',
    },
    {
      name: 'umd',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-control-container.umd.js'),
      format: 'umd',
      compress: false,
      banner: ' legions-control-container',
      outputName: 'legionsControlContainer',
    },
  ],
};
