// 给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。

// 说明：每次只能向下或者向右移动一步。

// 示例 1：
// 输入：grid = [
//   [1,3,1],
//   [1,5,1],
//   [4,2,1]
// ]
// 输出：7
// 解释：因为路径 1→3→1→1→1 的总和最小。

// 示例 2：
// 输入：grid = [
//   [1,2,3],
//   [4,5,6]
// ]
// 输出：12

// 提示：
// m == grid.length
// n == grid[i].length
// 1 <= m, n <= 200
// 0 <= grid[i][j] <= 100

/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
  const M = grid.length;
  const N = grid[0].length;

  // dp[i][j] 代表到达 i, j 处的最小路径总和
  let dp = new Array(M).fill(0).map(() => new Array(N).fill(0));

  // 初始状态
  dp[0][0] = grid[0][0];
  for (let i = 1; i < M; i++) {
    dp[i][0] = dp[i - 1][0] + grid[i][0];
  }
  for (let i = 1; i < N; i++) {
    dp[0][i] = dp[0][i - 1] + grid[0][i];
  }

  // 注意不能用JZ47的解法，因为JZ47是求最大值，路径走得少必然值小
  // 而这里必须初始化第一行和第一列，否则会出现不从左上角出发的情况
  for (let i = 1; i < M; i++) {
    for (let j = 1; j < N; j++) {
      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
    }
  }

  return dp[M - 1][N - 1];
};

/**
 * 不初始化而是给dp矩阵多加一行一列的解法
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum_ = function(grid) {
  const M = grid.length;
  const N = grid[0].length;

  let dp = new Array(M + 1).fill(0).map(() => new Array(N + 1).fill(0));
  for (let i = 1; i <= M; i++) {
    for (let j = 1; j <= N; j++) {
      // 注意第一行和第一列的特殊情况
      if (i === 1) {
        dp[i][j] = dp[i][j - 1] + grid[i - 1][j - 1];
        continue;
      }
      if (j === 1) {
        dp[i][j] = dp[i - 1][j] + grid[i - 1][j - 1];
        continue;
      }

      dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i - 1][j - 1];
    }
  }

  return dp[M][N];
};
