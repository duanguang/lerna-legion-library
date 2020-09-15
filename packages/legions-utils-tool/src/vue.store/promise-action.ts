import observablePromise from './observable-promise';
/**
 * action操作方法
 *
 * @export
 * @class PromiseAction
 */
import { invariant } from '../invariant';
export class PromiseAction {
  constructor(options) {
    options = options || {};
    return this;
  }
  init(dispatch: any, type: string) {
    invariant(
      typeof dispatch === 'object',
      'dispatch: dispatch should be a object'
    );
    invariant(
      typeof dispatch.commit === 'function',
      'dispatch.commit: dispatch.commit should be a function'
    );
    invariant(
      typeof type === 'string',
      'type: dispatch.commit should be a string'
    );
    dispatch.commit(type);
    return this;
  }
  set(dispatch: any, type: string, promise: Promise<any>) {
    invariant(
      typeof dispatch === 'object',
      'dispatch: dispatch should be a object'
    );
    invariant(
      typeof dispatch.commit === 'function',
      'dispatch.commit: dispatch.commit should be a function'
    );
    invariant(
      typeof type === 'string',
      'type: dispatch.commit should be a string'
    );
    //@ts-ignore
    dispatch.commit(type, new observablePromise({ state: 'pending' }));
    observablePromise({
      //@ts-ignore
      promise: promise,
      dispatch: item => {
        dispatch.commit(type, item);
      },
    });
    return this;
  }
  commit(promise: Promise<any>, callBackFunc: Function) {
    observablePromise({
      //@ts-ignore
      promise: promise,
      dispatch: item => {
        callBackFunc && callBackFunc(item);
      },
    });
    return this;
  }
}
