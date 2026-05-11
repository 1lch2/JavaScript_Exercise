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

import { ListNode } from "../../algorithms/linkedList.js";

const partition_old = function (head: ListNode, x: number) {
  if (head == null || head.next == null) {
    return head;
  }

  let first = [];
  let second = [];

  let temp: ListNode | null = head;
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

function partition(head: ListNode | null, x: number): ListNode | null {
  if (head == null || head.next == null) return head;

  const dummyHead = new ListNode(-114514, head);
  let start = null;
  let temp = dummyHead;
  while (temp.next != null) {
    if (temp.next.val >= x) {
      start = temp;
      break;
    } else {
      temp = temp.next;
    }
  }

  if (start == null) return head;

  let temp2 = start;
  while (temp2 !== null && temp2.next !== null) {
    if (temp2.next.val >= x) {
      temp2 = temp2.next;
      continue;
    }
    let moveTarget = temp2.next;
    temp2.next = moveTarget.next;
    moveTarget.next = start.next;
    start.next = moveTarget;
    start = start.next;
  }
  return dummyHead.next;
}

// console.log(partition_old(deserialize([1, 4, 3, 2, 5, 2]) as ListNode, 3));
const result = partition(ListNode.deserialize([1, 4, 3, 2, 5, 2]) as ListNode, 3);
console.log(ListNode.print(result));
