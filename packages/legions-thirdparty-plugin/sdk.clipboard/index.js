/**
 * legions-thirdparty-plugin v0.0.8
 * (c) 2021 duanguang
 * @license MIT
 */
import Clipboard from 'clipboard';
export { default as Clipboard } from 'clipboard';

/* import Clipboard from './clipboard.min'; */
/* import Clipboard from './clipboard' */
function copyText(text) {
    return new Promise(function (resolve, reject) {
        var fake_el = document.createElement('button');
        if (Clipboard) {
            // @ts-ignore
            var clipboard_1 = new Clipboard(fake_el, {
                text: function () {
                    return text;
                },
                action: function () {
                    return 'copy';
                },
            });
            clipboard_1.on('success', function (e) {
                clipboard_1.destroy();
                resolve(e);
            });
            clipboard_1.on('error', function (e) {
                clipboard_1.destroy();
                reject(e);
            });
            fake_el.click();
        }
    });
}

export { copyText };
