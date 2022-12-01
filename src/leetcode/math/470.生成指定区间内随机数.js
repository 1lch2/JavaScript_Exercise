// 给定方法 rand7 可生成 [1,7] 范围内的均匀随机整数，
// 试写一个方法 rand10 生成 [1,10] 范围内的均匀随机整数。

// 你只能调用 rand7() 且不能调用其他方法。
// 请不要使用系统的 Math.random() 方法。

// 每个测试用例将有一个内部参数 n，即你实现的函数 rand10() 在测试时将被调用的次数。
// 请注意，这不是传递给 rand10() 的参数。

// 示例 1:
// 输入: 1
// 输出: [2]

// 示例 2:
// 输入: 2
// 输出: [2,8]

// 示例 3:
// 输入: 3
// 输出: [3,8,10]

// 提示:
// 1 <= n <= 105

// 进阶:
// rand7()调用次数的 期望值 是多少 ?
// 你能否尽量少调用 rand7() ?

/**
 * @returns {Number}
 */
var rand7 = function() {
  // defined function
};

/**
 * The rand7() API is already defined for you.
 * var rand7 = function() {}
 * @return {number} a random integer in the range 1 to 7
 */
var rand10 = function() {
  // 核心思路：(randX() - 1) * Y + randY() 可以等概率的生成[1, X * Y]范围的随机数
  // Credit: https://leetcode-cn.com/problems/implement-rand10-using-rand7/solution/
  // xiang-xi-si-lu-ji-you-hua-si-lu-fen-xi-zhu-xing-ji/

  // 首先得到一个数
  let num = (rand7() - 1) * 7 + rand7();
  // 只要大于40，不断生成
  while (num > 40) {
    num = (rand7() - 1) * 7 + rand7();
  }

  // 返回结果，+1 是为了解决 40 % 10为 0 的情况
  return 1 + num % 10;
};