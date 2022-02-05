// 给你一个整数数组 nums ，其中可能包含重复元素，请你返回该数组所有可能的子集（幂集）。

// 解集 不能 包含重复的子集。返回的解集中，子集可以按 任意顺序 排列。

// 示例 1：
// 输入：nums = [1,2,2]
// 输出：[[],[1],[1,2],[1,2,2],[2],[2,2]]

// 示例 2：
// 输入：nums = [0]
// 输出：[[],[0]]

// 提示：
// 1 <= nums.length <= 10
// -10 <= nums[i] <= 10

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function(nums) {
  let res = [];
  let len = nums.length;
  
  // 保证元素有序排列
  nums.sort();

  const backtrack = (index, path) => {
    res.push(path.slice());
    for(let i = index; i < len; i++) {
      // 检查是否和前一个元素重复
      if(i > index && nums[i] === nums[i-1]) {
        continue;
      }
      path.push(nums[i]);
      backtrack(i+1, path); // 递归进入下一层
      path.pop(); // 撤销本次选择
    }
  };
  backtrack(0, []);
  return res;
};