/**
 * Linked list node
 * @param {Number} val value of the node
 * @param {Number} next pointer to the next node
 */
function ListNode(val, next) {
  this.val = (val === undefined ? 0 : val)
  this.next = (next === undefined ? null : next)
}

// Print out the linked list.
var printLinkedList = function (linkedlist) {
  let current = linkedlist;
  let out = "";
  while (current != null) {
    out += current.val;
    if (current.next != null) {
      out += " -> "
    }
    current = current.next;
  }
  console.log(out);
  return out;
};


// De-serialize from a list
var deserialize = function (list) {
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

(function () {
  let root = new ListNode(0);
  let first = new ListNode(1);
  let second = new ListNode(2);

  root.next = first;
  first.next = second;

  printLinkedList(root);

  let list = [0, 1, 2, 3, 4];
  let res = deserialize(list);

  // Ref: https://stackoverflow.com/questions/7390426/better-way-to-get-type-of-a-javascript-variable
  console.log("res type: " + res.constructor.name); 
  console.log("res: " + printLinkedList(res));
})();
