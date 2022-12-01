// 根据一棵树的中序遍历与后序遍历构造二叉树。

// 注意:
// 你可以假设树中没有重复的元素。

// 例如，给出
// 中序遍历 inorder = [9,3,15,20,7]
// 后序遍历 postorder = [9,15,7,20,3]
// 返回如下的二叉树：

//     3
//    / \
//   9  20
//     /  \
//    15   7

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
 * 思路同105
 * 
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function (inorder, postorder) {
  if(inorder.length === 0) {
    return null;
  }

  let rootVal = postorder[postorder.length - 1];
  let root = new TreeNode(rootVal);

  let rootIndex = inorder.indexOf(rootVal);

  let leftInorder = inorder.slice(0, rootIndex);
  let rightInorder = inorder.slice(rootIndex + 1);

  let leftPostorder = postorder.slice(0, leftInorder.length);
  let rightPostorder = postorder.slice(leftInorder.length, postorder.length - 1);

  root.left = buildTree(leftInorder, leftPostorder);
  root.right = buildTree(rightInorder, rightPostorder);
  return root;
};