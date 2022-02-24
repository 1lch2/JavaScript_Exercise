// 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。

// 图示两个链表在节点 c1 开始相交：

//       a1 -> a2 
//               \
//               c1 -> c2 -> c3
//               /
// b1 -> b2 -> b3 

// 题目数据 保证 整个链式结构中不存在环。
// 注意，函数返回结果后，链表必须 保持其原始结构 。

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
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
  if(headA == null || headB == null) {
    return null;
  }

  let t1 = headA;
  let t2 = headB;

  // 交换起始位置遍历，最终两个指针会在路程相等处相遇
  // 否则返回空
  while(t1 !== t2) {
    t1 = t1 == null ? headB : t1.next;
    t2 = t2 == null ? headA : t2.next;
  }
  return t1;
};