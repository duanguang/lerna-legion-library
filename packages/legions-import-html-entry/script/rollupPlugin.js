const babel = { browser: {}, umd: { babel: false },es: { babel: false },cjs:{babel:false} };
const externals = ['whatwg-fetch','core-js/modules/es.string.starts-with']
const external = {
  browser: [],
  umd: [...externals],
  es: [...externals],
  cjs:[...externals]
};
module.exports = {
    babel,
    external,
}