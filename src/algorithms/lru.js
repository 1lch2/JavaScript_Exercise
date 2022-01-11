/**
 * 双链表节点
 * 
 * @param {Number} key key of the node
 * @param {Number} val value of the node
 * @param {ListNode} prev pointer to the previous node
 * @param {ListNode} next pointer to the next node
 */
class ListNode {
  constructor(key, val, prev, next) {
    this.key = (key === undefined ? 0 : key);
    this.val = (val === undefined ? 0 : val);
    this.prev = (prev === undefined ? null : prev);
    this.next = (next === undefined ? null : next);
  }
}

/**
 * @param {number} capacity
 */
class LRUCache {

  _FALLBACK_VALUE = -1;

  constructor(capacity) {
    this.capacity = capacity; // capacity
    this.map = new Map(); // hashmap，key为节点的key，value为节点的引用
    this.dummyHead = new ListNode(); // 虚拟头结点
    this.dummyTail = new ListNode(); // 虚拟尾节点

    // 虚拟节点头尾相连
    this.dummyHead.next = this.dummyTail;
    this.dummyTail.prev = this.dummyHead;
  }

  /**
   * Get
   * @param {number} key
   * @return {number}
   */
  get(key) {
    if (this.map.has(key)) {
      let node = this.map.get(key);
      this.moveToHead(node);
      return node.val;
    } else {
      return this._FALLBACK_VALUE;
    }
  }

  /**
   * Put
   * @param {number} key
   * @param {number} value
   * @return {void}
   */
  put(key, value) {
    if (this.map.has(key)) {
      // 修改节点
      let node = this.map.get(key);
      node.val = value;
      this.moveToHead(node);
    } else {
      // 创建新节点
      let node = new ListNode(key, value);

      // 仅当key不存在且容量已满时执行移除操作
      if (this.map.size === this.capacity) {
        let lastNode = this.dummyTail.prev;

        // 移除最后一个节点
        lastNode.prev.next = this.dummyTail;
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
   *
   * @param {ListNode} node key
   */
  moveToHead(node) {
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
    this.dummyHead.next.prev = node;
    this.dummyHead.next = node;
  }
}
