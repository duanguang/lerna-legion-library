const babel = { browser: {}, umd: { babel: false } };

const external = {
  browser: [],
  umd: [
    'lodash/mergeWith',
    'lodash/concat',
    'lodash/forEach',
    'lodash/noop',
    'reflect-metadata',
    'lodash/cloneDeep',
    'lodash/snakeCase',
    'lodash/isFunction',
    'legions-import-html-entry',
    'single-spa',
  ],
};
const commonjs = {
  browser: {
    commonjs: {
      namedExports: {
        // 显式指出指定文件导出模块
        'node_modules/legions-import-html-entry/lib/legions-import-html-entry.umd.js': [
          'importHTML',
          'importEntry',
          'execScripts',
        ],
        /*  'node_modules/legions-import-html-entry/lib/legions-import-html-entry.umd.js': [
      'importHTML',
      'importEntry',
    ], */
      },
    },
  },
  umd: {},
};
module.exports = {
    babel,
    external,
    commonjs
}