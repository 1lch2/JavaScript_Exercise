/**
 * 数组扁平化
 * @param {Array} arr 嵌套结构的数组
 * @returns {Array} 扁平化的数组
 */
function flatten(arr) {
  let res = [];

  for(let i of arr) {
    if(Array.isArray(i)) {
      // 若成员为数组，则递归处理嵌套数组
      res = res.concat(flatten(i));
    } else {
      res.push(i);
    }
  }
  return res;
}

(function(){
  let test = [1, [2, 3], [4, 5, 6, [7, 8]]];
  console.log(flatten(test));
  console.log(test.flat(2));
})();