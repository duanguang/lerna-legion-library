const babel = { browser: {}, umd: { babel: false },es:{babel:false} };
const externals =['lodash/mergeWith',
'lodash/concat',
'lodash/forEach',
'lodash/noop',
'reflect-metadata',
'lodash/cloneDeep',
'lodash/snakeCase',
'lodash/isFunction',
'legions-import-html-entry',
'single-spa',]
const external = {
  browser: [],
  umd: [
    ...externals
  ],
  es: [
    ...externals
  ],
};
const commonjs = {
  browser: {
    commonjs: {
      namedExports: {
        // 显式指出指定文件导出模块
        'node_modules/legions-import-html-entry/es/index.js': [
          'importHTML',
          'importEntry',
          'execScripts',
          'fetch'
        ],
        /*  'node_modules/legions-import-html-entry/lib/legions-import-html-entry.umd.js': [
      'importHTML',
      'importEntry',
    ], */
      },
    },
  },
  umd: {},
  es:{}
};
module.exports = {
    babel,
    external,
    commonjs
}