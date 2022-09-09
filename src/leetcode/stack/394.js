// 给定一个经过编码的字符串，返回它解码后的字符串。

// 编码规则为: k[encoded_string]，
// 表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。

// 你可以认为输入字符串总是有效的；
// 输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

// 此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，
// 例如不会出现像 3a 或 2[4] 的输入。

// 示例 1：
// 输入：s = "3[a]2[bc]"
// 输出："aaabcbc"

// 示例 2：
// 输入：s = "3[a2[c]]"
// 输出："accaccacc"

// 示例 3：
// 输入：s = "2[abc]3[cd]ef"
// 输出："abcabccdcdcdef"

// 示例 4：
// 输入：s = "abc3[cd]xyz"
// 输出："abccdcdcdxyz"

// 提示：
// 1 <= s.length <= 30
// s 由小写英文字母、数字和方括号 '[]' 组成
// s 保证是一个 有效 的输入。
// s 中所有整数的取值范围为 [1, 300]

/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function(s) {
  let result = "";
  let charStack = [];
  let numStack = [];

  let mult = 0;
  for (let i = 0; i < s.length; i++) {
    let char = s[i];
    if (Number.isInteger(+char)) {
      // 数字可能有多位，每次进一位
      mult = mult * 10 + Number(char);
    }

    else if (char === "[") {
      // 遇到左括号开始入栈操作
      numStack.push(mult);
      charStack.push(result);

      // 入完栈后重置字符和数字
      result = "";
      mult = 0;
    }

    else if (char === "]") {
      let num = numStack.pop();
      let str = charStack.pop();

      // 数字作用于当前累积的字符而不是弹栈的字符
      // 把当前数字乘字符累加完毕后和栈顶字符拼接起来
      result = str + result.repeat(num);
    }

    else {
      result += char;
    }
  }

  return result;
};

let input = [
  "3[a]2[bc]",
  "3[a2[c]]",
  "2[abc]3[cd]ef",
  "abc3[cd]xyz"
];
for (let each of input) {
  console.log(decodeString(each));
}