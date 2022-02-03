// 给你两个整数数组 nums1 和 nums2 ，请你以数组形式返回两数组的交集。
// 返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。
// 可以不考虑输出结果的顺序。

// 示例 1：
// 输入：nums1 = [1,2,2,1], nums2 = [2,2]
// 输出：[2,2]

// 示例 2:
// 输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
// 输出：[4,9]

// 提示：
// 1 <= nums1.length, nums2.length <= 1000
// 0 <= nums1[i], nums2[i] <= 1000

// 进阶：
// 如果给定的数组已经排好序呢？你将如何优化你的算法？
// 如果 nums1 的大小比 nums2 小，哪种方法更优？
// 如果 nums2 的元素存储在磁盘上，内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
  /**
   * 统计每个元素出现次数并存入一个map
   * @param {Number[]} arr 待计数数组
   * @returns {Map<Number, Number>} map
   */
  const counter = (arr) => {
    let map = new Map();
    for (let i of arr) {
      if (!map.has(i)) {
        map.set(i, 1);
      } else {
        map.set(i, map.get(i) + 1);
      }
    }
    return map;
  };

  // 键为元素，值为该元素出现次数
  let map1 = counter(nums1);
  let map2 = counter(nums2);

  // 将较小的map换到第一个
  if(map1.size > map2.size) {
    [map1, map2] = [map2, map1];
  }

  let res = [];
  for(let i of map1.keys()) {
    if(i !== undefined && map2.has(i)) {
      // 取数量和元素的交集
      let num = Math.min(map1.get(i), map2.get(i));
      res = res.concat(Array(num).fill(i));
    }
  }
  return res;
};

(function(){
  intersect([1, 2, 2, 1], [2, 2]);
})();