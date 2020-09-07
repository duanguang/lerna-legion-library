# `legions-mobx-decorator`

> TODO: 基于 mobx 数据流的 React 库修饰器集合

## Usage

```
npm i legions-mobx-decorator --save
```

## API

### submittingAutoMessage

```js
import React from 'react';
import { observer, bind } from 'legions/store-react';
import {submittingAutoMessage} from 'legions-mobx-decorator';

@bind({ store: UserInfoStore })
@observer
export default class CustomsCommodity extends React.Component<IProps, IState> {
    @submittingAutoMessage<CustomsCommodity>({
        state: 'DeleteCustomsCommondity', sideEffect: (that) => {
            that.initData();
        },
    })
    deleteCustomsCommondity(ids: string) {
        this.props.store.deleteCustomsCommondity(ids);
    }
}
```
