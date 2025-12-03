interface DualLinkedListNode {
  key: string | number;
  val: any;
  prev: DualLinkedListNode | null;
  next: DualLinkedListNode | null;
}

/**
 * 双链表节点
 *
 * @param {Number} key key of the node
 * @param {Number} val value of the node
 * @param {DualLinkedListNode} prev pointer to the previous node
 * @param {DualLinkedListNode} next pointer to the next node
 */
class DualLinkedListNode implements DualLinkedListNode {
  constructor(
    key: string | number,
    val: any,
    prev?: DualLinkedListNode,
    next?: DualLinkedListNode
  ) {
    this.key = key;
    this.val = val;
    this.prev = prev ?? null;
    this.next = next ?? null;
  }
}

export interface LRUCache {
  capacity: number;
  map: Map<string | number, DualLinkedListNode>;
  dummyHead: DualLinkedListNode;
  dummyTail: DualLinkedListNode;
}

/**
 * @param {number} capacity
 */
export class LRUCache implements LRUCache {
  _FALLBACK_VALUE = -1;

  constructor(capacity: number) {
    this.capacity = capacity <= 0 ? 1 : capacity; // capacity
    this.map = new Map<string | number, DualLinkedListNode>(); // hashmap，key为节点的key，value为节点的引用
    this.dummyHead = new DualLinkedListNode(-1, -1); // 虚拟头结点
    this.dummyTail = new DualLinkedListNode(-1, -1); // 虚拟尾节点

    // 虚拟节点头尾相连
    this.dummyHead.next = this.dummyTail;
    this.dummyTail.prev = this.dummyHead;
  }

  get(key: DualLinkedListNode["key"]): DualLinkedListNode["val"] {
    if (this.map.has(key)) {
      let node = this.map.get(key);
      if (node) {
        this.moveToHead(node);
        return node.val;
      }
    } else {
      return this._FALLBACK_VALUE;
    }
  }

  put(key: DualLinkedListNode["key"], value: DualLinkedListNode["val"]) {
    if (this.map.has(key)) {
      // 修改节点
      let node = this.map.get(key);
      if (node) {
        node.val = value;
        this.moveToHead(node);
      }
    } else {
      // 创建新节点
      let node = new DualLinkedListNode(key, value);

      // 仅当key不存在且容量已满时执行移除操作
      if (this.map.size === this.capacity) {
        let lastNode = this.dummyTail.prev as DualLinkedListNode;

        // 移除最后一个节点
        lastNode.prev!.next = this.dummyTail; // 双链表必定不为空
        this.dummyTail.prev = lastNode.prev;
        lastNode.prev = null;
        lastNode.next = null;

        // 移除map中对应键值对
        this.map.delete(lastNode.key);
      }
      // 插入或更新值
      this.map.set(key, node);
      this.moveToHead(node);
    }
  }

  /**
   * move the node to the front
   *
   * 靠近头结点的节点使用频次最高
   */
  moveToHead(node: DualLinkedListNode) {
    if (node == undefined) {
      return;
    }

    // 已在最前则不操作
    if (node.prev === this.dummyHead) {
      return;
    }

    // 非已存在节点则只执行插入操作
    if (node.prev != null && node.next != null) {
      // 将当前节点移出双链表
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }

    // 将节点插入伪头结点之后
    node.next = this.dummyHead.next;
    node.prev = this.dummyHead;
    this.dummyHead.next!.prev = node;
    this.dummyHead.next = node;
  }
}
