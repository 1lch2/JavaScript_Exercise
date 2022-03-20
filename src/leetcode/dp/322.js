// 给你一个整数数组 coins ，表示不同面额的硬币；
// 以及一个整数 amount ，表示总金额。

// 计算并返回可以凑成总金额所需的 最少的硬币个数 。
// 如果没有任何一种硬币组合能组成总金额，返回 -1 。

// 你可以认为每种硬币的数量是无限的。

// 示例 1：
// 输入：coins = [1, 2, 5], amount = 11
// 输出：3 
// 解释：11 = 5 + 5 + 1

// 示例 2：
// 输入：coins = [2], amount = 3
// 输出：-1

// 示例 3：
// 输入：coins = [1], amount = 0
// 输出：0

// 提示：
// 1 <= coins.length <= 12
// 1 <= coins[i] <= 231 - 1
// 0 <= amount <= 104

/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
  if(amount === 0) {
    return 0;
  }

  if(Math.min(...coins) > amount) {
    return -1;
  }

  // dp[i] 代表凑出 i 需要的最少硬币数量
  // 因为硬币最小面值为 1 ，最多硬币数为 amount，初始化值为 amount + 1 代表无穷大
  // 初始化大小 amount + 1 是因为要取到下标等于 amount 的数
  let dp = new Array(amount + 1).fill(amount + 1);
  // 初始情况：0 块钱需要 0 枚硬币，
  dp[0] = 0;

  for(let i = 0; i < dp.length; i++) {
    for(let value of coins) {
      if(i - value < 0) {
        // 无解情况
        continue;
      }

      // 凑 i 块钱需要的最小硬币数等于凑 i 减硬币面值的钱所需硬币数再加一枚硬币
      // 与自身的初始值比较来判断是否可以凑出
      dp[i] = Math.min(dp[i - value] + 1, dp[i]);
    }
  }

  if(dp[amount] === amount + 1) {
    return -1;
  } else {
    return dp[amount];
  }
};