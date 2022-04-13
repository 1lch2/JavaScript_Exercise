// 若一个数组中，任意相邻两个数中最大的与最小的之比小于等于 2 ，则称该数组为稠密数组。
// 如：[1, 2, 3, 5]

// 给定一个数组，返回使其成为稠密数组所需要插入的最少的数字的数量。

// 例1：nums: [4, 1, 3, 5]
// 返回：2
// 构造后的稠密数组：[4, 2, 1, 2, 3, 5]

/**
 * 稠密数组
 * @param {number[]} nums 
 */
function denseArray(nums) {
  if (nums == null || nums.length <= 1) {
    return 0;
  }

  const judge = (a, b) => {
    if (a > b) {
      [a, b] = [b, a];
    }

    return 2 * a >= b;
  };

  let intervals = [];
  for (let i = 0; i < nums.length - 1; i++) {
    if (!judge(nums[i], nums[i + 1])) {
      intervals.push([nums[i], nums[i + 1]]);
    }
  }

  if (intervals.length === 0) {
    return 0;
  }

  let res = 0;
  while (intervals.length !== 0) {
    let current = intervals.shift();

    let left = current[0];
    let right = current[1];

    if (left > right) {
      [left, right] = [right, left];
    }

    let temp = left;
    while (2 * temp < right) {
      temp = 2 * temp;
      res++;
    }
  }

  return res;
}

let input = [4, 2, 10, 1];
let input2 = [1, 3];
let input3 = [6, 1];
let input4 = [1, 4, 2];
let input6 = [1, 2, 3, 4, 3];
let input5 = [4, 31, 25, 50, 30, 20, 34, 46, 42, 16, 15, 16];


console.log(denseArray(input));
console.log(denseArray(input2));
console.log(denseArray(input3));
console.log(denseArray(input4));
console.log(denseArray(input6));
console.log(denseArray(input5));