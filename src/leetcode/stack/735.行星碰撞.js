// 给定一个整数数组 asteroids，表示在同一行的行星。

// 对于数组中的每一个元素，其绝对值表示行星的大小，
// 正负表示行星的移动方向（正表示向右移动，负表示向左移动）。每一颗行星以相同的速度移动。

// 找出碰撞后剩下的所有行星。
// 碰撞规则：两个行星相互碰撞，较小的行星会爆炸。
// 如果两颗行星大小相同，则两颗行星都会爆炸。
// 两颗移动方向相同的行星，永远不会发生碰撞。

// 示例 1：
// 输入：asteroids = [5,10,-5]
// 输出：[5,10]
// 解释：10 和 -5 碰撞后只剩下 10 。 5 和 10 永远不会发生碰撞。

// 示例 2：
// 输入：asteroids = [8,-8]
// 输出：[]
// 解释：8 和 -8 碰撞后，两者都发生爆炸。

// 示例 3：
// 输入：asteroids = [10,2,-5]
// 输出：[10]
// 解释：2 和 -5 发生碰撞后剩下 -5 。10 和 -5 发生碰撞后剩下 10 。

// 提示：
// 2 <= asteroids.length <= 104
// -1000 <= asteroids[i] <= 1000
// asteroids[i] != 0

/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
var asteroidCollision = function(asteroids) {
  let stack = [];
  for (let item of asteroids) {
    // 初始情况
    if (stack.length === 0) {
      stack.push(item);
      continue;
    }

    let currTop = stack[stack.length - 1];
    // 同号元素直接入栈
    if (currTop * item > 0) {
      stack.push(item);
      continue;
    }

    // 左负右正不会碰撞，直接入栈
    if (currTop < 0 && item > 0) {
      stack.push(item);
      continue;
    }

    // 不同号元素，绝对值相同，左正右负，直接弹栈
    if (currTop === -item && currTop > 0) {
      stack.pop();
      continue;
    }

    // 不同号元素，且新元素较大时，不断对比并弹栈顶元素
    while (currTop > 0 && item < 0 && currTop < -item) {
      stack.pop();
      if(stack.length !== 0) {
        currTop = stack[stack.length - 1];
      } else {
        break;
      }
    }

    // 栈已经弹空
    if(stack.length === 0) {
      stack.push(item);
      continue;
    }

    // 绝对值相同情况
    if(currTop > 0 && currTop === -item) {
      stack.pop();
      continue;
    }

    // 当栈顶和新元素同号时，停止弹栈，新元素入栈
    if (currTop * item > 0) {
      stack.push(item);
    }
  }

  return stack;
};

let inputs = [
  // [5, 10, -5],
  // [8, -8],
  // [10, 2, -5],
  // [-2, -1, 1, 2],
  // [-2,2,1,-2]
  [1,-2,-2,-2]
];

for (let input of inputs) {
  console.log(asteroidCollision(input));
}