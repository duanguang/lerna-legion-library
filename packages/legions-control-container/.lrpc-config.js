const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
module.exports = {
  external: ['reflect-metadata','inversify','inversify-binding-decorators','inversify-inject-decorators'],
  rollupPlugin: {
    babel: false,
  },
  extendPlugins: [],
  entitys: [
    {
      name: 'es',
      input: resolves('src/index.ts'),
      file: resolves('es/index.js'),
      format: 'es',
      banner: ' legions-control-container',
      outputName: 'legionsControlContainer',
    },
    {
      name: 'cjs',
      input: resolves('src/index.ts'),
      file: resolves('cjs/index.js'),
      format: 'cjs',
      compress: false,
      banner: ' legions-control-container',
      outputName: 'legionsControlContainer',
    },
  ],
};
