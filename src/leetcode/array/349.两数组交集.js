// 给定两个数组 nums1 和 nums2 ，返回 它们的交集 。输出结果中的每个元素一定是 唯一 的。我们可以 不考虑输出结果的顺序 。

// 示例 1：
// 输入：nums1 = [1,2,2,1], nums2 = [2,2]
// 输出：[2]

// 示例 2：
// 输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
// 输出：[9,4]
// 解释：[4,9] 也是可通过的

// 提示：
// 1 <= nums1.length, nums2.length <= 1000
// 0 <= nums1[i], nums2[i] <= 1000

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
  let set1 = new Set(nums1);
  let set2 = new Set(nums2);

  let res = [];
  for (let i of set1) {
    if (set2.has(i)) {
      res.push(i);
    }
  }
  return res;
};

// 另解
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
  if (nums1.length === 0 || nums2.length === 0) {
    return [];
  }

  // 保证 nums1 长度比 nums2 小
  if (nums1.length > nums2.length) {
    [nums1, nums2] = [nums2, nums1];
  }

  let arr2 = [...new Set(nums2)];
  let set1 = new Set(nums1);
  return arr2.filter(val => {
    return set1.has(val);
  });
};