// 给定一个二叉搜索树的根节点 root ，和一个整数 k ，请你设计一个算法查找其中第 k 个最小元素（从 1 开始计数）。

// 示例 1：
// 输入：root = [3,1,4,null,2], k = 1
// 输出：1

// 示例 2：
// 输入：root = [5,3,6,2,4,null,null,1], k = 3
// 输出：3

// 提示：
// 树中的节点数为 n 。
// 1 <= k <= n <= 104
// 0 <= Node.val <= 104

// 进阶：如果二叉搜索树经常被修改（插入/删除操作）并且你需要频繁地查找第 k 小的值，你将如何优化算法？

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
 * 中序遍历思路
 * 
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {
  let stack = [root];
  let res = [];
  while (stack.length !== 0 && k > 0) {
    let current = stack.pop();
    if (current == null) {
      continue;
    }
    if (current.constructor.name === "TreeNode") {
      stack.push(current.right);
      stack.push(current.val);
      stack.push(current.left);
    } else {
      res.push(current);
    }
  }
  return res[k - 1];
};

/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var _kthSmallest = function(root, k) {
  let nodeNumMap = new Map();

  /**
   * 
   * @param {TreeNode} root 
   * @returns 以当前节点为根的子树的节点总数量
   */
  const countNode = (root) => {
    if (root == null) {
      return 0;
    }

    let count = countNode(root.left) + countNode(root.right) + 1;
    nodeNumMap.set(root, count);
    return count;
  };

  countNode(root);

  let temp = root;
  while (temp !== null) {
    // 根据左节点数量，按二分查找思路找到左节点数量等于 k - 1 的节点

    // 注意处理空节点情况，需要返回 0
    let left = nodeNumMap.get(temp.left) || 0;
    if (left < k - 1) {
      temp = temp.right;
      // 进入右侧节点后，左节点要比较的数字需要减去左子树节点总数和 1 个根节点
      k -= left + 1;
    }
    else if (left > k - 1) {
      temp = temp.left;
    }
    else {
      // 左子树节点总数量刚好为 k - 1 时，当前根节点即为想要的节点
      break;
    }
  }

  return temp.val;
};

let node = new TreeNode(1);
node.right = new TreeNode(2);

console.log(_kthSmallest(node));