// 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。
// 你只可以看到在滑动窗口内的 k 个数字。
// 滑动窗口每次只向右移动一位。

// 返回 滑动窗口中的最大值 。

// 示例 1：
// 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
// 输出：[3,3,5,5,6,7]
// 解释：
// 滑动窗口的位置                最大值
// ---------------               -----
// [1  3  -1] -3  5  3  6  7       3
//  1 [3  -1  -3] 5  3  6  7       3
//  1  3 [-1  -3  5] 3  6  7       5
//  1  3  -1 [-3  5  3] 6  7       5
//  1  3  -1  -3 [5  3  6] 7       6
//  1  3  -1  -3  5 [3  6  7]      7

// 示例 2：
// 输入：nums = [1], k = 1
// 输出：[1]

// 提示：
// 1 <= nums.length <= 10^5
// -10^4 <= nums[i] <= 10^4
// 1 <= k <= nums.length


/**
 * @copyright https://leetcode-cn.com/problems/sliding-window-maximum/solution/
 * dong-hua-yan-shi-dan-diao-dui-lie-239hua-hc5u/
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
  if (k === 1) {
    return nums;
  }

  Array.prototype.getLast = function() {
    return this[this.length - 1];
  };

  // 单调队列，存储对应元素的下标
  let queue = [];
  let res = [];
  for(let right = 0; right < nums.length; right++) {
    // 若当前待考察元素比队尾元素大且队列不为空，则移除队尾元素
    while(queue.length !== 0 && nums[right] >= nums[queue.getLast()]) {
      queue.pop();
    }

    // 将元素下标压入队列
    queue.push(right);

    // 窗口左边界下标
    let left = right - k + 1;
    // 当队首元素下标小于窗口左边界时，移除队首元素
    while(queue[0] < left) {
      queue.shift();
    }

    // 第一次遍历从下标 0 开始，当右边界到达 k - 1 时，窗口形成
    if(right >= k - 1) {
      res.push(nums[queue[0]]);
    }
  }
  return res;
};

(function() {
  console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));
})();