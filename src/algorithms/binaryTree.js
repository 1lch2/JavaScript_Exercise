/**
 * Binary tree Node
 * @param {Number} val value of the node
 * @param {TreeNode} left left sub-tree node
 * @param {TreeNode} right right sub-tree node
 */
class TreeNode {
  _TYPE_NAME = "TreeNode";

  constructor(val, left, right) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }

  /**
   * 深度优先遍历
   * 
   * a.k.a. 先序遍历
   * @param {String} type "recur" or "stack"
   */
  dfs(type) {
    if (type === "recur") {
      // 递归模式
      let res = [];
      const dfs = (root) => {
        if (root == null) {
          return;
        }
        res.push(root.val);
        dfs(root.left);
        dfs(root.right);
      }
      dfs(this);
      return res;
    } else if (type === "stack") {
      // 迭代模式
      let res = [];
      let stack = [];
      let root = this;

      if (root === null) {
        return stack;
      }

      stack.push(root)
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
    } else {
      console.error("not valid type.")
    }
  }

  /**
   * 层序遍历
   * @returns {Number[][]} BFS results by level
   */
  bfs() {
    let res = [];
    let root = this;
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
  }

  /**
   * 后序遍历
   * @param {String} type "recur" or "stack"
   */
  postOrderTraverse(type) {
    let res = [];

    if(type === "recur") {
      const traverse = (root) => {
        if(root == null) {
          return;
        }
        traverse(root.left);
        traverse(root.right);
        res.push(root.val);
      }
      traverse(this);
      return res;
    } else if(type === "stack") {
      let stack = [];
      let root = this;
      stack.push(root);
      while(stack.length !== 0) {
        let current = stack.pop();
        // 避免将空节点压入栈
        if (current === null) {
          continue;
        }
        // 仅当节点未访问过（判断节点类型）时入栈
        if (current.constructor.name === this._TYPE_NAME) {
          // 按反方向入栈
          stack.push(current.val);  // 压入值类型，标记为已访问
          stack.push(current.right);
          stack.push(current.left);
        } else {
          // 当节点已被访问过（类型不是节点）时出栈
          res.push(current);
        }
      }
      return res;
    } else {
      console.error("not valid type");
    }
  }
}

(function () {
  //      0
  //     / \
  //    1   2
  //   / \ /
  //  3  4 5
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

  let traverseRes = root.dfs("stack");
  console.log(traverseRes);
})();