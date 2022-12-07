// 输入一个整数数组，判断该数组是不是某二叉搜索树的后序遍历结果。
// 如果是则返回 true，否则返回 false。
// 假设输入的数组的任意两个数字都互不相同。

// 参考以下这颗二叉搜索树：

//      5
//     / \
//    2   6
//   / \
//  1   3

// 示例 1：
// 输入: [1,6,3,2,5]
// 输出: false

// 示例 2：
// 输入: [1,3,2,6,5]
// 输出: true

// 提示：
// 数组长度 <= 1000

/**
 * @param {number[]} postorder
 * @return {boolean}
 */
var verifyPostorder = function(postorder) {
  /**
   * 判断能否找到以根节点值为标准的分割点，使得左侧严格小于，右侧严格大于分割点
   * @param {number} start 区间起始端点
   * @param {number} end 区间中止端点
   * @returns {boolean} 是否构成BST
   */
  const divide = (start, end) => {
    // 区间长度小于等于 1，显然是BST
    if (start >= end) {
      return true;
    }

    // 后续遍历的根元素值显然是最后一个
    let rootVal = postorder[end];
    let leftEnd = start;

    // 定位找到左子树的区间右端点，会停在右子树的起始端点
    while(postorder[leftEnd] < rootVal) {
      leftEnd++;
    }

    let rightStart = leftEnd;
    // 从左子树右端点出发定位右子树的右端点，判断是否在根元素左侧
    while(postorder[rightStart] > rootVal) {
      rightStart++;
    }

    // 若当前子树为BST，则右子树的右端点应该在遍历后与根元素位置重合
    // 若当前子树为BST，则递归进入左右子树检验
    return (rightStart === end) && divide(start, leftEnd - 1) && divide(leftEnd, end - 1);
  }

  return divide(0, postorder.length - 1);
};

let inputs = [
  [1, 3, 2, 6, 5],
  [1, 6, 3, 2, 5],
  [4, 8, 6, 12, 16, 14, 10],
  [1, 2, 5, 10, 6, 9, 4, 3],
  [5, 4, 3, 2, 1]
];

for (let input of inputs) {
  console.log(verifyPostorder(input));
}
