// 路径 被定义为一条从树中任意节点出发，沿父节点-子节点连接，达到任意节点的序列。
// 同一个节点在一条路径序列中 至多出现一次 。
// 该路径 至少包含一个 节点，且不一定经过根节点。

// 路径和 是路径中各节点值的总和。

// 给你一个二叉树的根节点 root ，返回其 最大路径和 。

// 示例 1：
//     1
//    / \
//   2   3
// 输入：root = [1,2,3]
// 输出：6
// 解释：最优路径是 2 -> 1 -> 3 ，路径和为 2 + 1 + 3 = 6

// 示例 2：
//    -10
//    /  \
//   9   20
//      /  \
//     15   7
// 输入：root = [-10,9,20,null,null,15,7]
// 输出：42
// 解释：最优路径是 15 -> 20 -> 7 ，路径和为 15 + 20 + 7 = 42

// 提示：
// 树中节点数目范围是 [1, 3 * 10^4]
// -1000 <= Node.val <= 1000

/**
 * Definition for a binary tree node.
 * @param {Number} val value
 * @param {TreeNode} left left sub-tree
 * @param {TreeNode} right right sub-tree
 */
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

/**
 * @param {TreeNode} root
 * @return {number}
 */
var maxPathSum = function(root) {
  let maxSum = -Infinity;

  /**
   * 计算当前子树收益
   * @param {TreeNode} root 当前子树根节点
   * @returns {Number} 当前节点的最大收益值
   */
  const maxGain = (root) => {
    // 空节点收益为 0
    if(root == null) {
      return 0;
    }

    // 仅当贡献值大于 0 时才考虑选取子节点
    let left = Math.max(maxGain(root.left), 0);
    let right = Math.max(maxGain(root.right), 0);

    // 当前子树路径的总收益
    // 此时计算的是在子树内折返的路径收益
    let totalGain = root.val + left + right;
    maxSum = Math.max(maxSum, totalGain);

    // 返回当前节点的最大收益（必须包含当前节点）
    // 左右节点只能选其一，因为如果上一层选择了当前节点，则路径必然只能包含左右节点之一
    return root.val + Math.max(left, right);
  };
  
  maxGain(root);
  return maxSum;
};