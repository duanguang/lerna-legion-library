/*
 * @Author: duanguang
 * @Date: 2020-09-30 16:20:29
 * @LastEditTime: 2021-07-22 00:27:24
 * @LastEditors: duanguang
 * @Description: 
 * @FilePath: /lerna-legion-library/packages/legions-thirdparty-plugin/build/configs.js
 * 「扫去窗上的尘埃，才可以看到窗外的美景。」
 */
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
const main = {
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
  /* iifeProd: {
    input: resolves('src/index.ts'),
    file: resolves('release/legions-thirdparty-plugin.min.js'),
    format: 'iife',
    env: 'production',
  }, */
};
const focusOutside = {
  es: {
    input: resolves('src/focus-outside/index.ts'),
    file: resolves('focus-outside/index.js'),
    format: 'es',
    compress: true,
    env: 'development',
  },
  /* iifefocusOutsideProd: {
    input: resolves('src/focus-outside/index.ts'),
    file: resolves('release/focus-outside.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyFocusOutsidePlugin',
  }, */
};
const dexie = {
  esmdexie: {
    input: resolves('src/dexie/index.ts'),
    file: resolves('dexie/index.js'),
    format: 'es',
    external:['dexie']
  },
 /*  iifedexieProd: {
    input: resolves('src/dexie/index.ts'),
    file: resolves('release/dexie.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyDexiePlugin',
  }, */
};
const clipboard = {
  esmclipboard: {
    input: resolves('src/clipboard/index.ts'),
    file: resolves('clipboard/index.js'),
    format: 'es',
    external:['clipboard']
  },
  /* iifeclipboardProd: {
    input: resolves('src/clipboard/index.ts'),
    file: resolves('release/clipboard.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyClipboardPlugin',
  }, */
};
const jsbarcode = {
  esmjsbarcode: {
    input: resolves('src/jsbarcode/index.ts'),
    file: resolves('jsbarcode/index.js'),
    format: 'es',
    external:['jsbarcode']
  },
  /* iifejsbarcodeProd: {
    input: resolves('src/jsbarcode/index.ts'),
    file: resolves('release/jsbarcode.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyJsbarcodePlugin',
  }, */
};
const html2canvas = {
  esmhtml2canvas: {
    input: resolves('src/html2canvas/index.ts'),
    file: resolves('html2canvas/index.js'),
    format: 'es',
    external:['html2canvas']
  },
  /* iifehtml2canvasProd: {
    input: resolves('src/html2canvas/index.ts'),
    file: resolves('release/html2canvas.min.js'),
    format: 'iife',
    env: 'production',
    outputName: 'legionsThirdpartyHtml2canvasPlugin',
  }, */
};
const excel = {
  esmexcel: {
    input: resolves('src/excel/index.ts'),
    file: resolves('excel/index.js'),
    format: 'es',
    external:['xlsx']
  },
  /* iifeexcelProd: {
    input: resolves('src/excel/index.ts'),
    file: resolves('release/excel.0.0.8.min.js'),
    format: 'iife',
    compress:true,
    env: 'production',
    outputName: 'legionsThirdpartyExcelPlugin',
  }, */
};
const excelPro = {
  iifeexcelProProd: {
    input: resolves('src/excel-pro/index.ts'),
    file: resolves('excel-pro/excel-pro.js'),
    format: 'iife',
    compress:true,
    outputName: 'legionsThirdpartyExcelPlugin',
  }
}
const mainEntity = {
  main,
  excel,
  html2canvas,
  jsbarcode,
  clipboard,
  dexie,
  focusOutside,
  excelPro,
};
const entity = mainEntity.hasOwnProperty(process.env.PACKAGE)
  ? mainEntity[process.env.PACKAGE]
  : mainEntity;
const configs = {
  ...entity,
};

function genConfig(opts) {
  const external= opts.external||[]
  const config = {
    input: {
      input: opts.input,
      external,
      plugins: [
        replace({
          __VERSION__: version,
        }),
        resolve({
          jsnext: true,
          main: true,
          browser: true,
        }),
        commonjs({
          namedExports: {
            // 显式指出指定文件导出模块
            'node_modules/exceljs/lib/exceljs.browser.js': [
              'Workbook',
            ],
            /*  'node_modules/legions-import-html-entry/lib/legions-import-html-entry.umd.js': [
          'importHTML',
          'importEntry',
        ], */
          },
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
        }),
        /* buble(),
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
        }), */
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

module.exports = mapValues(configs, genConfig);
