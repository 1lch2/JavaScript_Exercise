/**
 * 两数之和
 * 
 * 因为对数组排序会打乱下标，不适用leetcode #1
 * 
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var twoSum_dualPointer = function(nums, target) {
  if (Math.min(...nums) > target) {
    return [];
  }

  // 升序排序
  nums.sort((a, b) => a - b);

  let left = 0;
  let right = nums.length - 1;
  let res = [];
  while (left < right) {
    let leftVal = nums[left];
    let rightVal = nums[right];
    let sum = nums[left] + nums[right];

    if (sum === target) {
      res.push([leftVal, rightVal]);
      // 跳过重复
      while (left < right && nums[left] === leftVal) {
        left++;
      }
      while (left < right && nums[right] === rightVal) {
        right--;
      }

    } else if (sum < target) {
      // 跳过重复
      while (left < right && nums[left] === leftVal) {
        left++;
      }
    } else {
      // 跳过重复
      while (left < right && nums[right] === rightVal) {
        right--;
      }
    }
  }

  return res;
};