/**
 * 冒泡排序
 * 将输入数组按升序排列
 * @param {Number[]} numArr 待排序数组
 */
function bubbleSort(numArr) {
  let flag = true;
  let maxIndex = numArr.length - 1;
  while(flag) {
    flag = false;
    for(let i = 0; i < maxIndex; i++) {
      if(numArr[i] > numArr[i+1]) {
        [numArr[i], numArr[i+1]] = [numArr[i+1], numArr[i]];
        flag = true;
      }
    }
  }
  return numArr;
}

/**
 * 快速排序，递归版
 * @param {Number[]} numArr 待排序的数组
 * @param {Number} low 当前排序子数组的起始下标
 * @param {Number} high 当前排序子数组的结尾下标
 * @returns {null}
 */
function quickSortRecur(numArr, low, high) {
  // 两指针相交时结束递归
  if (low >= high) {
    return;
  }
  let i = low;
  let j = high;
  let base = numArr[i]; // 以左侧起始数字为枢轴
  while (i < j) {
    while (numArr[j] > base && i < j) {
      j--; // 从右往左扫描比枢轴小的数
    }
    // 若存在相同元素，则有可能会相交，需要保证i，j不同
    if (i < j) {
      numArr[i] = numArr[j];
      i++; 
    }

    while (numArr[i] < base && i < j) {
      i++; // 从左往右扫描比枢轴小的数
    }
    if (i < j) {
      numArr[j] = numArr[i];
      j--;
    }
  }
  numArr[i] = base;

  quickSortRecur(numArr, low, i-1); // 左侧递归
  quickSortRecur(numArr, i+1, high); // 右侧递归
}

/**
 * 堆排序
 * @param {Number[]} nums 无序数组
 * @returns {Number[]} 升序排列的数组
 */
function heapSort(nums) {
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

  for (let i = len - 1; i > 0; i--) {
    // 每次将一个找到的最大元素与末尾元素互换
    [nums[0], nums[i]] = [nums[i], nums[0]];
    // 调整大顶堆
    maxHeap(nums, i, 0);
  }
}


// 测试
(function() {
  // let testArr = [2, 3, 10, 1, 21, 4, 7, 5, 9, 12, 0, 1, 1, 30, 8];

  // console.log(">>> Original array: " + testArr);
  // console.log(">>> Bubble sort: " + bubbleSort(testArr.slice(0)));
  
  // let qsortArr = testArr.slice(0);
  // quickSortRecur(qsortArr, 0, qsortArr.length - 1);
  // console.log(">>> Quick sort: " + qsortArr);


  let testArr = [1,2,3];

  let heapsortArr = testArr.slice(0);
  heapSort(heapsortArr);
  console.log(">>> Heap sort: " + heapsortArr);
})();