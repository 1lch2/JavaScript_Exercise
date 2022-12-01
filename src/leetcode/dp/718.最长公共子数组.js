// 给两个整数数组 nums1 和 nums2 ，
// 返回 两个数组中 公共的 、长度最长的子数组的长度 。

// 示例 1：
// 输入：nums1 = [1,2,3,2,1], nums2 = [3,2,1,4,7]
// 输出：3
// 解释：长度最长的公共子数组是 [3,2,1] 。

// 示例 2：
// 输入：nums1 = [0,0,0,0,0], nums2 = [0,0,0,0,0]
// 输出：5

// 提示：
// 1 <= nums1.length, nums2.length <= 1000
// 0 <= nums1[i], nums2[i] <= 100

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findLength = function(nums1, nums2) {
  const M = nums1.length;
  const N = nums2.length;

  // dp[i][j] 代表以 nums1[i] 和 nums2[j] 结尾的最长子数组的长度
  let dp = new Array(M+1).fill(0).map(() => new Array(N+1).fill(0));

  let max = 0;
  // 因为 dp 的计算要取前一位，取不到 -1 下标，所以需要给二维数组横纵各增加一位
  for(let i = 1; i <= M; i++) {
    for(let j = 1; j <= N; j++) {
      // 结尾字符必须相同
      if(nums1[i-1] !== nums2[j-1]) {
        continue;
      }
      
      // 当前两个下标结尾的最长相同子数组长度只取决于各自前一位的情况
      dp[i][j] = dp[i-1][j-1] + 1;
      max = Math.max(dp[i][j], max);
    }
  }

  return max;
};

let input = [[1,2,3,2,1], [3,2,1,4,7]];
console.log(findLength(...input));