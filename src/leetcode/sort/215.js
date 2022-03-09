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
   * @param {Number} root 根节点下标
   */
  const maxHeap = (seq, size, root) => {
    let largest = root; // 当前最大节点下标
    let left = 2 * root + 1; // 左节点下标
    let right = 2 * root + 2; // 右节点下标

    if (left < size && seq[left] > seq[largest]) {
      // 若左节点比当前最大节点更大，则将最大节点下标指向左节点
      largest = left;
    }
    if (right < size && seq[right] > seq[largest]) {
      // 若右节点比当前最大节点更大，则将最大节点下标指向右节点
      largest = right;
    }
    if (largest !== root) {
      // 若根节点不是最大节点的下标，则存在比父节点大的子节点
      // 将最大节点交换到根节点
      [seq[root], seq[largest]] = [seq[largest], seq[root]];
      // 递归检测调整后的大顶堆
      maxHeap(seq, size, largest);
    }
  };

  const LENGTH = nums.length;
  // 自底向上建立初始大顶堆
  for (let i = LENGTH - 1; i >= 0; i--) {
    maxHeap(nums, LENGTH, i);
  }

  for (let i = LENGTH - 1; i > LENGTH - k - 1; i--) {
    // 每次将堆顶元素换到最后
    [nums[0], nums[i]] = [nums[i], nums[0]];
    // 在少了一位的范围内继续调整
    maxHeap(nums, i, 0);
  }
  return nums[LENGTH - k];
};

/**
 * 优先队列 - 小顶堆版
 */
class HeapPriorityQueue {

  constructor() {
    this.heap = [];
  }

  swapNodes(a, b) {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }

  shiftUp(index) {
    // 堆顶元素不需要调整
    if (index === 0) {
      return;
    }

    // 获取父节点下标
    let parentIndex = (index - 1) >> 1;
    if (this.heap[parentIndex] > this.heap[index]) {
      this.swapNodes(parentIndex, index);
      // 递归上移
      this.shiftUp(parentIndex);
    }
  }

  shiftDown(index) {
    // 获取左右子节点下标
    let leftIndex = index * 2 + 1;
    let rightIndex = index * 2 + 2;

    // 叶子节点无需下沉
    if (index === this.heap.length - 1) {
      return;
    }

    if (this.heap[leftIndex] < this.heap[index]) {
      this.swapNodes(leftIndex, index);
      this.shiftDown(leftIndex);
    }
    if (this.heap[rightIndex] < this.heap[index]) {
      this.swapNodes(rightIndex, index);
      this.shiftDown(rightIndex);
    }
  }

  insert(val) {
    this.heap.push(val);
    this.shiftUp(this.heap.length - 1);
  }

  pop() {
    // 将最后一个元素移除并替换到堆顶，再从堆顶下沉
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }

  getMin() {
    return this.heap[0];
  }
}

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest_new = function(nums, k) {
  let minHeap = new HeapPriorityQueue();
  for(let i = 0; i < nums.length; i++) {
    minHeap.insert(nums[i]);

    // 当元素数量大于 K 时开始去除最小的元素
    if(minHeap.heap.length > k) {
      minHeap.pop();
    }
  }
  return minHeap.getMin();
};


(function() {
  let test = [1, 2, 3];
  console.log(findKthLargest(test, 3));
})();