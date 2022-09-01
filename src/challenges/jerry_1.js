// 给定一个数组，只有一个初始数字 1。
// 对于数组的第 2n 个元素，有 a[2i] = a[2i-1] * 2 +1
// 对于数组的第 2n + 1个元素，有 a[2i+1] = a[2i-1] * 3 + 1
// 每次使用同一个数字作为参数计算并加入两个数字
// 数组最终应该有序
// 返回数组第 N 个数字

// [1, 3, 4, 7, 9, 10, 13]

/**
 * 
 * @param {number} n 
 * @return {number}
 */
function getNthNumber(n) {
  // 计算方式对应层序构造一棵树，左子树为 x2+1，右子树为 x3+1
  // 将树按数组方式处理

  let result = new Array(n).fill(0);
  result[0] = 1;

  for(let i = 0; i < n; i++) {
    let leftIndex = i * 2 + 1;
    let rightIndex = i * 2 + 2;

    result[leftIndex] = result[i] * 2 + 1;
    result[rightIndex] = result[i] * 3 + 1;
  }

  // 去重并排序
  result = [...new Set(result)].sort((a, b) => a - b);
  return result;
}

// [1, 3, 4, 7, 9, 10, 13]
console.log(getNthNumber(7));
