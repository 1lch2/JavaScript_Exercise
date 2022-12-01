// 给定一个非负整数数组 nums ，你最初位于数组的 第一个下标 。

// 数组中的每个元素代表你在该位置可以跳跃的最大长度。

// 判断你是否能够到达最后一个下标。

// 示例 1：
// 输入：nums = [2,3,1,1,4]
// 输出：true
// 解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。

// 示例 2：
// 输入：nums = [3,2,1,0,4]
// 输出：false
// 解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。

// 提示：
// 1 <= nums.length <= 3 * 104
// 0 <= nums[i] <= 105

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
  if(nums.length === 1) {
    return true;
  }

  // 从下标为 i 的位置出发能到达的最远位置
  // 不需要存储每个位置的最远位置，只需要记住当前最远就行
  let dpState = [nums[0]];
  // 当前能到达的最远位置
  let maxIndex = nums[0];
  // 不需要遍历到最后一位
  for(let i = 1; i < nums.length - 1; i++) {
    // 仅当能到达位置 i 时才计算
    if(i <= maxIndex) {
      dpState[i] = i + nums[i];
    }
    maxIndex = dpState[i] > maxIndex ? dpState[i] : maxIndex;
    if(dpState[i] >= nums.length - 1) {
      return true;
    }
  }
  return maxIndex >= nums.length - 1;
};

(function(){
  console.log(canJump([2,3,1,1,4]));
  console.log(canJump([3,2,1,0,4]));
  console.log(canJump([3,2,1,0,1,4]));
  console.log(canJump([3,2,1,2,0,1,4]));
})();