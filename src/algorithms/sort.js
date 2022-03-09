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
 * 快排迭代版，原地修改数组
 * 
 * @param {Number[]} nums 
 */
function quickSortStack(nums) {
  // 存储排序区间下标的栈
  let stack = [[0, nums.length - 1]];

  while(stack.length !== 0) {
    let current = stack.pop();
    let low = current[0];
    let high = current[1];

    let base = nums[low];

    // 区间大小为1，直接跳过本地循环
    if(low >= high) {
      continue;
    }

    let i = low;
    let j = high;
    while(i < j) {
      while(i < j && nums[j] > base) {
        j--;
      }
      if(i < j) {
        nums[i] = nums[j];
        i++;
      }

      while(i < j && nums[i] < base) {
        i++;
      }
      if(i < j) {
        nums[j] = nums[i];
        j--;
      }
    }
    nums[i] = base;

    // 将子区间压入栈
    stack.push([low, i - 1]);
    stack.push([i + 1, high]);
  }
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


/**
 * 并归排序
 * @param {Number[]} nums 待排序数组
 * @returns {Number[]}
 */
function mergeSort(nums) {
  
  /**
   * 合并两个有序列表
   * @param {Number[]} list1 
   * @param {Number[]} list2 
   * @returns {Number[]}
   */
  const merge = (list1, list2) => {
    let res = [];
    // 两个列表的下标
    let i = 0;
    let j = 0;

    while(i < list1.length && j < list2.length) {
      if(list1[i] < list2[j]) {
        res.push(list1[i]);
        i++;
      } else {
        res.push(list2[j]);
        j++;
      }
    }

    if(i === list1.length) {
      res = res.concat(list2.slice(j));
    } else {
      res = res.concat(list1.slice(i));
    }
    return res;
  };

  /**
   * 
   * @param {Number[]} nums 
   * @returns {Number[]}
   */
  const divide = (nums) => {
    if(nums.length <= 1) {
      return nums;
    }
    
    let mid = Math.floor(nums.length / 2);
    let left = divide(nums.slice(0, mid));
    let right = divide(nums.slice(mid));
  
    return merge(left, right);
  };

  return divide(nums);
}


// 测试
(function() {
  let testArr = [2, 3, 10, 1, 21, 4, 7, 5, 9, 12, 0, 1, 1, 30, 8];
  console.log(">>> Original array: " + testArr);

  // console.log(">>> Bubble sort: " + bubbleSort(testArr.slice(0)));
  
  let qsortArr = testArr.slice(0);
  // quickSortRecur(qsortArr, 0, qsortArr.length - 1);
  quickSortStack(qsortArr);
  console.log(">>> Quick sort: " + qsortArr);

  let heapsortArr = testArr.slice(0);
  heapSort(heapsortArr);
  console.log(">>> Heap sort: " + heapsortArr);

  let mergeSortArr = mergeSort(testArr.slice(0));
  console.log(">>> Merge sort: " + mergeSortArr);
})();