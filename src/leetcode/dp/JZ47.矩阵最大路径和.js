// 在一个 m*n 的棋盘的每一格都放有一个礼物，
// 每个礼物都有一定的价值（价值大于 0）。
// 你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、
// 直到到达棋盘的右下角。
// 给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

// 示例 1:
// 输入: 
// [
//   [1,3,1],
//   [1,5,1],
//   [4,2,1]
// ]
// 输出: 12
// 解释: 路径 1→3→5→2→1 可以拿到最多价值的礼物

// 提示：
// 0 < grid.length <= 200
// 0 < grid[0].length <= 200

/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxValue = function(grid) {
  const M = grid.length;
  const N = grid[0].length;

  // 原矩阵的左侧和上方各增加一行作为起始值
  // dp[i-1][j-1] 对应到达 [i, j]位置的最大值
  let dp = new Array(M + 1).fill(0).map(() => new Array(N + 1).fill(0));
  for (let i = 1; i <= M; i++) {
    for (let j = 1; j <= N; j++) {
      dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]) + grid[i - 1][j - 1];
    }
  }
  return dp[M][N];
};