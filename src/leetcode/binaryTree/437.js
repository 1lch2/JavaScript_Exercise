// 给定一个二叉树的根节点 root ，和一个整数 targetSum ，
// 求该二叉树里节点值之和等于 targetSum 的 路径 的数目。

// 路径 不需要从根节点开始，也不需要在叶子节点结束，
// 但是路径方向必须是向下的（只能从父节点到子节点）。

// 示例 1：
// 输入：root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8
// 输出：3
// 解释：和等于 8 的路径有 3 条，如图所示。

// 示例 2：
// 输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
// 输出：3

// 提示:
// 二叉树的节点个数的范围是 [0,1000]
// -109 <= Node.val <= 109 
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
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function(root, targetSum) {
  // 将每个路径看作以某颗子树为的根为起点的路径
  // 对每个子树做一次DFS遍历

  if(root == null) {
    return 0;
  }

  let result = 0;
  const dfs = (root, currentSum) => {
    if(root == null) {
      return;
    }
    if(currentSum + root.val === targetSum) {
      result++;
    }

    dfs(root.left, currentSum + root.val);
    dfs(root.right, currentSum + root.val);
  };

  const traverse = (root) => {
    if(root == null) {
      return;
    }

    dfs(root, 0);

    traverse(root.left);
    traverse(root.right);
  };

  traverse(root);

  return result;
};

let root = new TreeNode(10);
root.left = new TreeNode(5);
root.right = new TreeNode(-3);

root.left.left = new TreeNode(3);
root.left.right = new TreeNode(2);
root.right.right = new TreeNode(11);

root.left.left.left = new TreeNode(3);
root.left.left.right = new TreeNode(-2);
root.left.right.right = new TreeNode(1);

console.log(pathSum(root, 8));