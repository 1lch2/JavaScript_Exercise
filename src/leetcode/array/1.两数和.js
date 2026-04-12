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
var twoSum = function (nums, target) {
  for (let i = 0; i < nums.length; i++) {
    let residue = target - nums[i];
    let index = nums.indexOf(residue);
    if (index !== -1 && index !== i) {
      return [i, index];
    }
  }
};

/**
 * 使用Map一边检查是否存在，一边更新
 *
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSumMap(nums, target) {
  const map = {};
  let result = [];
  for (let i = 0; i < nums.length; i++) {
    const targetIndex = map[target - nums[i]];
    // index 可能为0，手动转换为boolean
    if (targetIndex !== undefined) {
      result = [i, targetIndex];
      break;
    }
    map[nums[i]] = i;
  }
  return result;
}

(function () {
  console.log(twoSumMap([2, 7, 11, 15], 9));
  console.log(twoSumMap([3, 2, 4], 6));
})();
