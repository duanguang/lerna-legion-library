import {
  MicroAppStateActions,
  OnGlobalStateChangeCallback,
  IResource,
} from '../interfaces';
import cloneDeep from 'lodash/cloneDeep';
let globalState: Record<string, any> = {};
const deps: Record<string,OnGlobalStateChangeCallback> = {};
const events = {};

// 触发全局监听
function emitGlobal(
  state: Record<string, any>,
  prevState: Record<string,any>,
  event?: {
    name: string;
    scope: string;
  }
) {
  Object.keys(deps).forEach((id: string) => {
    if (typeof deps[id]==='function') {
      if (event) {
        const types = events[event.scope];
        if (types && Array.isArray(types)) {
          types.forEach(function (type) {
            if (type === id) {
              deps[id](cloneDeep(state), cloneDeep(prevState),event);
             }
          })
        }
      }
      /* else {
        deps[id](cloneDeep(state), cloneDeep(prevState));
      } */
    }
  });
}

export function initGlobalState(state: Record<string, any> = {}) {
  if (state === globalState) {
    console.warn('[legions] state has not changed！');
  } else {
    const prevGlobalState = cloneDeep(globalState);
    globalState = cloneDeep(state);
    emitGlobal(globalState, prevGlobalState);
  }
  return getMicroAppStateActions(`global-${+new Date()}`, true);
}

export function getMicroAppStateActions(
  id: string,
  isMaster?: boolean
): MicroAppStateActions {
  return {
    /**
     * onGlobalStateChange 全局依赖监听
     *
     * 收集 setState 时所需要触发的依赖
     *
     * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onGlobalStateChange
     *
     * 这么设计是为了减少全局监听滥用导致的内存爆炸
     *
     * 依赖数据结构为：
     * {
     *   {id}: callback
     * }
     *
     * @param callback
     * @param fireImmediately
     */
    onGlobalStateChange<IGlobalState=Record<string, any>>(
      callback: OnGlobalStateChangeCallback<IGlobalState>,
      options?: {
        fireImmediately?: boolean,
        eventScopes?:IResource[],
      }
    ) {
      if (!(typeof callback==='function')) {
        console.error('[legions] callback must be function!');
        return;
      }
      if (deps[id]) {
        console.warn(
          `[legions] '${id}' global listener already exists before this, new listener will overwrite it.`
        );
      }
      //@ts-ignore
      deps[id] = callback;
      if (options && Array.isArray(options.eventScopes)) {
        options.eventScopes.forEach(function (eventScope) {
          let types = events[eventScope.name];
          if (!types) {
            types = events[eventScope.name] = []; 
          }
          types.push(id);
        })
      }
      const cloneState = cloneDeep(globalState);
      if (options&&options.fireImmediately) {
        callback(cloneState, cloneState);
      }
    },

    /**
     * setGlobalState 更新 store 数据
     *
     * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
     * 2. 修改 store 并触发全局监听
     *
     * @param state
     */
    setGlobalState(state = {},event: {
      name: string;
      scope: string;
    }) {
      if (state === globalState) {
        console.warn('[legions] state has not changed！');
        return false;
      }

      const changeKeys: string[] = [];
      const prevGlobalState = cloneDeep(globalState);
      globalState = cloneDeep(
        Object.keys(state).reduce((_globalState, changeKey) => {
          if (isMaster || _globalState.hasOwnProperty(changeKey)) {
            changeKeys.push(changeKey);
            return Object.assign(_globalState, {
              [changeKey]: state[changeKey],
            });
          }
          console.warn(
            `[legions] '${changeKey}' not declared when init state！`
          );
          return _globalState;
        }, globalState)
      );
      if (changeKeys.length === 0) {
        console.warn('[legions] state has not changed！');
        return false;
      }
      emitGlobal(globalState, prevGlobalState,event);
      return true;
    },

    // 注销该应用下的依赖
    offGlobalStateChange() {
      delete deps[id];
      return true;
    },
  };
}
