// 数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。

// 示例 1：
// 输入：n = 3
// 输出：["((()))","(()())","(())()","()(())","()()()"]

// 示例 2：
// 输入：n = 1
// 输出：["()"]

// 提示：
// 1 <= n <= 8

/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  let res = [];

  /**
   * @param {String} path path
   * @param {Number} left left parenthes
   */
  const backtrack = (path, left, right) => {
    if (path.length === 2 * n) {
      res.push(path.slice(0));
      return;
    }

    if(left < n) {
      path += "(";
      left++;
      backtrack(path, left, right);
      path = path.slice(0, path.length - 1);
      left--;
    }

    if(right < n && right < left) {
      path += ")";
      right++;
      backtrack(path, left, right);
      path = path.slice(0, path.length - 1);
      right--;
    }
  };

  backtrack("(", 1, 0);
  return res;
};

(function() {
  console.log(generateParenthesis(3));
})();