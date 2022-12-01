// 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

// 你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

// 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。

// 示例 1：
// 输入：[7,1,5,3,6,4]
// 输出：5
// 解释：在第 2 天（股票价格 = 1）的时候买入，在第 5 天（股票价格 = 6）的时候卖出，最大利润 = 6-1 = 5 。
//      注意利润不能是 7-1 = 6, 因为卖出价格需要大于买入价格；同时，你不能在买入前卖出股票。

// 示例 2：
// 输入：prices = [7,6,4,3,1]
// 输出：0
// 解释：在这种情况下, 没有交易完成, 所以最大利润为 0。

// 提示：
// 1 <= prices.length <= 105
// 0 <= prices[i] <= 104

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
  let pureProfit = [0];
  // 将价格转换为每天相比前一天的差值
  // 再应用最大子序列和的方法
  for(let i = 1; i < prices.length; i++) {
    pureProfit.push(prices[i] - prices[i - 1]);
  }

  // 以 i 下标结束的子序列的最大和
  let dp = [pureProfit[0]];
  let maxVal = -Infinity;
  for(let i = 1; i < pureProfit.length; i++) {
    dp[i] = Math.max(dp[i - 1] + pureProfit[i], pureProfit[i]);
    maxVal = dp[i] > maxVal ? dp[i] : maxVal;
  }
  return maxVal > 0 ? maxVal : 0;
};

var _maxProfit = function(prices) {
  let pureProfit = [0];
  // 将价格转换为每天相比前一天的差值
  // 再应用最大子序列和的方法
  for(let i = 1; i < prices.length; i++) {
    pureProfit.push(prices[i] - prices[i - 1]);
  }

  // 以 i 下标结束的子序列的最大和

  // 优化：只需要保存dp[i]和dp[i-1]两个值，而不需要全部的dp数组
  let dp_i_1 = pureProfit[0];
  let dp_i = 0;
  let maxVal = -Infinity;
  for(let i = 1; i < pureProfit.length; i++) {
    dp_i = Math.max(dp_i_1 + pureProfit[i], pureProfit[i]);
    maxVal = dp_i > maxVal ? dp_i : maxVal;
    // 注意更新两个状态的值
    dp_i_1 = dp_i;
  }
  return maxVal > 0 ? maxVal : 0;
};

(function(){
  console.log(_maxProfit([7,1,5,3,6,4]));
  console.log(_maxProfit([7,6,4,3,1]));
})();