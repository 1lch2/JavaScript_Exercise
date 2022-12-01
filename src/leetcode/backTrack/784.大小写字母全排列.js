// 给定一个字符串 s ，通过将字符串 s 中的每个字母转变大小写，我们可以获得一个新的字符串。

// 返回 所有可能得到的字符串集合 。以 任意顺序 返回输出。

// 示例 1：
// 输入：s = "a1b2"
// 输出：["a1b2", "a1B2", "A1b2", "A1B2"]

// 示例 2:
// 输入: s = "3z4"
// 输出: ["3z4","3Z4"]

// 提示:
// 1 <= s.length <= 12
// s 由小写英文字母、大写英文字母和数字组成

/**
 * @param {string} s
 * @return {string[]}
 */
var letterCasePermutation = function(s) {
  let result = [];

  /**
   * @param {Array<number | string>} path
   */
  const backtrack = (path, index) => {
    // 对数字不做处理，右移下标
    while(index < s.length && !isNaN(parseInt(path[index]))) {
      index++;
    }

    // 下标超过末尾
    if (index === s.length) {
      result.push(path.join(""));
      return;
    }

    // 选择不变和选择变大小写两种情况
    path[index] = path[index].toUpperCase();
    backtrack(path, index + 1);

    path[index] = path[index].toLowerCase();
    backtrack(path, index + 1);
  };

  backtrack([...s], 0);
  return result;
};

console.log(letterCasePermutation("a1b2"));