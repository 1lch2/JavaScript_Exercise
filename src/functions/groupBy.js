// 输入：
// array = [
//   {"id":"1"},
//   {"id":"1"},
//   {"id":"2"}
// ],
// fn = function (item) {
//   return item.id;
// }
// 输出：
// {
//   "1": [{"id": "1"}, {"id": "1"}],
//   "2": [{"id": "2"}]
// }
// 解释：
// 输出来自函数 array.groupBy(fn)。
// 分组选择方法是从数组中的每个项中获取 "id" 。
// 有两个 "id" 为 1 的对象。所以将这两个对象都放在第一个数组中。
// 有一个 "id" 为 2 的对象。所以该对象被放到第二个数组中。

Array.prototype.groupBy = function (fn) {
  const result = {};
  const array = this;
  for (let i = 0; i < array.length; i++) {
    const key = fn(array[i]);
    const val = result[key];
    if (val !== undefined) {
      result[key].push(array[i]);
    } else {
      result[key] = [array[i]];
    }
  }
  return result;
};

/**
 * [1,2,3].groupBy(String) // {"1":[1],"2":[2],"3":[3]}
 */
