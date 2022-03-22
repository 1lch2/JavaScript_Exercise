/* eslint-disable no-constant-condition */
/**
 * 获取两数组合并后的第 k 小数
 * @param {Number[]} nums1 
 * @param {Number[]} nums2 
 * @param {Number} k
 */
function getMinKth(nums1, nums2, k) {
  const M = nums1.length;
  const N = nums2.length;

  // 两指针分别对应两个数组
  let index1 = 0;
  let index2 = 0;

  while(true) {
    // 下标抵达数组末尾
    if(index1 === M) {
      return nums2[index2 + k - 1];
    }
    if(index2 === N) {
      return nums1[index1 + k - 1];
    }

    // 当 k 为 1 时直接找两数组最小值
    if(k === 1) {
      return Math.min(nums1[index1], nums2[index2]);
    }

    // 指针偏移 (k/2)-1 距离
    let offset = Math.floor(k / 2) - 1;

    // 比较数组末尾和偏移后的下标，避免取到数组范围外
    let newIndex1 = Math.min(index1 + offset, M - 1);
    let newIndex2 = Math.min(index2 + offset, N - 1);

    if(nums1[newIndex1] < nums2[newIndex2]) {
      // 较小那一侧的数字不可能为第k小元素，排除 (k/2)-1 个数字
      // 排除后 k 相应减少对应数量
      k -= (newIndex1 - index1) + 1;

      // 指针重新定位到排除结果的后一位
      index1 = newIndex1 + 1;
    } else {
      k -= (newIndex2 - index2) + 1;
      index2 = newIndex2 + 1;
    }
  }
}
