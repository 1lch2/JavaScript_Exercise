// JZ07

// 给定一棵树的前序遍历 preorder 与中序遍历  inorder。请构造二叉树并返回其根节点。

// 示例 1:
// Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
// Output: [3,9,20,null,null,15,7]

// 示例 2:
// Input: preorder = [-1], inorder = [-1]
// Output: [-1]

// 提示:
// 1 <= preorder.length <= 3000
// inorder.length == preorder.length
// -3000 <= preorder[i], inorder[i] <= 3000
// preorder 和 inorder 均无重复元素
// inorder 均出现在 preorder
// preorder 保证为二叉树的前序遍历序列
// inorder 保证为二叉树的中序遍历序列

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
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function (preorder, inorder) {
  // 返回空节点
  if(preorder.length === 0) {
    return null;
  }

  // 根节点必定是先序遍历的第一个节点
  let rootVal = preorder[0];
  let root = new TreeNode(rootVal);

  // 根节点坐标
  let rootIndex = inorder.indexOf(rootVal);

  // 切割中序遍历数组获得左右子树部分
  let leftInorder = inorder.slice(0, rootIndex);
  let rightInorder = inorder.slice(rootIndex + 1);

  // 切割先序遍历数组获得左右子树部分
  let leftPreorder = preorder.slice(1, leftInorder.length + 1);
  let rightPreorder = preorder.slice(leftInorder.length + 1);

  // 递归构造子树并返回根节点
  let leftTree = buildTree(leftPreorder, leftInorder);
  let rightTree = buildTree(rightPreorder, rightInorder);

  // 连接左右子树
  root.left = leftTree;
  root.right = rightTree;
  return root;
};

/**
 * 二解
 * @param {Number[]} preorder 先序
 * @param {Number[]} inorder 中序
 * @returns {TreeNode} 树的根节点
 */
var _buildTree = function(preorder, inorder) {
  if(preorder.length === 0) {
    return null;
  }

  let LEN = preorder.length;
  // 将中序遍历每个节点值和下标映射到map
  let map = new Map();
  for(let i = 0; i < LEN; i++) {
    map.set(inorder[i], i);
  }

  /**
   * 
   * @param {Number} preroot 先序遍历中的根节点下标
   * @param {Number} inleft 中序遍历的左边界下标
   * @param {Number} inright 中序遍历的右边界下标
   */
  const getTree = (preroot, inleft, inright) => {
    // 左右下标相遇代表区间为空
    if(inleft > inright) {
      return null;
    }
    let rootVal = preorder[preroot];
    let root = new TreeNode(rootVal);

    let i = map.get(rootVal); // 中序遍历的根节点下标
    root.left = getTree(preroot + 1, inleft, i - 1);

    // 先序遍历的当前子树起始下标为preroot， 左子树长度为i - inleft
    // + 1 后即为先序遍历中右子树的第一个下标，为右子树在先序遍历的根节点下标
    root.right = getTree(i - inleft + 1 + preroot, i + 1, inright);
    return root;
  };

  return getTree(0, 0, LEN - 1);
};
