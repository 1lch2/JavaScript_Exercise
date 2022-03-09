/* eslint-disable no-unused-vars */

/**
 * 优先队列 - 小顶堆版
 */
class HeapPriorityQueue {

  constructor() {
    this.heap = [];
  }

  swapNodes(a, b) {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }

  shiftUp(index) {
    // 堆顶元素不需要调整
    if (index === 0) {
      return;
    }

    // 获取父节点下标
    let parentIndex = (index - 1) >> 1;
    if (this.heap[parentIndex] > this.heap[index]) {
      this.swapNodes(parentIndex, index);
      // 递归上移
      this.shiftUp(parentIndex);
    }
  }

  shiftDown(index) {
    // 获取左右子节点下标
    let leftIndex = index * 2 + 1;
    let rightIndex = index * 2 + 2;

    // 叶子节点无需下沉
    if(index === this.heap.length - 1) {
      return;
    }

    if(this.heap[leftIndex] < this.heap[index]) {
      this.swapNodes(leftIndex, index);
      this.shiftDown(leftIndex);
    }
    if(this.heap[rightIndex] < this.heap[index]) {
      this.swapNodes(rightIndex, index);
      this.shiftDown(rightIndex);
    }
  }

  insert(val) {
    this.heap.push(val);
    this.shiftUp(this.heap.length - 1);
  }

  pop() {
    // 将最后一个元素移除并替换到堆顶，再从堆顶下沉
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }

  getMin() {
    return this.heap[0];
  }
}


/**
 * 优先队列 - 数组版
 */
class ArrayPriorityQueue {

  constructor() {
    this.items = [];
  }

  enqueue(val) {
    if (val >= this.items[0]) {
      this.items.push(val);
    } else {
      this.items.unshift(val);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  getMin() {
    return this.items[0];
  }
}
