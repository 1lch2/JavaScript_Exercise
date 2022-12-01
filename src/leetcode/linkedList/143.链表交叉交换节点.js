// 给定一个单链表 L 的头节点 head ，单链表 L 表示为：

// L0 → L1 → … → Ln - 1 → Ln
// 请将其重新排列后变为：
// L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → …

// 不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。

// 示例 1：
// 输入：head = [1,2,3,4]
// 输出：[1,4,2,3]

// 示例 2：
// 输入：head = [1,2,3,4,5]
// 输出：[1,5,2,4,3]

// 提示：

// 链表的长度范围为 [1, 5 * 104]
// 1 <= node.val <= 1000

/**
 * Definition for singly-linked list.
 * 
 * @param {Number} val value of the node
 * @param {ListNode} next pointer to the next node
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

/**
 * @param {ListNode} head
 * @return {void} Do not return anything, modify head in-place instead.
 */
var reorderList = function(head) {
  // 长度为 1，2 的链表不做处理
  if(head.next == null || head.next.next == null) {
    return head;
  }
  
  /**
   * @param {ListNode} head 
   * @returns {ListNode}
   */
  const findMiddle = (head) => {
    let fast = head;
    let slow = head;
    
    // 双指针定位中点
    while(fast != null && fast.next != null) {
      fast = fast.next.next;
      slow = slow.next;
    }
    // 此时 slow.next 指向中点（奇数长度）或中点前驱（偶数长度）
    return slow;
  };
  
  /**
   * @param {ListNOde} head 
   */
  const reverse = (head) => {
    let prev = null;
    let curr = head;
    let temp;
    while(curr != null) {
      temp = curr;
      curr = curr.next;
      temp.next = prev;
      prev = temp;
    }
    return prev;
  };

  let dummy = new ListNode();
  dummy.next = head;
  
  let mid = findMiddle(head);
  let reversedHead = reverse(mid.next);
  mid.next = null;

  // 合并两个链表
  let l1 = head;
  let l2 = reversedHead;
  while(l1 != null && l2 != null) {
    let temp1 = l1.next;
    let temp2 = l2.next;

    l1.next = l2;
    l1 = temp1;

    l2.next = l1;
    l2 = temp2;
  }

  return dummy.next;
};