// 给你一个链表数组，每个链表都已经按升序排列。

// 请你将所有链表合并到一个升序链表中，返回合并后的链表。

// 示例 1
// 输入lists = [[1,4,5],[1,3,4],[2,6]]
// 输出[1,1,2,3,4,4,5,6]
// 解释链表数组如下
// [
//   1->4->5,
//   1->3->4,
//   2->6
// ]

// 将它们合并到一个有序链表中得到。
// 1->1->2->3->4->4->5->6

// 示例 2
// 输入lists = []
// 输出[]

// 示例 3
// 输入lists = [[]]
// 输出[]

// 提示
// k == lists.length
// 0 <= k <= 10^4
// 0 <= lists[i].length <= 500
// -10^4 <= lists[i][j] <= 10^4

// lists[i] 按 升序 排列
// lists[i].length 的总和不超过 10^4


// Definition for singly-linked list.
function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val);
  this.next = (next===undefined ? null : next);
}

/**
 * 顺序合并
 * 
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
  if (lists.length == 0) {
    return null;
  }

  let res = null;
  for (let index = 0; index < lists.length; index++) {
    res = mergeTwoLists(res, lists[index]);
  }
  return res;
};

/**
 * 并归方法
 * 
 * @param {ListNode[]} lists list of linked-lists
 */
var mergeKLists2 = function(lists) {
  if(lists.length == 0) {
    return null;
  }

  // 递归分治
  const merge = (lists, left, right) => {
    // Base case
    if(left >= right) {
      return lists[left];
    }

    // Divide
    let mid = Math.floor((left + right) / 2);
    let leftList = merge(lists, left, mid);
    let rightList = merge(lists, mid + 1, right);

    return mergeTwoLists(leftList, rightList);
  };

  return merge(lists, 0, lists.length - 1);
};


// 合并两个列表
const mergeTwoLists = function(list1, list2) {
  if (list1 == null || list2 == null) {
    return (list1 == null ? list2 : list1);
  }
  
  let dummyHead = new ListNode(0);
  let res = dummyHead;

  while (list1 != null && list2 != null) {
    if (list1.val < list2.val) {
      res.next = list1;
      list1 = list1.next;
    } else {
      res.next = list2;
      list2 = list2.next;
    }
    res = res.next;
  }
  res.next = list1 ? list1 : list2;

  return dummyHead.next;
};