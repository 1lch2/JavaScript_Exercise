// 给你一个整数数组 coins 表示不同面额的硬币，另给一个整数 amount 表示总金额。

// 请你计算并返回可以凑成总金额的硬币组合数。

// 如果任何硬币组合都无法凑出总金额，返回 0 。

// 假设每一种面额的硬币有无限个。

// 题目数据保证结果符合 32 位带符号整数。

// 示例 1：
// 输入：amount = 5, coins = [1, 2, 5]
// 输出：4
// 解释：有四种方式可以凑成总金额：
// 5=5
// 5=2+2+1
// 5=2+1+1+1
// 5=1+1+1+1+1

// 示例 2：
// 输入：amount = 3, coins = [2]
// 输出：0
// 解释：只用面额 2 的硬币不能凑成总金额 3 。

// 示例 3：
// 输入：amount = 10, coins = [10] 
// 输出：1

// 提示：
// 1 <= coins.length <= 300
// 1 <= coins[i] <= 5000
// coins 中的所有值 互不相同
// 0 <= amount <= 5000

/**
 * @copyright https://leetcode-cn.com/problems/coin-change-2/solution/
 *            ling-qian-dui-huan-iihe-pa-lou-ti-wen-ti-dao-di-yo/
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
var change = function(amount, coins) {
  if(amount === 0) {
    return 1;
  }

  // dp[i] 为凑出 i 块钱的组合数
  let dp = new Array(amount + 1).fill(0);
  // 起始情况
  dp[0] = 1;

  // 枚举硬币选项而不是金额选项
  // 若直接套用 322 代码，得到的是排列数而不是组合数
  for(let value of coins) {
    for(let i = 1; i <= amount; i++) {
      if(i < value) {
        // 剩余额度小于硬币面值时无法凑出
        continue;
      }
      // 不同面值能凑出来的组合数会累加
      dp[i] = dp[i - value] + dp[i];
    }
  }

  return dp[amount];
};
