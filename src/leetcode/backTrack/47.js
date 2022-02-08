// 给定一个可包含重复数字的序列 nums ，按任意顺序 返回所有不重复的全排列。

// 示例 1：
// 输入：nums = [1,1,2]
// 输出：
// [[1,1,2],
//  [1,2,1],
//  [2,1,1]]

// 示例 2：
// 输入：nums = [1,2,3]
// 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]

// 提示：
// 1 <= nums.length <= 8
// -10 <= nums[i] <= 10

/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permuteUnique = function(nums) {
  let res = [];
  let used = new Array(nums.length).fill(false);
  nums.sort();
  
  /**
   * @param {Number[]} path path
   * @param {Number[]} candidates candidates
   * @param {Number[]} used
   */
  const backtrack = (path, candidates) => {
    if(path.length === candidates.length) {
      res.push(path.slice(0));
      return;
    }

    for(let i = 0; i < candidates.length; i++) {
      // 跳过同一元素
      if(!used[i]) {
        // 跳过前一次选择过的元素
        // 相邻重复元素，只有前一个元素选过了才能选择下一个重复元素
        if(i > 0 && candidates[i] === candidates[i - 1] && !used[i - 1]) {
          continue;
        }

        path.push(candidates[i]);
        used[i] = true;
        backtrack(path, candidates);
        path.pop();
        used[i] = false;
      }
    }
  };

  backtrack([], nums);
  return res;
};

(function(){
  let input = [1, 1, 2];
  console.log(permuteUnique(input));
})();