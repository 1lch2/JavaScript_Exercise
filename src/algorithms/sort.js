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
      j -= 1; // 从右往左扫描比枢轴小的数
    }
    if (i < j) {
      [numArr[i], numArr[j]] = [numArr[j], numArr[i]];
      i += 1; 
    }

    while (numArr[i] < base && i < j) {
      i += 1; // 从左往右扫描比枢轴小的数
    }
    if (i < j) {
      [numArr[i], numArr[j]] = [numArr[j], numArr[i]];
    }
  }
  numArr[i] = base;

  quickSortRecur(numArr, low, i-1); // 左侧递归
  quickSortRecur(numArr, i+1, high); // 右侧递归
}


// 测试
(function() {
  let testArr = [2, 3, 10, 1, 21, 4, 7, 5, 9, 12, 0, 1, 1, 30, 8];
  console.log(">>> Original array: " + testArr);
  console.log(">>> Bubble sort: " + bubbleSort(testArr.slice(0)));
  
  let qsortArr = testArr.slice(0)
  quickSortRecur(qsortArr, 0, qsortArr.length - 1)
  console.log(">>> Quick sort: " + qsortArr);
})();