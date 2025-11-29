// 给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

// 示例 1:
// 输入: head = [1,2,3,4,5]
// 输出: [5,4,3,2,1]

// 示例 2:
// 输入: head = [1,2]
// 输出: [2,1]

// 示例 3:
// 输入: head = []
// 输出: []

// 提示:
// 链表中节点的数目范围是 [0, 5000]
// -5000 <= Node.val <= 5000

import { buildLinkedList, ListNode, printLinkedList } from "./buildLinkedList";

const reverseList = function (head: ListNode | null) {
  // 尾指针，指向当前节点被重新定向的目标
  let prev = null;
  // 头指针，指向当前准备操作的指针
  let curr = head;
  // 由于链表不能反向遍历，必须保存一份下一个目标的指针
  let temp;

  while (curr != null) {
    temp = curr; // 保存一份当前指针
    curr = curr.next; // 指向后一个节点，供下一轮迭代使用
    temp.next = prev; // 反转指针方向
    prev = temp; // 尾指针向后移动，准备下一轮迭代
  }
  return prev;
};

/**
 * 反转链表递归版
 * @copyright https://labuladong.gitee.io/algo/2/17/17/
 * @param {ListNode} head root node
 */
const reverseListRecur = function (head: ListNode | null): ListNode | null {
  // 只剩下一个节点或到达空节点时，直接返回当前节点
  if (head == null || head.next == null) {
    return head;
  }

  let newHead = reverseListRecur(head.next); // 递归进入，反转头结点之后的部分
  head.next.next = head; // 将反转后的尾节点指向反转前的头结点
  head.next = null;
  return newHead;
};

(function () {
  // let root = new ListNode(0);
  // root.next = new ListNode(1);
  // root.next.next = new ListNode(2);
  // root.next.next.next = new ListNode(3);
  // root.next.next.next.next = new ListNode(4);
  // root.next.next.next.next.next = new ListNode(5);

  const root = buildLinkedList([0, 1, 2, 3, 4, 5]);

  let res = reverseList(root);
  console.log(printLinkedList(res));
})();
