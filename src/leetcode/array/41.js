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

/**
 * @param {number[]} nums
 * @return {number}
 */
var firstMissingPositive = function(nums) {
  const LEN = nums.length;

  // 对于一个长度为 N 的数组，其中没有出现的最小正整数只能在 [1, N+1] 中
  for(let i = 0; i < LEN; i++) {
    // 将所有小于 0 的数标记为 N+1 ，排除在寻找范围外
    if(nums[i] <= 0) {
      nums[i] = LEN + 1;
    }
  }
  // 将所有在 [1, N] 范围内的数指向的下标的数变为负数
  // 1 指向 第一个，也就是下标为 0 的数
  for(let i = 0; i < LEN; i++) {
    let absNum = Math.abs(nums[i]);
    if(absNum <= LEN) {
      nums[absNum - 1] = - Math.abs(nums[absNum - 1]);
    }
  }

  // 再次遍历，此时第一个不为 0 的数字的下标 + 1 即为所求的数
  // 暂时不能理解
  for(let i = 0; i < LEN; i++) {
    if(nums[i] > 0) {
      return i + 1;
    }
  }

  // 如果此时所有数都为负数，则说明数组内数字在 [1, N] 范围内，返回 N+1
  return LEN + 1;
};

(function(){
  console.log(firstMissingPositive([1,2,0]));
  console.log(firstMissingPositive([3,4,-1,1]));
  console.log(firstMissingPositive([7,8,9,11,12]));
})();