// 输入一个链表的头节点，从尾到头反过来返回每个节点的值（用数组返回）。

// 示例 1：
// 输入：head = [1,3,2]
// 输出：[2,3,1]

// 限制：
// 0 <= 链表长度 <= 10000

// Definition for singly-linked list.
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

/**
 * @param {ListNode} head
 * @return {number[]}
 */
var reversePrint = function(head) {
  if(head == null) {
    return [];
  }

  let res = [];
  let temp = head;
  while(temp !== null) {
    res.push(temp.val);
    temp = temp.next;
  }

  /**
   * reverse array
   * @param {Number[]} nums number array
   */
  const reverse = (nums) => {
    let res = [];
    for(let i = nums.length - 1; i >= 0; i--) {
      res.push(nums[i]);
    }
    return res;
  };

  return reverse(res);
};

(function(){
  let root = new ListNode(1);
  let l1 = new ListNode(2);
  let l2 = new ListNode(3);

  root.next = l1;
  l1.next = l2;

  console.log(reversePrint(root));
})();