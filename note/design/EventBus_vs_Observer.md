# 观察者模式 vs 发布-订阅模式

## 1. 核心差异概览

**“它们最大的区别在于：是否有中间的调度中心（Event Channel / Broker）。”**

* **观察者模式 (Observer)**：观察者直接订阅目标，**两者松耦合，但依然互相感知**。
* **发布-订阅模式 (Pub-Sub)**：发布者和订阅者通过第三方（调度中心）通信，**两者完全解耦，互不认识**。

## 2. 深度拆解：观察者模式 (Observer Pattern)

### 2.1 角色定义

* **Subject（目标/被观察者）**：维护一组观察者列表，提供添加、删除观察者的方法，并负责在状态变化时通知它们。
* **Observer（观察者）**：提供一个更新接口（如 update()），当收到 Subject 的通知时被调用。

### 2.2 工作流程

1. Observer 显式地将自己注册（add）到 Subject 的列表中。
2. Subject 状态发生变化。
3. Subject 遍历内部列表，**直接调用**每个 Observer 的 update() 方法。

### 2.3 代码示意

```js
class Subject {
  constructor() {
    this.observers = []; // 内部维护观察者列表
  }

  add(observer) {
    this.observers.push(observer);
  }

  notify() {
    this.observers.forEach(observer => observer.update()); // 直接调用
  }
}

class Observer {
  update() {
    console.log('Observer updated!');
  }
}
```

### 2.4 前端典型应用

* **Vue 2.x/3.x 的响应式系统**：Dep (Subject) 收集 Watcher (Observer)。数据变更时 Dep 直接通知 Watcher。
* **DOM 事件监听**（逻辑上节点直接持有监听回调）。

## 3. 深度拆解：发布-订阅模式 (Publish-Subscribe Pattern)

### 3.1 角色定义

* **Publisher（发布者）**：只负责产生事件，不关心谁在订阅。
* **Subscriber（订阅者）**：只负责订阅事件，不关心谁发布的。
* **Event Channel（调度中心/事件总线）**：**这是与观察者模式的核心区别**。它负责存储事件和回调的对应关系，并分发消息。

### 3.2 工作流程

1. Subscriber 向 Event Channel 订阅（$on）特定类型的事件。
2. Publisher 向 Event Channel 发布（$emit）特定类型的事件。
3. Event Channel 找到该事件类型对应的所有回调函数并执行。
4. **关键点**：Publisher 和 Subscriber 甚至不知道对方的存在。

### 3.3 代码示意

```js
class EventChannel {
  constructor() {
    this.events = {}; // 存储 'eventName': [cb1, cb2]
  }

  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}
// 使用时：发布者和订阅者都只持有 EventChannel，不持有对方
```
### 3.4 前端典型应用

* **EventBus**（Vue 2 中常用的全局事件总线）。
* **Node.js 的 EventEmitter**。
* **Webpack 的 Tapable**。

## 4. 核心对比表

| 特性 | 观察者模式 (Observer) | 发布-订阅模式 (Pub-Sub) |
| :---- | :---- | :---- |
| **核心结构** | Subject <---> Observer | Publisher ---> **Event Channel** ---> Subscriber |
| **通信方式** | 直接通信 | 通过中间代理（调度中心）通信 |
| **耦合度** | **松耦合** (Subject 需维护 Observer 列表) | **完全解耦** (双方互不感知) |
| **关注点** | 此时此刻的数据/状态变化 | 事件流、消息分发 |
| **灵活性** | 较低，通常用于特定对象间的绑定 | 较高，适合跨组件、跨模块通信 |
| **典型场景** | Vue 响应式原理、MobX | 全局消息通知、Node.js EventEmitter |
