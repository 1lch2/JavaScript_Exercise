// 给你一个整数数组 nums ，和一个表示限制的整数 limit，
// 请你返回最长连续子数组的长度，
// 该子数组中的任意两个元素之间的绝对差必须小于或者等于 limit 。

// 如果不存在满足条件的子数组，则返回 0 。

// 示例 1：
// 输入：nums = [8,2,4,7], limit = 4
// 输出：2 
// 解释：所有子数组如下：
// [8] 最大绝对差 |8-8| = 0 <= 4.
// [8,2] 最大绝对差 |8-2| = 6 > 4. 
// [8,2,4] 最大绝对差 |8-2| = 6 > 4.
// [8,2,4,7] 最大绝对差 |8-2| = 6 > 4.
// [2] 最大绝对差 |2-2| = 0 <= 4.
// [2,4] 最大绝对差 |2-4| = 2 <= 4.
// [2,4,7] 最大绝对差 |2-7| = 5 > 4.
// [4] 最大绝对差 |4-4| = 0 <= 4.
// [4,7] 最大绝对差 |4-7| = 3 <= 4.
// [7] 最大绝对差 |7-7| = 0 <= 4. 
// 因此，满足题意的最长子数组的长度为 2 。

// 示例 2：
// 输入：nums = [10,1,2,4,7,2], limit = 5
// 输出：4 
// 解释：满足题意的最长子数组是 [2,4,7,2]，其最大绝对差 |2-7| = 5 <= 5 。

// 示例 3：
// 输入：nums = [4,2,2,2,4,4,2,2], limit = 0
// 输出：3

// 提示：
// 1 <= nums.length <= 10^5
// 1 <= nums[i] <= 10^9
// 0 <= limit <= 10^9

/**
 * @param {number[]} nums
 * @param {number} limit
 * @return {number}
 */
var longestSubarray = function(nums, limit) {
  if(nums.length <= 1) {
    return nums.length;
  }

  let res = 0;

  // 维护窗口内的最大最小值
  let max = nums[0];
  let min = nums[0];

  // 窗口左边界
  let left = 0;
  for(let right = 0; right < nums.length; right++) {
    // 确定当前窗口的最大最小值
    max = Math.max(max, nums[right]);
    min = Math.min(min, nums[right]);

    // 若窗口不符合要求则将左边界收缩到右边界左侧
    if(max - min > limit) {
      // 重新从右边界开始拓展窗口
      max = nums[right];
      min = nums[right];
      left = right - 1;

      // 单位长度的窗口必定符合要求，因此判断新的长度为 2 的窗口是否符合要求
      // 不断向左移动左边界，定位到最左侧符合要求的边界
      while(Math.abs(nums[left] - nums[right]) <= limit) {
        max = Math.max(nums[left], max);
        min = Math.min(nums[left], min);
        left--;
      }
      // 收缩左边界，准备检查下一端右边界移动后的窗口
      left++;
    }
    // 取最长的窗口长度
    res = Math.max(right - left + 1, res);
  }

  return res;
};