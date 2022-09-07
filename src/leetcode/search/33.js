// 整数数组 nums 按升序排列，数组中的值 互不相同 。

// 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，
// 使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。
// 例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。

// 给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。

// 示例 1：
// 输入：nums = [4,5,6,7,0,1,2], target = 0
// 输出：4

// 示例 2：
// 输入：nums = [4,5,6,7,0,1,2], target = 3
// 输出：-1

// 示例 3：
// 输入：nums = [1], target = 0
// 输出：-1

// 提示：
// 1 <= nums.length <= 5000
// -10^4 <= nums[i] <= 10^4
// nums 中的每个值都 独一无二
// 题目数据保证 nums 在预先未知的某个下标上进行了旋转
// -10^4 <= target <= 10^4

// 进阶：你可以设计一个时间复杂度为 O(log n) 的解决方案吗？

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  let divide = -1;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i + 1] < nums[i]) {
      divide = i + 1;
    }
  }

  /**
   * 二分查找
   * @param {Number[]} nums 
   * @param {Number} target 
   */
  const binarySearch = (start, end, target) => {
    let low = start;
    let high = end;
    let res = -1;
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      if (nums[mid] === target) {
        res = mid;
        break;
      } else if (nums[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return res;
  };

  if (divide !== -1) {
    let leftRes = binarySearch(0, divide, target);
    let rightRes = binarySearch(divide, nums.length - 1, target);
    return leftRes !== -1 ? leftRes : rightRes;
  } else {
    return binarySearch(0, nums.length - 1, target);
  }
};

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var _search = function(nums, target) {
  const LEFT = nums[0];
  const RIGHT = nums[nums.length - 1];

  const binarySearch = (start, end) => {
    let low = start;
    let high = end;
    
    while(low <= high) {
      let mid = (low + high) >> 1;
      if(nums[mid] > target) {
        high = mid - 1;
      } else if(nums[mid] < target) {
        low = mid + 1;
      } else {
        return mid;
      }
    }
    return -1;
  };

  // 数组没有被切分后旋转
  if(LEFT < RIGHT) {
    return binarySearch(0, nums.length - 1);
  }

  // 二分查找定位旋转点
  let low = 0;
  let high = nums.length - 1;
  let rotateIndex = 0;
  while (low <= high) {
    let mid = (low + high) >> 1;
    if (nums[mid] > nums[mid + 1]) {
      rotateIndex = mid;
      break;
    }

    // mid 在左半边
    if (nums[mid] >= LEFT) {
      low = mid + 1;
    } 
    // mid 在右半边
    else if(nums[mid] <= RIGHT) {
      high = mid - 1;
    }
  }

  let midNum = nums[rotateIndex];
  if(midNum === target) {
    return rotateIndex;
  }

  if(target >= LEFT) {
    return binarySearch(0, rotateIndex);
  } else if(target <= RIGHT) {
    return binarySearch(rotateIndex + 1, nums.length - 1);
  } else {
    return -1;
  }
};


let inputs = [
  [[4,5,6,7,0,1,2], 0],
  [[4,5,6,7,0,1,2], 3],
  [[1], 0],
  [[1,3], 3],
  [[3,4,5,6,1,2] ,2]
];

for(let input of inputs) {
  console.log(_search(...input));
}

// 4
// -1
// -1
// 1
// 5