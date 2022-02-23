// 给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有 从根节点到叶子节点 路径总和等于给定目标和的路径。

// 叶子节点 是指没有子节点的节点。

// 示例 1：
// 输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
// 输出：[[5,4,11,2],[5,8,4,5]]

// 示例 2：
// 输入：root = [1,2,3], targetSum = 5
// 输出：[]

// 示例 3：
// 输入：root = [1,2], targetSum = 0
// 输出：[]

// 提示：
// 树中节点总数在范围 [0, 5000] 内
// -1000 <= Node.val <= 1000
// -1000 <= targetSum <= 1000

/**
 * Constructor
 * @param {Number} val value of the node
 * @param {TreeNode} left left sub-tree node
 * @param {TreeNode} right right sub-tree node
 */
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val);
  this.left = (left === undefined ? null : left);
  this.right = (right === undefined ? null : right);
}

/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function(root, targetSum) {
  if (root == null) {
    return [];
  }

  Array.prototype.sum = function mySum() {
    return this.reduce((prev, curr) => prev + curr, 0);
  };

  let res = [];
  let temp = root;

  /**
   * @param {TreeNode} root root
   * @param {Number[]} path path
   */
  const backtrack = (root, path) => {
    if (root == null) {
      return;
    }

    path.push(root.val);

    // 若已经到达叶子节点，判断是否符合要求
    // 避免递归进入左右空子树导致添加两次一样的路径
    if(root.left == null && root.right == null) {
      if(path.sum() === targetSum) {
        // 找到路径直接return会导致少pop一次
        res.push(path.slice(0));
        path.pop();
        return;
      }
    }
    // 手动遍历写两次代替循环
    backtrack(root.left, path);
    backtrack(root.right, path);
    path.pop();
  };

  backtrack(temp, []);
  return res;
};

(function() {
  let root = new TreeNode(5);
  let l1 = new TreeNode(4);
  let l2 = new TreeNode(8);
  let l3 = new TreeNode(11);
  let l5 = new TreeNode(13);
  let l6 = new TreeNode(4);
  let l7 = new TreeNode(7);
  let l8 = new TreeNode(2);
  let l11 = new TreeNode(5);
  let l12 = new TreeNode(1);

  root.left = l1;
  root.right = l2;
  l1.left = l3;
  l2.left = l5;
  l2.right = l6;
  l3.left = l7;
  l3.right = l8;
  l6.left = l11;
  l6.right = l12;


  let res = pathSum(root, 22);
  console.log(res);
})();