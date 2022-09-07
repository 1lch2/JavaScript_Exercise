/**
 * Binary search
 * @param {number[]} nums Number array in ascending order
 * @param {number} target Target number
 * @returns {number} Target index. If not found, return `-1`.
 */
function binarySearch(nums, target) {
  let low = 0;
  let high = nums.length - 1;
  while (low <= high) {
    // 防止数值溢出最大整数范围
    // (low + high) / 2 = low + (high - low) / 2
    let mid = low + ((high - low) >> 1);
    if (target < nums[mid]) {
      high = mid - 1;
    } else if (target > nums[mid]) {
      low = mid + 1;
    } else {
      return mid;
    }
  }

  return -1;
}


let inputs = [
  [[1, 2, 3, 4, 5, 6, 7, 8, 9], 3],
  [[0, 2, 4, 6, 8, 10], 3],
  [[1], 1],
  [[1], 0]
];

for (let input of inputs) {
  console.log(binarySearch(...input));
}

// 2
// -1
// 0
// -1