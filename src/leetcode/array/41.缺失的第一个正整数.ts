// 给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

// 请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。

// 示例 1：
// 输入：nums = [1,2,0]
// 输出：3

// 示例 2：
// 输入：nums = [3,4,-1,1]
// 输出：2

// 示例 3：
// 输入：nums = [7,8,9,11,12]
// 输出：1

// 提示：
// 1 <= nums.length <= 5 * 105
// -231 <= nums[i] <= 231 - 1

function firstMissingPositive(nums: number[]): number {
  // 结果的范围在 [1, N+1]，和数组长度一致
  // 原数组排列成 [1, 2, ..., N+1] 的形式，缺失的数字就是结果
  const n = nums.length;

  for (let i = 0; i < n; i++) {
    // 若对应下标 i 的元素值不是 i+1，则和元素值对应下标的元素交换位置
    // 不处理负数
    // 注意检查元素值是否超过数组长度
    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      // 注意不要直接使用ES6交换语法，因为nums更新以后，nums[i] - 1的值也会变
      let temp = nums[nums[i] - 1];
      nums[nums[i] - 1] = nums[i];
      nums[i] = temp;
    }
  }

  // 找到第一个不对应的元素
  for (let i = 0; i < n; i++) {
    if (nums[i] !== i + 1) {
      return i + 1;
    }
  }
  // 如果全部对应则答案是 N+1
  return n + 1;
}

(function () {
  console.log(firstMissingPositive([3, 4, -1, 1]));
  console.log(firstMissingPositive([1, 2, 0]));
  console.log(firstMissingPositive([7, 8, 9, 11, 12]));
})();
