# ES6 - Proxy
## 概述
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（meta programming），即对编程语言进行编程。

## 语法
ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。
```js
var proxy = new Proxy(target, handler);
```
target 表示要拦截的目标对象，handler 是一个对象，用来定制拦截行为。如果handler没有设置任何拦截，那就等同于直接通向原对象。

下例中，使用Proxy拦截了读取属性的行为。
```js
var proxy = new Proxy({}, {
  get: function(target, propKey) {
    return 35;
  }
});

proxy.time; // 35
proxy.name; // 35
proxy.title; // 35
```

### 拦截操作一览
下面是 Proxy 支持的拦截操作一览，一共 13 种。
- `get(target, propKey, receiver)`：拦截点操作符和方括号读取的操作，如 `obj.val` 和 `obj["val"]`
- `set(target, propKey, value, receiver)`：拦截对象属性的设置，返回一个 boolean 值
- `has(target, propKey)`：拦截propKey in proxy的操作，返回一个 boolean 值。