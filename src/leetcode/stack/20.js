// 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

// 有效字符串需满足：

// 左括号必须用相同类型的右括号闭合。
// 左括号必须以正确的顺序闭合。

// 示例 1：
// 输入：s = "()"
// 输出：true

// 示例 2：
// 输入：s = "()[]{}"
// 输出：true

// 示例 3：
// 输入：s = "(]"
// 输出：false

// 示例 4：
// 输入：s = "([)]"
// 输出：false

// 示例 5：
// 输入：s = "{[]}"
// 输出：true
//  
// 提示：
// 1 <= s.length <= 104
// s 仅由括号 '()[]{}' 组成

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  if(s.length % 2 != 0) {
    return false;
  }

  let pairMap = new Map();
  pairMap.set("}", "{");
  pairMap.set("]", "[");
  pairMap.set(")", "(");

  let stack = [];
  for (const char of s) {
    let stackSize = stack.length;
    // 仅当右括号准备入栈时检查
    if(pairMap.has(char)) {
      // 括号不匹配或栈已经清空时为false
      if (stack[stackSize - 1] !== pairMap.get(char) || stack.length == 0) {
        return false
      } else {
        stack.pop();
      }
    } else {
      // 左括号直接入栈
      stack.push(char);
    }
  }
  return stack.length == 0;
};
