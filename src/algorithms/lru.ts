/**
 * 双向链表
 */
class DualListNode {
  key: number;
  val: number;
  prev: DualListNode | null;
  next: DualListNode | null;

  constructor(
    key: number,
    val: number,
    prev?: DualListNode | null,
    next?: DualListNode | null,
  ) {
    this.key = key;
    this.val = val;
    this.prev = prev ?? null;
    this.next = next ?? null;
  }
}

interface LRUCache {
  capacity: number;
  store: Map<number, DualListNode>;
  head: DualListNode;
  tail: DualListNode;
}

class LRUCache {
  constructor(capacity: number) {
    this.capacity = capacity;
    this.store = new Map<number, DualListNode>();
    this.head = new DualListNode(-1, 0);
    this.tail = new DualListNode(114514, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    const node = this.store.get(key);
    if (!node) {
      return -1;
    }
    this.moveToTop(node);
    return node.val;
  }

  put(key: number, value: number): void {
    const node = this.store.get(key);
    // 若已经存在则更新值
    if (node) {
      node.val = value;
      this.moveToTop(node);
      return;
    }

    // 往头节点后添加
    const newNode = new DualListNode(key, value);
    const prevTop = this.head.next!; // 头节点的下一个节点一定不为空
    this.head.next = newNode;
    newNode.next = prevTop;
    newNode.prev = this.head;
    prevTop.prev = newNode;

    this.store.set(key, newNode);

    // 如果超出上限就移除最后一个
    if (this.store.size > this.capacity) {
      const currEnd = this.tail.prev!; // 尾节点的前一个一定不为空
      const prevEnd = currEnd.prev!;
      prevEnd.next = this.tail;
      this.tail.prev = prevEnd;
      currEnd.prev = null;
      currEnd.next = null;
      this.store.delete(currEnd.key);
    }
  }

  moveToTop(node: DualListNode): void {
    // 因为头尾节点一定不为空，其他kv节点都在头尾之间，所以使用非空断言
    const prevNode = node.prev!;
    const nextNode = node.next!;

    if (prevNode === this.head) {
      // 已经在第一个位置，不用操作
      return;
    }
    prevNode.next = nextNode;
    nextNode.prev = prevNode;

    const prevTop = this.head.next!;
    if (this.store.size === 1) {
      // 目前只有一个元素，不用操作
      return;
    }

    this.head.next = node;
    node.next = prevTop;
    prevTop.prev = node;
    node.prev = this.head;
  }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */

const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
console.log(cache.get(1));
cache.put(3, 3);
console.log(cache.get(2));
cache.put(4, 4);
console.log(cache.get(1));
console.log(cache.get(3));
console.log(cache.get(4));
