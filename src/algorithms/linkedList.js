/**
 * Linked list node
 * @param {Number} val value of the node
 * @param {Number} next pointer to the next node
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val);
  this.next = (next === undefined ? null : next);
}

/**
 * Print out the linked list.
 * @param {ListNode} linkedlist Head node of the linked list
 * @returns {string[]} Serialized linked list
 */
export const printLinkedList = function (linkedlist) {
  let current = linkedlist;
  let out = "";
  while (current != null) {
    out += current.val;
    if (current.next != null) {
      out += " -> ";
    }
    current = current.next;
  }
  console.log(out);
  return out;
};


/**
 * De-serialize from a list
 * @param {any[]} list Array of linked list values
 * @returns {ListNode} Head node of linked list.
 */
export const deserialize = function (list) {
  let dummyRoot = new ListNode();
  if (list.length == 0) {
    return null;
  }

  let pointer = dummyRoot;
  let current;
  for (current of list) {
    pointer.next = new ListNode(current);
    pointer = pointer.next;
  }
  return dummyRoot.next;
};
