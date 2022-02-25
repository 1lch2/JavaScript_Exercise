// 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

// 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish”）。

// 现在考虑网格中有障碍物。那么从左上角到右下角将会有多少条不同的路径？

// 网格中的障碍物和空位置分别用 1 和 0 来表示。

// 示例 1：
// 输入：obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
// 输出：2

// 解释：3x3 网格的正中间有一个障碍物。
// 从左上角到右下角一共有 2 条不同的路径：
// 1. 向右 -> 向右 -> 向下 -> 向下
// 2. 向下 -> 向下 -> 向右 -> 向右

// 示例 2：
// 输入：obstacleGrid = [[0,1],[0,0]]
// 输出：1

// 提示：
// m == obstacleGrid.length
// n == obstacleGrid[i].length
// 1 <= m, n <= 100
// obstacleGrid[i][j] 为 0 或 1

/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
  const M = obstacleGrid.length;
  const N = obstacleGrid[0].length;

  // dp[i][j] 代表到达i，j的路径数量
  let dpState = new Array(M).fill(0).map(() => new Array(N).fill(0));
  
  // 顶部一行的初始值
  for(let obsX = 0; obsX < N; obsX++) {
    if(obstacleGrid[0][obsX] === 0) {
      dpState[0][obsX] = 1;
    } else {
      break;
    }
  }

  // 最左边一列的初始值
  for(let obsY = 0; obsY < M; obsY++) {
    if(obstacleGrid[obsY][0] === 0) {
      dpState[obsY][0] = 1;
    } else {
      break;
    }
  }

  // 状态方程
  // dp[i][j] = dp[i-1][j] + dp[i][j-1], obs[i][j] != 0
  // dp[i][j] = 0 , obs[i][j] = 0

  for(let i = 1; i < M; i++) {
    for(let j = 1; j < N; j++) {
      // 仅当当前格子没有障碍时才可到达
      if(obstacleGrid[i][j] === 0) {
        dpState[i][j] = dpState[i - 1][j] + dpState[i][j - 1];
      }
    }
  }

  return dpState[M - 1][N - 1];
};

(function(){
  console.log(uniquePathsWithObstacles([[0,0,0],[0,1,0],[0,0,0]]));
  console.log(uniquePathsWithObstacles([[0,1],[0,0]]));
  console.log(uniquePathsWithObstacles([[0,0]]));
})();