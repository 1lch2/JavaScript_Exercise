// 给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，
// 使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。

// 你应当 保留 两个分区中每个节点的初始相对位置。

// 示例 1：
// 输入：head = [1,4,3,2,5,2], x = 3
// 输出：[1,2,2,4,3,5]

// 示例 2：
// 输入：head = [2,1], x = 2
// 输出：[1,2]

// 提示：
// 链表中节点的数目在范围 [0, 200] 内
// -100 <= Node.val <= 100
// -200 <= x <= 200

import { deserialize } from "../../algorithms/linkedList.js";

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
 * @param {number} x
 * @return {ListNode}
 */
var partition = function(head, x) {
  if (head == null || head.next == null) {
    return head;
  }

  let first = [];
  let second = [];

  let temp = head;
  while (temp !== null) {
    if (temp.val < x) {
      first.push(temp);
    } else {
      second.push(temp);
    }
    temp = temp.next;
  }

  let dummy = new ListNode();
  temp = dummy;
  for (let node of first) {
    temp.next = node;
    // 断开原节点的后继，防止形成环
    node.next = null;
    temp = temp.next;
  }
  for (let node of second) {
    temp.next = node;
    node.next = null;
    temp = temp.next;
  }

  return dummy.next;
};


let input = [deserialize([1, 4, 3, 2, 5, 2]), 3];
console.log(partition(...input));