/* import Clipboard from './clipboard.min'; */
// @ts-ignore
import Clipboard from 'clipboard';
/* import Clipboard from './clipboard' */
export function copyText(text: string) {
  return new Promise(function (resolve, reject) {
    const fake_el = document.createElement('button');
    if (Clipboard) {
      // @ts-ignore
      const clipboard = new Clipboard(fake_el, {
        text: function () {
          return text;
        },
        action: function () {
          return 'copy';
        },
      });
      clipboard.on('success', function (e) {
        clipboard.destroy();
        resolve(e);
      });
      clipboard.on('error', function (e) {
        clipboard.destroy();
        reject(e);
      });
      fake_el.click();
    }
  });
}
export { Clipboard };
