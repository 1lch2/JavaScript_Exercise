# Node与浏览器环境的区别
## 组成
浏览器：
- ECMAScript（语言基础，如：语法、数据类型结构以及一些内置对象）
- DOM（一些操作页面元素的方法）
- BOM（一些操作浏览器的方法）

Node.js：
- ECMAScript（语言基础，如：语法、数据类型结构以及一些内置对象）
- OS（操作系统）
- file（文件系统）
- net（网络系统）
- database（数据库）

## 全局对象
浏览器：
全局对象为 `window`。

```js
var a = 42;
window.a; // 42
```

Node.js：
全局对象为 `global`。

```js
var a = 42;
global.a; // 42
```

## this
Node.js:
this在最外部时，与module.exports，exports指向同一个内存空间

对于如下JS文件，在 Node 环境中运行结果如下
```js
this.a = 1;
exports.b = 2;
module.exports.c = 3;

// node text.js
// { a: 1, b: 2, c: 3}
```
