// 给你二叉树的根节点 root ，返回其节点值的 锯齿形层序遍历 。
// （即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。

// 示例 1：
//    3
//   / \
//  9  20
//    /  \
//   15   7

// 输入：root = [3,9,20,null,null,15,7]
// 输出：[[3],[20,9],[15,7]]

// 示例 2：
// 输入：root = [1]
// 输出：[[1]]

// 示例 3：
// 输入：root = []
// 输出：[]

// 提示：
// 树中节点数目在范围 [0, 2000] 内
// -100 <= Node.val <= 100

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
 * @return {number[][]}
 */
var zigzagLevelOrder = function(root) {
  if(root == null) {
    return [];
  }

  let queue = [root];
  let res = [];
  // 入队列方向
  let directionLeft = true;
  while(queue.length !== 0) {
    let temp = [];
    let currLen = queue.length;

    while(currLen > 0) {
      let current;
      current = queue.shift();

      if(directionLeft) {
        temp.push(current.val);
      } else {
        temp.unshift(current.val);
      }
      if(current.left != null) {
        queue.push(current.left);
      }
      if(current.right != null) {
        queue.push(current.right);
      }
      currLen--;
    }
    directionLeft = !directionLeft;
    res.push(temp);
  }
  return res;
};

(function(){
  //       0
  //      / \
  //     1   2
  //    / \
  //   3   4
  //  /
  // 5
  let root = new TreeNode(0);
  let l1 = new TreeNode(1);
  let l2 = new TreeNode(2);
  let l3 = new TreeNode(3);
  let l4 = new TreeNode(4);
  let l5 = new TreeNode(5);

  root.left = l1;
  root.right = l2;
  l1.left = l3;
  l1.right = l4;
  l3.left = l5;

  console.log(zigzagLevelOrder(root));
})();