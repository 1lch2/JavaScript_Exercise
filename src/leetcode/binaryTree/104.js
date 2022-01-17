// 给定一个二叉树，找出其最大深度。

// 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

// 说明: 叶子节点是指没有子节点的节点。

// 示例：
// 给定二叉树 [3,9,20,null,null,15,7]，

//     3
//    / \
//   9  20
//     /  \
//    15   7
// 返回它的最大深度 3 。

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
 * DFS遍历所有节点
 * 
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  if(root === null) {
    return 0;
  }

  // 目前最大深度
  let max = 1;

  const dfs = (root, level) => {
    if(root === null) {
      return;
    }
    // 每层递归不重用level避免重复增加
    let currentLevel = level
    currentLevel++;
    max = currentLevel > max ? currentLevel : max;
    dfs(root.left, currentLevel);
    dfs(root.right, currentLevel);
  }

  dfs(root, 0);
  return max;
};

/**
 * DFS思路递归
 * 
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
  const max = (root) => {
    if(root === null) {
      return 0;
    } else {
      // 当前节点的深度等于左右子树中最深的那个，再加自身节点的1高度
      let leftHeight = max(root.left);
      let rightHeight = max(root.right);
      return Math.max(leftHeight, rightHeight) + 1;
    }
  }

  return max(root);
}