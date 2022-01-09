// 给你一个链表，每k个节点一组进行翻转，请你返回翻转后的链表。

// k是一个正整数，它的值小于或等于链表的长度。

// 如果节点总数不是k的整数倍，那么请将最后剩余的节点保持原有顺序。

// 进阶

// 你可以设计一个只使用常数额外空间的算法来解决此问题吗？
// 你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。

// 示例 1
// 输入head = [1,2,3,4,5], k = 2
// 输出[2,1,4,3,5]

// 示例 2
// 输入head = [1,2,3,4,5], k = 3
// 输出[3,2,1,4,5]

// 示例 3
// 输入head = [1,2,3,4,5], k = 1
// 输出[1,2,3,4,5]

// 示例 4
// 输入head = [1], k = 1
// 输出[1]

// 提示
// 列表中节点的数量在范围 sz 内
// 1 <= sz <= 5000
// 0 <= Node.val <= 1000
// 1 <= k <= sz

/**
 * Definition for singly-linked list.
 * 
 * @param {Number} val value of the node
 * @param {ListNode} next pointer to the next node
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val)
  this.next = (next === undefined ? null : next)
}

/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function (head, k) {
  if (head == null || head.length < k || k == 1) {
    return head;
  }

  // 返回头节点开始的第k个节点
  const jumpToK = (head) => {
    let temp = head
    for(let i = 0; i < k; i++) {
      temp = temp.next;
    }
    return temp;
  }

  // 翻转指定数量节点
  const reverse = (pre) => {
    let head = pre.next;
    let tail = jumpToK(pre);
    let end = tail.next;
    
    tail = end;

    // 尾插法反转
    while(pre.next != end) {
      pre.next = head.next;
      head.next = tail;
      tail = head;
      head = pre.next;
    }
    // 将前驱节点连接到反转后的头节点
    pre.next = tail;
  }

  let dummyHead = new ListNode(0, head);
  let current = dummyHead;

  let length = 0;
  let temp = head;
  while(temp != null) {
    temp = temp.next;
    length++;
  }

  // 计算翻转组数
  let revTime = Math.floor(length / k);
  for (let i = 0; i < revTime; i++) {
    reverse(current);
    current = jumpToK(current);
  }
  return dummyHead.next;
};