// JZ10-1
// 写一个函数，输入 n ，求斐波那契（Fibonacci）数列的第 n 项（即 F(N)）。

// 斐波那契数列的定义如下：
// F(0) = 0, F(1) = 1
// F(N) = F(N - 1) + F(N - 2), 其中 N > 1.

// 斐波那契数列由 0 和 1 开始，之后的斐波那契数就是由之前的两数相加而得出。

// 答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

// 示例 1：
// 输入：n = 2
// 输出：1

// 示例 2：
// 输入：n = 5
// 输出：5

// 提示：
// 0 <= n <= 100

/**
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
  // dpState代表第i个元素的数列值
  let dpState = [];
  const MOD = 1e9 + 7;
  dpState[0] = 0;
  dpState[1] = 1;

  if (n < 2) {
    return dpState[n];
  }
  for (let i = 2; i <= n; i++) {
    dpState[i] = (dpState[i - 1] + dpState[i - 2]) % MOD;
  }
  return dpState[n];
};

const fib_ = function(n) {
  let fi_2 = 0;
  let fi_1 = 1;

  if (n === 0) {
    return fi_2;
  }
  if (n === 1) {
    return fi_1;
  }

  // 只需要存储 f(i), f(i-1), f(i-2)这三个变量
  let fi = fi_1 + fi_2;
  for (let i = 1; i < n; i++) {
    fi = fi_1 + fi_2;
    fi_2 = fi_1;
    fi_1 = fi;
  }
  return fi;
};

(function() {
  let n = 81;
  console.log(fib(n));
})();