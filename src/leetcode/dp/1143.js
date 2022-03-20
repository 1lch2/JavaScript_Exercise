// 给定两个字符串 text1 和 text2，返回这两个字符串的最长 公共子序列 的长度。
// 如果不存在 公共子序列 ，返回 0 。

// 一个字符串的 子序列 是指这样一个新的字符串：
// 它是由原字符串在不改变字符的相对顺序的情况下删除某些字符（也可以不删除任何字符）后组成的新字符串。

// 例如，"ace" 是 "abcde" 的子序列，但 "aec" 不是 "abcde" 的子序列。
// 两个字符串的 公共子序列 是这两个字符串所共同拥有的子序列。

// 示例 1：
// 输入：text1 = "abcde", text2 = "ace" 
// 输出：3
// 解释：最长公共子序列是 "ace" ，它的长度为 3 。

// 示例 2：
// 输入：text1 = "abc", text2 = "abc"
// 输出：3
// 解释：最长公共子序列是 "abc" ，它的长度为 3 。

// 示例 3：
// 输入：text1 = "abc", text2 = "def"
// 输出：0
// 解释：两个字符串没有公共子序列，返回 0 。

// 提示：
// 1 <= text1.length, text2.length <= 1000
// text1 和 text2 仅由小写英文字符组成。

/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {
  const M = text1.length;
  const N = text2.length;

  // dp[i][j] 代表在下标 i 处结尾的序列1和在下标 j 处结尾的序列2的最长公共序列长度
  let dp = new Array(M + 1).fill(0).map(() => new Array(N + 1).fill(0));

  for(let i = 1; i <= M; i++) {
    for(let j = 1; j <= N; j++) {
      // 这里下标应该减 1 来抵消 dp 数组的偏移
      if(text1[i - 1] === text2[j - 1]) {
        // 若结尾处下标相同，则考虑前一位的长度
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // 若结尾下标不同，则只保留其中一段序列的结尾字符
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[M][N];
};

(function(){
  console.log(longestCommonSubsequence("abc", "def"));
})();