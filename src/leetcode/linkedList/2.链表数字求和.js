// 给你两个 非空 的链表，表示两个非负的整数。
// 它们每位数字都是按照 逆序 的方式存储的，并且每个节点只能存储 一位 数字。

// 请你将两个数相加，并以相同形式返回一个表示和的链表。

// 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。

// 示例 1：
// 输入：l1 = [2,4,3], l2 = [5,6,4]
// 输出：[7,0,8]
// 解释：342 + 465 = 807.

// 示例 2：
// 输入：l1 = [0], l2 = [0]
// 输出：[0]

// 示例 3：
// 输入：l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]
// 输出：[8,9,9,9,0,0,0,1]

// 提示：
// 每个链表中的节点数在范围 [1, 100] 内
// 0 <= Node.val <= 9
// 题目数据保证列表表示的数字不含前导零
/**
 * Definition for singly-linked list.
 * @param {Number} val 
 * @param {ListNode} next 
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}


/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
  let temp1 = l1;
  let temp2 = l2;

  let len1 = 1;
  while(temp1.next != null) {
    temp1 = temp1.next;
    len1++;
  }

  let len2 = 1;
  while(temp2.next != null) {
    temp2 = temp2.next;
    len2++;
  }

  // 若长度不一样则补0
  let delta = len1 - len2;
  while(delta > 0) {
    temp2.next = new ListNode(0);
    temp2 = temp2.next;
    delta--;
  }

  while(delta < 0) {
    temp1.next = new ListNode(0);
    temp1 = temp1.next;
    delta++;
  }

  let carry = 0; // 进位
  let tempVal = 0;
  let dummy = new ListNode(-1);
  let curr = dummy;
  temp1 = l1;
  temp2 = l2;
  while(temp1 != null || temp2 != null) {
    tempVal = (temp1.val + temp2.val + carry) % 10;
    carry = temp1.val + temp2.val + carry >= 10 ? 1 : 0;
    curr.next = new ListNode(tempVal);

    curr = curr.next;
    temp1 = temp1.next;
    temp2 = temp2.next;
  }

  // 计算到最后一位进位还存在时，需要加一个节点
  if(carry !== 0) {
    curr.next = new ListNode(1);
  }

  return dummy.next;
};
