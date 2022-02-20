// 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

// 子数组 是数组中的一个连续部分。

// 示例 1：
// 输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
// 输出：6
// 解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。

// 示例 2：
// 输入：nums = [1]
// 输出：1

// 示例 3：
// 输入：nums = [5,4,-1,7,8]
// 输出：23

// 提示：
// 1 <= nums.length <= 105
// -104 <= nums[i] <= 104

// 进阶：如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的 分治法 求解。

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
  const LENGTH = nums.length;

  // 代表在下标 i 结束的子序列的最大和
  // 必须包含第 i 个元素
  let dpState = [nums[0]];
  let maxVal = nums[0];
  for(let i = 1; i < LENGTH; i++) {
    // dp[i] = max{dp[i-1] + num[i], num[i]}
    dpState[i] = Math.max(dpState[i - 1] + nums[i], nums[i]);
    maxVal = dpState[i] > maxVal ? dpState[i] : maxVal;
  }
  return maxVal;
};

/**
 * * 错解
 * 二维数组存储dp状态导致内存溢出
 * 
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray_OOM = function(nums) {
  const LENGTH = nums.length;
  // dpState[i][j]代表从 i 到 j 的序列之和
  let dpState = [];
  for (let i = 0; i < LENGTH; i++) {
    dpState[i] = new Array(LENGTH).fill(undefined);
  }

  // 初始状态
  for (let i = 0; i < LENGTH; i++) {
    dpState[i][i] = nums[i];
  }

  let maxVal = dpState[0][0];

  for (let j = 1; j < LENGTH; j++) {
    for (let i = 0; i <= j; i++) {
      // 对角线上值不计算
      if (i !== j) {
        // 状态转移方程
        dpState[i][j] = dpState[i][j - 1] + nums[j];
      }
      if (dpState[i][j] > maxVal) {
        maxVal = dpState[i][j];
      }
    }
  }
  return maxVal;
};

(function() {
  console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));
  console.log(maxSubArray([5, 4, -1, 7, 8]));
})();