const path = require('path');
const resolves = _path => path.join(process.cwd(), _path);
const commonjs = [
  {
    name: 'umd',
    input: resolves('src/index.js'),
    file: resolves('dist/legions-report.umd.js'),
    format: 'umd',
    compress: false,
    banner: ' legions-report',
    outputName: 'legionsReport',
  },
];
const browser = [
  {
    name: 'umdprod',
    input: resolves('src/index.js'),
    file: resolves('dist/legions-report.umd.min.js'),
    format: 'iife',
    compress: true,
    banner: ' legions-report',
    rollupPlugin: {
      commonjs: {
        namedExports: {
          // 显式指出指定文件导出模块
          'node_modules/legions-utils-tool/browser/index.js': [
            'BrowserMatch',
            'getNetworkType',
          ],
        },
      },
    },
    outputName: 'legionsReport',
  },
];
const entitys = {
  browser,
  commonjs,
};
module.exports = {
  external:
    process.env.PACKAGE === 'commonjs' ? ['legions-utils-tool/browser'] : [],
  rollupPlugin: {
    babel: false,
    typescript: {
      include: ['*.ts+(|x)', '**/*.ts+(|x)', '**/*.js', '*.js'],
    },
  },
  extendPlugins: [],
  entitys: [...entitys[process.env.PACKAGE]],
};
