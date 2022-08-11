// 给定一个包含大写字母和小写字母的字符串 s ，返回 通过这些字母构造成的 最长的回文串 。

// 在构造过程中，请注意 区分大小写 。
// 比如 "Aa" 不能当做一个回文字符串。

// 示例 1:
// 输入:s = "abccccdd"
// 输出:7
// 解释:
// 我们可以构造的最长的回文串是"dccaccd", 它的长度是 7。

// 示例 2:
// 输入:s = "a"
// 输入:1

// 示例 3:
// 输入:s = "bb"
// 输入: 2

// 提示:
// 1 <= s.length <= 2000
// s 只能由小写和/或大写英文字母组成

/**
 * @param {string} s
 * @return {number}
 */
var longestPalindrome = function(s) {
  let chmap = {};
  for(let i = 0; i < s.length; i++) {
    if(chmap[s[i]] === undefined) {
      chmap[s[i]] = 1;
    } else {
      chmap[s[i]]++;
    }
  }

  let res = 0;
  // 记录是否存在只出现一次的字母
  let one = 0;
  for(let i in chmap) {
    // 记录模2的余数
    let sub = chmap[i] % 2;

    // 将出现次数向下取偶数值
    res += chmap[i] - sub;

    if(sub === 1) {
      one = true;
    }
  }

  return res + one;
};

console.log(longestPalindrome("aaa"));
console.log(longestPalindrome("a"));
console.log(longestPalindrome("abbccc"));
console.log(longestPalindrome("aabbcccc"));
console.log(longestPalindrome("abcccc"));
