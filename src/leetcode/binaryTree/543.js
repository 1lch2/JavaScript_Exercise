// 给定一棵二叉树，你需要计算它的直径长度。
// 一棵二叉树的直径长度是任意两个结点路径长度中的最大值。
// 这条路径可能穿过也可能不穿过根结点。

// 示例 :
// 给定二叉树
//       1
//      / \
//     2   3
//    / \     
//   4   5    
// 返回 3, 它的长度是路径 [4,2,1,3] 或者 [5,2,1,3]。

// 注意：两结点之间的路径长度是以它们之间边的数目表示。

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
var diameterOfBinaryTree = function(root) {
  if(root == null) {
    return 0;
  }

  let max = 1;

  /**
   * @param {TreeNode} root 
   * @returns {Number} 子树路径长度
   */
  const traverse = (root) => {
    // 空节点的路径长为 0 
    if(root == null) {
      return 0;
    }

    let left = traverse(root.left);
    let right = traverse(root.right);

    // 判断以当前根为中心的路径是否为最长路径
    max = Math.max(max, left + right + 1);

    // 向上只能返回一侧路径
    return Math.max(left, right) + 1;
  };

  traverse(root);

  // 直径不是节点数，是节点之间的路径段数
  return max - 1;
};
