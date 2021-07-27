import { runScriptsSdk } from '../src';
const prex ='https://gitee.com/duanguang/legion-library/raw/master/packages/legions-thirdparty-plugin/release'
const clipboard =
  `${prex}/clipboard.min.js`;
describe('start Test urlParams Decorator',() => {
  jest.useFakeTimers();
  beforeEach(() => {
  });
 /*  it('install clipboard',done => {
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
  }); */
  /* it('install dexie',done => {
    const ulr =`${prex}/dexie.min.js`
    runScriptsSdk.use([
      {
        name: 'dexie',
        url: ulr,
      },
    ]);
    runScriptsSdk.subscribe('dexie',() => {
      console.log(window.document.documentElement.outerHTML);
      const dexies = runScriptsSdk.plugins.dexie
      expect(dexies).not.toBeUndefined()
      done()
    });
  }); */
  it('install xlsx',done => {
    const ulr =`${prex}/xlsx.min.js`
    runScriptsSdk.use([
      {
        name: 'xlsx',
        url: ulr,
      },
    ]);
    console.log(window.document.documentElement.outerHTML);
    runScriptsSdk.subscribe('xlsx',() => {
      console.log(window.document.documentElement.outerHTML);
      const xlsx = runScriptsSdk.plugins.xlsx
      console.log(xlsx)
      done()
    });
  });
});
