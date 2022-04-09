// 给你一个整数数组 nums ，设计算法来打乱一个没有重复元素的数组。
// 打乱后，数组的所有排列应该是 等可能 的。

// 实现 Solution class:

// Solution(int[] nums) 使用整数数组 nums 初始化对象
// int[] reset() 重设数组到它的初始状态并返回
// int[] shuffle() 返回数组随机打乱后的结果

// 示例 1：
// 输入
// ["Solution", "shuffle", "reset", "shuffle"]
// [[[1, 2, 3]], [], [], []]
// 输出
// [null, [3, 1, 2], [1, 2, 3], [1, 3, 2]]

// 解释
// Solution solution = new Solution([1, 2, 3]);
// solution.shuffle();    // 打乱数组 [1,2,3] 并返回结果。任何 [1,2,3]的排列返回的概率应该相同。例如，返回 [3, 1, 2]
// solution.reset();      // 重设数组到它的初始状态 [1, 2, 3] 。返回 [1, 2, 3]
// solution.shuffle();    // 随机返回数组 [1, 2, 3] 打乱后的结果。例如，返回 [1, 3, 2]

// 提示：
// 1 <= nums.length <= 200
// -106 <= nums[i] <= 106
// nums 中的所有元素都是 唯一的
// 最多可以调用 5 * 104 次 reset 和 shuffle

/**
 * @param {number[]} nums
 */
var Solution = function(nums) {
  this.initNum = nums;
};

/**
 * @return {number[]}
 */
Solution.prototype.reset = function() {
  return this.initNum;
};

/**
 * @return {number[]}
 */
Solution.prototype.shuffle = function() {
  /**
   * @param {Number} min 
   * @param {Number} max 
   * @returns {Number}
   */
  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /**
   * swap numbers with given index
   * @param {Number} first 
   * @param {Number} second 
   */
  const swap = (arr, first, second) => {
    [arr[first], arr[second]] = [arr[second], arr[first]];
  };
  
  let res = this.initNum.slice(0);
  let range = this.initNum.length;
  let randomIndex;

  for(let i = 0; i < range; i++) {
    randomIndex = getRandomInt(i, range);
    swap(res, randomIndex, i);
  }
  return res;
};

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(nums)
 * var param_1 = obj.reset()
 * var param_2 = obj.shuffle()
 */
