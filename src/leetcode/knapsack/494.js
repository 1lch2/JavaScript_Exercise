// 给你一个整数数组 nums 和一个整数 target 。

// 向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：

// 例如，nums = [2, 1] ，可以在 2 之前添加 '+' ，
// 在 1 之前添加 '-' ，然后串联起来得到表达式 "+2-1" 。
// 返回可以通过上述方法构造的、运算结果等于 target 的不同 表达式 的数目。

// 示例 1：
// 输入：nums = [1,1,1,1,1], target = 3
// 输出：5
// 解释：一共有 5 种方法让最终目标和为 3 。
// -1 + 1 + 1 + 1 + 1 = 3
// +1 - 1 + 1 + 1 + 1 = 3
// +1 + 1 - 1 + 1 + 1 = 3
// +1 + 1 + 1 - 1 + 1 = 3
// +1 + 1 + 1 + 1 - 1 = 3

// 示例 2：
// 输入：nums = [1], target = 1
// 输出：1

// 提示：
// 1 <= nums.length <= 20
// 0 <= nums[i] <= 1000
// 0 <= sum(nums[i]) <= 1000
// -1000 <= target <= 1000

/**
 * @copyright https://github.com/CyC2018/CS-Notes/blob/master/notes/
 * Leetcode%20%E9%A2%98%E8%A7%A3%20-%20%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92.md#0-1-%E8%83%8C%E5%8C%85
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function(nums, target) {
  // 可以将这组数看成两部分，P 和 N，其中 P 使用正号，N 使用负号，有以下推导：
  //                   sum(P) - sum(N) = target
  // sum(P) + sum(N) + sum(P) - sum(N) = target + sum(P) + sum(N)
  //                        2 * sum(P) = target + sum(nums)
  // 因此只要找到一个子集，令它们都取正号，并且和等于 (target + sum(nums)) / 2，就证明存在解。

  Array.prototype.sum = function() {
    return this.reduce((prev, curr) => prev + curr, 0);
  };

  const SUM = nums.sum();
  // 数字之和小于目标，或 sum(P) 目标数不是偶数时无解
  if(SUM < target || (SUM + target) % 2 === 1) {
    return 0;
  }

  // 0-1背包问题的目标重量
  const W = (SUM + target) / 2;

  // dp[i] : 当目标重量为 i 时的选择数量
  // 初始化为 1 ，即当目标重量为 0 时，不选择就是一种方案
  let dp = [1];

  // 外层循环待选物品
  for(let num of nums) {
    // 内层循环倒序
    for(let i = W; i >= num; i--) {
      dp[i] = dp[i] + dp[i - num];
    }
  }

  // TODO:

  return dp[W];
};