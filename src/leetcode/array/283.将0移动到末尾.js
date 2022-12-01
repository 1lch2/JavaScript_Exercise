// 给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，
// 同时保持非零元素的相对顺序。

// 请注意 ，必须在不复制数组的情况下原地对数组进行操作。

// 示例 1:
// 输入: nums = [0,1,0,3,12]
// 输出: [1,3,12,0,0]

// 示例 2:
// 输入: nums = [0]
// 输出: [0]

// 提示:
// 1 <= nums.length <= 104
// -2^31 <= nums[i] <= 2^31 - 1

// 进阶：你能尽量减少完成的操作次数吗？

/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var moveZeroes = function(nums) {
  let nonZeroCount = 0;
  for (let num of nums) {
    if (num !== 0) {
      nonZeroCount++;
    }
  }

  // 全 0 或 全非 0 不操作
  if (nonZeroCount === 0 || nonZeroCount === nums.length) {
    return;
  }

  // 数出所有非零元素个数
  // 把非零元素按序覆盖到前方
  for (let i = 0; i < nonZeroCount; i++) {
    let index = i;
    while (nums[index] === 0) {
      index++;
    }

    // 仅在需要的时候赋值
    if (i !== index) {
      nums[i] = nums[index];
      // 原位置赋 0 防止影响下一步判断
      nums[index] = 0;
    }
  }
};

let input = [0, 2, 3, 0, 0];
console.log(moveZeroes(input));