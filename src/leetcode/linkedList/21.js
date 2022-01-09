// 将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。

// 示例 1
// 输入l1 = [1,2,4], l2 = [1,3,4]
// 输出[1,1,2,3,4,4]

// 示例 2
// 输入l1 = [], l2 = []
// 输出[]

// 示例 3
// 输入l1 = [], l2 = [0]
// 输出[0]

// 提示
// 两个链表的节点数目范围是 [0, 50]
// -100 <= Node.val <= 100
// l1 和 l2 均按 非递减顺序 排列


// Definition for singly-linked list.
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val)
  this.next = (next === undefined ? null : next)
}

/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function(list1, list2) {
  // 任意链表为空则返回另一个
  if (list1 == null || list2 == null) {
    return (list1 == null ? list2 : list1)
  }
  
  let dummyHead = new ListNode(0);
  let res = dummyHead;
  let first = list1;
  let second = list2;

  while (first != null && second != null) {
    if (first.val < second.val) {
      res.next = first;
      first = first.next;
    } else {
      res.next = second;
      second = second.next;
    }
    res = res.next;
  }

  res.next = first ? first : second;

  return dummyHead.next;
};