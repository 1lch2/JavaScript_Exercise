// 给定一个二叉树的 根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，返回从右侧所能看到的节点值。

// 示例 1:
// 输入: [1,2,3,null,5,null,4]
// 输出: [1,3,4]

// 示例 2:
// 输入: [1,null,3]
// 输出: [1,3]

// 示例 3:
// 输入: []
// 输出: []

// 提示:
// 二叉树的节点个数的范围是 [0,100]
// -100 <= Node.val <= 100 

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var rightSideView = function(root) {
  if(root == null) {
    return [];
  }

  let res = [];
  let queue = [root];
  while(queue.length > 0) {
    let len = queue.length;
    while(len > 0) {
      let current = queue.shift();
      // 仅添加当前层最右侧的一个节点
      if(len - 1 === 0) {
        res.push(current.val);
      }
      if(current.left != null) {
        queue.push(current.left);
      }
      if(current.right != null) {
        queue.push(current.right);
      }
      len--;
    }
  }
  return res;
};
