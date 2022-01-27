// 输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数在数组的前半部分，所有偶数在数组的后半部分。

// 示例：
// 输入：nums = [1,2,3,4]
// 输出：[1,3,2,4] 

// 注：[3,1,2,4] 也是正确的答案之一。

// 提示：
// 0 <= nums.length <= 50000
// 0 <= nums[i] <= 10000

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var exchange = function(nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if(nums[i] % 2 !== 0) {
      [nums[j], nums[i]] = [nums[i], nums[j]]; // 将奇数换到前面
      j++;
    }
  }
  return nums;
};

(function(){
  let input = [1,2,3,4,5,6,7,8];
  console.log(exchange(input));
})();