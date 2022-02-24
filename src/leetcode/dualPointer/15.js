// 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，
// 使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

// 注意：答案中不可以包含重复的三元组。

// 示例 1：
// 输入：nums = [-1,0,1,2,-1,-4]
// 输出：[[-1,-1,2],[-1,0,1]]

// 示例 2：
// 输入：nums = []
// 输出：[]

// 示例 3：
// 输入：nums = [0]
// 输出：[]

// 提示：
// 0 <= nums.length <= 3000
// -105 <= nums[i] <= 105

/**
 * @param {number[]} nums
 * @return {number[][]}
 * @copyright https://leetcode-cn.com/problems/3sum/solution/3sumpai-xu-shuang-zhi-zhen-yi-dong-by-jyd/
 */
var threeSum = function(nums) {
  if (nums == null || Math.min(nums) > 0 ||
    Math.max(nums) < 0 || nums.length < 3) {
    return [];
  }

  let res = [];
  nums.sort((a, b) => a - b);

  // 固定一个指针，令另外两个指针在其右侧
  // k < i < j
  let i = -1;
  let j = nums.length - 1;
  let tempSum;

  for (let k = 0; k < nums.length - 2; k++) {
    // 当nums[k] > 0时，i，j对应下标数字必定大于0，此时无解
    if (nums[k] > 0) {
      break;
    }

    // 跳过重复的 k 下标值
    if (k > 0 && nums[k] === nums[k - 1]) {
      continue;
    }

    // 每次重置i，j坐标
    i = k + 1;
    j = nums.length - 1;

    // i，j交替向中间靠近找到符合条件的数字
    while (i < j) {
      tempSum = nums[k] + nums[i] + nums[j];

      if (tempSum < 0) {
        i++;
        // 跳过重复
        while (i < j && nums[i] === nums[i - 1]) {
          i++;
        }
      } else if (tempSum > 0) {
        j--;
        // 跳过重复
        while (i < j && nums[j] === nums[j + 1]) {
          j--;
        }
      } else {
        // 找到候选时结束这一次寻找，移动 k 进入下一轮搜寻
        res.push([nums[k], nums[i], nums[j]]);
        i++;
        j--;
        // 跳过重复的匹配选项
        while (i < j && nums[j] === nums[j + 1]) {
          j--;
        }
        while (i < j && nums[i] === nums[i - 1]) {
          i++;
        }
      }
    }
  }

  return res;
};

(function() {
  console.log(threeSum([-1,0,1,2,-1,-4,-2,-3,3,0,4]));
})();