// 输入两棵二叉树A和B，判断B是不是A的子结构。(约定空树不是任意一个树的子结构)

// B是A的子结构， 即 A中有出现和B相同的结构和节点值。

// 例如:
// 给定的树 A:

//      3
//     / \
//    4   5
//   / \
//  1   2

// 给定的树 B：
//    4 
//   /
//  1
// 返回 true，因为 B 与 A 的一个子树拥有相同的结构和节点值。

// 示例 1：
// 输入：A = [1,2,3], B = [3,1]
// 输出：false

// 示例 2：
// 输入：A = [3,4,5,1,2], B = [4,1]
// 输出：true

// 限制：
// 0 <= 节点个数 <= 10000

/**
 * Definition for a binary tree node.
 * @param {Number} val value
 */
function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
}

/**
 * @param {TreeNode} A
 * @param {TreeNode} B
 * @return {boolean}
 */
var isSubStructure = function (A, B) {
  if(A == null || B == null) {
    return false;
  }

  const check = (A, B) => {
    // 遍历到B为空时说明B已经匹配完成
    if(B === null) {
      return true;
    }

    // 遍历到A为空时说明已经越过了A叶子节点，匹配失败
    if(A === null) {
      return false;
    }

    // 值不匹配
    if(A.val !== B.val) {
      return false
    }

    // 递归进入左右子树检查
    return check(A.left, B.left) && check(A.right, B.right);
  };

  // 检查当前子树，以及A的左右子树中是否存在匹配
  return check(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B)
};

(function(){
  let n1 = new TreeNode(1);
  let n2 = new TreeNode(2);
  let n3 = new TreeNode(3);
  let n4 = new TreeNode(4);

  n1.left = n2;
  n1.right = n3;
  n3.left = n4;

  let B = new TreeNode(3);

  isSubStructure(n1, B);
})();
