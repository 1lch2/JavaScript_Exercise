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
 * 
 * 回溯法，每次选择添加当前元素的正数或负数
 * 
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function(nums, target) {
  let result = 0;

  /**
   * 
   * @param {number} currentSum 
   * @param {number[]} available 
   * @returns 
   */
  const backtrack = (currentSum, index) => {
    if (index === nums.length) {
      if (currentSum === target) {
        result++;
      }
      return;
    }

    // 使用起始下标和当前累积，而不存储所有选择的数字，减少内存消耗
    // + - 分支代替手写循环
    backtrack(currentSum + nums[index], index + 1);
    backtrack(currentSum - nums[index], index + 1);
  };

  backtrack(0, 0);
  return result;
};


/**
 * @copyright https://github.com/CyC2018/CS-Notes/blob/master/notes/
 * Leetcode%20%E9%A2%98%E8%A7%A3%20-%20%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92.md#0-1-%E8%83%8C%E5%8C%85
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var _findTargetSumWays = function(nums, target) {
  // 可以将这组数看成两部分，P 和 N，其中 P 使用正号，N 使用负号，有以下推导：
  //                   sum(P) - sum(N) = target
  // sum(P) + sum(N) + sum(P) - sum(N) = target + sum(P) + sum(N)
  //                        2 * sum(P) = target + sum(nums)
  // 因此只要找到一个子集，令它们都取正号，并且和等于 (target + sum(nums)) / 2，就证明存在解。

  Array.prototype.sum = function() {
    return this.reduce((prev, curr) => prev + curr, 0);
  };

  const SUM = nums.sum();
  // 数字之和小于目标绝对值，或 sum(P) 目标数不是偶数时无解
  if (SUM < Math.abs(target) || (SUM + target) % 2 === 1) {
    return 0;
  }

  // 0-1背包问题的目标重量
  const W = (SUM + target) / 2;

  // dp[i][j] : 已经考虑前 i 个物品，重量为 j 时的最大选择数
  // 重量需要取到 W
  let dp = new Array(nums.length + 1).fill(0).map(() => new Array(W + 1).fill(0));
  // 初始状态，由于可能存在 0 元素，不应该对所有物品项的 0 重量都初始化为只有 1 个选项
  dp[0][0] = 1;

  // 先遍历物品，再遍历背包重量
  for (let i = 1; i <= nums.length; i++) {
    for (let j = 0; j <= W; j++) {
      // nums[i-1] 代表第 i 个物品
      // 若当前物品不可选，则选项数和同重量时的前一物品相同
      if (nums[i - 1] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        // 若可选，则将选择第 i 个物品和不选的选择数相加
        // 这里本质是 max(dp[i-1][j], dp[i-1][j] + dp[i-1][j-nums[i-1]])
        // 由于后一项必定大于前一项，所以结果简化为下方写法
        dp[i][j] = dp[i - 1][j - nums[i - 1]] + dp[i - 1][j];
      }
    }
  }

  return dp[nums.length][W];
};

console.log(findTargetSumWays([1, 1, 1, 1, 1], 3));