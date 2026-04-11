// 给定一个含有 n 个正整数的数组和一个正整数 target 。

// 找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，
// 并返回其长度。如果不存在符合条件的子数组，返回 0 。

// 示例 1：
// 输入：target = 7, nums = [2,3,1,2,4,3]
// 输出：2
// 解释：子数组 [4,3] 是该条件下的长度最小的子数组。

// 示例 2：
// 输入：target = 4, nums = [1,4,4]
// 输出：1

// 示例 3：
// 输入：target = 11, nums = [1,1,1,1,1,1,1,1]
// 输出：0

// 提示：
// 1 <= target <= 109
// 1 <= nums.length <= 105
// 1 <= nums[i] <= 105

// 进阶：
// 如果你已经实现 O(n) 时间复杂度的解法, 请尝试设计一个 O(n log(n)) 时间复杂度的解法。

const minSubArrayLen = function (target: number, nums: number[]) {
  let start = 0;
  let end = 0;

  // 初始化一个较大的值用来判断是否存在
  let result = Number.MAX_SAFE_INTEGER;
  let sum = 0;

  // 滑动窗口
  while (end < nums.length) {
    sum += nums[end];

    // 只处理左边界右移情况
    // 等同于外部多一个右边界右移直到 sum >= target 的循环
    while (sum >= target) {
      result = Math.min(result, end - start + 1);
      sum -= nums[start];
      start++;
    }
    end++;
  }

  return result === Number.MAX_SAFE_INTEGER ? 0 : result;
};

function minSubArrayLen_presum(target: number, nums: number[]): number {
  const preSum = Array(nums.length + 1).fill(0);
  for (let i = 1; i < nums.length + 1; i++) {
    preSum[i] = nums[i - 1] + preSum[i - 1];
  }

  if (preSum[nums.length] < target) return 0;

  const binSearchLowerBound = (low: number, high: number, target: number) => {
    let mid = Math.floor((high - low) / 2) + low; // 数组太长可能会溢出
    while (low < high) {
      mid = Math.floor((high - low) / 2) + low;
      if (preSum[mid] < target) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return low;
  };

  let min = 114514;
  for (let i = 1; i < preSum.length + 1; i++) {
    // 先判断在当前子区间内是否存在解
    if (preSum[nums.length] - preSum[i - 1] >= target) {
      // 将 preSum[j] - preSum[i] >= target 转换为 preSum[j] >= preSum[i] + target
      // 二分查找符合的最小下标
      let lowBound = binSearchLowerBound(
        i,
        preSum.length - 1,
        target + preSum[i - 1],
      );
      min = Math.min(min, lowBound - (i - 1));
    }
  }
  return min;
}

console.log(minSubArrayLen_presum(7, [2, 3, 1, 2, 4, 3]));
console.log(minSubArrayLen_presum(15, [1, 2, 3, 4, 5]));
console.log(minSubArrayLen_presum(1, [2, 3, 3, 4, 5]));
