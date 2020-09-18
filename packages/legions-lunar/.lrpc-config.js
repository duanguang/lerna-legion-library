const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
module.exports = {
  external: [
    'reflect-metadata',
    'antd',
    'brain-store',
    'brain-store-utils',
    'react',
    'mobx',
    'prop-types',
    'legions-nprogress',
    'lodash.debounce',
    'lodash',
    'object-hash',
  ],
  rollupPlugin: {
    typescript: {
      moduleSpecifier: [
        {
          libraryName: '../antd-toolkit',
          mapLibraryName: 'legions-lunar/antd-toolkit',
        },
        {
          libraryName: '../schedule',
          mapLibraryName: 'legions-lunar/schedule',
        },
        {
          libraryName: '../warning',
          mapLibraryName: 'legions-lunar/warning',
        },
      ],
    },
  },
  extendPlugins: [],
  entitys: [
    /* {
      name: 'esmlegionsLunar',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-lunar.esm.js'),
      format: 'es',
      banner: 'legions-lunar',
      outputName: 'legionsLunar',
    },
    {
      name: 'umdlegionsLunar',
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-lunar.umd.js'),
      format: 'umd',
      banner: 'legions-lunar',
      outputName: 'legionsLunar',
    },
    {
      name: 'esmmobxdecorator',
      input: resolves('src/mobx-decorator/index.ts'),
      file: resolves('mobx-decorator/index.js'),
      format: 'es',
    },
    {
      name: 'umdmobxdecorator',
      input: resolves('src/mobx-decorator/index.ts'),
      file: resolves('mobx-decorator/mobx-decorator.umd.js'),
      format: 'umd',
    },
    {
      name: 'esmantdToolkit',
      input: resolves('src/antd-toolkit/index.ts'),
      file: resolves('antd-toolkit/index.js'),
      format: 'es',
    },
    {
      name: 'esmObjectHash',
      input: resolves('src/object-hash/index.ts'),
      file: resolves('object-hash/index.js'),
      format: 'es',
    },
    {
      name: 'esmwarning',
      input: resolves('src/warning/index.ts'),
      file: resolves('warning/index.js'),
      format: 'es',
    },
    {
      name: 'esmschedule',
      input: resolves('src/schedule/index.ts'),
      file: resolves('schedule/index.js'),
      format: 'es',
    }, */
    {
      name: 'esmvmodel',
      input: resolves('src/model/index.ts'),
      file: resolves('model/index.js'),
      format: 'es',
      banner: 'legions-lunar',
      outputName: 'legionsLunar',
      rollupPlugin: {
        resolve: false,
        commonjs: false,
        babel: false,
      },
    },
    {
      name: 'esmlegionpluginsdk',
      input: resolves('src/legion.plugin.sdk/index.tsx'),
      file: resolves('legion.plugin.sdk/index.js'),
      format: 'es',
    },
  ],
};
