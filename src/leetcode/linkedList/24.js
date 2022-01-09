// 给你一个链表，两两交换其中相邻的节点，并返回交换后链表的头节点。你必须在不修改节点内部的值的情况下完成本题（即，只能进行节点交换）。

// 示例 1
// 输入head = [1,2,3,4]
// 输出[2,1,4,3]

// 示例 2
// 输入head = []
// 输出[]

// 示例 3
// 输入head = [1]
// 输出[1]

// 提示
// 链表中节点的数目在范围 [0, 100] 内
// 0 <= Node.val <= 100

/**
 * Definition for singly-linked list.
 * 
 * @param {Number} val value of the node
 * @param {ListNode} next pointer to the next node
 */
function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val)
  this.next = (next===undefined ? null : next)
}

var swapPairs = function(head) {
  if(head == null || head.length <= 1) {
    return head;
  }

  // 交换两节点
  const swap = (pre, second) => {
    if(second == null) {
      return;
    }

    let head = pre.next;
    head.next = second.next;
    pre.next = second;
    second.next = head;
  }

  let dummyHead = new ListNode(0, head);
  let current = dummyHead;
  while(current != null) {
    if(current.next == null) {
      break;
    }
    swap(current, current.next.next);
    current = current.next.next;
  }

  return dummyHead.next;
};