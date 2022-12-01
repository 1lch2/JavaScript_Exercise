// 给定一个包含非负整数的数组 nums ，
// 返回其中可以组成三角形三条边的三元组个数。

// 示例 1:
// 输入: nums = [2,2,3,4]
// 输出: 3
// 解释:有效的组合是: 
// 2,3,4 (使用第一个 2)
// 2,3,4 (使用第二个 2)
// 2,2,3

// 示例 2:
// 输入: nums = [4,2,3,4]
// 输出: 4

// 提示:
// 1 <= nums.length <= 1000
// 0 <= nums[i] <= 1000

/**
 * 三指针法
 * @param {number[]} nums
 * @return {number}
 */
var triangleNumber = function(nums) {
  const LEN = nums.length;
  if (LEN < 3) {
    return 0;
  }

  nums.sort((a, b) => a - b);

  let count = 0;
  // 最右侧指针
  for (let k = 2; k < LEN; k++) {
    // 前两个指针在 k 的左侧空间的起始和末尾
    // 在遍历中互相靠近
    let i = 0;
    let j = k - 1;

    while (i < j) {
      if (nums[i] + nums[j] > nums[k]) {
        // 若成立，则 i 左侧到 j 之间的数字全部都成立
        count += j - i;
        j--;
      } else {
        i++;
      }
    }
  }
  return count;
};

console.log(triangleNumber([2, 2, 3, 4]));
console.log(triangleNumber([4, 2, 3, 4]));