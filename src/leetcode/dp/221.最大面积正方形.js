// 在一个由 '0' 和 '1' 组成的二维矩阵内，
// 找到只包含 '1' 的最大正方形，并返回其面积。

// 示例 1：
// 输入：matrix = [
//   ["1","0","1","0","0"],
//   ["1","0","1","1","1"],
//   ["1","1","1","1","1"],
//   ["1","0","0","1","0"]
// ]
// 输出：4

// 示例 2：
// 输入：matrix = [
//   ["0","1"],
//   ["1","0"]
// ]
// 输出：1

// 示例 3：
// 输入：matrix = [["0"]]
// 输出：0

// 提示：
// m == matrix.length
// n == matrix[i].length
// 1 <= m, n <= 300
// matrix[i][j] 为 '0' 或 '1'

/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function(matrix) {
  const M = matrix.length;
  const N = matrix[0].length;

  let max = 0;

  // dp[i][j] 代表以坐标 [i, j] 为右下角的最大正方形的 边长
  // 外部添加一行一列 0 ，方便dp访问之前的元素
  let dp = new Array(M + 1).fill(0).map(() => new Array(N + 1).fill(0));

  // 跳过第一行第一列
  // 注意dp数组相对matrix数组的 1 位偏移
  for (let i = 1; i < M + 1; i++) {
    for (let j = 1; j < N + 1; j++) {
      if (matrix[i - 1][j - 1] === "0") {
        continue;
      }

      // 检查两条边上是不是都为 "1"
      // 检查左上角一格和它左右两格的状态
      dp[i][j] = Math.min(dp[i - 1][j - 1], dp[i][j - 1], dp[i - 1][j]) + 1;

      max = Math.max(max, dp[i][j]);
    }
  }

  // 注意平方求面积
  return max * max;
};

let matrix = [
  ["0", "0", "0", "1"], 
  ["1", "1", "0", "1"], 
  ["1", "1", "1", "1"], 
  ["0", "1", "1", "1"], 
  ["0", "1", "1", "1"]
];

console.log(maximalSquare(matrix));