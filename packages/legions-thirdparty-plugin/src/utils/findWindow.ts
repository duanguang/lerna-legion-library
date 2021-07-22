/** 查找window 变量值，优先查找父级元素，如果没有找到 */
export function findWindow<T = {}>(name: string) {
    let LegionstValue: T | null = null;
    try {
      LegionstValue = window.parent[name];
    } catch (e) {
      LegionstValue = null;
    }
    if (!LegionstValue) {
      LegionstValue = window[name];
    }
    return LegionstValue;
  }