// 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

// 请必须使用时间复杂度为 O(log n) 的算法。

// 示例 1:
// 输入: nums = [1,3,5,6], target = 5
// 输出: 2

// 示例 2:
// 输入: nums = [1,3,5,6], target = 2
// 输出: 1

// 示例 3:
// 输入: nums = [1,3,5,6], target = 7
// 输出: 4

// 示例 4:
// 输入: nums = [1,3,5,6], target = 0
// 输出: 0

// 示例 5:
// 输入: nums = [1], target = 0
// 输出: 0

// 提示:
// 1 <= nums.length <= 104
// -104 <= nums[i] <= 104
// nums 为无重复元素的升序排列数组
// -104 <= target <= 104

function searchInsert(nums: number[], target: number): number {
  let low = 0;
  let high = nums.length - 1;
  let mid = 0;
  while (low <= high) {
    mid = (low + high) >> 1;
    if (nums[mid] < target) {
      // 不能使用 mid ，否则 low high 在找不到元素时候不会错开位置结束循环
      low = mid + 1;
    } else if (nums[mid] > target) {
      high = mid - 1;
    } else if (nums[mid] === target) {
      return mid;
    }
  }

  // 插入位置应该在比 target 小的元素的位置
  return nums[mid] > target ? mid : mid + 1;
}

(function () {
  let a = searchInsert([1, 3, 5, 6], 7);
  console.log(a);
})();
