// 给定一个按照升序排列的整数数组 nums，和一个目标值 target。
// 找出给定目标值在数组中的开始位置和结束位置。

// 如果数组中不存在目标值 target，返回 [-1, -1]。

// 进阶：
// 你可以设计并实现时间复杂度为 O(log n) 的算法解决此问题吗？

// 示例 1：
// 输入：nums = [5,7,7,8,8,10], target = 8
// 输出：[3,4]

// 示例 2：
// 输入：nums = [5,7,7,8,8,10], target = 6
// 输出：[-1,-1]

// 示例 3：
// 输入：nums = [], target = 0
// 输出：[-1,-1]

// 提示：
// 0 <= nums.length <= 10^5
// -10^9 <= nums[i] <= 10^9
// nums 是一个非递减数组
// -10^9 <= target <= 10^9

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var searchRange = function(nums, target) {
  let res = [-1, -1];
  if(nums.length === 0) {
    return res;
  }

  let i = 0;
  let j = nums.length - 1;
  while(i <= j) {
    let mid = Math.floor((i + j) / 2);
    if(nums[mid] === target) {
      i = mid;
      j = mid;
      while(i - 1 >= 0 && nums[i - 1] === target) {
        i--;
      }
      while(j + 1 <= nums.length - 1 && nums[j + 1] === target) {
        j++;
      }

      return [i, j];
    } else if(nums[mid] < target) {
      i = mid + 1;
    } else {
      j = mid - 1;
    }
  }

  return res;
};