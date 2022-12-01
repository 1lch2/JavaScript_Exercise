// 给你一个二叉树的根节点 root ，树中每个节点都存放有一个 0 到 9 之间的数字。
// 每条从根节点到叶节点的路径都代表一个数字：

// 例如，从根节点到叶节点的路径 1 -> 2 -> 3 表示数字 123 。
// 计算从根节点到叶节点生成的 所有数字之和 。

// 叶节点 是指没有子节点的节点。

// 示例 1：
//   1
//  / \
// 2   3

// 输入：root = [1,2,3]
// 输出：25
// 解释：
// 从根到叶子节点路径 1->2 代表数字 12
// 从根到叶子节点路径 1->3 代表数字 13
// 因此，数字总和 = 12 + 13 = 25

// 示例 2：
//     4
//    / \
//   9   0
//  / \
// 5   1

// 输入：root = [4,9,0,5,1]
// 输出：1026
// 解释：
// 从根到叶子节点路径 4->9->5 代表数字 495
// 从根到叶子节点路径 4->9->1 代表数字 491
// 从根到叶子节点路径 4->0 代表数字 40
// 因此，数字总和 = 495 + 491 + 40 = 1026

// 提示：
// 树中节点的数目在范围 [1, 1000] 内
// 0 <= Node.val <= 9
// 树的深度不超过 10

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
var sumNumbers = function(root) {
  let res = [];

  Array.prototype.sum = function() {
    return this.reduce((prev, curr) => prev + curr, 0);
  };

  /**
   * 回溯思路
   * 
   * @param {TreeNode} root 
   * @param {Number} sum 
   */
  const dfs = (root, sum) => {
    if(root.left == null && root.right == null) {
      res.push(sum);
      return;
    }

    if(root.left != null) {
      dfs(root.left, sum * 10 + root.left.val);
    }
    if(root.right != null) {
      dfs(root.right, sum * 10 + root.right.val);
    }
  };

  dfs(root, root.val);
  return res.sum();
};

(function(){
  let root = new TreeNode(1);
  root.left = new TreeNode(2);
  root.right = new TreeNode(3);

  console.log(sumNumbers(root));
})();