// 给你一个整数数组 nums 和一个整数 k ，如果 nums 有一个 好的子数组 返回 true ，否则返回 false：

// 一个 好的子数组 是：
// 长度 至少为 2 ，且
// 子数组元素总和为 k 的倍数。

// 注意：
// 子数组 是数组中 连续 的部分。
// 如果存在一个整数 n ，令整数 x 符合 x = n * k ，则称 x 是 k 的一个倍数。0 始终 视为 k 的一个倍数。

// 示例 1：
// 输入：nums = [23,2,4,6,7], k = 6
// 输出：true
// 解释：[2,4] 是一个大小为 2 的子数组，并且和为 6 。

// 示例 2：
// 输入：nums = [23,2,6,4,7], k = 6
// 输出：true
// 解释：[23, 2, 6, 4, 7] 是大小为 5 的子数组，并且和为 42 。
// 42 是 6 的倍数，因为 42 = 7 * 6 且 7 是一个整数。

// 示例 3：
// 输入：nums = [23,2,6,4,7], k = 13
// 输出：false

// 提示：
// 1 <= nums.length <= 10^5
// 0 <= nums[i] <= 10^9
// 0 <= sum(nums[i]) <= 2^31 - 1
// 1 <= k <= 2^31 - 1

/**
 * 错解，复杂度超了
 */
function _checkSubarraySum(nums: number[], k: number): boolean {
  if (nums.length === 1) return false;

  const preSum = Array(nums.length + 1).fill(0);
  for (let i = 1; i <= nums.length; i++) {
    preSum[i] = preSum[i - 1] + nums[i - 1];
  }

  // 0 也是倍数，只要存在和为 0 就
  if (preSum[preSum.length - 1] === 0) return true;

  for (let i = 2; i <= preSum.length; i++) {
    // 从距离2开始
    for (let j = i - 2; j >= 0; j--) {
      if ((preSum[i] - preSum[j]) % k === 0) {
        return true;
      }
    }
  }
  return false;
}
function checkSubarraySum(nums: number[], k: number): boolean {
  // 同余定理
  // 若 a 和 b 被 m 整除后的余数相同，则 a - b 被 m 整除后的余数相同
  // 则称 a 与 b 对模 m 同余，记作 a ≡ b mod m
  if (nums.length === 1) return false;

  const preSum = Array(nums.length + 1).fill(0);
  for (let i = 1; i <= nums.length; i++) {
    preSum[i] = preSum[i - 1] + nums[i - 1];
  }

  const set = new Set<number>();
  // 最小距离是 2 所以直接从 2 开始遍历
  for (let i = 2; i <= nums.length; i++) {
    // 对于这道题，对当前前缀和之前距离 2 的位置除以 k 取余，存这个余数
    // 如果当前的前缀和之前出现过，且至少距离为 2 的位置同余，则说明存在这样的序列
    set.add(preSum[i - 2] % k);
    if (set.has(preSum[i] % k)) {
      return true;
    }
  }

  return false;
}

console.log(checkSubarraySum([1, 0], 2));
console.log(checkSubarraySum([23, 2, 6, 4, 7], 6));
