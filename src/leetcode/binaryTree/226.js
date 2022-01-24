// 翻转一棵二叉树。

// 示例：

// 输入：
//      4
//    /   \
//   2     7
//  / \   / \
// 1   3 6   9

// 输出：
//      4
//    /   \
//   7     2
//  / \   / \
// 9   6 3   1

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
 * @return {TreeNode}
 */
var invertTree = function (root) {
  if(root == null) {
    return null;
  }

  const invert = (root) => {
    if(root === null) {
      return;
    }
    
    let left = root.left;
    let right = root.right;

    root.left = right;
    root.right = left;

    invert(root.left);
    invert(root.right);
  }
  
  invert(root);
  return root;
};
