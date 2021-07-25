/*
 * @Author: duanguang
 * @Date: 2020-09-30 16:20:29
 * @LastEditTime: 2021-07-25 23:36:34
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
  esDev: {
    input: resolves('src/index.ts'),
    file: resolves('dist/index.js'),
    format: 'es',
   /*  compress: true, */
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
  esfocusOutside: {
    input: resolves('src/focus-outside/index.ts'),
    file: resolves('focus-outside/index.js'),
    format: 'es',
    external: [],
    name:'focus-outside',
    /* compress: true, */
    env: 'development'
  },
  /* iifefocusOutsideProd: {
    input: resolves('src/focus-outside/index.ts'),
    file: resolves('release/focus-outside.min.js'),
    format: 'iife',
    env: 'production',
    name:'focus-outside',
    outputName: 'legionsThirdpartyFocusOutsidePlugin',
  }, */
};
const dexie = {
  esmdexie: {
    input: resolves('src/sdk.dexie/index.ts'),
    file: resolves('sdk.dexie/index.js'),
    format: 'es',
    name:'sdk.dexie',
    external:['dexie']
  },
 /*  iifedexieProd: {
    input: resolves('src/sdk.dexie/index.ts'),
    file: resolves('release/dexie.min.js'),
    format: 'iife',
    name:'sdk.dexie',
    env: 'production',
    outputName: 'legionsThirdpartyDexiePlugin',
  }, */
};
const clipboard = {
  esmclipboard: {
    input: resolves('src/sdk.clipboard/index.ts'),
    file: resolves('sdk.clipboard/index.js'),
    format: 'es',
    name:'sdk.clipboard',
    external:['clipboard']
  },
  /* iifeclipboardProd: {
    input: resolves('src/sdk.clipboard/index.ts'),
    file: resolves('release/clipboard.min.js'),
    format: 'iife',
    env: 'production',
    name:'sdk.clipboard',
    outputName: 'legionsThirdpartyClipboardPlugin',
  }, */
};
const jsbarcode = {
  esmjsbarcode: {
    input: resolves('src/sdk.jsbarcode/index.ts'),
    file: resolves('sdk.jsbarcode/index.js'),
    format: 'es',
    name:'sdk.jsbarcode',
    external:['jsbarcode']
  },
  /* iifejsbarcodeProd: {
    input: resolves('src/sdk.jsbarcode/index.ts'),
    file: resolves('release/jsbarcode.min.js'),
    format: 'iife',
    env: 'production',
    name:'sdk.jsbarcode',
    outputName: 'legionsThirdpartyJsbarcodePlugin',
  }, */
};
const html2canvas = {
  esmhtml2canvas: {
    input: resolves('src/sdk.html2canvas/index.ts'),
    file: resolves('sdk.html2canvas/index.js'),
    format: 'es',
    name:'sdk.html2canvas',
    external:['html2canvas']
  },
  /* iifehtml2canvasProd: {
    input: resolves('src/sdk.html2canvas/index.ts'),
    file: resolves('release/html2canvas.min.js'),
    format: 'iife',
    env: 'production',
    name:'sdk.html2canvas',
    outputName: 'legionsThirdpartyHtml2canvasPlugin',
  }, */
};
const excel = {
  esmexcel: {
    input: resolves('src/sdk.excel/index.ts'),
    file: resolves('sdk.excel/index.js'),
    format: 'es',
    name:'sdk.excel',
    external:['exceljs']
  },
  /* iifeexcelProd: {
    input: resolves('src/sdk.excel/index.ts'),
    file: resolves('release/excel.0.0.8.min.js'),
    format: 'iife',
    compress:true,
    env: 'production',
     name:'sdk.excel',
    outputName: 'legionsThirdpartyExcelPlugin',
  }, */
};
const xlsx = {
  esmxlsx: {
    input: resolves('src/sdk.xlsx/index.ts'),
    file: resolves('sdk.xlsx/index.js'),
    format: 'es',
    name:'sdk.xlsx',
    external:['xlsx']
  },
  iifeexcelProProd: {
    input: resolves('src/sdk.xlsx/index.ts'),
    file: resolves('release/xlsx.min.js'),
    format: 'iife',
    compress:true,
    name:'sdk.xlsx',
    outputName: 'legionsThirdpartyXlsxPlugin',
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
  xlsx,
};
const entity = mainEntity.hasOwnProperty(process.env.PACKAGE)
  ? mainEntity[process.env.PACKAGE]
  : mainEntity;
const configs = {
  ...entity,
};

function genConfig(opts) {
  const external = opts.external || []
  let tsconfigOverride = {}
  if (opts.tsconfigOverride) {
    tsconfigOverride=opts.tsconfigOverride
  } else if (opts.name) {
    tsconfigOverride = {
      tsconfigOverride:{ compilerOptions: { "declaration": true, declarationDir: `./${opts.name}` },input:[`src/${opts.name}/**/*`] }
    }
  }
  console.log(tsconfigOverride);
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
          // include: ['*.ts+(|x)', '**/*.ts+(|x)'],
          exclude: [
            'dist',
            'node_modules/**',
            '*.test.{js+(|x), ts+(|x)}',
            '**/*.test.{js+(|x), ts+(|x)}',
          ],
          clean: true,
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
