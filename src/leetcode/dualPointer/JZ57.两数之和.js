// 输入一个递增排序的数组和一个数字s，在数组中查找两个数，使得它们的和正好是s。
// 如果有多对数字的和等于s，则输出任意一对即可。

// 示例 1：
// 输入：nums = [2,7,11,15], target = 9
// 输出：[2,7] 或者 [7,2]

// 示例 2：
// 输入：nums = [10,26,30,31,47,60], target = 40
// 输出：[10,30] 或者 [30,10]

// 限制：
// 1 <= nums.length <= 10^5
// 1 <= nums[i] <= 10^6

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  let i = 0;
  let j = nums.length - 1;
  let res = [];

  // 双指针，一端从最小，一端从最大开始向中间遍历
  // 依据两数和与目标值的相对大小调整对应的指针
  while (i < nums.length && j < nums.length) {
    let sum = nums[i] + nums[j];
    if (sum === target) {
      res = [nums[i], nums[j]];
      break;
    }

    while (j > i && sum > target) {
      j--;
      sum = nums[i] + nums[j];
    }
    while (i < j && sum < target) {
      i++;
      sum = nums[i] + nums[j];
    }
  }
  return res;
};