# JavaScript基础 - Promise
## 定义
> 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。
> 
> 从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise对象代表一个异步操作，有三种状态：
1. pending（进行中）
2. fulfilled（已成功）
3. rejected（已失败）。

只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。

如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。


## 用法
### 构造器
Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

Promise的构造器语法如下：
```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```
`resolve`函数的作用是，将Promise对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。

`reject`函数的作用是，将Promise对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

Promise 新建后就会立即执行。如下例所示：
```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

Promise的执行器（构造器）内部只能调用一个resolve或reject，一旦调用了其中之一，状态就不会再改变，再次调用另一个方法会被忽略。

`resolve()`后不应该再有其他操作，如果后面有其他操作会在resolve前执行。
```js
new Promise((resolve) => {
  console.log(1);
  resolve();
  console.log(2);
}).then(() => {
  console.log(3);
});

// 1
// 2
// 3
```

### then
Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。

`then`方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved时调用，第二个回调函数是Promise对象的状态变为rejected时调用。

这两个函数都是可选的，不一定要提供。它们都接受Promise对象传出的值作为参数。

如果调用resolve函数和reject函数时带有参数，那么它们的参数会被传递给回调函数。

举例如下：
```js
let promise = new Promise(function(resolve) {
    resolve(10);
});

promise.then(function(value) {
  // success
  console.log("value is " + value)
}, function(error) {
  // failure
});

// value is 10
```

## catch()
通过catch方法可以捕获到异常。它等同于`.then(null, f)`，只是一个简写形式。
```js
let promise = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error("Whoops!")), 1000);
});

// .catch(f) 与 promise.then(null, f) 一样
promise.catch(alert); // 1 秒后显示 "Error: Whoops!"
```

如果 Promise 状态已经变成resolved，再抛出错误是无效的。如下例：
```js
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise.then(function(value) { console.log(value) })
       .catch(function(error) { console.log(error) });

// ok
```

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。

```js
const promise = new Promise(function(resolve) {
  resolve();
});

promise.then(function() {
    throw new Error("err");
}).then(function() {
    console.log("ignore error");
}).catch(function(error) {
    console.log(error);
})

// Error: err
//    at <anonymous>:6:11
```

跟传统的try/catch代码块不同的是，如果没有使用catch()方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。
```js
setTimeout(() => console.log("this line will run as usual;"), 0)

new Promise(function(resolve) {
  throw new Error("test err");
  resolve();
}).then(function() {
  console.log("everything is fine.")
});

// Uncaught (in promise) Error: test err
//     at <anonymous>:4:9
//     at new Promise (<anonymous>)
//     at <anonymous>:3:1
// this line will run as usual;
```
上述例子中抛出异常不影响setTimeout中函数的正常执行。

catch 后还可以接 then，若捕获到错误，则会在运行 catch中函数后执行then。若没有错误则跳过catch。
```js
new Promise(function(resolve) {
  throw new Error("test err");
  resolve();
}).catch(function(err) {
  console.log("got err: " + err);
}).then(function() {
  console.log("error processed");
});

// got err: Error: test err
// error processed
```

## finally()
`finally()` 方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数。

finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。
这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。


```js
new Promise(function(resolve) {
  throw new Error("test err");
  resolve();
}).catch(function(err) {
  console.log("got err: " + err);
}).then(function() {
  console.log("error processed");
}).finally(function() {
  console.log("finished");
});

// got err: Error: test err
// error processed
// finished
```

finally本质上是then方法的特例。
```js
promise.finally(() => {
  // 语句
});

// 等同于
promise.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```

因此可以手动实现finally方法：
```js
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

## Promise.all()
Promise.all()方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

```js
const p = Promise.all([p1, p2, p3]);
```

上面代码中，Promise.all()方法接受一个**数组**作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用`Promise.resolve`方法，将参数转为 Promise 实例，再进一步处理。

另外，Promise.all()方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。

p的状态由p1、p2、p3决定，分成两种情况。
1. 只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。
2. 只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。

举例如下：
```js
// 生成一个Promise对象的数组
const promises = [2, 3, 5, 7, 11, 13].map(function(id) {
  return getJSON('/post/' + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});
```