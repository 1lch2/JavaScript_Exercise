/**
 * Binary tree Node
 * @param {Number} val value of the node
 * @param {TreeNode} left left sub-tree node
 * @param {TreeNode} right right sub-tree node
 */
class TreeNode {
  constructor(val, left, right) {
    this.val = (val === undefined ? 0 : val)
    this.left = (left === undefined ? null : left)
    this.right = (right === undefined ? null : right)
  }

  /**
   * 先序遍历
   * @param {String} type "recur" or "stack"
   */
  dfs(type) {
    switch(type) {
      case "recur": 
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
        
      case "stack":
        break;

      default:
        console.error("Not valid type");
    }
  }

  bfs() {
    // TODO
  }
}