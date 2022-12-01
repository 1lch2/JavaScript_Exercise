// 给你一个整数数组 nums 和一个整数 k ，请你统计并返回该数组中和为 k 的连续子数组的个数。

// 示例 1：
// 输入：nums = [1,1,1], k = 2
// 输出：2

// 示例 2：
// 输入：nums = [1,2,3], k = 3
// 输出：2

// 提示：
// 1 <= nums.length <= 2 * 104
// -1000 <= nums[i] <= 1000
// -107 <= k <= 107

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
  // boundary case
  if(k < Math.min(...nums)) {
    return 0;
  }
  let count = 0;

  // 记录前缀和对应的出现次数
  let map = new Map([[0, 1]]);

  // 计算前缀和
  let preSum = 0;
  for(let i = 0; i < nums.length + 1; i++) {
    // 记录当前累积的前缀和
    preSum += nums[i];

    // 检查前缀和与k之差是否出现过
    // preSum[i] - preSum[j] = k
    // preSum[i] - k = preSum[j]，若成立，则存在比 i 小的 preSum，即map中有值
    if(map.get(preSum - k) !== undefined) {
      count += map.get(preSum - k);
    }

    // 前缀和出现次数
    if(map.get(preSum) !== undefined) {
      map.set(preSum, map.get(preSum) + 1);
    } else {
      map.set(preSum, 1);
    }
  }
  return count;
};

(function(){
  console.log(subarraySum([1,1,1], 2));
})();