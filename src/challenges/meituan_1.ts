// 小美拿到了一个 n∗n 的矩阵，其中每个元素是 0 或者 1。
// 小美认为一个矩形区域是完美的，当且仅当该区域内 0 的数量恰好等于 1 的数量。
// 现在，小美希望你回答有多少个 i∗i 的完美矩形区域。你需要回答 1≤ i ≤ n 的所有答案。

// 示例1
// 输入例子：
// 4,
// [[1,0,1,0],
// [0,1,0,1],
// [1,1,0,0],
// [0,0,1,1]]
// 输出例子：
// 0
// 7
// 0
// 1

function perfectMatirx(n: number, matrix: number[][]) {
  const result = Array(n).fill(0);

  let preSum = Array(n + 1)
    .fill(0)
    .map((_) => Array(n + 1).fill(0));

  // 构造二维前缀和
  for (let row = 1; row <= n; row++) {
    for (let col = 1; col <= n; col++) {
      // 把 0 元素转换为 -1，方便后面判断是否指定区域前缀和为0，直接得出结论，不需要再计算对比 dim^2 /2
      let currPosition = matrix[row - 1][col - 1] === 1 ? 1 : -1;
      // 左上角坐标为 [row, col]，加上左侧和上方的前缀和之后，左上方 [row - 1][col - 1] 的和被多加了一次，因此减掉
      preSum[row][col] =
        preSum[row][col - 1] +
        preSum[row - 1][col] +
        currPosition -
        preSum[row - 1][col - 1];
    }
  }

  for (let dim = 1; dim <= n; dim++) {
    for (let startRow = 1; startRow + dim - 1 <= n; startRow++) {
      for (let startCol = 1; startCol + dim - 1 <= n; startCol++) {
        // 类似前缀和计算，减去左侧和上方的前缀和，左上方的被多减了一次，因此加回来
        let sum =
          preSum[startRow + dim - 1][startCol + dim - 1] -
          preSum[startRow - 1][startCol + dim - 1] -
          preSum[startRow + dim - 1][startCol - 1] +
          preSum[startRow - 1][startCol - 1];

        if (sum === 0) {
          result[dim - 1]++;
        }
      }
    }
  }

  return result;
}

console.log(
  perfectMatirx(4, [
    [1, 0, 1, 0],
    [0, 1, 0, 1],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
  ]),
);

console.log(
  perfectMatirx(5, [
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 1],
    [1, 1, 0, 0, 1],
    [0, 0, 1, 1, 1],
    [0, 0, 1, 1, 1],
  ]),
);
