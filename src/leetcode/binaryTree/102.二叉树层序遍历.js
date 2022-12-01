// 给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 
// （即逐层地，从左到右访问所有节点）。

// 示例：
// 二叉树：[3,9,20,null,null,15,7],
//     3
//    / \
//   9  20
//     /  \
//    15   7
// 返回其层次遍历结果：
// [
//   [3],
//   [9,20],
//   [15,7]
// ]

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
 * @return {number[][]}
 */
var levelOrder = function(root) {
  let res = [];
  if(root == null) {
    return res;
  }

  let queue = [root];
  while(queue.length !== 0) {
    let temp = [];
    let l = queue.length; // 记录当前层的节点数
    while(l > 0) {
      // 将下一层的节点压入队列
      let current = queue.shift();
      temp.push(current.val);
      if(current.left != null) {
        queue.push(current.left);
      }
      if(current.right != null) {
        queue.push(current.right)
      }
      l--;
    }
    res.push(temp)
  }
  return res;
};