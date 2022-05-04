// 给定整数 n ，返回 所有小于非负整数 n 的质数的数量 。

// 示例 1：
// 输入：n = 10
// 输出：4
// 解释：小于 10 的质数一共有 4 个, 它们是 2, 3, 5, 7 。

// 示例 2：
// 输入：n = 0
// 输出：0

// 示例 3：
// 输入：n = 1
// 输出：0

// 提示：
// 0 <= n <= 5 * 106

/**
 * @param {number} n
 * @return {number}
 */
var countPrimes = function(n) {
  let count = 0;

  // 起始状态默认所有数都为质数
  let isPrime = new Array(n).fill(true);
  for(let i = 2; i < n; i++) {
    if(isPrime[i]) {
      count++;
      //每次找到一个质数 x ，就排除所有 x 的倍数 k*x
      for(let j = 2 * i; j < n; j += i) {
        isPrime[j] = false;
      }
    }
  }

  return count;
};