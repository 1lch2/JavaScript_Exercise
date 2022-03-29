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
  if(MIN_LEN === 0) {
    return res;
  }

  for(let i = 0; i < MIN_LEN; i++) {
    let current = strs[0][i];
    for(let word of strs) {
      if(word[i] !== current) {
        return res;
      }
    }
    res += current;
  }

  return res;
};