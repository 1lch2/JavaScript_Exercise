// 编写一个函数来查找字符串数组中的最长公共前缀。

// 如果不存在公共前缀，返回空字符串 ""。

// 示例 1：
// 输入：strs = ["flower","flow","flight"]
// 输出："fl"

// 示例 2：
// 输入：strs = ["dog","racecar","car"]
// 输出：""
// 解释：输入不存在公共前缀。

// 提示：
// 1 <= strs.length <= 200
// 0 <= strs[i].length <= 200
// strs[i] 仅由小写英文字母组成

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  let res = "";

  // 按长度升序排列
  strs.sort((a, b) => a.length - b.length);

  const MIN_LEN = strs[0].length;
  if (MIN_LEN === 0) {
    return res;
  }

  for (let i = 0; i < MIN_LEN; i++) {
    let current = strs[0][i];
    for (let word of strs) {
      if (word[i] !== current) {
        return res;
      }
    }
    res += current;
  }

  return res;
};

/**
 * @param {string[]} strs
 * @return {string}
 */
var _longestCommonPrefix = function(strs) {
  strs.sort((a, b) => a.length - b.length);
  const MIN = strs[0].length;

  const isCommonPrefix = (length) => {
    // 以最短的字符串为基准
    let base = strs[0].slice(0, length);
    for (let i = 1; i < strs.length; i++) {
      let currentWord = strs[i];
      for(let j = 0; j < base.length; j++) {
        if(currentWord[j] !== base[j]) {
          return false;
        }
      }
    }
    return true;
  };

  // 在 [0, MIN] 区间内二分查找公共点
  let low = 0;
  let high = MIN;
  while (low < high) {
    // 这里让偶数长度区间取中点时，取到靠右的那个
    let mid = (low + high + 1) >> 1;
    if (isCommonPrefix(mid)) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  return strs[0].slice(0, low);
};

let input = [
  ["dog", "racecar", "car"],
  ["flower","flow","flight"],
  ["abcdef", "abcde", "abc"],
  ["abcc", "abdddd", "abeeee"]
];

for(let test of input) {
  console.log(_longestCommonPrefix(test));
}