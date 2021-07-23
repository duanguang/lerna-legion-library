import { legionsThirdpartyPlugin,runDynamicScripts } from '../src';
const clipboard =
  'https://gitee.com/duanguang/legion-library/raw/master/packages/legions-thirdparty-plugin/release/clipboard.min.js';
describe('start Test urlParams Decorator',() => {
  jest.useFakeTimers();
  it('对同个资源执行加载串行测试',done => {
    
    /* legionsThirdpartyPlugin.use([
      {
        name: 'clipboard',
        url: clipboard,
      },
    ]); */
      
   /*  legionsThirdpartyPlugin.subscribe('clipboard', () => {
        console.log(legionsThirdpartyPlugin.plugins.clipboard.Clipboard);
        done()
    }); */
    runDynamicScripts({
        scriptId: 'legions-clipboard-sdk',
        src: clipboard,
        library: 'legionsThirdpartyClipboardPlugin',
        onExecute:(value) => {
          const jsSDKDom= document.getElementById('legions-clipboard-sdk')
          expect(jsSDKDom).not.toBeUndefined()
          expect(value).not.toBeUndefined()
          runDynamicScripts({
            scriptId: 'legions-clipboard-sdks',
            src: clipboard,
            library: 'legionsThirdpartyClipboardPlugin',
            onExecute:(value) => {
              expect(document.getElementById('legions-clipboard-sdks')).toBeNull()
              expect(value).not.toBeUndefined()
            },
          })
          done()
        }
      })
  });
  it('对同个资源执行加载并行测试',(done) => {
    runDynamicScripts({
      scriptId: 'legions-clipboard-sdk',
      src: clipboard,
      library: 'legionsThirdpartyClipboardPlugin',
      onExecute:(value) => {
        const jsSDKDom= document.getElementById('legions-clipboard-sdk')
        expect(jsSDKDom).not.toBeUndefined()
        expect(value).not.toBeUndefined()
      },
    })
    runDynamicScripts({
      scriptId: 'legions-clipboard-sdks',
      src: clipboard,
      library: 'legionsThirdpartyClipboardPlugin',
      onExecute:(value) => {
        expect(document.getElementById('legions-clipboard-sdks')).toBeNull()
        expect(value).not.toBeUndefined()
        done()
      }
    })
  })
});
