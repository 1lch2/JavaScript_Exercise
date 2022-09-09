// 在给定的 m x n 网格 grid 中，每个单元格可以有以下三个值之一：

// 值 0 代表空单元格；
// 值 1 代表新鲜橘子；
// 值 2 代表腐烂的橘子。
// 每分钟，腐烂的橘子 周围 4 个方向上相邻 的新鲜橘子都会腐烂。

// 返回 直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 -1 。

// 示例 1：
// 输入：grid = [
//   [2,1,1],
//   [1,1,0],
//   [0,1,1]
// ]
// 输出：4

// 示例 2：
// 输入：grid = [
//   [2,1,1],
//   [0,1,1],
//   [1,0,1]
// ]
// 输出：-1
// 解释：左下角的橘子（第 2 行， 第 0 列）永远不会腐烂，因为腐烂只会发生在 4 个正向上。

// 示例 3：
// 输入：grid = [[0,2]]
// 输出：0
// 解释：因为 0 分钟时已经没有新鲜橘子了，所以答案就是 0 。

// 提示：
// m == grid.length
// n == grid[i].length
// 1 <= m, n <= 10
// grid[i][j] 仅为 0、1 或 2

/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function(grid) {
  const M = grid.length;
  const N = grid[0].length;

  // 对于所有初始为 2 的节点，在BFS中等同于同一个起点
  // 先构造包含所有起点的坐标列表
  let rotList = [];
  for(let i = 0; i < M; i++) {
    for(let j = 0; j < N; j++) {
      if(grid[i][j] === 2) {
        rotList.push([i, j]);
      }
    }
  }

  let time = 0;
  // 坐标的四个方向偏移
  const DEVIATION = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  while(rotList.length !== 0) {
    // 每次遍历检查是否有新的一层节点，并继续下一次遍历
    let newRotList = [];
    for(let position of rotList) {
      let x0 = position[0];
      let y0 = position[1];
      
      // 四个方向遍历
      for(let direction of DEVIATION) {
        let x = x0 + direction[0];
        let y = y0 + direction[1];
        if(x < 0 || y < 0 || x > M - 1 || y > N - 1) {
          continue;
        }
        if(grid[x][y] === 1) {
          grid[x][y] = 2;
          newRotList.push([x, y]);
        }
      }
    }

    // 已经遍历结束
    if(newRotList.length === 0) {
      break;
    }

    rotList = newRotList;
    time++;
  }

  // 再次遍历检查是否有元素 1
  for(let i = 0; i < M; i++) {
    for(let j = 0; j < N; j++) {
      if(grid[i][j] === 1) {
        return -1;
      }
    }
  }
  return time;
};

let grid = [
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1]
];

console.log(orangesRotting(grid));