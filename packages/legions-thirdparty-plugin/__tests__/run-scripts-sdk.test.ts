import { runScriptsSdk } from '../src';
const clipboard =
  'https://gitee.com/duanguang/legion-library/raw/master/packages/legions-thirdparty-plugin/release/clipboard.min.js';
describe('start Test urlParams Decorator',() => {
  jest.useFakeTimers();
  it('对同个资源执行加载串行测试',done => {
    runScriptsSdk.use([
      {
        name: 'clipboard',
        url: clipboard,
      },
    ]);
    runScriptsSdk.subscribe('clipboard',() => {
       console.log(window.document.documentElement.outerHTML);
       console.log(runScriptsSdk.plugins.clipboard.Clipboard);
       done()
    });
  });
});
