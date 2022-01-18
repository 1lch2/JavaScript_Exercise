// 给定两个整数，被除数 dividend 和除数 divisor。将两数相除，要求不使用乘法、除法和 mod 运算符。

// 返回被除数 dividend 除以除数 divisor 得到的商。

// 整数除法的结果应当截去（truncate）其小数部分，例如：truncate(8.345) = 8 以及 truncate(-2.7335) = -2

// 示例 1:
// 输入: dividend = 10, divisor = 3
// 输出: 3
// 解释: 10/3 = truncate(3.33333..) = truncate(3) = 3

// 示例 2:
// 输入: dividend = 7, divisor = -3
// 输出: -2
// 解释: 7/-3 = truncate(-2.33333..) = -2

// 提示：
// 被除数和除数均为 32 位有符号整数。
// 除数不为 0。
// 假设我们的环境只能存储 32 位有符号整数，其数值范围是 [−231,  231 − 1]。本题中，如果除法结果溢出，则返回 231 − 1。

/**
 * @param {number} dividend
 * @param {number} divisor
 * @return {number}
 */
var divide = function (dividend, divisor) {
  const MAX_VALUE = 2 ** 31 - 1;
  const MIN_VALUE = -(2 ** 31);

  if (dividend === 0) {
    return 0;
  }

  if (dividend === MIN_VALUE && divisor === -1) {
    return MAX_VALUE;
  }

  // 异或结果为负数时，两数符号相异
  let negative = (dividend ^ divisor) < 0;
  // 左移次数之和
  let res = 0

  dividend = Math.abs(dividend);
  divisor = Math.abs(divisor);

  if (dividend < divisor) {
    return 0;
  }

  // 循环对被除数减去左移后的除数，累加左移次数对应的2次幂
  // 直到无法被整除为止
  while (true) {
    k = divisor; // 保存除数副本
    let i = 0; // 记录左移次数

    // 循环左移检查，同时注意不能溢出到负数
    while ((k << 1) < dividend && (k << 1) > 0) {
      k = k << 1;
      i++;
    }
    res += (1 << i); // 除数左移次数的2次幂，即乘法因数
    dividend -= k;

    if (dividend < divisor) {
      // 当被除数已经小于除数时，处理返回结果
      res = negative ? -res : res;
      return res > MAX_VALUE ? MAX_VALUE : res
    }
  }
};

(function() {
  let a = divide(2147483647, 2);
})();