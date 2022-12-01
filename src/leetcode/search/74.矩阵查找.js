// 编写一个高效的算法来判断 m x n 矩阵中，
// 是否存在一个目标值。该矩阵具有如下特性：

// 每行中的整数从左到右按升序排列。
// 每行的第一个整数大于前一行的最后一个整数。

// 示例 1：
// 输入：matrix = [
//   [1,3,5,7],
//   [10,11,16,20],
//   [23,30,34,60]
// ], target = 3
// 输出：true

// 示例 2：
// 输入：matrix = [
//   [1,3,5,7],
//   [10,11,16,20],
//   [23,30,34,60]
// ], target = 13
// 输出：false

// 提示：
// m == matrix.length
// n == matrix[i].length
// 1 <= m, n <= 100
// -104 <= matrix[i][j], target <= 104

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
  const M = matrix.length;
  const N = matrix[0].length;

  // 二分查找定位目标所在的行
  let low = 0;
  let high = M - 1;
  let row = -1;
  while (low <= high) {
    let mid = (low + high) >> 1;
    if (target < matrix[mid][0]) {
      high = mid - 1;
    } else if (target > matrix[mid][N - 1]) {
      low = mid + 1;
    } else {
      row = mid;
      break;
    }
  }

  // 不在任意一行范围内
  if (row === -1) {
    return false;
  }

  // 二分查找定位行内
  low = 0;
  high = N - 1;
  while (low <= high) {
    let mid = (low + high) >> 1;
    if (target < matrix[row][mid]) {
      high = mid - 1;
    } else if (target > matrix[row][mid]) {
      low = mid + 1;
    } else {
      return true;
    }
  }
  return false;
};

let matrix = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60]
];
let target = 3;

console.log(searchMatrix(matrix, target));