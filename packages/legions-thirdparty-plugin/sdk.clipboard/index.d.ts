/*
 * @Author: duanguang
 * @Date: 2020-09-10 13:41:03
 * @LastEditTime: 2021-07-24 01:35:04
 * @LastEditors: duanguang
 * @Description: 
 * @FilePath: /lerna-legion-library/packages/legions-thirdparty-plugin/sdk.clipboard/index.d.ts
 * 「扫去窗上的尘埃，才可以看到窗外的美景。」
 */
import Clipboard from 'clipboard';
export declare function copyText(text: string): Promise<unknown>;
export { Clipboard };
