// 给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

// 示例 1：
// 输入：s = "(()"
// 输出：2
// 解释：最长有效括号子串是 "()"

// 示例 2：
// 输入：s = ")()())"
// 输出：4
// 解释：最长有效括号子串是 "()()"

// 示例 3：
// 输入：s = ""
// 输出：0

// 提示：
// 0 <= s.length <= 3 * 104
// s[i] 为 '(' 或 ')'

/**
 * @copyright https://leetcode-cn.com/problems/longest-valid-parentheses/solution/
 *            dong-tai-gui-hua-si-lu-xiang-jie-c-by-zhanganan042/
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
  if(s.length <= 1) {
    return 0;
  }

  let maxLen = 0;
  // dp[i] 代表以 i 结尾的子串的最长括号长度
  let dp = new Array(s.length).fill(0);

  for(let i = 1; i < s.length; i++) {
    // 左括号结束的序列不是有效括号，因此遇到右括号才开始判断情况
    if(s[i] === ")") {
      if(s[i - 1] === "(") {
        // 若此时是从起始位置开始的第一组括号则直接赋值，避免出现引用 -1 位置的错误
        if(i < 2) {
          dp[i] = 2;
        } else {
          // 若可以拼成一对括号，则最长长度 + 2
          dp[i] = dp[i - 2] + 2;
        }

      } else if(s[i - 1] === ")") {
        // 若不能拼成一对，则需要考虑以 i-1 结尾的有效括号序列之前的序列长度
        // 若以 i-1 结尾的子序列的长度为 dp[i-1]
        // 该子序列起始位置下标为 i - dp[i-1] - 1
        let subSeqIndex = i - dp[i - 1] - 1;
  
        // 若子序列起始下标没超出范围，且对应位置是左括号才能在序列长度基础上 + 2
        if(subSeqIndex >= 0 && s[subSeqIndex] === "(") {
          // 同理这里下标也需要在范围内
          if(subSeqIndex - 1 >= 0) {
            // 该子序列的前一位就是 i - dp[i-1] - 2
            dp[i] = dp[i - 1] + dp[i - dp[i - 1] - 2] + 2;
          } else {
            dp[i] = dp[i - 1] + 2;
          }
        }
      }
  
      maxLen = Math.max(maxLen, dp[i]);
    }
  }

  return maxLen;
};