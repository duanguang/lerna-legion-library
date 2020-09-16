const resolve = require('rollup-plugin-node-resolve'); //告诉 Rollup 如何查找外部模块
const path = require('path');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const version = process.env.VERSION || require('../package.json').version;
/* const tsImportPluginFactory = require('ts-import-plugin'); */
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const uglify = require('rollup-plugin-uglify');
const createTransformer = require('./ts-plugin').default;
const banner = `/**
 * legions-lunar v${version}
 * (c) ${new Date().getFullYear()} duanguang
 * @license MIT
 */`;
const transformer = () => ({
  before: [
    createTransformer([
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
    ]),
  ],
});
const resolves = _path => path.resolve(__dirname, '../', _path);
/** 1. amd -- 异步模块定义，用于像RequestJS这样的模块加载器。
2. cjs -- CommonJS, 适用于Node或Browserify/webpack
3. es -- 将软件包保存为ES模块文件。
4. iife -- 一个自动执行的功能，适合作为 <script>标签这样的。
5. umd -- 通用模块定义，以amd, cjs, 和 iife 为一体。 */
const MobxDecoratorConfig = {
  esmmobxdecorator: {
    input: resolves('src/mobx-decorator/index.ts'),
    file: resolves('mobx-decorator/index.js'),
    format: 'es',
  },
  umdmobxdecorator: {
    input: resolves('src/mobx-decorator/index.ts'),
    file: resolves('mobx-decorator/mobx-decorator.umd.js'),
    format: 'umd',
  },
};
const AntdToolKitConfig = {
  esmantdToolkit: {
    input: resolves('src/antd-toolkit/index.ts'),
    file: resolves('antd-toolkit/index.js'),
    format: 'es',
  },
};
const ObjectHashConfig = {
  esmObjectHash: {
    input: resolves('src/object-hash/index.ts'),
    file: resolves('object-hash/index.js'),
    format: 'es',
  },
};
const warningConfig = {
  esmwarning: {
    input: resolves('src/warning/index.ts'),
    file: resolves('warning/index.js'),
    format: 'es',
  },
};
const scheduleConfig = {
  esmschedule: {
    input: resolves('src/schedule/index.ts'),
    file: resolves('schedule/index.js'),
    format: 'es',
  },
};
const VModelConfig = {
  esmvmodel: {
    input: resolves('src/model/index.ts'),
    file: resolves('model/index.js'),
    format: 'es',
  },
};
const legionpluginConfig = {
  esmlegionpluginsdk: {
    input: resolves('src/legion.plugin.sdk/index.tsx'),
    file: resolves('legion.plugin.sdk/index.js'),
    format: 'es',
  },
};
const configs = Object.assign(
  {
    /* commonjs: {
    input: resolves('src/index.ts'),
    file: resolves('dist/egg-decoratorers.common.js'),
    format: 'cjs',
  }, */
    esm: {
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-lunar.esm.js'),
      format: 'es',
    },
    umd: {
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-lunar.umd.js'),
      format: 'umd',
    },
  },
  /* MobxDecoratorConfig,
  AntdToolKitConfig,
  ObjectHashConfig,
  warningConfig,
  scheduleConfig,
  VModelConfig, */
  legionpluginConfig
);
function genConfig(opts) {
  const config = {
    input: {
      input: opts.input,
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
        /*  'legions-lunar', */
        /* path.resolve('./src/antd-toolkit/index.ts'),
         path.resolve('./src/warning/index.ts'),
        path.resolve('./src/schedule/index.ts'), */
      ],
      plugins: [
        replace({
          __VERSION__: version,
        }),
        /* resolve(), */
        opts.input.indexOf('model') < 0 &&
          resolve({
            jsnext: true,
            main: true,
            browser: true,
          }),
        opts.input.indexOf('model') < 0 && commonjs(),
        typescript({
          typescript: require('typescript'),
          include: ['*.ts+(|x)', '**/*.ts+(|x)'],
          clean: true,
          exclude: [
            'dist',
            'node_modules/**',
            '*.test.{js+(|x), ts+(|x)}',
            '**/*.test.{js+(|x), ts+(|x)}',
          ],
          useTsconfigDeclarationDir: true,
          transformers: [transformer],
        }),

        /*  buble(), */
        opts.input.indexOf('model') < 0 &&
          babel({
            runtimeHelpers: true,
            // 只转换源代码，不运行外部依赖
            exclude: 'node_modules/**',
            // babel 默认不支持 ts 需要手动添加
            extensions: [...DEFAULT_EXTENSIONS, '.ts'],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
            ],
          }),
        opts.compress === true && uglify.uglify(),
        /*  buble(), */
      ],
    },
    output: {
      banner,
      file: opts.file,
      format: opts.format,
      name: 'legionsMobxDecorator',
    },
  };

  if (opts.env) {
    config.input.plugins.unshift(
      replace({
        'process.env.NODE_ENV': JSON.stringify(opts.env),
      })
    );
  }

  return config;
}

function mapValues(obj, fn) {
  const res = {};
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key);
  });
  return res;
}

module.exports = mapValues(configs, genConfig);
