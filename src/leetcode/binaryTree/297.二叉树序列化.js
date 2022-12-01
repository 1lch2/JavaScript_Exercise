// 请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，
// 你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

// 提示: 输入输出格式与 LeetCode 目前使用的方式一致，详情请参阅 LeetCode 序列化二叉树的格式。
// 你并非必须采取这种方式，你也可以采用其他的方法解决这个问题。

// 示例 1：
// 输入：root = [1,2,3,null,null,4,5]
// 输出：[1,2,3,null,null,4,5]

// 示例 2：
// 输入：root = []
// 输出：[]

// 示例 3：
// 输入：root = [1]
// 输出：[1]

// 示例 4：
// 输入：root = [1,2]
// 输出：[1,2]

// 提示：
// 树中结点数在范围 [0, 104] 内
// -1000 <= Node.val <= 1000

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
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function (root) {
  if(root == null) {
    return [];
  }

  let queue = [root];
  let res = [];

  while(queue.length > 0) {
    let current = queue.shift();
    // 将null也推入队列
    if(current !== null) {
      res.push(current.val);
      queue.push(current.left);
      queue.push(current.right);
    } else {
      res.push("null");
    }
  }
  while(res[res.length - 1] === "null") {
    res.pop();
  }
  return res.join(" ");
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function (data) {
  if(data.length === 0 || data.trim() === "") {
    return null;
  }

  let nodeList = data.split(" ");
  let root = new TreeNode(nodeList.shift());
  let queue = [root];

  while(nodeList.length > 0) {
    let currentRoot = queue.shift();
    let leftVal = nodeList.shift();
    let rightVal = nodeList.shift();

    if(leftVal !== "null" && leftVal !== undefined) {
      let left = new TreeNode(leftVal);
      currentRoot.left = left;
      queue.push(left);
    }
    if(rightVal !== "null" && rightVal !== undefined) {
      let right = new TreeNode(rightVal);
      currentRoot.right = right;
      queue.push(right);
    }
  }
  return root;
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */