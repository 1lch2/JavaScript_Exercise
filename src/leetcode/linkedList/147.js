// 对链表进行插入排序。

// 从第一个元素开始，该链表可以被认为已经部分排序（用黑色表示）。
// 每次迭代时，从输入数据中移除一个元素（用红色表示），并原地将其插入到已排好序的链表中。

// 插入排序算法：
// 插入排序是迭代的，每次只移动一个元素，直到所有元素可以形成一个有序的输出列表。
// 每次迭代中，插入排序只从输入数据中移除一个待排序的元素，找到它在序列中适当的位置，并将其插入。
// 重复直到所有输入数据插入完为止。

// 示例 1：
// 输入: 4->2->1->3
// 输出: 1->2->3->4

// 示例 2：
// 输入: -1->5->3->4->0
// 输出: -1->0->3->4->5

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

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var insertionSortList = function(head) {
  if(head == null) {
    return null;
  }

  let dummyHead = new ListNode(0, head);

  // 已经有序部分的最后一个节点
  let end = dummyHead.next;
  let current = end.next;

  while(current != null) {
    // 若当前待排节点值比已排部分都要大
    // 则直接移动end指针
    if(current.val > end.val) {
      end = end.next;
    } else {
      // 定位到第一个比待排节点值大的节点
      let temp = dummyHead;
      while(current.val > temp.next.val) {
        temp = temp.next;
      }
      // 将当前待排节点移到指定位置
      end.next = current.next;
      current.next = temp.next;
      temp.next = current;
    }

    // 指针重新定位
    current = end.next;
  }

  return dummyHead.next;
};

(function(){
  let tail = new ListNode(0);
  let n1 = new ListNode(4, tail);
  let n2 = new ListNode(3, n1);
  let n3 = new ListNode(5, n2);
  let head = new ListNode(-1, n3);

  let newList = insertionSortList(head);

  let temp = newList;
  while(temp != null) {
    console.log(temp.val)
    temp = temp.next;
  }
})();