//JZ36

// 输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。
// 要求不能创建任何新的节点，只能调整树中节点指针的指向。

// 为了让您更好地理解问题，以下面的二叉搜索树为例：

//     4
//    / \
//   2   5
//  / \
// 1   3

// 我们希望将这个二叉搜索树转化为双向循环链表。
// 链表中的每个节点都有一个前驱和后继指针。

// 对于双向循环链表，
// 第一个节点的前驱是最后一个节点，
// 最后一个节点的后继是第一个节点。

// 下图展示了上面的二叉搜索树转化成的链表。“head” 表示指向链表中有最小元素的节点。

// head
//   ↓
//  1 <-> 2 <-> 3 <-> 4 <-> 5 
//   ↖---------------------↙

// 特别地，我们希望可以就地完成转换操作。
// 当转化完成以后，树中节点的左指针需要指向前驱，
// 树中节点的右指针需要指向后继。
// 还需要返回链表中的第一个节点的指针。


// Definition for a Node.
function Node(val, left, right) {
  this.val = val;
  this.left = left;
  this.right = right;
};

/**
 * @param {Node} root
 * @return {Node}
 */
var treeToDoublyList = function(root) {
  if(root == null) {
    return null;
  }

  // 指向头节点的指针
  let head = null;
  let prev = null;

  const dfs = (curr) => {
    if(curr == null) {
      return curr;
    }
    
    // 中序遍历
    dfs(curr.left);
    
    // 左侧没有节点时，当前节点为第一个节点
    if(prev == null) {
      head = curr;
    } else {
      // 若当前节点左侧存在节点则需连接起来
      prev.right = curr;
    }

    // 当前节点连接左侧
    curr.left = prev;
    // 移动指针
    prev = curr;
    // 进入下一个节点
    dfs(curr.right);
  }

  dfs(root);
  // 完成遍历后头尾相连
  prev.right = head;
  head.left = prev;

  return head;
};
