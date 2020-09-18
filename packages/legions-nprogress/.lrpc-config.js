const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
module.exports = {
  external: [],
  rollupPlugin: {
    babel: false,
  },
  extendPlugins: [],
  entitys: [
    {
      name: 'umdDev',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-nprogress.umd.js'),
      format: 'umd',
      env: 'development',
      outputName: 'legionsNprogress',
      banner: 'legions-nprogress',
    },
    {
      name: 'iife',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-nprogress.js'),
      format: 'iife',
      outputName: 'legionsNprogress',
      banner: 'legions-nprogress',
    },
    {
      name: 'esm',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-nprogress.esm.js'),
      format: 'es',
      outputName: 'legionsNprogress',
      banner: 'legions-nprogress',
    },
    {
      name: 'iifeProd',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-nprogress.min.js'),
      format: 'iife',
      env: 'production',
      outputName: 'legionsNprogress',
      banner: 'legions-nprogress',
    },
  ],
};
