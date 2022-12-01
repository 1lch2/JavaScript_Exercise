// 给你两个二进制字符串，返回它们的和（用二进制表示）。

// 输入为 非空 字符串且只包含数字 1 和 0。

// 示例 1:
// 输入: a = "11", b = "1"
// 输出: "100"

// 示例 2:
// 输入: a = "1010", b = "1011"
// 输出: "10101"

// 提示：
// 每个字符串仅由字符 '0' 或 '1' 组成。
// 1 <= a.length, b.length <= 10^4
// 字符串如果不是 "0" ，就都不含前导零。

// /**
//  * @param {string} a
//  * @param {string} b
//  * @return {string}
//  */
// var addBinary = function (a, b) {
//   // JS位运算只能操作32位整数，测试用例有一个超出了32位，该解法无法通过

//   let x = Number.parseInt(a, 2);
//   let y = Number.parseInt(b, 2);

//   // 将y视作待加的进位部分
//   while (y !== 0) {
//     // 异或计算不带进位的加法结果
//     answer = x ^ y;
//     // 计算进位部分
//     carry = (x & y) << 1;

//     // 更新值
//     x = answer;
//     y = carry;
//   }
//   return x.toString(2);
// };

/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function (a, b) {
  let delta = a.length - b.length;
  let x = a;
  let y = b;
  if(delta > 0) {
    y = b.padStart(a.length, "0")
    x = a;
  } else if(delta < 0) {
    x = a.padStart(b.length, "0")
    y = b
  }

  x = x.split("");
  y = y.split("");

  let len = x.length;
  let carry = 0;
  let answer = [];
  for(let i = len - 1; i >= 0; i--) {
    current = x[i] ^ y[i] ^ carry;
    carry = Number(x[i]) + Number(y[i]) + carry > 1 ? 1 : 0;

    answer.unshift(current);
    if(i === 0 && carry !== 0) {
      answer.unshift(carry);
    }
  }

  return answer.join("");
};

(function(){
  let a = "10101";
  let b = "111";

  console.log(addBinary(a, b));
})();