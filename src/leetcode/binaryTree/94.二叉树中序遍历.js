// 给定一个二叉树的根节点 root ，返回它的 中序 遍历。

// 示例 1：
// 输入：root = [1,null,2,3]
// 输出：[1,3,2]

// 示例 2：
// 输入：root = []
// 输出：[]

// 示例 3：
// 输入：root = [1]
// 输出：[1]

// 示例 4：
// 输入：root = [1,2]
// 输出：[2,1]

// 示例 5：
// 输入：root = [1,null,2]
// 输出：[1,2]
//  
// 提示：
// 树中节点数目在范围 [0, 100] 内
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
var inorderTraversal = function(root) {
  let res = [];
  if(root == null) {
    return res;
  }

  const inorder = (root) => {
    if(root == null) {
      return;
    }
    inorder(root.left);
    res.push(root.val);
    inorder(root.right);
  }

  inorder(root);
  return res;
};