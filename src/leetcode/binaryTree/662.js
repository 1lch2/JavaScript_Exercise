// 给定一个二叉树，编写一个函数来获取这个树的最大宽度。
// 树的宽度是所有层中的最大宽度。
// 这个二叉树与满二叉树（full binary tree）结构相同，但一些节点为空。

// 每一层的宽度被定义为两个端点（该层最左和最右的非空节点，
// 两端点间的null节点也计入长度）之间的长度。

// 示例 1:
// 输入: 

//            1
//          /   \
//         3     2
//        / \     \  
//       5   3     9 

// 输出: 4
// 解释: 最大值出现在树的第 3 层，宽度为 4 (5,3,null,9)。

// 示例 2:
// 输入: 

//           1
//          /  
//         3    
//        / \       
//       5   3     

// 输出: 2
// 解释: 最大值出现在树的第 3 层，宽度为 2 (5,3)。

// 示例 3:
// 输入: 

//           1
//          / \
//         3   2 
//        /        
//       5      

// 输出: 2
// 解释: 最大值出现在树的第 2 层，宽度为 2 (3,2)。

// 示例 4:
// 输入: 

//           1
//          / \
//         3   2
//        /     \  
//       5       9 
//      /         \
//     6           7
// 输出: 8
// 解释: 最大值出现在树的第 4 层，宽度为 8 (6,null,null,null,null,null,null,7)。
// 注意: 答案在32位有符号整数的表示范围内。

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
var widthOfBinaryTree = function(root) {
  if(root == null) {
    return 0;
  }

  let max = 0;
  // 修改值为编号
  root.val = 1;
  let queue = [root];

  while(queue.length !== 0) {
    // TODO:
  }
};

(function() {

  //       1
  //      / \
  //     3   2
  //    /     \  
  //   5       9 
  //  /         \
  // 6           7

  let root = new TreeNode(0);
  let l3 = new TreeNode(3);
  let l2 = new TreeNode(2);
  let l5 = new TreeNode(5);
  let l9 = new TreeNode(9);
  let l6 = new TreeNode(6);
  let l7 = new TreeNode(7);

  root.left = l3;
  root.right = l2;
  l3.left = l5;
  l2.right = l9;
  l5.left = l6;
  l9.right = l7;

  console.log(widthOfBinaryTree(root));
})();