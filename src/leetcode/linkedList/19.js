// 给定一个链表，删除链表的倒数第 n 个节点，并且返回链表的头结点。

// 示例：
// 给定一个链表: 1->2->3->4->5, 和 n = 2.

// 当删除了倒数第二个节点后，链表变为 1->2->3->5.

// 说明：
// 给定的 n 保证是有效的。

// 进阶：
// 你能尝试使用一趟扫描实现吗？

/**
 * Definition for singly-linked list.
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthNode = function (n, head) {
  if (head === null) {
    return null;
  }

  let dummy = new ListNode(0, head);

  // 双指针法
  let left = dummy;
  let right = dummy;

  // 让两个指针相距 n 个单位
  for(let i = 0; i < n; i++) {
    right = right.next;
  }

  // 当右侧指针到末尾时，左侧指针指向倒数第 n 个节点的前驱
  while (right.next != null) {
    left = left.next;
    right = right.next;
  }

  // 移除节点
  left.next = left.next.next;

  return dummy.next;
};