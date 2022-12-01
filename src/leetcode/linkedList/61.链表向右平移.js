// 给你一个链表的头节点 head ，旋转链表，将链表每个节点向右移动 k 个位置。

// 示例 1：
// 输入：head = [1,2,3,4,5], k = 2
// 输出：[4,5,1,2,3]

// 示例 2：
// 输入：head = [0,1,2], k = 4
// 输出：[2,0,1]

// 提示：
// 链表中节点的数目在范围 [0, 500] 内
// -100 <= Node.val <= 100
// 0 <= k <= 2 * 109

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
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function(head, k) {
  if(head == null || k === 0) {
    return head;
  }

  let dummy = new ListNode(-1, head);
  let temp = head;
  let pre = head;

  let length = 0;
  while(temp != null) {
    temp = temp.next;
    length++;
  }

  // 对 k 取模，得到移动距离
  k = k % length;

  temp = head;
  for(let i = 0; i < k; i++) {
    temp = temp.next;
  }

  // 双指针定位切割链表的位置
  while(temp.next != null) {
    temp = temp.next;
    pre = pre.next;
  }

  temp.next = head;
  dummy.next = pre.next;
  pre.next = null;

  return dummy.next;
};