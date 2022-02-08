// 给定一个候选人编号的集合 candidates 和一个目标数 target ，找出 candidates 中所有可以使数字和为 target 的组合。

// candidates 中的每个数字在每个组合中只能使用 一次 。

// 注意：解集不能包含重复的组合。 

// 示例 1:
// 输入: candidates = [10,1,2,7,6,1,5], target = 8,
// 输出:
// [
// [1,1,6],
// [1,2,5],
// [1,7],
// [2,6]
// ]

// 示例 2:
// 输入: candidates = [2,5,2,1,2], target = 5,
// 输出:
// [
// [1,2,2],
// [5]
// ]

// 提示:
// 1 <= candidates.length <= 100
// 1 <= candidates[i] <= 50
// 1 <= target <= 30

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
  if(target < Math.min(candidates)) {
    return [];
  }

  let res = [];
  let used = new Array(candidates.length).fill(false);
  candidates.sort();

  Array.prototype.sum = function mySum() {
    return this.reduce((prev, curr) => prev + curr, 0);
  };

  Array.prototype.copy = function myCopy() {
    return this.slice(0);
  };

  /**
   * @param {Number[]} path path
   * @param {Number[]} candidates candidates
   */
  const backtrack = (path, candidates, used) => {
    if(path.sum() === target) {
      res.push(path.copy());
      return;
    }

    if(candidates.length === 0) {
      return;
    }

    if(path.sum() + Math.min(candidates) > target) {
      return;
    }

    for(let i = 0; i < candidates.length; i++) {
      if(used[i]) {
        continue;
      }

      // 跳过相邻且未被选过的重复元素
      if(i > 0 && candidates[i] === candidates[i - 1] && !used[i]) {
        continue;
      }

      if(path.sum() + candidates[i] > target) {
        continue;
      }

      path.push(candidates[i]);
      used[i] = true;
      // 下一层只使用当前元素之后的部分
      backtrack(path, candidates.slice(i+1), used.slice(i+1));
      path.pop();
      used[i] = false;
    }
  };

  backtrack([], candidates, used);
  return res;
};