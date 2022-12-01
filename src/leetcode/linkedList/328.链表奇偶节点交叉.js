// 给定单链表的头节点 head ，
// 将所有索引为奇数的节点和索引为偶数的节点分别组合在一起，
// 然后返回重新排序的列表。

// 第一个节点的索引被认为是 奇数 ， 第二个节点的索引为 偶数 ，以此类推。

// 请注意，偶数组和奇数组内部的相对顺序应该与输入时保持一致。

// 你必须在 O(1) 的额外空间复杂度和 O(n) 的时间复杂度下解决这个问题。

// 示例 1:
// 输入: head = [1,2,3,4,5]
// 输出: [1,3,5,2,4]

// 示例 2:
// 输入: head = [2,1,3,5,6,4,7]
// 输出: [2,3,6,7,1,5,4]

// 提示:
// n ==  链表中的节点数
// 0 <= n <= 104
// -106 <= Node.val <= 106

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
 * @return {ListNode}
 */
var oddEvenList = function(head) {
  if(head === null || head.next === null) {
    return head;
  }

  let dummy = new ListNode();
  dummy.next = head;

  // 存储偶数个节点的链表头节点
  let evenHead = new ListNode();
  let evenPtr = evenHead;
  // 遍历原链表的指针
  let mainPtr = dummy.next;
  while (mainPtr.next != null) {
    evenPtr.next = mainPtr.next;
    mainPtr.next = mainPtr.next.next;
    evenPtr = evenPtr.next;

    // 因为每次实际上移动了两个节点的距离，因此要检查一下后继节点
    if (mainPtr.next !== null) {
      mainPtr = mainPtr.next;
    }
  }

  // 断开偶数链表的尾节点的指向
  evenPtr.next = null;
  mainPtr.next = evenHead.next;
  return dummy.next;
};