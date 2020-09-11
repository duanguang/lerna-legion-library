# `legions-thirdparty-plugin`

> TODO: 第三方插件调用工具库

## Usage

```md
npm install --save legions-thirdparty-plugin
```

```js
import { legionsThirdpartyPlugin } from 'legions-thirdparty-plugin';
legionsThirdpartyPlugin.use([
  {
    name: 'excel',
    url: 'https://qa-zy.hoolinks.com/static/plugin/excel.min.js',
  },
  {
    name: 'clipboard',
    url: 'https://qa-zy.hoolinks.com/static/plugin/clipboard.min.js',
  },
]);

/* ====== start 如果在使用插件数据时，不确定插件是否返回，可以这样使用====== */
legionsThirdpartyPlugin.subscribe('clipboard', () => {
  console.log(legionsThirdpartyPlugin.plugins);
});
/* ====== end====== */

/* ====== start 如果在使用插件数据时，确定插件返回，可以这样使用====== */
legionsThirdpartyPlugin.plugins.clipboard;
/* ====== end====== */
```

详情见 d.ts 文档
