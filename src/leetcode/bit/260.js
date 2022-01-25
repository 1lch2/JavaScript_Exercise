// 给定一个整数数组 nums，其中恰好有两个元素只出现一次，其余所有元素均出现两次。 找出只出现一次的那两个元素。你可以按 任意顺序 返回答案。

// 进阶：你的算法应该具有线性时间复杂度。你能否仅使用常数空间复杂度来实现？

// 示例 1：
// 输入：nums = [1,2,1,3,2,5]
// 输出：[3,5]
// 解释：[5, 3] 也是有效的答案。

// 示例 2：
// 输入：nums = [-1,0]
// 输出：[-1,0]

// 示例 3：
// 输入：nums = [0,1]
// 输出：[1,0]

// 提示：
// 2 <= nums.length <= 3 * 104
// -2^31 <= nums[i] <= 2^31 - 1

// 除两个只出现一次的整数外，nums 中的其他数字都出现两次

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var singleNumber = function(nums) {
  let xorSum = nums.reduce((previous, current) => {
    return previous ^ current;
  }, 0);

  // 取最后一个1，代表两个数在那一位上值不同
  // 值相同则为0
  let mask = xorSum & (-xorSum);
  let res = [0, 0];
  for(let num of nums) {
    // 由于除了2个数字以外所有数字都出现了两次
    // 因此，每个数字与mask异或后只会剩下两个
    // 一个对应位为1，另一个为0
    if((num & mask) !== 0) {
      res[0] ^= num;
    } else {
      res[1] ^= num;
    }
  }
  return res;
};

(function(){
  let input = [1, 2, 1, 3, 2, 5];
  let res = singleNumber(input);
})();