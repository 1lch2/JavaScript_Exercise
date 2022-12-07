// JZ53-1

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
 * @return {number}
 */
var searchRange = function(nums, target) {
  let start = 0;
  let end = nums.length - 1;
  let res = [-1, -1];
  while (start <= end) {
    let mid = (start + end) >> 1;
    if (nums[mid] < target) {
      start = mid + 1;
      continue;
    }
    if (nums[mid] > target) {
      end = mid - 1;
      continue;
    }

    let i = mid;
    let j = mid;
    while (i >= 0 && nums[i] === target) {
      i--;
    }
    while (j <= nums.length - 1 && nums[j] === target) {
      j++;
    }
    res = [i + 1, j - 1]
    break;
  }
  return res;
};