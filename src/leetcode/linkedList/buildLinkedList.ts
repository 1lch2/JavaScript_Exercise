export class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

export const buildLinkedList = (arr: number[]) => {
  if (arr.length === 0) return null;

  let head = new ListNode(arr[0]);
  let curr = head;

  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }

  return head;
};

export const printLinkedList = (head: ListNode | null) => {
  let curr = head;
  let result = [];

  while (curr !== null) {
    result.push(curr.val);
    curr = curr.next;
  }

  console.log(result.join(" -> "));
};
