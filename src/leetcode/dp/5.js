// 给你一个字符串 s，找到 s 中最长的回文子串。

// 示例 1：
// 输入：s = "babad"
// 输出："bab"
// 解释："aba" 同样是符合题意的答案。

// 示例 2：
// 输入：s = "cbbd"
// 输出："bb"

// 提示：
// 1 <= s.length <= 1000
// s 仅由数字和英文字母组成

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
  const LENGTH = s.length;
  if(LENGTH <= 1) {
    return s;
  }

  // 当前最大子串长度
  let maxLen = 1;
  // 当前最大子串长度起始下标
  let maxStart = 0;

  // 状态转移矩阵，对应下标段是否为回文子串
  let dpState = [];
  for(let i = 0; i < LENGTH; i++) {
    dpState.push(new Array(LENGTH).fill(false));
  }

  for(let i = 0; i < LENGTH; i++) {
    dpState[i][i] = true;
  }

  // 终止下标
  for(let j = 0; j < LENGTH; j++) {
    // 起始下标
    for(let i = 0; i < j; i++) {
      // 判断是否为回文串，填充dpstate
      if(s[i] === s[j]) {
        if(j - i <= 2) {
          dpState[i][j] = true;
        } else {
          // i，j段为回文串，当且仅当两段字符相同且i+1, j-1段也为回文串
          dpState[i][j] = dpState[i + 1][j - 1];
        }
      }

      if(dpState[i][j]) {
        if(j - i + 1 > maxLen) {
          maxLen = j - i + 1;
          maxStart = i;
        }
      }
    }
  }
  return s.slice(maxStart, maxLen + maxStart);
};

(function(){
  let input = "abcbd";
  console.log(longestPalindrome(input));
})();
