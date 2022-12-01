// 给你一个整数数组 nums ，除某个元素仅出现 一次 外，其余每个元素都恰出现 三次 。请你找出并返回那个只出现了一次的元素。

// 示例 1：
// 输入：nums = [2,2,3,2]
// 输出：3

// 示例 2：
// 输入：nums = [0,1,0,1,0,1,99]
// 输出：99

// 提示：
// 1 <= nums.length <= 3 * 104
// -231 <= nums[i] <= 231 - 1
// nums 中，除某个元素仅出现 一次 外，其余每个元素都恰出现 三次

// 进阶：你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {
  let answer = 0;

  for (let i = 0; i < 32; i++) {
    let totalBit = 0;
    for(let num of nums) {
      totalBit += (num >> i) & 1; // 右移取到对应位，并累加
    }
    // 模3的余数不为0，则该位为结果对应位上的1
    if(totalBit % 3 !== 0) {
      answer |= (1 << i); // 填入对应位的比特
    }
  }
  return answer;
};