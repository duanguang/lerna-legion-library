const path = require('path');
const resolves = _path => path.resolve(__dirname, '../', _path);
const asyncvalidator = {
  umdasyncvalidator: {
    input: resolves('src/async.validator/index.ts'),
    file: resolves('async.validator/index.js'),
    format: 'umd',
  },
};

const entityConfig = {
  asyncvalidator,
};
module.exports = entityConfig;
