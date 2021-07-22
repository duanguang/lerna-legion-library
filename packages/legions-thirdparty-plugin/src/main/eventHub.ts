import { indexOf } from "../utils/indexof";
import { PLUGINS, TypePluginName } from "./plugin.config";

type ICache = {
    [p in keyof TypePluginName]?: Function[];
  };
export class EventHub {
    //@ts-ignore
    cache: ICache = {};
    on(evenName: TypePluginName, fn: () => void) {
      if (PLUGINS.findIndex(item => item === evenName) > -1) {
        if (typeof fn !== 'function') {
          console.warn('callback not an executable function');
          return;
        }
        this.cache[evenName] = this.cache[evenName] || [];
        this.cache[evenName].push(fn);
      } else {
        console.warn('输入的插件不在可使用队列');
      }
    }
    emit(evenName: TypePluginName, fn?: () => void) {
      if (
        this.cache[evenName] &&
        Object.prototype.toString.call(this.cache[evenName]) === '[object Array]'
      ) {
        if (typeof fn === 'function') {
          const index = indexOf(this.cache[evenName], fn);
          if (index === -1) return;
          fn();
        } else {
          this.cache[evenName].forEach(fn => fn());
        }
      }
    }
    off(eventName: TypePluginName, fn?: () => void) {
      if (
        this.cache[eventName] &&
        Object.prototype.toString.call(this.cache[eventName]) === '[object Array]'
      ) {
        if (fn && typeof fn === 'function') {
          const index = indexOf(this.cache[eventName], fn);
          if (index === -1) return;
          this.cache[eventName].splice(index, 1);
        } else {
          this.cache[eventName] = [];
        }
      }
    }
  }