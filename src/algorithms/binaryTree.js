/**
 * Binary tree node.
 */
class TreeNode {
  _TYPE_NAME = this.constructor.name;

  /**
   * Constructor
   * @param {Number} val value of the node
   * @param {TreeNode} left left sub-tree node
   * @param {TreeNode} right right sub-tree node
   */
  constructor(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
  }

  /**
   * 深度优先遍历
   * 
   * a.k.a. 先序遍历
   * @param {String} type "recur" or "stack"
   * @returns {Number[]} result
   */
  dfs(type) {
    // 递归模式
    const recur = () => {
      let res = [];
      const dfs = (root) => {
        if (root == null) {
          return;
        }
        res.push(root.val);
        dfs(root.left);
        dfs(root.right);
      };
      dfs(this);
      return res;
    };

    // 迭代模式
    const stack = () => {
      let res = [];
      let stack = [];
      let root = this;

      if (root === null) {
        return stack;
      }

      stack.push(root);
      while (stack.length !== 0) {
        let current = stack.pop();
        res.push(current.val);
        // 右节点先入栈
        if (current.right !== null) {
          stack.push(current.right);
        }
        if (current.left !== null) {
          stack.push(current.left);
        }
      }
      return res;
    };

    if (type === "recur") {
      return recur();
    } else if (type === "stack") {
      return stack();
    } else {
      console.error("not valid type.");
    }
  }

  /**
   * 广度优先遍历
   * 
   * a.k.a. 层序遍历
   * @returns {Number[]} 遍历结果数组
   */
  bfs() {
    let res = [];
    let root = this;
    if (root == null) {
      return res;
    }

    let queue = [root];
    while (queue.length != 0) {
      let current = queue.shift();
      res.push(current.val);
      if (current.left !== null) {
        queue.push(current.left);
      }
      if (current.right !== null) {
        queue.push(current.right);
      }
    }
    return res;
  }

  /**
   * 每层节点存入一个数组的层序遍历
   * @returns {Number[][]} BFS results by level
   */
  levelOrderTraverse() {
    let res = [];
    let root = this;
    if (root == null) {
      return res;
    }

    let queue = [root];
    while (queue.length !== 0) {
      let temp = [];
      let l = queue.length; // 记录当前层的节点数
      while (l > 0) {
        // 将下一层的节点压入队列
        let current = queue.shift();
        temp.push(current.val);
        if (current.left != null) {
          queue.push(current.left);
        }
        if (current.right != null) {
          queue.push(current.right);
        }
        l--;
      }
      res.push(temp);
    }
    return res;
  }

  /**
   * 后序遍历
   * @param {String} type "recur" or "stack"
   * @returns {Number[]} result
   */
  postOrderTraverse(type) {
    let res = [];

    // 递归方法
    const recur = () => {
      const traverse = (root) => {
        if (root == null) {
          return;
        }
        traverse(root.left);
        traverse(root.right);
        res.push(root.val);
      };
      traverse(this);
      return res;
    };

    // 迭代方法
    const stack = () => {
      let stack = [];
      let root = this;
      stack.push(root);
      while (stack.length !== 0) {
        let current = stack.pop();
        // 避免将空节点压入栈
        if (current === null) {
          continue;
        }
        // 颜色标记法（此处使用类型代替颜色标记）
        // Credit: https://leetcode-cn.com/problems/binary-tree-inorder-traversal/solution/
        //         yan-se-biao-ji-fa-yi-chong-tong-yong-qie-jian-ming/
        // 仅当节点未访问过（判断节点类型）时入栈
        if (current.constructor.name === this._TYPE_NAME) {
          // 按反方向入栈
          stack.push(current.val); // 压入值类型，标记为已访问
          stack.push(current.right);
          stack.push(current.left);
        } else {
          // 当节点已被访问过（类型不是节点）时出栈
          res.push(current);
        }
      }
      return res;
    };

    if (type === "recur") {
      return recur();
    } else if (type === "stack") {
      return stack();
    } else {
      console.error("not valid type");
    }
  }

  /**
   * 中序遍历
   * 
   * @param {String} type 遍历方法, "recur" or "stack"
   */
  inorderTraverse(type) {
    let res = [];

    // 递归方法
    const recur = () => {
      let root = this;
      const traverse = (root) => {
        if (root == null) {
          return;
        }
        traverse(root.left);
        res.push(root.val);
        traverse(root.right);
      };
      traverse(root);
      return res;
    };

    // 迭代方法
    const stack = () => {
      let root = this;
      let stack = [root];
      while (stack.length !== 0) {
        let current = stack.pop();
        if (current == null) {
          continue;
        }
        if (current.constructor.name === this._TYPE_NAME) {
          stack.push(current.right);
          stack.push(current.val);
          stack.push(current.left);
        } else {
          res.push(current);
        }
      }
      return res;
    };

    if (type === "recur") {
      return recur();
    } else if (type === "stack") {
      return stack();
    } else {
      console.error("not valid type");
    }
  }
  /**
   * Encodes a tree to a single string.
   *
   * @param {TreeNode} root root node
   * @return {string} serialized string of nodes
   */
  serialize() {
    let root = this;
    if (root == null) {
      return [];
    }

    let queue = [root];
    let res = [];

    while (queue.length > 0) {
      let current = queue.shift();
      // 将null也推入队列
      if (current !== null) {
        res.push(current.val);
        queue.push(current.left);
        queue.push(current.right);
      } else {
        res.push("null");
      }
    }
    while (res[res.length - 1] === "null") {
      res.pop();
    }
    return res.join(" ");
  }

  /**
   * Decodes your encoded data to tree.
   *
   * @param {string} data
   * @return {TreeNode} root node
   */
  deserialize(data) {
    if (data.length === 0 || data.trim() === "") {
      return null;
    }

    let nodeList = data.split(" ");
    let root = new TreeNode(nodeList.shift());
    let queue = [root];

    // 按层序遍历顺序弹队列重建树
    while (nodeList.length > 0) {
      let currentRoot = queue.shift();
      let leftVal = nodeList.shift();
      let rightVal = nodeList.shift();

      if (leftVal !== "null" && leftVal !== undefined) {
        let left = new TreeNode(leftVal);
        currentRoot.left = left;
        queue.push(left);
      }
      if (rightVal !== "null" && rightVal !== undefined) {
        let right = new TreeNode(rightVal);
        currentRoot.right = right;
        queue.push(right);
      }
    }
    return root;
  }

}

(function() {
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

  let traverseRes = root.dfs("recur");
  console.log(traverseRes);

  let serialized = root.serialize();
  console.log(serialized.join(" "));
})();