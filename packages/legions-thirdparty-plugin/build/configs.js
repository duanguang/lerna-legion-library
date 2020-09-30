const resolve = require('rollup-plugin-node-resolve'); //告诉 Rollup 如何查找外部模块
const path = require('path');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const { DEFAULT_EXTENSIONS } = require('@babel/core');
const uglify = require('rollup-plugin-uglify');
const version = process.env.VERSION || require('../package.json').version;

const banner = `/**
 * legions-thirdparty-plugin v${version}
 * (c) ${new Date().getFullYear()} duanguang
 * @license MIT
 */`;
const resolves = _path => path.resolve(__dirname, '../', _path);
/** 1. amd -- 异步模块定义，用于像RequestJS这样的模块加载器。
2. cjs -- CommonJS, 适用于Node或Browserify/webpack
3. es -- 将软件包保存为ES模块文件。
4. iife -- 一个自动执行的功能，适合作为 <script>标签这样的。
5. umd -- 通用模块定义，以amd, cjs, 和 iife 为一体。 */
const configs = {
  umdDev: {
    input: resolves('src/index.ts'),
    file: resolves('dist/legions-thirdparty-plugin.umd.js'),
    format: 'umd',
    compress: true,
    env: 'development',
  },
  /* iife: {
    input: resolves('src/index.ts'),
    file: resolves('dist/legions-thirdparty-plugin.js'),
    format: 'iife',
  }, */
  iifeProd: {
    input: resolves('src/index.ts'),
    file: resolves('release/legions-thirdparty-plugin.min.js'),
    format: 'iife',
    env: 'production',
  },

  umdfocusOutsideDev: {
    input: resolves('src/focus-outside/index.ts'),
    file: resolves('focus-outside/index.js'),
    format: 'umd',
    compress: true,
    env: 'development',
  },
  iifefocusOutsideProd: {
    input: resolves('src/focus-outside/index.ts'),
    file: resolves('release/focus-outside.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyFocusOutsidePlugin',
  },
  /* esmdexie: {
    input: resolves('src/dexie/index.ts'),
    file: resolves('dexie/index.js'),
    format: 'umd',
  }, */
  iifedexieProd: {
    input: resolves('src/dexie/index.ts'),
    file: resolves('release/dexie.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyDexiePlugin',
  },

  esmclipboard: {
    input: resolves('src/clipboard/index.ts'),
    file: resolves('clipboard/index.js'),
    format: 'umd',
  },
  iifeclipboardProd: {
    input: resolves('src/clipboard/index.ts'),
    file: resolves('release/clipboard.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyClipboardPlugin',
  },
  esmjsbarcode: {
    input: resolves('src/jsbarcode/index.ts'),
    file: resolves('jsbarcode/index.js'),
    format: 'umd',
  },
  iifejsbarcodeProd: {
    input: resolves('src/jsbarcode/index.ts'),
    file: resolves('release/jsbarcode.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyJsbarcodePlugin',
  },
  /* esmhtml2canvas: {
    input: resolves('src/html2canvas/index.ts'),
    file: resolves('html2canvas/index.js'),
    format: 'umd',
  }, */
  iifehtml2canvasProd: {
    input: resolves('src/html2canvas/index.ts'),
    file: resolves('release/html2canvas.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyHtml2canvasPlugin',
  },
  /* esmexcel: {
    input: resolves('src/excel/index.ts'),
    file: resolves('excel/index.js'),
    format: 'umd',
  }, */
  /* iifeexcelProd: {
    input: resolves('src/excel/index.ts'),
    file: resolves('release/excel.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyExcelPlugin',
  }, */
};

function genConfig(opts) {
  const config = {
    input: {
      input: opts.input,
      external: [],
      plugins: [
        replace({
          __VERSION__: version,
        }),
        resolve({
          jsnext: true,
          main: true,
          browser: true,
        }),
        commonjs({}),
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
        }),
        buble(),
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
      ],
    },
    output: {
      banner,
      file: opts.file,
      format: opts.format,
      name: opts.outputName || 'legionsThirdpartyPlugin',
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

module.exports = mapValues(
  {
    umdDev: {
      input: resolves('src/index.ts'),
      file: resolves('dist/legions-thirdparty-plugin.umd.js'),
      format: 'umd',
      compress: true,
      env: 'development',
    },
  },
  genConfig
);
