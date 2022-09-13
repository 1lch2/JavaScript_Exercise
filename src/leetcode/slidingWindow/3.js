// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

// 示例 1:
// 输入: s = "abcabcbb"
// 输出: 3 
// 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

// 示例 2:
// 输入: s = "bbbbb"
// 输出: 1
// 解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

// 示例 3:
// 输入: s = "pwwkew"
// 输出: 3
// 解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
//      请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
//  
// 提示：
// 0 <= s.length <= 5 * 104
// s 由英文字母、数字、符号和空格组成

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  if (s.length <= 1) {
    return s.length;
  }

  // 记录已使用字符
  let set = new Set();
  set.add(s[0]);

  let end = 0;
  let max = 1;
  // 每轮迭代确定一个最长的不重复子串
  for (let start = 0; start < s.length; start++) {
    // 除了第一次循环，之后每轮都把左边界右移一位
    if (start !== 0) {
      set.delete(s[start - 1]);
    }

    // 不断右移右边界直到遇到重复字符
    while (end + 1 < s.length && !set.has(s[end + 1])) {
      set.add(s[end + 1]);
      end++;
    }
    max = Math.max(max, end - start + 1);
  }
  return max;
};

(function() {
  console.log(lengthOfLongestSubstring("pwwkew"));
})();