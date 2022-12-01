// 给你一个单链表的头节点 head ，
// 请你判断该链表是否为回文链表。
// 如果是，返回 true ；否则，返回 false 。

// 示例 1：
// 输入：head = [1,2,2,1]
// 输出：true

// 示例 2：
// 输入：head = [1,2]
// 输出：false

// 提示：
// 链表中节点数目在范围[1, 105] 内
// 0 <= Node.val <= 9

// 进阶：你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？

/**
 * Definition for singly-linked list.
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var isPalindrome = function(head) {
  if(head == null || head.next == null) {
    return true;
  }

  const reverse = (root) => {
    let prev = null;
    let curr = root;
    let temp = root;
    while(curr != null) {
      temp = curr;
      curr = curr.next;
      temp.next = prev;
      prev = temp;
    }
    return prev;
  };

  // 返回中间节点的前驱节点
  const findHalfIndex = (root) => {
    let fast = root;
    let slow = root;

    while(fast.next != null && fast.next.next != null) {
      fast = fast.next.next;
      slow = slow.next;
    }

    return slow;
  };

  let middle = findHalfIndex(head);
  let newHead = reverse(middle.next);
  
  let left = head;
  let right = newHead;
  while(right != null) {
    if(left.val != right.val) {
      return false;
    }
    left = left.next;
    right = right.next;
  }

  return true;
};