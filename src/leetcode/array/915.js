// 给定一个数组 nums ，将其划分为两个连续子数组 left 和 right， 使得：

// left 中的每个元素都小于或等于 right 中的每个元素。
// left 和 right 都是非空的。
// left 的长度要尽可能小。
// 在完成这样的分组后返回 left 的 长度 。

// 用例可以保证存在这样的划分方法。

// 示例 1：
// 输入：nums = [5,0,3,8,6]
// 输出：3
// 解释：left = [5,0,3]，right = [8,6]

// 示例 2：
// 输入：nums = [1,1,1,0,6,12]
// 输出：4
// 解释：left = [1,1,1,0]，right = [6,12]

// 提示：
// 2 <= nums.length <= 10^5
// 0 <= nums[i] <= 106
// 可以保证至少有一种方法能够按题目所描述的那样对 nums 进行划分。

/**
 * @param {number[]} nums
 * @return {number}
 */
var partitionDisjoint = function(nums) {
  // 左区间的最大值
  let leftMax = nums[0];
  // 分割点
  let position = 0;
  // nums 的[0, i]区间的的最大值
  let currentMax = nums[0];

  for (let i = 1; i < nums.length - 1; i++) {
    currentMax = nums[i] > currentMax ? nums[i] : currentMax;
    // 右侧存在比左侧最大值小的数字，即当前划分不满足 leftMax <= rightMin
    if (nums[i] < leftMax) {
      leftMax = currentMax;
      position = i;
    }
  }

  return position + 1;
};
