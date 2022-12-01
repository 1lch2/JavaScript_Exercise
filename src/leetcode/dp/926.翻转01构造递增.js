// 如果一个由 '0' 和 '1' 组成的字符串，
// 是以一些 '0'（可能没有 '0'）后面跟着一些 '1'（也可能没有 '1'）的形式组成的，
// 那么该字符串是单调递增的。

// 我们给出一个由字符 '0' 和 '1' 组成的字符串 S，
// 我们可以将任何 '0' 翻转为 '1' 或者将 '1' 翻转为 '0'。

// 返回使 S 单调递增的最小翻转次数。

// 示例 1：
// 输入：s = "00110"
// 输出：1
// 解释：我们翻转最后一位得到 00111.

// 示例 2：
// 输入：s = "010110"
// 输出：2
// 解释：我们翻转得到 011111，或者是 000111。

// 示例 3：
// 输入：s = "00011000"
// 输出：2
// 解释：我们翻转得到 00000000。

// 提示：
// 1 <= s.length <= 105
// S 中只包含字符 '0' 和 '1'

/**
 * @copyright https://leetcode-cn.com/problems/
 * flip-string-to-monotone-increasing/solution/zui-gui-fan-de-dong-tai-gui-hua-xie-fa-d-82le/
 * @param {string} s
 * @return {number}
 */
var minFlipsMonoIncr = function(s) {
  if(s.length <= 1) {
    return 0;
  }

  // dp[i][0] 代表前 i 个元素递增，且第 i 个元素为 0 时的最小翻转次数
  // dp[i][1] 代表前 i 个元素递增，且第 i 个元素为 1 时的最小翻转次数
  let dp = new Array(s.length).fill(0).map(() => new Array(2).fill(0));

  // 起始状态
  dp[0][0] = s[0] === "0" ? 0 : 1;
  dp[0][1] = s[0] === "1" ? 0 : 1;

  for(let i = 1; i < s.length; i++) {
    dp[i][0] = dp[i - 1][0] + (s[i] === "0" ? 0 : 1);

    // dp[i][1] 的前 i - 1 个元素可以为 1 或 0，因此需要两种情况中取最小
    dp[i][1] = Math.min(dp[i - 1][0], dp[i - 1][1] + (s[i] === "1" ? 0 : 1));
  }

  return Math.min(...dp[s.length - 1]);
};

(function() {
  console.log(minFlipsMonoIncr("00110"));
})();