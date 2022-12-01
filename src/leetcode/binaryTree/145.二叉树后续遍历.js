// 给你一棵二叉树的根节点 root ，返回其节点值的 后序遍历 。

// 示例 1：
// 输入：root = [1,null,2,3]
// 输出：[3,2,1]

// 示例 2：
// 输入：root = []
// 输出：[]

// 示例 3：
// 输入：root = [1]
// 输出：[1]

// 提示：
// 树中节点的数目在范围 [0, 100] 内
// -100 <= Node.val <= 100

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
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
  let res = [];

  const traverse = (root) => {
    if(root == null) {
      return;
    }
    traverse(root.left);
    traverse(root.right);
    res.push(root.val);
  }

  traverse(root);
  return res;
};