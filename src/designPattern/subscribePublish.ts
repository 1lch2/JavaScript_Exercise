type EventCallback = (...args: any[]) => any;

class EventEmitter {
  // 每个事件名对应一组回调函数
  private eventBus: Map<string, EventCallback[]>;

  constructor() {
    this.eventBus = new Map();
  }

  /**
   * 添加事件订阅以及对应的回调
   * @param eventName 事件名
   * @param callback 回调函数
   */
  subscribe(eventName: string, callback: EventCallback) {
    const callbacks = this.eventBus.get(eventName);
    if (callbacks) {
      callbacks.push(callback);
    } else {
      this.eventBus.set(eventName, [callback]);
    }
    return {
      /**
       * 移除对应的回调
       */
      unsubscribe: () => {
        const callbacks = this.eventBus.get(eventName);
        const index = callbacks?.findIndex((f) => f === callback);
        if (index !== undefined && index !== -1) {
          callbacks?.splice(index, 1);
        }
      },
    };
  }

  /**
   * 添加一次性订阅，触发一次后自动移除
   * @param eventName 事件名
   * @param callback 回调函数
   */
  once(eventName: string, callback: EventCallback) {
    const onceWrapper = (...args: any[]) => {
      callback(...args);
      const callbacks = this.eventBus.get(eventName);
      if (callbacks) {
        const index = callbacks.findIndex((f) => f === onceWrapper);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
    return this.subscribe(eventName, onceWrapper);
  }

  /**
   * 触发指定事件
   * @param eventName 事件名
   * @param args 传递给回调的参数
   */
  emit(eventName: string, ...args: unknown[]) {
    const tasks = this.eventBus.get(eventName);
    if (tasks && tasks.length > 0) {
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

eventBus.subscribe("e1", fn1);
const { unsubscribe } = eventBus.subscribe("e2", fn2);

eventBus.emit("e1", "A", "20");
eventBus.emit("e2", "B", "10");

unsubscribe();

eventBus.emit("e2", "C", "30");

// 测试 once：一次性订阅
let onceFn = function (msg: string) {
  console.log(`Once: ${msg}`);
};
eventBus.once("e3", onceFn);
eventBus.emit("e3", "First");
eventBus.emit("e3", "Second");

// 测试同一事件多个订阅者
let multiFn1 = function (data: number) {
  console.log(`Multi 1: ${data}`);
};
let multiFn2 = function (data: number) {
  console.log(`Multi 2: ${data}`);
};
eventBus.subscribe("e4", multiFn1);
eventBus.subscribe("e4", multiFn2);
eventBus.emit("e4", 42);
