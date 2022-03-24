/**
 * Promise
 */
class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(executor) {
    let self = this;

    // 初始状态为等待
    self.state = MyPromise.PENDING;
    self.value = undefined;
    self.reason = undefined;

    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    // 成功
    let resolve = function(value) {
      if (self.state === MyPromise.PENDING) {
        self.state = MyPromise.FULFILLED;
        self.value = value;
        self.onResolvedCallbacks.forEach(fn => fn());
      }
    };

    // 失败
    let reject = function(reason) {
      if (self.state === MyPromise.PENDING) {
        self.state = MyPromise.REJECTED;
        self.reason = reason;
        self.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    // 立即执行
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // 同步直接处理
    if (this.state === MyPromise.FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.state === MyPromise.REJECTED) {
      onRejected(this.reason);
    }
    
    // 异步将函数放入数组，待resolve或reject时处理
    if (this.state === MyPromise.PENDING) {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}

/**
 * Promise.all
 * 
 * @param {Promise[]} promises 
 * @returns {Promise} 包含执行结果数组的 promise
 */
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    let res = new Array(promises.length).fill(null);
    let counter = 0;
    
    function trigger(data, i) {
      res[i] = data;
      // 使用计数来判断是否所有的promise都已经执行完成
      counter++;
      if(counter === promises.length) {
        // 只有当所有都执行完成时才返回一个promise
        resolve(res);
      }
    }

    for(let i = 0; i < promises.length; i++) {
      let current = promises[i];
      current.then((data) => {
        // 由于promise不会按序执行完成，需要将结果存入对应下标
        trigger(data, i);
      }).catch((err) => {
        // 只要有一个promise被reject则整个方法返回reject
        reject(err);
      });
    }
  });
};