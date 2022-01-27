// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

// 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

// 示例 1:
// 输入: [3,2,1,5,6,4] 和 k = 2
// 输出: 5

// 示例 2:
// 输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
// 输出: 4

// 提示：
// 1 <= k <= nums.length <= 104
// -104 <= nums[i] <= 104

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
  /**
   * 建立大顶堆
   * 
   * 使用数组作为小顶堆的结构
   * @param {Number[]} seq 待建堆的数组
   * @param {Number} size 数组长度
   * @param {Number} i 根节点下标
   */
  const maxHeap = (seq, size, i) => {
    let largest = i; // 当前最大节点下标
    let l = 2 * i + 1; // 左节点下标
    let r = 2 * i + 2; // 右节点下标

    if(l < size && seq[l] > seq[largest]) {
      // 若左节点比当前最大节点更大，则将最大节点下标指向左节点
      largest = l;
    }
    if(r < size && seq[r] > seq[largest]) {
      // 若右节点比当前最大节点更大，则将最大节点下标指向右节点
      largest = r;
    }
    if(largest !== i) {
      // 若根节点不是最大节点的下标，则存在比父节点大的子节点
      // 将最大节点交换到根节点
      [seq[i], seq[largest]] = [seq[largest], seq[i]];
      // 递归检测调整后的大顶堆
      maxHeap(seq, size, largest);
    }
  };

  let len = nums.length;
  // 自底向上建立初始大顶堆
  for(let i = len - 1; i >= 0; i--) {
    maxHeap(nums, len, i);
  }

  for (let i = len - 1; i > len - k - 1; i--) {
    // 每次将堆顶元素换到最后
    [nums[0], nums[i]] = [nums[i], nums[0]];
    // 在少了一位的范围内继续调整
    maxHeap(nums, i, 0);
  }
  return nums[len - k];
};

(function(){
  let test = [1, 2, 3];
  console.log(findKthLargest(test, 3));
})();