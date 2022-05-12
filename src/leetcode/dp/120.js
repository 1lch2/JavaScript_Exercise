// 给定一个三角形 triangle ，找出自顶向下的最小路径和。

// 每一步只能移动到下一行中相邻的结点上。
// 相邻的结点 在这里指的是 下标 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。
// 也就是说，如果正位于当前行的下标 i ，
// 那么下一步可以移动到下一行的下标 i 或 i + 1 。

// 示例 1：
// 输入：triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
// 输出：11
// 解释：如下面简图所示：
//    2
//   3 4
//  6 5 7
// 4 1 8 3
// 自顶向下的最小路径和为 11（即，2 + 3 + 5 + 1 = 11）。

// 示例 2：
// 输入：triangle = [[-10]]
// 输出：-10

// 提示：
// 1 <= triangle.length <= 200
// triangle[0].length == 1
// triangle[i].length == triangle[i - 1].length + 1
// -10^4 <= triangle[i][j] <= 10^4

// 进阶：
// 你可以只使用 O(n) 的额外空间（n 为三角形的总行数）来解决这个问题吗？

/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
  if(triangle.length === 1) {
    return triangle[0][0];
  }

  // dp[i][j] 代表 移动到第 i 行的第 j 个元素时的最小路径之和
  // 将三角形靠左对齐后如下，dp[i][j] 只取决于 dp[i-1][j] 和 dp[i-1][j-1]
  // 2
  // 3 4
  // 6 5 7
  // 4 1 8 3
  let dp = new Array(triangle.length).fill(0).map(() => new Array());
  // 初始情况，取第一个元素
  dp[0][0] = triangle[0][0];
  for(let i = 1; i < triangle.length; i++) {
    for(let j = 0; j < triangle[i].length; j++) {
      if(j === 0) {
        // 第一个元素只能从正上方到达
        dp[i][j] = dp[i - 1][j] + triangle[i][j];
      } else if(j === triangle[i].length - 1){
        // 末尾元素只能从左上方到达
        dp[i][j] = dp[i - 1][j - 1] + triangle[i][j];
      } else {
        dp[i][j] = Math.min(dp[i-1][j], dp[i-1][j-1]) + triangle[i][j];
      }
    }
  }

  return Math.min(...dp[triangle.length - 1]);
};