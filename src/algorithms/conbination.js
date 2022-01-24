/**
 * 返回所有组合（子集）
 * 
 * @param {Number[]} nums 元素数组，不含重复元素
 * @returns {Number[][]} 全组合
 */
const conbinationBit = (nums) => {
  let len = nums.length;
  let iterMax = 1 << len; // 子集元素数量为数组长度的平方
  let res = [];

  for (let i = 0; i < iterMax; i++) {
    let temp = [];
    for (let j = 0; j < len; j++) {
      if ((1 << j) & i) {
        // 按位与来判断是否加入对应位的元素
        temp.push(nums[j]);
      }
    }
    res.push(temp)
  }
  return res;
};

/**
 * 返回所有组合（子集）
 * 
 * Credit: https://leetcode-cn.com/problems/subsets/solution
 * /shou-hua-tu-jie-zi-ji-hui-su-fa-xiang-jie-wei-yun-/
 * 
 * @param {Number[]} nums 元素数组
 * @returns {Number[][]} 全组合
 */
const conbinationBackTrack = (nums) => {
  let res = [];

  /**
   * 回溯
   * @param {Number} index 待选择元素的下标
   * @param {Number[]} list 当前结果
   */
  const backtrack = (index, list) => {
    res.push(list.slice()); // 复制一份list对象

    // 当下标越过数组长度时结束递归
    for(let i = index; i < nums.length; i++) {
      list.push(nums[i]);
      backtrack(i+1, list); // 递归进入下一层
      list.pop(); // 撤销当前选择
    }
  }
  backtrack(0, [])
  return res;
}

/**
 * 全组合（子集）
 * @param {Number[]} nums 待组合元素，可包含重复
 * @returns {Number[][]} 全组合
 */
const combinationRepeatable = (nums) => {
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
  }
  backtrack(0, [])
  return res;
}

export default {conbinationBit, conbinationBackTrack}
