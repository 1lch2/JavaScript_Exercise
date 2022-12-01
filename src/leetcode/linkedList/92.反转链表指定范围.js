// 给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。
// 请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。

// 示例 1：
// 输入：head = [1,2,3,4,5], left = 2, right = 4
// 输出：[1,4,3,2,5]

// 示例 2：
// 输入：head = [5], left = 1, right = 1
// 输出：[5]

// 提示：
// 链表中节点数目为 n
// 1 <= n <= 500
// -500 <= Node.val <= 500
// 1 <= left <= right <= n

// 进阶： 你可以使用一趟扫描完成反转吗？

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
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function(head, left, right) {
  if(left === right) {
    return head;
  }

  /**
   * 反转的区间左闭右开：[head, end) <br>
   * 
   * @param {ListNode} head 
   * @param {ListNode} end 
   * @returns {ListNode} 反转后的头结点，此时翻转部分尾节点指向空
   */
  const reverse = (head, end) => {
    let prev = null;
    let curr = head;
    let temp;
    while(curr !== end) {
      temp = curr;
      curr = curr.next;
      temp.next = prev;
      prev = temp;
    }
    return prev;
  };
  
  let dummyHead = new ListNode();
  dummyHead.next = head;

  let pre = dummyHead;
  let end = dummyHead;
  while(right >= 0) {
    // 前驱少移一位
    if(left > 1) {
      pre = pre.next;
      left--;
    }
    // 后驱多移一位
    if(right >= 0) {
      end = end.next;
      right--;
    }
  }

  let start = pre.next;
  pre.next = reverse(start, end);
  start.next = end;
  
  return dummyHead.next;
};

(function(){
  let root = new ListNode(0);
  root.next = new ListNode(1);
  root.next.next = new ListNode(2);
  root.next.next.next = new ListNode(3);
  root.next.next.next.next = new ListNode(4);
  root.next.next.next.next.next = new ListNode(5);

  const print = (head) => {
    let temp = head;
    let res = [];
    while(temp != null) {
      res.push(temp.val);
      temp = temp.next;
    }
    return res;
  };

  let res = reverseBetween(root, 2, 4);
  console.log(print(res));
})();