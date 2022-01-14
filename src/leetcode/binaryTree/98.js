// 给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。

// 有效 二叉搜索树定义如下：

// 节点的左子树只包含 小于 当前节点的数。
// 节点的右子树只包含 大于 当前节点的数。
// 所有左子树和右子树自身必须也是二叉搜索树。
//  
// 示例 1：
// 输入：root = [2,1,3]
// 输出：true

// 示例 2：
// 输入：root = [5,1,4,null,null,3,6]
// 输出：false
// 解释：根节点的值是 5 ，但是右子节点的值是 4 。

// 提示：
// 树中节点数目范围在[1, 104] 内
// -231 <= Node.val <= 231 - 1

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
 * @return {boolean}
 */
var isValidBST = function(root) {  
  if(root == null) {
    return true;
  }

  // 当前节点和父节点比较，返回的结果用来得出父节点的BST判断
  // 若判断当前节点为叶子节点则返回true，会缺失所有叶子节点的判断
  // 逐层向上对结果进行与运算得到最终结果
  const compare = (root, lowerBound, upperBound) => {
    // 以叶子节点为根节点的子树属于BST
    if(root == null) {
      return true;
    }

    // 非叶子节点时比较值
    if(root.val <= lowerBound || root.val >= upperBound) {
      return false;
    }

    // 对于当前节点的左子节点，只需要小于自身；右节点同理
    // 上下界则使用对应的默认值
    return compare(root.left, lowerBound, root.val) && compare(root.right, root.val, upperBound);

  }

  return compare(root, -Infinity, Infinity);
};