// 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
// 百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，
// 满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

// 示例 1：
// 输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
// 输出：3
// 解释：节点 5 和节点 1 的最近公共祖先是节点 3 。

// 示例 2：
// 输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
// 输出：5
// 解释：节点 5 和节点 4 的最近公共祖先是节点 5 。因为根据定义最近公共祖先节点可以为节点本身。

// 示例 3：
// 输入：root = [1,2], p = 1, q = 2
// 输出：1

// 提示：
// 树中节点数目在范围 [2, 105] 内。
// -109 <= Node.val <= 109
// 所有 Node.val 互不相同 。
// p != q
// p 和 q 均存在于给定的二叉树中。

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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
  if (root === null || p === null || q === null) {
    return null;
  }

  /**
   * 自底向上找到当前子树中符合要求的祖先节点并返回
   * @param {TreeNode} root 当前子树根节点
   * @returns 符合要求的节点
   */
  const find = (root) => {
    // 当前遍历到p或q则返回,若进入了空节点则返回空
    if (root === p || root === q || root === null) {
      return root;
    }

    // DFS进入左右子树寻找符合条件的节点
    let left = find(root.left);
    let right = find(root.right);

    // 左右同时为空则返回空，代表不在当前子树中
    if (left === null && right === null) {
      return null;
    }

    // 左右不同时为空
    // 左空右不空，说明p，q均不在左子树中
    // 直接返回右
    if (left === null) {
      // 此时右可能是p或q，或两者的公共祖先
      return right;
    }

    // 右空左不空同理
    if (right === null) {
      return left;
    }

    // 左右均不为空则说明p，q位于当前子树的两侧
    if (left !== null && right !== null) {
      return root;
    }
  };

  return find(root);
};
