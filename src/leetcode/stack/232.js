// JZ09
// 用两个栈实现一个队列。
// 队列的声明如下，请实现它的两个函数 appendTail 和 deleteHead ，
// 分别完成在队列尾部插入整数和在队列头部删除整数的功能。
// (若队列中没有元素，deleteHead 操作返回 -1 )

// 示例 1：
// 输入：
// ["CQueue","appendTail","deleteHead","deleteHead"]
// [[],[3],[],[]]
// 输出：[null,null,3,-1]

// 示例 2：
// 输入：
// ["CQueue","deleteHead","appendTail","appendTail","deleteHead","deleteHead"]
// [[],[],[5],[2],[],[]]
// 输出：[null,-1,null,null,5,2]

// 提示：
// 1 <= values <= 10000
// 最多会对 appendTail、deleteHead 进行 10000 次调用

var CQueue = function() {
  // s1作为弹栈时使用的栈
  this.s1 = [];
  // s2作为压栈时使用的辅助栈
  this.s2 = [];
};

/** 
 * @param {number} value
 * @return {void}
 */
CQueue.prototype.appendTail = function(value) {
  // 将s1栈中的所有元素弹出压入s2
  while(this.s1.length !== 0) {
    this.s2.push(this.s1.pop()); 
  }

  // 将新元素压入s1栈
  this.s1.push(value);

  // 再将所有s2中元素弹出压入s1
  // s1随时可以弹栈，s2为空
  while(this.s2.length !== 0) {
    this.s1.push(this.s2.pop());
  }
};

/**
 * @return {number}
 */
CQueue.prototype.deleteHead = function() {
  if(this.s1.length === 0) {
    return -1;
  }
  return this.s1.pop();
};

/**
 * Your CQueue object will be instantiated and called as such:
 * var obj = new CQueue()
 * obj.appendTail(value)
 * var param_2 = obj.deleteHead()
 */