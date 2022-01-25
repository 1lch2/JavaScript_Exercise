/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
// 一个长度为n-1的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围0～n-1之内。
// 在范围0～n-1内的n个数字中有且只有一个数字不在该数组中，请找出这个数字。

// 示例 1:
// 输入: [0,1,3]
// 输出: 2

// 示例 2:
// 输入: [0,1,2,3,4,5,6,7,9]
// 输出: 8

// 限制：
// 1 <= 数组长度 <= 10000

/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {
  let i = 0;
  let j = nums.length - 1;

  // 二分法查找
  while(i <= j) {
    let mid = Math.floor((i + j) / 2);
    // 中位的值与下标对应则在右侧寻找
    if(nums[mid] == mid) {
      i = mid + 1;
    } else {
      j = mid - 1;
    }
  }

  // 当两下标相遇时即得到结果
  return i;
};