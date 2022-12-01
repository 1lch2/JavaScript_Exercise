// 给你一个整数数组 nums 和一个整数 k ，
// 请你返回其中出现频率前 k 高的元素。
// 你可以按 任意顺序 返回答案。

// 示例 1:
// 输入: nums = [1,1,1,2,2,3], k = 2
// 输出: [1,2]

// 示例 2:
// 输入: nums = [1], k = 1
// 输出: [1]

// 提示：
// 1 <= nums.length <= 105
// k 的取值范围是 [1, 数组中不相同的元素的个数]
// 题目数据保证答案唯一，换句话说，数组中前 k 个高频元素的集合是唯一的

// 进阶：你所设计算法的时间复杂度 必须 优于 O(n log n) ，其中 n 是数组大小。

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
  if (nums.length === 1) {
    return [nums[0]];
  }

  let map = new Map();
  // 将数字和频次的映射存储到map中
  nums.forEach((val) => {
    let current = map.get(val);
    if (current === undefined) {
      map.set(val, 1);
    } else {
      map.set(val, current + 1);
    }
  });

  let keys = Array.from(new Set(nums));

  /**
   * @param {Number[]} nums 
   */
  const qsort = (nums) => {
    let stack = [[0, nums.length - 1]];

    while (stack.length > 0) {
      let current = stack.pop();
      let low = current[0];
      let high = current[1];

      if(low >= high) {
        continue;
      }

      let base = nums[low];

      let i = low;
      let j = high;
      while (i < j) {
        while (i < j && map.get(nums[j]) < map.get(base)) {
          j--;
        }
        if (i < j) {
          nums[i] = nums[j];
          i++;
        }

        while (i < j && map.get(nums[i]) > map.get(base)) {
          i++;
        }
        if (i < j) {
          nums[j] = nums[i];
          j--;
        }
      }
      nums[i] = base;

      stack.push([low, i - 1]);
      stack.push([i + 1, high]);
    }
  };

  qsort(keys);
  return keys.slice(0, k);
};

let input = [1,1,1,2,2,3,4,4,4,4];
console.log(topKFrequent(input, 2));