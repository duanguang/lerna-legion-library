// 兼容 IE 8 的 indexOf
export function indexOf(arr, item) {
  if (arr === undefined) return -1;
  let index = -1;
  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] === item) {
      index = i;
      break;
    }
  }
  return index;
}
