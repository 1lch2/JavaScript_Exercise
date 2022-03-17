// 给定一个已排序的链表的头 head ， 删除所有重复的元素，使每个元素只出现一次 。返回 已排序的链表 。

// 示例 1：
// 输入：head = [1,1,2]
// 输出：[1,2]

// 示例 2：
// 输入：head = [1,1,2,3,3]
// 输出：[1,2,3]

// 提示：
// 链表中节点数目在范围 [0, 300] 内
// -100 <= Node.val <= 100
// 题目数据保证链表已经按升序 排列

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
var deleteDuplicates = function(head) {
  if(head == null || head.next == null) {
    return head;
  }

  let left = head;
  let right = head;
  let dummy = new ListNode(-1, head);

  while(left != null && right != null) {
    while(right != null && right.val === left.val) {
      right = right.next;
    }
    left.next = right;
    left = right;
  }
  return dummy.next;
};