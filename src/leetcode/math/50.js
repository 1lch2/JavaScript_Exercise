// JZ16
// 实现 pow(x, n) ，即计算 x 的 n 次幂函数（即，xn ）。

// 示例 1：
// 输入：x = 2.00000, n = 10
// 输出：1024.00000

// 示例 2：
// 输入：x = 2.10000, n = 3
// 输出：9.26100

// 示例 3：
// 输入：x = 2.00000, n = -2
// 输出：0.25000
// 解释：2-2 = 1/22 = 1/4 = 0.25

// 提示：
// -100.0 < x < 100.0
// -2^31 <= n <= 2^31-1
// -10^4 <= xn <= 10^4

/**
 * @copyright https://leetcode-cn.com/problems/powx-n/solution/50-powx-n-kuai-su-mi-qing-xi-tu-jie-by-jyd/
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function(x, n) {
  if(x === 0) {
    return 0;
  }

  if(x === 1 || n === 0) {
    return 1;
  }

  // 负数次幂时做转换
  if(n < 0) {
    x = 1 / x;
    n = -n;
  }

  let res = 1;
  while(n !== 0) {
    // 当前幂次为奇数
    if(n % 2 === 1) {
      res *= x;
    }
    x *= x;
    // 无符号右移
    // 当 n 为 -2^31 时，转换后的值符号位为 1，需要使用无符号右移
    n = n >>> 1;
  }
  
  return res;
};