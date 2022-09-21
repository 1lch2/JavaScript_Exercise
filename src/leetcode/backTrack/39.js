// 给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，
// 找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，并以列表形式返回。
// 你可以按 任意顺序 返回这些组合。

// candidates 中的 同一个 数字可以 无限制重复被选取 。如果至少一个数字的被选数量不同，则两种组合是不同的。 

// 对于给定的输入，保证和为 target 的不同组合数少于 150 个。

// 示例 1：
// 输入：candidates = [2,3,6,7], target = 7
// 输出：[[2,2,3],[7]]

// 解释：
// 2 和 3 可以形成一组候选，2 + 2 + 3 = 7 。注意 2 可以使用多次。
// 7 也是一个候选， 7 = 7 。
// 仅有这两种组合。

// 示例 2：
// 输入: candidates = [2,3,5], target = 8
// 输出: [[2,2,2,2],[2,3,3],[3,5]]

// 示例 3：
// 输入: candidates = [2], target = 1
// 输出: []

// 提示：
// 1 <= candidates.length <= 30
// 1 <= candidates[i] <= 200
// candidate 中的每个元素都 互不相同
// 1 <= target <= 500

/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {
  if (target < Math.min(...candidates)) {
    return [];
  }

  Array.prototype.sum = function() {
    return this.reduce((prev, curr) => prev + curr, 0);
  };

  // 保证候选数组有序
  candidates.sort((a, b) => a - b);
  let result =[];

  /**
   * 回溯
   * @param {number[]} path 已选择的数组
   * @param {number} index 待选部分的起始下标
   */
  const backtrack = (path, index) => {
    // 找到符合要求的数组
    if (path.sum() === target) {
      result.push(path.slice(0));
      return;
    }

    // 备选为空
    if (index >= candidates.length) {
      return;
    }

    // 递归进入下一层
    for (let i = index; i < candidates.length; i++) {
      let item = candidates[i];
      // 跳过不符合要求的候选
      if (item + path.sum() > target) {
        continue;
      }
      path.push(item);
      backtrack(path, i); // 因为可以重复选，所以还是从当前下标开始
      path.pop();
    }
  };

  backtrack([], 0);
  return result;
};