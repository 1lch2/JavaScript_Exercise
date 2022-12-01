// JZ04
// 编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target 。该矩阵具有以下特性：

// 每行的元素从左到右升序排列。
// 每列的元素从上到下升序排列。

// 示例 1：
// 输入：matrix = [[1,4,7,11,15],
//                 [2,5,8,12,19],
//                 [3,6,9,16,22],
//                 [10,13,14,17,24],
//                 [18,21,23,26,30]], target = 5
// 输出：true

// 示例 2：
// 输入：matrix = [[1,4,7,11,15],
//                 [2,5,8,12,19],
//                 [3,6,4,16,22],
//                 [10,13,14,17,24],
//                 [18,21,23,26,30]], target = 20
// 输出：false


// 提示：
// m == matrix.length
// n == matrix[i].length
// 1 <= n, m <= 300
// -109 <= matix[i][j] <= 109
// 每行的所有元素从左到右升序排列
// 每列的所有元素从上到下升序排列
// -109 <= target <= 109

/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
  if(matrix.length === 0 || matrix[0].length === 0) {
    return false;
  }

  const M = matrix.length;
  const N = matrix[0].length;

  let i = 0;
  let j = N - 1;

  while(i < M && j >= 0) {
    // 找到目标
    if(matrix[i][j] === target) {
      return true;
    }
  
    if(matrix[i][j] < target) {
      // 若当前搜索范围右上角值小于目标
      // 说明当前顶部一行值都小于目标
      // 下一次搜索范围为去除顶部一行的矩阵
      i++;
    } else {
      // 若当前搜索范围右上角值大于目标
      // 说明当前最右一列值都大于目标
      // 下一次搜索范围为去除最右一列的矩阵
      j--;
    }
  }
  return false;
};