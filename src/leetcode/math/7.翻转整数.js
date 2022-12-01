// 给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。

// 如果反转后整数超过 32 位的有符号整数的范围 [−2^31, 2^31 − 1] ，就返回 0。

// 假设环境不允许存储 64 位整数（有符号或无符号）。

// 示例 1：
// 输入：x = 123
// 输出：321

// 示例 2：
// 输入：x = -123
// 输出：-321

// 示例 3：
// 输入：x = 120
// 输出：21

// 示例 4：
// 输入：x = 0
// 输出：0

// 提示：
// -231 <= x <= 231 - 1

/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
  // 一位数直接返回
  if (Math.abs(x) < 10) {
    return x;
  }

  // 把负数转为正数处理
  let negative = (x < 0);
  if (negative) {
    x = -x;
  }

  let result = 0;
  // 记录位数
  let digits = Math.floor(Math.log10(x));
  let remain = x;
  for (let i = digits; i >= 0; i--) {
    let currBase = Math.pow(10, i);
    // 从高位开始把每位数字提取出来，再乘对应的10次幂，累加到结果上
    result += Math.floor(remain / currBase) * Math.pow(10, digits - i);
    remain = x % currBase;
  }

  // 32 位整数溢出判断
  result = (result > Math.pow(2, 31) - 1 ? 0 : result);

  return (negative ? -result : result);
};