// 峰值元素是指其值严格大于左右相邻值的元素。

// 给你一个整数数组 nums，找到峰值元素并返回其索引。
// 数组可能包含多个峰值，在这种情况下，返回 任何一个峰值 所在位置即可。

// 你可以假设 nums[-1] = nums[n] = -∞ 。

// 你必须实现时间复杂度为 O(log n) 的算法来解决此问题。

// 示例 1：
// 输入：nums = [1,2,3,1]
// 输出：2
// 解释：3 是峰值元素，你的函数应该返回其索引 2。

// 示例 2：
// 输入：nums = [1,2,1,3,5,6,4]
// 输出：1 或 5 
// 解释：你的函数可以返回索引 1，其峰值元素为 2；
//      或者返回索引 5， 其峰值元素为 6。

// 提示：
// 1 <= nums.length <= 1000
// -231 <= nums[i] <= 231 - 1
// 对于所有有效的 i 都有 nums[i] != nums[i + 1]

/**
 * @param {number[]} nums
 * @return {number}
 */
var findPeakElement = function(nums) {
  const LEN = nums.length;
  if(LEN === 1) {
    return 0;
  }

  /**
   * 下标必须符合 i1 <= i2
   * @param {Number} i1 第一个下标
   * @param {Number} i2 第二个下标
   * @returns {Boolean} 下标对应元素是否左大于右
   */
  const compare = (i1, i2) => {
    let n1 = i1 === -1 ? -Infinity : nums[i1];
    let n2 = i2 === LEN ? -Infinity : nums[i2];

    return n1 > n2;
  };

  let low = 0;
  let high = LEN - 1;
  while(low <= high) {
    let mid = (low + high) >> 1;

    // 满足条件，直接返回
    if(!compare(mid - 1, mid) && compare(mid, mid + 1)) {
      return mid;
    }

    // 向一侧偏移
    if(compare(mid - 1, mid)) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }
};

console.log(findPeakElement([1,2,1,3,5,6,4]));
console.log(findPeakElement([1,2,3,1]));
console.log(findPeakElement([2,1,3,4]));
console.log(findPeakElement([1]));
console.log(findPeakElement([1,2,3]));
