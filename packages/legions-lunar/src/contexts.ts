const CONTEXTS = {
  /** 弹出提示交互窗口方法名称 */
  message: Symbol('message'),
  modal: Symbol('Modal'),
};
const LOADLIST: { name: Symbol; value: any }[] = [];
class LegionsMobxDecoratorContext {
  mount(name: Symbol, value: any) {
    if (Object.prototype.toString.call(name) === '[object Symbol]') {
      const _index = LOADLIST.findIndex(item => item.name === name);
      if (_index < 0) {
        LOADLIST.push({ name, value });
      }
    } else {
      console.error('name value Please set up Symbol type');
    }
  }
  get contexts() {
    return LOADLIST;
  }
  getContext(name: Symbol) {
    const _index = LOADLIST.findIndex(item => item.name === name);
    if (_index > -1) {
      return LOADLIST[_index];
    }
    return null;
  }
}
