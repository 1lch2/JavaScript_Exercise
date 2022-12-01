// 给定一个二叉树，找出其最小深度。

// 最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

// 说明：叶子节点是指没有子节点的节点。

// 示例 1：
// 输入：root = [3,9,20,null,null,15,7]
// 输出：2

// 示例 2：
// 输入：root = [2,null,3,null,4,null,5,null,6]
// 输出：5

// 提示：
// 树中节点数的范围在 [0, 105] 内
// -1000 <= Node.val <= 1000

/**
 * Definition for a binary tree node.
 * @param {Number} val value
 * @param {TreeNode} left left sub-tree
 * @param {TreeNode} right right sub-tree
 */
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)
}

/**
 * BFS找到第一个叶子节点
 * 
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function(root) {
  if(root == null) {
    return null;
  }

  let queue = [[root, 1]];
  while(queue.length !== 0) {
    let temp = queue.shift();
    let current = temp[0];
    let depth = temp[1];
    if(current.left === null && current.right === null) {
      return depth;
    }

    // 将当前深度和节点引用一块压入队列，避免重复累加
    if(current.left != null) {
      queue.push([current.left, depth + 1]);
    }
    if(current.right != null) {
      queue.push([current.right, depth + 1]);
    }
  }
};