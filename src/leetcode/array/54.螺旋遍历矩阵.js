// 给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。

// 示例 1：
// 输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
// 输出：[1,2,3,6,9,8,7,4,5]

// 示例 2：
// 输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
// 输出：[1,2,3,4,8,12,11,10,9,5,6,7]

// 提示：
// m == matrix.length
// n == matrix[i].length
// 1 <= m, n <= 10
// -100 <= matrix[i][j] <= 100

/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  const M = matrix.length;
  const N = matrix[0].length;
  const TOTAL = M * N;

  let top = 0;
  let right = N - 1;
  let left = 0;
  let bottom = M - 1;

  let res = [];
  while(res.length < TOTAL) {
    // ->
    for(let i = left; i <= right && res.length < TOTAL; i++) {
      res.push(matrix[top][i]);
    }
    top++;

    // ⬇
    for(let i = top; i <= bottom && res.length < TOTAL; i++) {
      res.push(matrix[i][right]);
    }
    right--;

    // <-
    for(let i = right; i >= left && res.length < TOTAL; i--) {
      res.push(matrix[bottom][i]);
    }
    bottom--;

    // ⬆
    for(let i = bottom; i >= top && res.length < TOTAL; i--) {
      res.push(matrix[i][left]);
    }
    left++;
  }
  return res;
};

(function(){
  console.log(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]));
})();