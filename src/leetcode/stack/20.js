// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。

// 示例 1：
// 输入：s = "()"
// 输出：true

// 示例 2：
// 输入：s = "()[]{}"
// 输出：true

// 示例 3：
// 输入：s = "(]"
// 输出：false

// 示例 4：
// 输入：s = "([)]"
// 输出：false

// 示例 5：
// 输入：s = "{[]}"
// 输出：true

// 提示：
// 1 <= s.length <= 104
// s 仅由括号 '()[]{}' 组成

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  if (s.length % 2 !== 0) {
    return false;
  }

  let map = {
    "}": "{",
    "]": "[",
    ")": "("
  };

  let stack = [];
  for (let char of s) {
    // 仅当右括号准备入栈时检查，否则入栈左括号
    if (!(char in map)) {
      stack.push(char);
      continue;
    }

    // 栈已经清空时为false
    if (stack.length === 0) {
      return false;
    }

    // 括号不匹配，直接返回false
    let top = stack[stack.length - 1];
    if (top !== map[char]) {
      return false;
    }

    // 括号匹配，弹栈
    stack.pop();
  }

  return stack.length === 0;
};
