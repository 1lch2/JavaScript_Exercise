// 给你一个整数数组 nums，请你将该数组升序排列。

// 示例 1：
// 输入：nums = [5,2,3,1]
// 输出：[1,2,3,5]

// 示例 2：
// 输入：nums = [5,1,1,2,0,0]
// 输出：[0,0,1,1,2,5]

// 提示：
// 1 <= nums.length <= 5 * 104
// -5 * 104 <= nums[i] <= 5 * 104

/**
 * @param {number[]} nums
 * @return {number[]}
 */
var sortArray = function(nums) {
  if(nums.length < 2) {
    return nums;
  }

  const qsort = (low, high) => {
    if(low >= high) {
      return;
    }
    
    let i = low;
    let j = high;
    let base = nums[i];

    while(i < j) {
      while(base < nums[j] && i < j) {
        j--;
      }
  
      if(i < j) {
        nums[i] = nums[j];
        i++;
      }
  
      while(base > nums[i] && i < j) {
        i++;
      }
  
      if(i < j) {
        nums[j] = nums[i];
        j--;
      }
    }
    nums[i] = base;

    qsort(low, i - 1);
    qsort(i + 1, high);
  };

  qsort(0, nums.length - 1);
  return nums;
};

(function(){
  console.log(sortArray([2, 3, 10, 1, 21, 4, 7, 5, 9, 12, 0, 1, 1, 30, 8]));
})();