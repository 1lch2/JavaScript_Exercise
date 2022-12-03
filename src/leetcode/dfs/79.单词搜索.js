// JZ12

// 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。
// 如果 word 存在于网格中，返回 true ；
// 否则，返回 false 。

// 单词必须按照字母顺序，通过相邻的单元格内的字母构成，
// 其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。

// 示例 1：
// 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"
// 输出：true

// 示例 2：
// 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"
// 输出：true

// 示例 3：
// 输入：board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"
// 输出：false

// 提示：
// m == board.length
// n = board[i].length
// 1 <= m, n <= 6
// 1 <= word.length <= 15
// board 和 word 仅由大小写英文字母组成

// 进阶：你可以使用搜索剪枝的技术来优化解决方案，使其在 board 更大的情况下可以更快解决问题？

/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
  const M = board.length;
  const N = board[0].length;

  // 标记每个格子是否在一次DFS中被访问过
  let visited = new Array(M).fill(0).map(() => new Array(N).fill(false));

  const search = (x, y, index) => {
    if (x < 0 || y < 0 || x >= M || y >= N) {
      return false;
    }
    if (visited[x][y]) {
      return false;
    }
    if (board[x][y] !== word[index]) {
      return false;
    }
    // 找到了所有字符
    if (index === word.length - 1) {
      return true;
    }

    visited[x][y] = true;
    let res = search(x + 1, y, index + 1) ||
      search(x - 1, y, index + 1) ||
      search(x, y + 1, index + 1) ||
      search(x, y - 1, index + 1);

    // 遍历结束后改回标记
    visited[x][y] = false;
    return res;
  };

  let flag = false;
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      if (board[i][j] === word[0]) {
        flag = search(i, j, 0);
      }

      // 找到了就提前返回结果
      if (flag) {
        return true;
      }
    }
  }
  return flag;
};
