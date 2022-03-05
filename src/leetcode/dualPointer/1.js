// 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出 和为目标值 target  的那 两个 整数，并返回它们的数组下标。

// 你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

// 你可以按任意顺序返回答案。

// 示例 1：
// 输入：nums = [2,7,11,15], target = 9
// 输出：[0,1]
// 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

// 示例 2：
// 输入：nums = [3,2,4], target = 6
// 输出：[1,2]

// 示例 3：
// 输入：nums = [3,3], target = 6
// 输出：[0,1]

// 提示：
// 2 <= nums.length <= 104
// -109 <= nums[i] <= 109
// -109 <= target <= 109
// 只会存在一个有效答案
// 进阶：你可以想出一个时间复杂度小于 O(n2) 的算法吗？

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    let residue = target - nums[i];
    let index = nums.indexOf(residue);
    if (index !== -1 && index !== i) {
      return [i, index];
    }
  }
};

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var twoSum_dualPointer = function(nums, target) {
  if(Math.min(...nums) > target) {
    return [];
  }

  // 升序排序
  nums.sort((a, b) => a - b);

  let left = 0;
  let right = nums.length - 1;
  let res = [];
  while(left < right) {
    let leftVal = nums[left];
    let rightVal = nums[right];
    let sum = nums[left] + nums[right];

    if(sum === target) {
      res.push([leftVal, rightVal]);
      // 跳过重复
      while(left < right && nums[left] === leftVal) {
        left++;
      }
      while(left < right && nums[right] === rightVal) {
        right--;
      }

    } else if (sum < target) {
      // 跳过重复
      while(left < right && nums[left] === leftVal) {
        left++;
      }
    } else {
      // 跳过重复
      while(left < right && nums[right] === rightVal) {
        right--;
      }
    }
  }

  return res;
};

(function(){
  console.log(twoSum_dualPointer([2,7,11,15], 9));
  console.log(twoSum_dualPointer([3,2,4], 6));
})();
