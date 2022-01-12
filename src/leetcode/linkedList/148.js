// 给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。

// 示例 1：
// 输入：head = [4,2,1,3]
// 输出：[1,2,3,4]

// 示例 2：
// 输入：head = [-1,5,3,4,0]
// 输出：[-1,0,3,4,5]

// 示例 3：
// 输入：head = []
// 输出：[]
//  
// 提示：
// 链表中节点的数目在范围 [0, 5 * 104] 内
// -105 <= Node.val <= 105
//  
// 进阶：你可以在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序吗？


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
 * 对链表自顶向下归并排序的过程如下。
 * 找到链表的中点，以中点为分界，将链表拆分成两个子链表。
 * 寻找链表的中点可以使用快慢指针的做法，快指针每次移动 2 步，慢指针每次移动 1 步，当快指针到达链表末尾时，慢指针指向的链表节点即为链表的中点。
 * 
 * 对两个子链表分别排序。
 * 将两个排序后的子链表合并，得到完整的排序后的链表。
 * 可以使用「21. 合并两个有序链表」的做法，将两个有序的子链表进行合并。
 * 
 * 上述过程可以通过递归实现。
 * 递归的终止条件是链表的节点个数小于或等于 1，即当链表为空或者链表只包含 1 个节点时，不需要对链表进行拆分和排序。
 * -1, 5, 3, 4, 0
 * @param {ListNode} head
 * @return {ListNode}
 */ 
 var sortList = function(head) {
  const mergeSort = (head, tail) => {
    if(head == null) {
      return head;
    }
    if(head.next == tail) {
      // 切割链表
      head.next = null;
      return head;
    }

    // 快慢指针定位中点
    let fast = head;
    let slow = head;
    while(fast != tail && fast.next != tail) {
      fast = fast.next.next;
      slow = slow.next;
    }
    
    // 递归分割再合并
    let mid = slow;
    let left = mergeSort(head, mid);
    let right = mergeSort(mid, tail);
    return merge(left, right);
  }

  // 合并两个有序链表
  const merge = (list1, list2) => {
    let dummyHead = new ListNode(0);
    let temp = dummyHead;
    let l1 = list1;
    let l2 = list2;
    while(l1 != null && l2 != null) {
      if(l1.val < l2.val) {
        temp.next = l1;
        l1 = l1.next;
      } else {
        temp.next = l2;
        l2 = l2.next;
      }
      temp = temp.next;
    }

    temp.next = (l1 != null ? l1 : l2);
    return dummyHead.next;
  }

  return mergeSort(head, null);
};

(function(){
  let tail = new ListNode(0);
  let n1 = new ListNode(4, tail);
  let n2 = new ListNode(3, n1);
  let n3 = new ListNode(5, n2);
  let head = new ListNode(-1, n3);

  let res = sortList(head);
})();