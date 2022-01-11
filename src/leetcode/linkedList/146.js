// 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。

// 实现 LRUCache 类：
// LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存

// int get(int key) 
// 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。

// void put(int key, int value) 
// 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，则向缓存中插入该组 key-value 。
// 如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。

// 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。

// 示例：

// 输入
// ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
// [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]

// 输出
// [null, null, null, 1, null, -1, null, -1, 3, 4]

// 解释
// LRUCache lRUCache = new LRUCache(2);
// lRUCache.put(1, 1); // 缓存是 {1=1}
// lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
// lRUCache.get(1);    // 返回 1
// lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
// lRUCache.get(2);    // 返回 -1 (未找到)
// lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
// lRUCache.get(1);    // 返回 -1 (未找到)
// lRUCache.get(3);    // 返回 3
// lRUCache.get(4);    // 返回 4
//  
// 提示：
// 1 <= capacity <= 3000
// 0 <= key <= 10000
// 0 <= value <= 105
// 最多调用 2 * 105 次 get 和 put

/**
 * Definition for doubly-linked list.
 * 
 * @param {Number} key key of the node
 * @param {Number} val value of the node
 * @param {ListNode} prev pointer to the previous node
 * @param {ListNode} next pointer to the next node
 */
 function ListNode(key, val, prev, next) {
  this.key = (key===undefined ? 0 : key)
  this.val = (val===undefined ? 0 : val)
  this.prev = (prev === undefined ? null : prev)
  this.next = (next===undefined ? null : next)
}

/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
  this.capacity = capacity; // capacity
  this.map = new Map(); // hashmap，key为节点的key，value为节点的引用
  this.dummyHead = new ListNode(); // 虚拟头结点
  this.dummyTail = new ListNode(); // 虚拟尾节点
  
  // 虚拟节点头尾相连
  this.dummyHead.next = this.dummyTail;
  this.dummyTail.prev = this.dummyHead;
};

/** 
 * Get
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
  if(this.map.has(key)) {
    let node = this.map.get(key);
    this.moveToHead(node)
    return node.val;
  } else {
    return -1;
  }
};

/** 
 * Put
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
  if(this.map.has(key)) {
    // 修改节点
    let node = this.map.get(key);
    node.val = value;
    this.moveToHead(node);
  } else {
    // 创建新节点
    let node = new ListNode(key, value);
    
    // 仅当key不存在且容量已满时执行移除操作
    if(this.map.size === this.capacity) {
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
};

/**
 * move the node to the front
 * 
 * 靠近头结点的节点使用频次最高
 * 
 * @param {ListNode} node key
 */
LRUCache.prototype.moveToHead = function(node) {
  if(node == undefined) {
    return;
  }

  // 已在最前则不操作
  if(node.prev === this.dummyHead) {
    return;
  }

  // 非已存在节点则只执行插入操作
  if(node.prev != null && node.next != null) {
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

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */