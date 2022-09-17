// 给你一个二叉树的根节点 root ， 检查它是否轴对称。

// 示例 1：
// 输入：root = [1,2,2,3,4,4,3]
// 输出：true

// 示例 2：
// 输入：root = [1,2,2,null,3,null,3]
// 输出：false

// 提示：
// 树中节点数目在范围 [1, 1000] 内
// -100 <= Node.val <= 100

// 进阶：你可以运用递归和迭代两种方法解决这个问题吗？

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
 * 递归方法
 * 
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric_recur = function(root) {
  if (root === null) {
    return true;
  }

  // 只检查是否不对称，只要出现一个不对称则整个树不对称
  const dfs = (leftNode, rightNode) => {
    // 空节点必定相同
    if (leftNode === null && rightNode === null) {
      return true;
    }

    if (leftNode === null || rightNode === null) {
      return false;
    }

    if (leftNode.val !== rightNode.val) {
      return false;
    }

    // 对称进入递归
    return dfs(leftNode.left, rightNode.right) && dfs(leftNode.right, rightNode.left);
  };

  return dfs(root.left, root.right);
};

/**
 * 迭代方法
 */
var isSymmetric_loop = function(root) {
  if (root === null) {
    return true;
  }

  let flag = true;

  let leftStack = [root.left];
  let rightStack = [root.right];

  while (leftStack.length !== 0 && rightStack.length !== 0) {
    let currentLeft = leftStack.pop();
    let currentRight = rightStack.pop();

    if (currentLeft === null && currentRight === null) {
      continue;
    }

    if (currentLeft === null || currentRight === null) {
      flag = false;
      break;
    }

    if (currentLeft.val !== currentRight.val) {
      flag = false;
      break;
    }

    leftStack.push(currentLeft.left, currentLeft.right);
    rightStack.push(currentRight.right, currentRight.left);
  }

  return flag;
};