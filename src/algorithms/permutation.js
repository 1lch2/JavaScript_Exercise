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

(function(){
  let input = [0, 1, 2, 3];
  console.log(permutation(input));
})();