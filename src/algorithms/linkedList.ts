export class ListNode {
  val: any;
  next: ListNode | null;

  constructor(val?: any, next?: ListNode | undefined) {
    this.val = val ?? 0;
    this.next = next ?? null;
  }

  /**
   * Print out the linked list.
   * @param {ListNode} linkedlist Head node of the linked list
   * @returns {string} Serialized linked list
   */
  static print(linkedlist: ListNode | undefined | null): string {
    let current = linkedlist;
    let out = "";
    while (current != null) {
      out += current.val;
      if (current.next != null) {
        out += " -> ";
      }
      current = current.next;
    }
    return out;
  }

  /**
   * De-serialize from a list
   * @param {any[]} list Array of linked list values
   * @returns {ListNode | null} Head node of linked list.
   */
  static deserialize(list: any[]): ListNode | null {
    if (list.length === 0) {
      return null;
    }

    const head = new ListNode(list[0]);
    let curr = head;
    for (let i = 1; i < list.length; i++) {
      curr.next = new ListNode(list[i]);
      curr = curr.next;
    }
    return head;
  }
}
