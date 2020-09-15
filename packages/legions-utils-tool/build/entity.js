const path = require('path');
const resolves = _path => path.resolve(__dirname, '../', _path);
const cookieConfig = {
  /* esmcookie: {
    input: resolves('src/cookie/index.ts'),
    file: resolves('cookie/index.js'),
    format: 'es',
  }, */
  umdcookie: {
    input: resolves('src/cookie/index.ts'),
    file: resolves('cookie/index.js'),
    format: 'umd',
  },
};

const debounceConfig = {
  umddebounce: {
    input: resolves('src/debounce/index.ts'),
    file: resolves('debounce/index.js'),
    format: 'umd',
  },
};
const domConfig = {
  umddom: {
    input: resolves('src/dom/index.ts'),
    file: resolves('dom/index.js'),
    format: 'umd',
  },
};
const downloadConfig = {
  umddownload: {
    input: resolves('src/download/index.ts'),
    file: resolves('download/index.js'),
    format: 'umd',
  },
};
const formatdateConfig = {
  umdformatdate: {
    input: resolves('src/format.date/index.ts'),
    file: resolves('format.date/index.js'),
    format: 'umd',
  },
};
const formatsttringConfig = {
  umdformatstring: {
    input: resolves('src/format.string/index.ts'),
    file: resolves('format.string/index.js'),
    format: 'umd',
  },
};
const invariantConfig = {
  umdinvariant: {
    input: resolves('src/invariant/index.js'),
    file: resolves('invariant/index.js'),
    format: 'umd',
  },
};
const objectutilsConfig = {
  umdobjectutils: {
    input: resolves('src/object.utils/index.ts'),
    file: resolves('object.utils/index.js'),
    format: 'umd',
  },
};
const regexConfig = {
  umdregex: {
    input: resolves('src/regex/index.ts'),
    file: resolves('regex/index.js'),
    format: 'umd',
  },
};
const storageConfig = {
  umdstorage: {
    input: resolves('src/storage/index.ts'),
    file: resolves('storage/index.js'),
    format: 'umd',
  },
};
const tarorequestConfig = {
  umdtaro: {
    input: resolves('src/taro.request/index.ts'),
    file: resolves('taro.request/index.js'),
    format: 'umd',
  },
};
const typevalidationConfig = {
  umdtypevalidation: {
    input: resolves('src/type.validation/index.ts'),
    file: resolves('type.validation/index.js'),
    format: 'umd',
  },
};
const vueStoreConfig = {
  umdvueStore: {
    input: resolves('src/vue.store/index.ts'),
    file: resolves('vue.store/index.js'),
    format: 'umd',
  },
};
module.exports = {
  typevalidationConfig,
  tarorequestConfig,
  storageConfig,
  regexConfig,
  objectutilsConfig,
  invariantConfig,
  formatsttringConfig,
  formatdateConfig,
  downloadConfig,
  domConfig,
  debounceConfig,
  cookieConfig,
  vueStoreConfig,
};
