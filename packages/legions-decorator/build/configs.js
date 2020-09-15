const resolve = require('rollup-plugin-node-resolve'); //告诉 Rollup 如何查找外部模块
const path = require('path');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const version = process.env.VERSION || require('../package.json').version;
const tsImportPluginFactory = require('ts-import-plugin');
const dts = require('rollup-plugin-dts');
const banner = `/**
 * legions-mobx-decorator v${version}
 * (c) ${new Date().getFullYear()} duanguang
 * @license MIT
 */`;
const transformer = () => ({
  before: [
    tsImportPluginFactory({
      libraryDirectory: 'lib',
      libraryName: 'antd',
      style: 'css',
    }),
  ],
});
const resolves = _path => path.resolve(__dirname, '../', _path);
/** 1. amd -- 异步模块定义，用于像RequestJS这样的模块加载器。
2. cjs -- CommonJS, 适用于Node或Browserify/webpack
3. es -- 将软件包保存为ES模块文件。
4. iife -- 一个自动执行的功能，适合作为 <script>标签这样的。
5. umd -- 通用模块定义，以amd, cjs, 和 iife 为一体。 */
const configs = {
  /* commonjs: {
    input: resolves('src/index.ts'),
    file: resolves('dist/egg-decoratorers.common.js'),
    format: 'cjs',
  }, */
  esm: {
    input: resolves('src/index.ts'),
    file: resolves('dist/legions-mobx-decorator.esm.js'),
    format: 'es',
  },
};

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
        'legions-nprogress',
      ],
      plugins: [
        replace({
          __VERSION__: version,
        }),
        resolve({
          jsnext: true,
          main: true,
          browser: true,
        }),
        typescript({
          typescript: require('typescript'),
          include: ['*.ts+(|x)', '**/*.ts+(|x)'],
          exclude: [
            'dist',
            'node_modules/**',
            '*.test.{js+(|x), ts+(|x)}',
            '**/*.test.{js+(|x), ts+(|x)}',
          ],
          useTsconfigDeclarationDir: true,
          /* transformers: [transformer], */
        }),
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