// 给你一个整数数组 nums 和一个整数 x 。
// 每一次操作时，你应当移除数组 nums 最左边或最右边的元素，
// 然后从 x 中减去该元素的值。

// 请注意，需要 修改 数组以供接下来的操作使用。

// 如果可以将 x 恰好 减到 0 ，返回 最小操作数 ；否则，返回 -1 。

// 示例 1：
// 输入：nums = [1,1,4,2,3], x = 5
// 输出：2
// 解释：最佳解决方案是移除后两个元素，将 x 减到 0 。

// 示例 2：
// 输入：nums = [5,6,7,8,9], x = 4
// 输出：-1

// 示例 3：
// 输入：nums = [3,2,20,1,1,3], x = 10
// 输出：5
// 解释：最佳解决方案是移除后三个元素和前两个元素（总共 5 次操作），将 x 减到 0 。

// 提示：
// 1 <= nums.length <= 10^5
// 1 <= nums[i] <= 10^4
// 1 <= x <= 10^9

/**
 * @param {number[]} nums
 * @param {number} x
 * @return {number}
 */
var minOperations = function(nums, x) {
  if (Math.min(...nums) > x) {
    return -1;
  }

  // 把问题转化为找和等于 sum - x 的最长的子数组
  const TARGET = nums.reduce((prev, curr) => prev + curr, 0) - x;

  // i，j 实际上是右边界而不是每次取到的下标，长度不需要加一
  let i = 0;
  let j = 0;
  let currentSum = 0;
  let maxLength = -1;
  while (j < nums.length) {
    // 右移一位右边界
    currentSum += nums[j];
    j++;

    // 由于每次先移动右边界必定增大和，因此只需要判断当前和是否超过了目标和
    // 超过目标和左移左边界
    while (currentSum > TARGET && i <= j) {
      currentSum -= nums[i];
      i++;
    }

    // 更新最大长度
    if (currentSum === TARGET) {
      // 左边界可能会越过右边界
      maxLength = Math.max(maxLength, j - i);
    }
  }

  return maxLength === -1 ? maxLength : nums.length - maxLength;
};
