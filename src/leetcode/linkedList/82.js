// 给定一个已排序的链表的头 head ， 删除原始链表中所有重复数字的节点，只留下不同的数字 。
// 返回 已排序的链表 。

// 示例 1：
// 输入：head = [1,2,3,3,4,4,5]
// 输出：[1,2,5]

// 示例 2：
// 输入：head = [1,1,1,2,3]
// 输出：[2,3]

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

  let dummy = new ListNode(-1, head);
  let left = dummy;
  let right = head;
  while(right != null) {
    // 找到不重复节点的边界
    while(right.next != null && right.val === right.next.val) {
      right = right.next;
    }
    // 判断是否存在重复节点
    if(left.next == right) {
      left = left.next;
    } else {
      left.next = right.next;
    }
    right = right.next;
  }

  return dummy.next;
};