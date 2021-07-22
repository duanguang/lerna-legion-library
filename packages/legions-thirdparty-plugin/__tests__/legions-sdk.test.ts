import { legionsThirdpartyPlugin } from '../src';
const clipboard =
  'https://gitee.com/duanguang/legion-library/raw/master/packages/legions-thirdparty-plugin/release/clipboard.min.js';
describe('start Test urlParams Decorator', () => {
    it('无参数',done => {
    legionsThirdpartyPlugin.use([
      {
        name: 'clipboard',
        url: clipboard,
      },
    ]);
      console.log(window.document.documentElement.outerHTML);
    legionsThirdpartyPlugin.subscribe('clipboard', () => {
        console.log(legionsThirdpartyPlugin.plugins.clipboard.Clipboard);
        done()
    });
  });
});
