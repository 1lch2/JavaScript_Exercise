// 给你一个 只包含正整数 的 非空 数组 nums 。
// 请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

// 示例 1：
// 输入：nums = [1,5,11,5]
// 输出：true
// 解释：数组可以分割成 [1, 5, 5] 和 [11] 。

// 示例 2：
// 输入：nums = [1,2,3,5]
// 输出：false
// 解释：数组不能分割成两个元素和相等的子集。

// 提示：
// 1 <= nums.length <= 200
// 1 <= nums[i] <= 100

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
  // 可以视作背包大小为 sum / 2 的 0-1背包问题
  const SUM = nums.reduce((prev, curr) => prev + curr, 0);

  if(SUM % 2 !== 0) {
    return false;
  }

  if(Math.max(...nums) > (SUM / 2)) {
    return false;
  }

  // 背包重量
  const W = SUM >> 1;
  // dp[i][j] 代表选择前 i 个物品，重量为 j 时是否可以分割
  let dp = new Array(nums.length + 1).fill(false).map(() => new Array(W + 1).fill(false));
  for(let i = 0; i < nums.length + 1; i++) {
    dp[i][0] = true;
  }

  for(let i = 1; i <= nums.length; i++) {
    for(let j = 0; j <= W; j++) {
      if(nums[i - 1] > j) {
        dp[i][j] = dp[i - 1][j];
      } else {
        // 选或者不选，只要有一种成立即可
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - nums[i - 1]];
      }
    }
  }
  
  return dp[nums.length][W];
};

console.log(canPartition([1, 5, 11, 5]));