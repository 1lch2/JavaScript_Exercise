// 给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。

// 你可以假设数组是非空的，并且给定的数组总是存在多数元素。

// 示例 1：
// 输入：[3,2,3]
// 输出：3

// 示例 2：
// 输入：[2,2,1,1,1,2,2]
// 输出：2

// 进阶：
// 尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法解决此问题。

/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  /**
   * 统计区间内目标元素的数量
   * 
   * @param {Number[]} nums 数组
   * @param {Number} low 起始下标
   * @param {Number} high 结束下标
   * @param {Number} target 待统计数量的元素
   * @returns 区间内目标元素的数量
   */
  const count = (nums, low, high, target) => {
    let count = 0;
    for (let i = low; i <= high; i++) {
      if(nums[i] === target) {
        count++;
      }
    }
    return count;
  };

  /**
   * 分治获取区间内数量最多的元素
   * 
   * @param {Number[]} nums 输入数组
   * @param {Number} low 起始下标
   * @param {Number} high 结束下标
   * @returns 划分的区间内数量最多的元素
   */
  const divide = (nums, low, high) => {
    // 区间大小为1时直接返回当前元素
    if(low === high) {
      return nums[low];
    }

    let mid = Math.floor((high + low) / 2);

    let left = divide(nums, low, mid);
    let right = divide(nums, mid + 1, high);

    if(left === right) {
      return left;
    }

    let leftCount = count(nums, low, high, left);
    let rightCount = count(nums, low, high, right);

    return leftCount > rightCount ? left : right;
  };

  return divide(nums, 0, nums.length - 1);
};