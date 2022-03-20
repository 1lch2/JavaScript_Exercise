// 给你一个整数数组 nums ，
// 请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），
// 并返回该子数组所对应的乘积。

// 测试用例的答案是一个 32-位 整数。

// 子数组 是数组的连续子序列。

// 示例 1:
// 输入: nums = [2,3,-2,4]
// 输出: 6
// 解释: 子数组 [2,3] 有最大乘积 6。

// 示例 2:
// 输入: nums = [-2,0,-1]
// 输出: 0
// 解释: 结果不能为 2, 因为 [-2,-1] 不是子数组。

// 提示:
// 1 <= nums.length <= 2 * 104
// -10 <= nums[i] <= 10
// nums 的任何前缀或后缀的乘积都 保证 是一个 32-位 整数

/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {
  if(nums.length <= 1) {
    return nums[0];
  }

  // 维护两个数组，一个记录以当前位置结尾的数组的最大积，另一个记录最小积，即可能为负数的序列
  let dpMax = [nums[0]];
  let dpMin = [nums[0]];
  let maxVal = nums[0];

  for(let i = 1; i < nums.length; i++) {
    // 由于负负得正，当前最大值除了考虑一般情况外，还需要考虑负数之积
    dpMax[i] = Math.max(dpMax[i - 1] * nums[i], nums[i], dpMin[i - 1] * nums[i]);
    dpMin[i] = Math.min(dpMin[i - 1] * nums[i], nums[i], dpMax[i - 1] * nums[i]);

    maxVal = Math.max(maxVal, dpMax[i]);
  }

  return maxVal;
};

(function(){
  console.log(maxProduct([2,3,-2,4]));
  console.log(maxProduct([-2,0,-1]));
  console.log(maxProduct([-2,3,-4]));
})();