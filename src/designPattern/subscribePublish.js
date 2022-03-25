class EventEmitter {

  /**
   * 构造函数
   */
  constructor() {
    // 以事件名为 key，保存对应的回调函数数组
    this.events = {};
  }

  /**
   * 添加事件订阅以及对应的回调
   * @param {String} name 事件名
   * @param {Function} fn 回调函数
   */
  on(name, fn) {
    if (this.events[name]) {
      this.events[name].push(fn);
    } else {
      this.events[name] = [fn];
    }
  }

  /**
   * 
   * @param {String} name 
   * @param {Function} fn 
   */
  off(name, fn) {
    let tasks = this.events[name];
    if (tasks) {
      const index = tasks.findIndex(f => f === fn || f.callback === fn);
      if (index >= 0) {
        tasks.splice(index, 1);
      }
    }
  }

  /**
   * 
   * @param {String} name 事件名
   * @param {Boolean} once 是否只触发一次（？）
   * @param  {...any} args 回调函数的参数
   */
  emit(name, once = false, ...args) {
    if (this.events[name]) {
      // 创建副本，如果回调函数内继续注册相同事件，会造成死循环
      let tasks = this.events[name].slice();
      for (let fn of tasks) {
        fn(...args);
      }
      if (once) {
        delete this.events[name];
      }
    }
  }
}

// 测试
let eventBus = new EventEmitter();
let fn1 = function(name, age) {
  console.log(`${name} ${age}`);
};
let fn2 = function(name, age) {
  console.log(`hello, ${name} ${age}`);
};
eventBus.on("aaa", fn1);
eventBus.on("aaa", fn2);
eventBus.emit("aaa", false, "布兰", 12);
// '布兰 12'
// 'hello, 布兰 12'
