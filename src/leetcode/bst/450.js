// 给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的 key 对应的节点，并保证二叉搜索树的性质不变。
// 返回二叉搜索树（有可能被更新）的根节点的引用。

// 一般来说，删除节点可分为两个步骤：

// 首先找到需要删除的节点；
// 如果找到了，删除它。

// 示例 1:
//     5
//    / \
//   3   6
//  / \   \
// 2   4   7
// 输入：root = [5,3,6,2,4,null,7], key = 3
// 输出：[5,4,6,2,null,null,7]
// 解释：给定需要删除的节点值是 3，所以我们首先找到 3 这个节点，然后删除它。
// 一个正确的答案是 [5,4,6,2,null,null,7], 如下图所示。
// 另一个正确答案是 [5,2,6,null,4,null,7]。

// 示例 2:
// 输入: root = [5,3,6,2,4,null,7], key = 0
// 输出: [5,3,6,2,4,null,7]
// 解释: 二叉树不包含值为 0 的节点

// 示例 3:
// 输入: root = [], key = 0
// 输出: []

// 提示:
// 节点数的范围 [0, 104].
// -105 <= Node.val <= 105
// 节点值唯一
// root 是合法的二叉搜索树
// -105 <= key <= 105

// 进阶： 要求算法时间复杂度为 O(h)，h 为树的高度。

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
 * 返回删除节点后的根节点
 * 
 * @param {TreeNode} root
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function(root, key) {
  if(root == null) {
    return null;
  }

  if(root.val < key) {
    // 递归进入右子树，调整后的根节点链接到右子树
    root.right = deleteNode(root.right, key);
  } else if(root.val > key) {
    // 同上
    root.left = deleteNode(root.left, key);
  } else {
    // 找到要删除的节点

    // 若左子树为空，移除当前节点后的子树根节点应为右子树
    if(root.left == null) {
      return root.right;
    }
    // 同上
    if(root.right == null) {
      return root.left;
    }

    // 左右子树均不为空
    // 找到节点右子树最左边的节点，因为它是左子树中值最大的，可以作为删除后的根节点
    // （同理可以换成左子树的最右边节点）
    let temp = root.right;
    while(temp.left != null) {
      temp = temp.left;
    }
    // 将根节点的左子树接到找到的右子树最左边节点下，作为它的左子树
    temp.left = root.left;
    // 将右子树根节点替换掉当前根节点，将删除节点后的子树连接回原本的树
    root = root.right;
  }
  return root;
};