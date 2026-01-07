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
 Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums: number[]): void {
  // 思路：输出所有不为 0 的元素，按顺序挨个排到前面，把剩下的元素全部填 0

  const nonZero =
    nums.length -
    nums.reduce((prev, curr) => {
      if (curr === 0) prev++;
      return prev;
    }, 0);

  for (let i = 0; i < nonZero; i++) {
    // 指向下一个不为 0 的元素的指针
    let p = i;
    while (nums[p] === 0) {
      p++;
    }

    if (p !== i) {
      nums[i] = nums[p];
      nums[p] = 0;
    }
  }
}
