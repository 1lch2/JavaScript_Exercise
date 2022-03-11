/**
 * 全排列
 * @param {Number[]} nums 待排列元素（不重复）
 * @returns {Number[][]} 全排列结果
 */
const permutation = (nums) => {
  let res = [];

  /**
   * @param {Number[]} path path
   * @param {Number[]} candidates candidates
   */
  const backtrack = (path, candidates) => {
    if (candidates.length === 0) {
      res.push(path.slice(0));
      return;
    }

    for (let i = 0; i < candidates.length; i++) {
      let selected = candidates.splice(i, 1)[0];

      path.push(selected);
      backtrack(path, candidates);
      path.pop();
      candidates.splice(i, -1, selected);
    }
  };

  backtrack([], nums);
  return res;
};

/**
 * 含重复元素的全排列
 * 
 * @param {number[]} nums
 * @return {number[][]}
 */
const permuteUnique = function(nums) {
  let res = [];
  let used = new Array(nums.length).fill(false);
  nums.sort();

  /**
   * @param {Number[]} path path
   * @param {Number[]} candidates candidates
   * @param {Number[]} used
   */
  const backtrack = (path, candidates) => {
    if (path.length === candidates.length) {
      res.push(path.slice(0));
      return;
    }

    for (let i = 0; i < candidates.length; i++) {
      // 跳过同一元素
      if (!used[i]) {
        // 跳过前一次选择过的元素
        // 相邻重复元素，只有前一个元素选过了才能选择下一个重复元素
        if (i > 0 && candidates[i] === candidates[i - 1] && !used[i - 1]) {
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


(function() {
  let input1 = [0, 1, 2, 3];
  console.log(permutation(input1));

  let input2 = [1, 1, 2];
  console.log(permuteUnique(input2));
})();