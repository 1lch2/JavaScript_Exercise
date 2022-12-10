// 给你两个长度可能不等的整数数组 nums1 和 nums2 。
// 两个数组中的所有值都在 1 到 6 之间（包含 1 和 6）。

// 每次操作中，你可以选择 任意 数组中的任意一个整数，将它变成 1 到 6 之间 任意 的值（包含 1 和 6）。

// 请你返回使 nums1 中所有数的和与 nums2 中所有数的和相等的最少操作次数。
// 如果无法使两个数组的和相等，请返回 -1 。

// 示例 1：
// 输入：nums1 = [1,2,3,4,5,6], nums2 = [1,1,2,2,2,2]
// 输出：3
// 解释：你可以通过 3 次操作使 nums1 中所有数的和与 nums2 中所有数的和相等。以下数组下标都从 0 开始。
// - 将 nums2[0] 变为 6 。 nums1 = [1,2,3,4,5,6], nums2 = [6,1,2,2,2,2] 。
// - 将 nums1[5] 变为 1 。 nums1 = [1,2,3,4,5,1], nums2 = [6,1,2,2,2,2] 。
// - 将 nums1[2] 变为 2 。 nums1 = [1,2,2,4,5,1], nums2 = [6,1,2,2,2,2] 。

// 示例 2：
// 输入：nums1 = [1,1,1,1,1,1,1], nums2 = [6]
// 输出：-1
// 解释：没有办法减少 nums1 的和或者增加 nums2 的和使二者相等。

// 示例 3：
// 输入：nums1 = [6,6], nums2 = [1]
// 输出：3
// 解释：你可以通过 3 次操作使 nums1 中所有数的和与 nums2 中所有数的和相等。以下数组下标都从 0 开始。
// - 将 nums1[0] 变为 2 。 nums1 = [2,6], nums2 = [1] 。
// - 将 nums1[1] 变为 2 。 nums1 = [2,2], nums2 = [1] 。
// - 将 nums2[0] 变为 4 。 nums1 = [2,2], nums2 = [4] 。

// 提示：
// 1 <= nums1.length, nums2.length <= 105
// 1 <= nums1[i], nums2[i] <= 6

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var minOperations = function(nums1, nums2) {
  Array.prototype.sum = function() {
    return this.reduce((prev, curr) => prev + curr, 0);
  }

  // 计算差值
  let delta = nums1.sum() - nums2.sum();
  if(delta === 0) {
    return 0;
  }

  const LEN1 = nums1.length;
  const LEN2 = nums2.length;

  // 无法满足条件
  if (LEN1 > LEN2 * 6 || LEN2 > LEN1 * 6) {
    return -1;
  }

  let opsCount = 0;
  // 保证nums1之和大于nums2
  if(delta < 0) {
    [nums1, nums2] = [nums2, nums1];
    delta = -delta;
  }

  // nums1 降序，nums2 升序
  nums1.sort((a, b) => b - a);
  nums2.sort((a, b) => a - b);

  // 双指针
  // 贪心思路：每次选差值最大的一边进行改动
  let i = 0; 
  let j = 0;
  while((i < LEN1 || j < LEN2) && delta > 0) {
    let diff1 = nums1[i] - 1;
    let diff2 = 6 - nums2[j];

    if(diff1 >= diff2) {
      delta -= diff1;
      i++;
    } else {
      delta -= diff2;
      j++;
    }
    opsCount++;
  }

  return opsCount;
};

let input = [
  [6, 6],
  [1]
];
console.log(minOperations(...input)); // 3
