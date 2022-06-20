// 数据样式：
// arr = [
//   { id: 1 },
//   { id: 2, parentId: 1 },
//   { id: 3, parentId: 1 },
//   { id: 4, parentId: 5 },
//   { id: 5 },
// ];

/**
 * 数组转树（非递归）
 * 
 * 会对原数组元素造成修改
 * 
 * @param {Array} arr 目标数组
 * @returns {Array} 树形结构的结果
 */
function arrToTree(arr) {
  // 结果数组
  let result = [];
  // 存储数组元素到 id 的映射，便于后续访问
  let map = {};

  // 建立映射
  arr.forEach(item => {
    map[item.id] = item;
  });

  arr.forEach(item => {
    // 获取当前元素的父元素，若不存在则结果为 undefined
    let parent = map[item.parentId];
    if(parent) {
      if(parent.children === undefined) {
        parent.children = [];
      }
      // 当前元素插入到父元素的子元素列表中
      parent.children.push(item);
    } else {
      result.push(item);
    }
  });

  return result;
}

(function() {
  let input = [
    { id: 1 },
    { id: 2, parentId: 1 },
    { id: 3, parentId: 1 },
    { id: 4, parentId: 5 },
    { id: 5 },
  ];

  console.log(arrToTree(input));
})();