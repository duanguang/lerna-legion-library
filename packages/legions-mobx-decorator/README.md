# `egg-decorator`

> TODO: description

## Usage

### Body&post

```js
import {
  validateProperty,
  post,
  Body,
  required,
  validate,
} from 'egg-decoratorers';

import { validateProperty } from 'egg-decoratorers';
export class LoggingRecordDto {
  @validateProperty({ type: 'number', required: true })
  modulesPath: string;
  @validateProperty({ type: 'string', required: true })
  type: string;
  content: string;
  modulesName: string;
  userInfo: string;
  @validateProperty({ type: 'string', required: true })
  traceId: string;
  browserEnvironment: string;
}
```

```js

import { Controller, Context } from 'egg';
import CommonController from '../abstract/controller/common';
import { LoggingRecordDto } from '../dto/loggingRecordDto';
import { post, Body } from 'egg-decoratorers';
export default class LoggingRecordController extends CommonController {

    @post
    public async edit(
    @Body(LoggingRecordDto) loggingRecordDto?: LoggingRecordDto
    ) {
        const body: LoggingRecordDto = this.ctx.request.body;
        console.log(loggingRecordDto, 'loggingRecordDto');
        const createResult = await this.ctx.service.loggingRecordService.edit(body);
        this.success(createResult);
    }

}

```

### required&validate

```js
import { Controller } from 'egg';
import { HttpClientResponse } from 'urllib';
import {
  required,
  validate,
} from 'egg-decoratorers';
export default class HomeController extends Controller {
  public async index() {
    const { ctx } = this;
    this.greet('222');
    ctx.body = await ctx.service.test.sayHi('egg');
  }
  @validate
  greet(@required name?: string) {
    return 'Hello ' + name + ', ';
  }
}

```

// TODO: DEMONSTRATE API

```

```
