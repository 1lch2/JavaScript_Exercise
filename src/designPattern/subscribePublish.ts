type EventCallback = Function & { callback?: Function };

class EventEmitter {
  // 每个事件名对应一组回调函数
  private events: Map<string, EventCallback[]>;

  constructor() {
    this.events = new Map();
  }

  /**
   * 添加事件订阅以及对应的回调
   * @param name 事件名
   * @param fn 回调函数
   */
  add(name: string, fn: EventCallback) {
    const callbacks = this.events.get(name);
    if (callbacks) {
      callbacks.push(fn);
    } else {
      this.events.set(name, [fn]);
    }
  }

  /**
   * 添加一次性订阅，触发一次后自动移除
   * @param name 事件名
   * @param fn 回调函数
   */
  once(name: string, fn: Function) {
    // 包装一层：触发后先移除再执行原回调
    const wrapper = (...args: unknown[]) => {
      this.off(name, wrapper);
      fn(...args);
    };
    // 保留对原回调的引用，以便 off 时仍可用原 fn 移除
    wrapper.callback = fn;
    this.add(name, wrapper);
  }

  /**
   * 移除指定事件的某个回调
   * @param name 事件名
   * @param fn 要移除的回调函数
   */
  off(name: string, fn: Function) {
    const tasks = this.events.get(name);
    if (tasks) {
      const index = tasks.findIndex((f) => f === fn || f.callback === fn);
      if (index >= 0) {
        tasks.splice(index, 1);
      }
    }
  }

  /**
   * 触发指定事件
   * @param name 事件名
   * @param args 传递给回调的参数
   */
  emit(name: string, ...args: unknown[]) {
    const tasks = this.events.get(name);
    if (tasks) {
      // 创建副本，避免回调中继续注册相同事件导致死循环
      const tasksCopy = tasks.slice();
      for (const fn of tasksCopy) {
        fn(...args);
      }
    }
  }
}

// 测试
let eventBus = new EventEmitter();
let fn1 = function (name: string, age: number) {
  console.log(`Name: ${name} Age: ${age}`);
};
let fn2 = function (name: string) {
  console.log(`Hello, ${name}`);
};

eventBus.add("e1", fn1);
eventBus.add("e2", fn2);

eventBus.emit("e1", "A", "20");
eventBus.emit("e2", "B", "10");
