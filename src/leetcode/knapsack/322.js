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
// 1 <= coins[i] <= 2^31 - 1
// 0 <= amount <= 10^4

/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
  if (amount === 0) {
    return 0;
  }

  if (Math.min(...coins) > amount) {
    return -1;
  }

  // dp[i] 代表凑出 i 需要的最少硬币数量
  // 因为硬币最小面值为 1 ，最多硬币数为 amount，初始化值为 amount + 1 代表无穷大
  // 初始化大小 amount + 1 是因为要取到下标等于 amount 的数
  let dp = new Array(amount + 1).fill(amount + 1);
  // 初始情况：0 块钱需要 0 枚硬币，
  dp[0] = 0;

  for (let i = 0; i < dp.length; i++) {
    for (let value of coins) {
      if (i - value < 0) {
        // 无解情况
        continue;
      }

      // 凑 i 块钱需要的最小硬币数等于凑 i 减硬币面值的钱所需硬币数再加一枚硬币
      // 与自身的初始值比较来判断是否可以凑出
      dp[i] = Math.min(dp[i - value] + 1, dp[i]);
    }
  }

  if (dp[amount] === amount + 1) {
    return -1;
  } else {
    return dp[amount];
  }
};

/**
 * BFS 思路
 * 
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var _coinChange = function(coins, amount) {
  // 注意先判断 amount 为 0 情况 ，不然会返回 -1
  if (amount === 0) {
    return 0;
  }

  if (amount < Math.min(...coins)) {
    return -1;
  }

  // 当前余额队列
  let balance = [amount];

  // 降序排列，更早找到结果
  coins.sort((a, b) => b - a);

  let step = 0;

  // 记录已经访问过的数字，避免重复计算
  // 下标对应值
  let visited = new Array(amount + 1).fill(false);
  visited[amount] = true;
  while (balance.length !== 0) {
    // 二叉树层序遍历分层输出思路
    let len = balance.length;
    for (let i = 0; i < len; i++) {
      let current = balance.shift();

      // 每个余额和每个硬币选项都要遍历
      for (let coin of coins) {
        let tempVal = current - coin;
        // 跳过无法继续减硬币面额的选项
        if (tempVal < 0) {
          continue;
        }
        // 找到第一个结果返回
        if (tempVal === 0) {
          return step + 1;
        }

        // 先前出现过的数字不访问直接跳过
        // 因为之前已经出现过，且每次硬币都可重用，因此必定是前一次的步数更小
        if(!visited[tempVal]) {
          balance.push(tempVal);
          visited[tempVal] = true;
        }
      }
    }
    step++;
  }
  return -1;
};

let input = [[1, 2, 5], 100];
console.log(_coinChange(...input));