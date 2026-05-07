// 给你一个整数 n ，请你返回所有 0 到 1 之间（不包括 0 和 1）满足分母小于等于  n 的 最简 分数 。分数可以以 任意 顺序返回。

// 示例 1：
// 输入：n = 2
// 输出：["1/2"]
// 解释："1/2" 是唯一一个分母小于等于 2 的最简分数。

// 示例 2：
// 输入：n = 3
// 输出：["1/2","1/3","2/3"]

// 示例 3：
// 输入：n = 4
// 输出：["1/2","1/3","1/4","2/3","3/4"]
// 解释："2/4" 不是最简分数，因为它可以化简为 "1/2" 。

// 示例 4：
// 输入：n = 1
// 输出：[]

// 提示：
// 1 <= n <= 100

function simplifiedFractions(n: number): string[] {
  if (n === 1) return [];

  const result = [];

  /**
   * 辗转相除法求最大公约数
   * 公理：两数的最大公约数等于其中较小数与他们余数的最大公约数
   * a > b, gcd(a, b) = gcd(a, a % b)
   */
  const getGcd = (a: number, b: number) => {
    if (a < b) {
      [b, a] = [a, b];
    }

    const recur = (a: number, b: number) => {
      if (b === 0) {
        return a;
      }
      return recur(b, a % b);
    };

    return recur(a, b);
  };

  for (let denominator = 2; denominator <= n; denominator++) {
    for (let numerator = 1; numerator < denominator; numerator++) {
      if (numerator === 1 || getGcd(numerator, denominator) === 1) {
        result.push(`${numerator}/${denominator}`);
      }
    }
  }
  return result;
}
