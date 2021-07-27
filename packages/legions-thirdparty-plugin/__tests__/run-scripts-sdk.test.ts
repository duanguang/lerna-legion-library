import { runScriptsSdk } from '../src';
/* const prex ='https://gitee.com/duanguang/legion-library/raw/master/packages/legions-thirdparty-plugin/release' */
const prex =' http://127.0.0.1:8080'
const clipboard =
  `${prex}/clipboard.min.js`;
describe('start Test urlParams Decorator',() => {
  jest.useFakeTimers();
  beforeEach(() => {
  });
  it('install clipboard',done => {
    runScriptsSdk.use([
      {
        name: 'clipboard',
        url: clipboard,
      },
    ]);
    runScriptsSdk.subscribe('clipboard',() => {
      // console.log(window.document.documentElement.outerHTML);
      expect(runScriptsSdk.plugins.clipboard).not.toBeUndefined()
       done()
    });
  });
  it('install dexie',done => {
    const ulr =`${prex}/dexie.min.js`
    runScriptsSdk.use([
      {
        name: 'dexie',
        url: ulr,
      },
    ]);
    runScriptsSdk.subscribe('dexie',() => {
      const dexies = runScriptsSdk.plugins.dexie
      expect(dexies).not.toBeUndefined()
      done()
    });
  });
  it('install xlsx',done => {
    const ulr =`${prex}/xlsx.min.js`
    runScriptsSdk.use([
      {
        name: 'xlsx',
        url: ulr,
      },
    ]);
    runScriptsSdk.subscribe('xlsx',() => {
      const xlsx = runScriptsSdk.plugins.xlsx
      expect(xlsx).not.toBeUndefined()
      done()
    });
  });
  it('install jsBarcode',done => {
    const ulr =`${prex}/jsbarcode.min.js`
    runScriptsSdk.use([
      {
        name: 'jsBarcode',
        url: ulr,
      },
    ]);
    runScriptsSdk.subscribe('jsBarcode',() => {
      const jsBarcode = runScriptsSdk.plugins.jsBarcode
      expect(jsBarcode).not.toBeUndefined()
      done()
    });
  });
  it('install focus-outside',done => {
    const ulr =`${prex}/focus-outside.min.js`
    runScriptsSdk.use([
      {
        name: 'focusOutside',
        url: ulr,
      },
    ]);
    runScriptsSdk.subscribe('focusOutside',() => {
      const focusOutside = runScriptsSdk.plugins.focusOutside
      expect(focusOutside).not.toBeUndefined()
      done()
    });
  });
});
