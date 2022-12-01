// 给你二叉树的根节点 root 和一个表示目标和的整数 targetSum 。
// 判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。
// 如果存在，返回 true ；否则，返回 false 。

// 叶子节点 是指没有子节点的节点。

// 示例: 
// 给定如下二叉树，以及目标和 sum = 22，
//        5
//       / \
//      4   8
//     /   / \
//    11  13  4
//   /  \      \
//  7    2      1
// 返回 true, 因为存在目标和为 22 的根节点到叶子节点的路径 5->4->11->2。

// 示例 2：
// 输入：root = [1,2,3], targetSum = 5
// 输出：false

// 解释：树中存在两条根节点到叶子节点的路径：
// (1 --> 2): 和为 3
// (1 --> 3): 和为 4
// 不存在 sum = 5 的根节点到叶子节点的路径。

// 示例 3：
// 输入：root = [], targetSum = 0
// 输出：false
// 解释：由于树是空的，所以不存在根节点到叶子节点的路径。

// 提示：
// 树中节点的数目在范围 [0, 5000] 内
// -1000 <= Node.val <= 1000
// -1000 <= targetSum <= 1000

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
 * BFS记录到每个节点的路径和
 * 
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum) {
  if(root == null) {
    return false;
  }

  let queueNode = [root];
  let queueVal = [root.val];

  while(queueNode.length > 0) {
    let currentNode = queueNode.shift();
    let currentVal = queueVal.shift();

    // 到达叶子节点时，判断是否符合要求，否则继续循环
    if(currentNode.left === null && currentNode.right === null) {
      if(currentVal === targetSum) {
        // 当前节点符合要求
        return true;
      }
      continue;
    }

    // 推入节点
    if(currentNode.left !== null) {
      queueNode.push(currentNode.left);
      queueVal.push(currentVal + currentNode.left.val);
    }
    if(currentNode.right !== null) {
      queueNode.push(currentNode.right);
      queueVal.push(currentVal + currentNode.right.val);
    }
  }
  return false;
};