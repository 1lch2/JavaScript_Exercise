// 给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，
// 其中 answer[i] 是指在第 i 天之后，才会有更高的温度。
// 如果气温在这之后都不会升高，请在该位置用 0 来代替。

// 示例 1:
// 输入: temperatures = [73,74,75,71,69,72,76,73]
// 输出: [1,1,4,2,1,1,0,0]

// 示例 2:
// 输入: temperatures = [30,40,50,60]
// 输出: [1,1,1,0]

// 示例 3:
// 输入: temperatures = [30,60,90]
// 输出: [1,1,0]

// 提示：
// 1 <= temperatures.length <= 105
// 30 <= temperatures[i] <= 100

/**
 * 单调栈
 * 
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
  const LEN = temperatures.length;

  Array.prototype.peekTop = function() {
    if(this.length !== 0) {
      return this[this.length - 1];
    } else {
      return undefined;
    }
  };

  Array.prototype.isEmpty = function() {
    return this.length === 0;
  };

  // 单调栈
  let stack = [];
  let res = new Array(LEN).fill(0);

  for(let i = LEN - 1; i >= 0; i--) {
    // 仅当当前温度比记录最高温度更高时弹栈
    while(!stack.isEmpty() && temperatures[i] >= temperatures[stack.peekTop()]) {
      // 必须先弹栈，去掉当前栈顶记录的最高温度下标
      stack.pop();
    }
    
    // 记录当前下标到下标右侧第一个比它大的数字的距离
    res[i] = stack.isEmpty() ? 0 : stack.peekTop() - i;
    // 记录当前最高温的下标
    stack.push(i);
  }

  return res;
};