
/**
 * Binary tree Node
 * @param {Number} val value of the node
 * @param {TreeNode} left left sub-tree node
 * @param {TreeNode} right right sub-tree node
 */
function TreeNode(val, left, right) {
  this.val = (val === undefined ? 0 : val)
  this.left = (left === undefined ? null : left)
  this.right = (right === undefined ? null : right)

  this.inOrderTraverse = function() {
    // TODO:
  }

  this.dfs = function() {
    // TODO:
  }

  this.bfs = function() {
    // TODO:
  }

  this.serialize = function() {
    // TODO:
  }
}