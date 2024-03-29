// 给定一个二叉树，判断它是否是高度平衡的二叉树。

// 本题中，一棵高度平衡二叉树定义为：

// 一个二叉树每个节点的左右两个子树的高度差的绝对值不超过 1 。

// 示例 1：
// 输入：root = [3,9,20,null,null,15,7]
// 输出：true

// 示例 2：
// 输入：root = [1,2,2,3,3,null,null,4,4]
// 输出：false

// 示例 3：
// 输入：root = []
// 输出：true

// 提示：
// 树中的节点数在范围 [0, 5000] 内
// -104 <= Node.val <= 104

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
 * 自顶向下，计算高度并对比
 * 
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced = function(root) {
  const getHeight = (root) => {
    if (root == null) {
      return 0;
    }

    let leftHeight = getHeight(root.left);
    let rightHeight = getHeight(root.right);
    return Math.max(leftHeight, rightHeight) + 1;
  };

  const judge = (root) => {
    if (root == null) {
      return true;
    }

    let delta = Math.abs(getHeight(root.left) - getHeight(root.right));

    // 当前子树为平衡树当且仅当左右子树为平衡树且高度差小于等于1
    return delta <= 1 && judge(root.left) && judge(root.right);
  };

  return judge(root);
};

/**
 * 自底向上
 * 
 * https://leetcode-cn.com/problems/balanced-binary-tree/solution
 *        /balanced-binary-tree-di-gui-fang-fa-by-jin40789108/
 * 
 * @param {TreeNode} root
 * @return {boolean}
 */
var isBalanced_ = function(root) {
  const judge = (root) => {
    if (root == null) {
      return 0;
    }
    let left = judge(root.left);
    if (left === -1) {
      return -1;
    }

    let right = judge(root.right);
    if (right === -1) {
      return -1;
    }

    // 若为平衡树则返回高度，否则返回-1
    return Math.abs(left - right) <= 1 ? Math.max(left, right) + 1 : -1;
  };

  return judge(root) !== -1;
};

/**
 * 使用计算深度的思路，每层比较左右子树深度
 * 
 * @param {TreeNode} root
 * @return {boolean}
 */
var _isBalanced = function(root) {
  let flag = true;
  const dfs = (root) => {
    if (root == null) {
      return 0;
    }

    let left = dfs(root.left);
    let right = dfs(root.right);

    if (Math.abs(left - right) > 1) {
      flag = false;
    }
    return Math.max(left, right) + 1;
  };
  dfs(root);
  return flag;
};