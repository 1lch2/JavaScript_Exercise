# Async/Await
## async 函数
`async` 关键字在 ES2017 中引入，它的返回值是一个`Promise`对象。

### 用法
`async` 函数返回一个 `Promise` 对象，可以使用 then 方法添加回调函数。当函数执行的时候，一旦遇到 await 就会先返回，等到异步操作完成，再接着执行函数体内后面的语句。如下例所示，3秒后才会打印log

```js
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function asyncPrint(value, ms) {
  await timeout(ms);
  console.log(value);
}

asyncPrint('hello world', 3000);
```

async 关键字让函数具有异步特征，但是其代码是同步求值的，在参数和闭包方面，异步函数和普通函数行为一致。如下例所示：
```js
async function foo() {
    console.log(1);
}

foo();
console.log(2);

// 1
// 2
```

若 async 函数返回了值（没有return的话会返回undefined），这个值会被`Promise.resolve()`包装成一个 Promise 对象。
```js
async function a() {
    console.log(1);
    return 3;
    // 等价于下面的写法
    return Promise.resolve(3);
}

a().then(res => console.log(res));
console.log(2);

// 1
// 2
// 3
```

## 错误处理
```js
async function test() {
  try {
    await new Promise((resolve) => {
      setTimeout(function() {
        console.log("waited for 3s");
        resolve("result");
      }, 3000)
    }).then(res => console.log("res: " + res))

    console.log("all good");

    await new Promise(() => {
      throw new Error("errrrrr");
    }).then();
    // 若在此处使用catch()语句捕获reject状态
    // 则下方的 catch 代码块不会捕获到错误

    console.log("err happened");
  } catch(err) {
    console.log("catched an err: " + err);
  }

  console.log("end");
}
test();

// 等待3秒后输出如下内容
// waited for 3s
// res: result
// all good
// catched an err: Error: errrrrr
// end
```

## await
await 操作符用于等待一个Promise 对象。它只能在异步函数 `async function` 中使用。

> `await` 等待的实际上是一个 Thenable 对象，也就是有 `.then()` 方法的对象。由此实际上可以不使用 Promise 创建一个可以被await的函数。如下所示
> ```js
> /**
>  * 一个不使用 new Promise() 实现的 sleep 函数。
>  * @param {number} ms 等待的毫秒数
>  * @returns {object} 一个 "Thenable" 对象，可以被 await 关键字处理
>  */
> function sleep(ms) {
>   return {
>     then: function(resolve) {
>       // await 关键字会调用这个 then 方法，
>       // 并将 async 函数的后续部分作为 resolve 回调传入。
>       // 我们使用 setTimeout 在指定时间后执行这个回调，
>       // 从而让 async 函数恢复执行。
>       setTimeout(resolve, ms);
>     }
>   };
> }
> 
> // --- 使用示例 ---
> async function main() {
>   console.log('程序开始');
>   console.log(`当前时间: ${new Date().toLocaleTimeString()}`);
> 
>   await sleep(3000); // 等待3秒
> 
>   console.log('3秒后，程序继续');
>   console.log(`当前时间: ${new Date().toLocaleTimeString()}`);
> }

### 用法
`[返回值] = await [表达式]`

await 表达式会暂停当前 async function 的执行，等待 Promise 处理完成。若 Promise 正常处理(fulfilled)，其回调的resolve函数参数作为 await 表达式的值，继续执行 async function。

若 Promise 处理异常(rejected)，await 表达式会把 Promise 的异常原因抛出，reject的参数会被catch方法的回调函数接收到。
```js
async function f() {
  await Promise.reject('出错了');
}

f()
.then(v => console.log(v))
.catch(e => console.log(e))
// 出错了
```

### 停止和恢复执行
async/await 中真正起作用的是 await ，如果一个 async 函数中没有使用到 await，那它的表现和普通函数无异。

JS在碰到 await 关键字时候，会记录在哪里暂停执行，知道 await 右边的值可用时，JS运行环境会向消息队列中推送一个任务，恢复异步函数的执行。因此，即使 await 后接着一个立即可用的值，函数剩余部分也会被**异步**求值。如下例所示：

```js
async function foo() {
    console.log(2);
    await null;
    console.log(4);
}

console.log(1);
foo();
console.log(3);

// 1
// 2
// 3
// 4
```

过程如下：
1. 打印 1
2. 执行foo，打印 2
3. 遇到 await，暂停执行
4. 打印 3
5. 同步线程执行完毕
6. 恢复异步函数执行，取出 null（未使用）
7. 打印 4
8. foo 返回

当 await 后面是一个 promise 时，为了执行异步函数，会有两个任务被加到消息队列，并被异步求值。如下例所示：
```js
async function foo() {
  console.log(2);
  console.log(await Promise.resolve(8));
  console.log(9);
}

async function bar() {
  console.log(4);
  console.log(await 6);
  console.log(7);
}

console.log(1);
foo();
console.log(3);
bar();
console.log(5);

// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
```

具体执行过程如下：
1. 打印 1
2. 调用异步函数 foo()，打印 2
3. 遇到 await ，暂停执行，向消息队列中添加一个 promise 完成后执行的任务
4. promise 马上完成，将给 await 提供值的任务添加到消息队列
5. foo() 退出
6. 打印 3
7. 调用异步函数 bar()，打印 4
8. 遇到 await ，暂停执行，将立即可用的值 6 添加到消息队列任务
9. bar() 退出
10. 打印 5
11. 此时顶级线程执行完毕，开始从消息队列中取出任务
12. 取出解决 await promise 的任务，将解决的值 8 提供给它
13. 向消息队列中添加一个恢复执行 foo() 的任务
14. 从消息队列中取出恢复执行 bar() 的任务和值 6
15. bar() 先恢复执行，await 取得 6，打印 6
16. 打印 7
17. bar() 返回，从消息队列中取出恢复 foo() 执行的任务和值 8
18. 打印 8
19. 打印 9
20. foo() 返回


#### async/await 和 promise 一块使用
```js
// 1. 同步任务先运行
console.log(1);

async function fn1() {
  // 3. 同步执行
  console.log(2);
  // 4. 先同步执行异步函数，返回结果挂起
  await fn2();
  // 8. 从微任务队列取出第一个任务，恢复await挂起的部分，执行后续
  console.log(6);
}

setTimeout(() => {
  // 10. 微任务清空，执行宏任务队列
  console.log(8);
}, 0);

async function fn2() {
  // 4. 同步执行后挂起，此处没有返回值，向微任务队列推入一个恢复的任务
  console.log(3);
}

// 2. 同步任务，进入函数内运行
fn1();

new Promise((resolve) => {
  // 5. Promise 构造函数本身是同步任务，因此执行
  console.log(4);
  // 6. 向微任务队列推入一个新任务
  resolve();
}).then(() => {
  // 9. 继续从微任务队列取出任务，执行 then
  console.log(7);
});

// 7. 最后一个同步任务
console.log(5);
```


若异步函数返回了一个 promise 而不是立即可用的值，则中断恢复时会解析 promise 后再向任务队列推入新任务，然后才能轮到中断部分后续运行。示例如下：

1 到 5 的过程同上
```js
console.log(1);

async function fn1() {
  console.log(2);

  // 1. 这里依然是先进入执行同步任务
  // 7. 取出恢复执行的微任务和结果
  console.log(await fn2());
  // 8. 执行后续任务
  console.log(8);
}

setTimeout(() => {
  // 9. 宏任务
  console.log(9);
}, 0);

async function fn2() {
  // 2. 执行同步任务
  console.log(3);
  // 3. 这里先向微任务队列推入解析promise的任务
  return Promise.resolve(7)
}

fn1();

new Promise((resolve) => {
  console.log(4);
  resolve();
}).then(() => {
  // 4. 同步任务执行完，取出第一个任务是解析前面的 promise
  // 解析后将结果和恢复 await 执行的任务推入队列后方，
  // 然后取出靠前的 then 并执行
  console.log(6);
});

console.log(5);
```

## async 函数返回值细节
async 函数总是返回一个 Promise，但返回值的处理方式需要特别注意：

```js
// 1. 返回非 Promise 值 - 会被 Promise.resolve() 包装
async function foo() {
  return 1;  // 等价于 return Promise.resolve(1)
}

// 2. 返回 Promise - 直接返回该 Promise，不会双重包装
async function bar() {
  return Promise.resolve(2);  // 返回的就是这个 Promise，不会变成 Promise.resolve(Promise.resolve(2))
}

// 3. 返回 thenable 对象 - 会被 Promise.resolve() 处理
async function baz() {
  return {  // 会被 Promise.resolve() 解析
    then(resolve) {
      resolve(3);
    }
  };
}

foo().then(console.log);  // 1
bar().then(console.log);  // 2
baz().then(console.log);  // 3
```

**重要**：如果返回值是 Promise，async 函数返回的就是这个 Promise 对象本身，而不是再创建一个新的 Promise。这意味着：

```js
const p = Promise.resolve(42);

async function foo() {
  return p;  // 直接返回原 Promise
}

async function bar() {
  return await p;  // await 解包后，再用 Promise.resolve() 包装
}

console.log(foo() === p);  // true，返回的是同一个 Promise
console.log(bar() === p);  // false，返回的是新 Promise
```

## 循环中的 await
循环中使用 async/await 和直接使用 Promise.then 效果截然不同。

如下代码预期每隔一秒输出一个数字，最后输出前面几个数字之和。
```js
function delay(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(num);
      resolve(num);
    }, 1000);
  });
}

function total(n) {
  // implementation
}

total(3).then(res => console.log(res));
```

Promise 实现如下
```js
function total(n) {
  let sum = 0;
  for(let i = 0; i < n; i++) {
    delay(i).then(res => sum += res);
  }

  return new Promise(resolve => resolve(sum));
}

total(3).then(res => console.log(res));

// total: 0
// 0
// 1
// 2
```

结果先输出了和为0的结果，等待一秒后输出了0，1，2。

原因是循环中使用 Promise.then 会一次性添加三个任务，他们的定时器同步执行，等待的一秒被压缩到了一起。

改用 async/await 实现如下：
```js
async function total(n) {
  let sum = 0;
  for(let i = 0; i < n; i++) {
    sum += await delay(i);
  }
  return sum;
}

total(3).then(res => console.log("total: " + res));

// 0
// 1
// 2
// total: 3
```

这时每隔一秒输出了一个数字，最后输出了结果。因为 await 会挂起后面的代码，直到执行完成返回后再继续，这样保证了顺序。

**但是**，这种阻塞效果仅限于传统 for 循环，如果是在数组的 forEach 或者 map 方法中使用，则不会有阻塞效果。示例如下：

```js
const awaited = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("waited 1s");
    }, 1000);
  });
};
const arr = [0, 1, 2];

(async function () {
  // 1 秒后同时输出
  arr.forEach(async (val) => {
    console.log(await awaited(), val);
  });

  // 隔 1 秒输出一次
  for (let i = 0; i < arr.length; i++) {
    console.log(await awaited(), i);
  }
})();
```

## async/await 的实现原理

async/await 本质上是 **Generator 函数 + 自动执行器** 的语法糖。理解其实现需要掌握三个核心概念：

### 1. Generator 函数回顾

Generator 函数返回一个迭代器对象，通过 `yield` 关键字暂停执行，通过 `next()` 方法恢复执行：

```js
function* gen() {
  console.log('start');
  const x = yield 1;  // 暂停，返回 { value: 1, done: false }
  console.log('x:', x);
  const y = yield 2;  // 暂停，返回 { value: 2, done: false }
  console.log('y:', y);
  return 3;           // 结束，返回 { value: 3, done: true }
}

const iterator = gen();
console.log(iterator.next());      // start → { value: 1, done: false }
console.log(iterator.next('a'));   // x: a → { value: 2, done: false }
console.log(iterator.next('b'));   // y: b → { value: 3, done: true }
```

### 2. Promise 的 then 方法

Promise 的 `.then()` 方法可以将后续代码推迟到微任务中执行，这正是实现 await 的关键：

```js
Promise.resolve()
  .then(() => console.log('microtask 1'))
  .then(() => console.log('microtask 2'));
console.log('sync');
// 输出顺序：sync → microtask 1 → microtask 2
```

### 3. async/await 的 babel 转换

下面是一个简单的 async 函数：

```js
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}
```

Babel 会将其转换为类似下面的代码（简化版）：

```js
function fetchData() {
  return _asyncToGenerator(function* () {
    const response = yield fetch('/api/data');
    const data = yield response.json();
    return data;
  })();
}

function _asyncToGenerator(fn) {
  return function() {
    const gen = fn.apply(this, arguments);

    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let info;
        try {
          info = gen[key](arg);
        } catch (error) {
          return reject(error);
        }

        if (info.done) {
          resolve(info.value);
        } else {
          Promise.resolve(info.value).then(
            value => step('next', value),
            error => step('throw', error)
          );
        }
      }

      step('next');
    });
  };
}
```

### 核心实现逻辑

1. **_asyncToGenerator** 是一个高阶函数，它：
   - 返回一个新的函数
   - 这个返回的函数返回一个 Promise

2. **step 函数** 是自动执行器，它：
   - 调用 `gen.next()` 让 Generator 执行到下一个 `yield`
   - 如果返回 `done: true`，调用 `resolve(value)` 完成 Promise
   - 如果返回 `done: false`：
     - 将 `yield` 的值用 `Promise.resolve()` 包装
     - 调用 `.then()` 将下一次 `step('next')` 加入微任务队列
     - 这样就实现了"暂停"效果，当前代码执行完后再继续

3. **await 的模拟**：
   - `await promise` 相当于 `yield promise`
   - 然后 `.then()` 将恢复执行加入微任务队列

### 简化的 async/await 实现

下面是一个极简的实现，展示了核心思想：

```js
// 手动实现 async/await
function asyncFunction(generatorFunc) {
  return function(...args) {
    const generator = generatorFunc(...args);

    return new Promise((resolve, reject) => {
      function handle(result) {
        // { value: ..., done: true/false }
        if (result.done) {
          resolve(result.value);
        } else {
          // result.value 就是 await 后面的表达式
          Promise.resolve(result.value)
            .then(res => handle(generator.next(res)))  // 将结果传回给 yield 表达式
            .catch(err => handle(generator.throw(err)));  // 错误处理
        }
      }

      handle(generator.next());
    });
  };
}

// 使用方式
const fetchData = asyncFunction(function* () {
  console.log('start');
  const result1 = yield Promise.resolve(1);  // 相当于 await
  console.log('result1:', result1);
  const result2 = yield Promise.resolve(2);  // 相当于 await
  console.log('result2:', result2);
  return result1 + result2;
});

fetchData().then(console.log);
// 输出：
// start
// result1: 1
// result2: 2
// 3
```

### 事件循环层面的理解

从事件循环角度看，await 做了两件事：

```js
async function foo() {
  console.log(1);
  await somePromise;
  console.log(2);
}
```

相当于：

```js
function foo() {
  return new Promise(resolve => {
    console.log(1);

    // await 做的事情：
    // 1. 注册 promise 的回调
    somePromise.then(() => {
      // 2. 将后续代码包装成微任务
      console.log(2);
      resolve();
    });
  });
}
```

### 为什么 await 后面即使立即值也会异步执行？

```js
await 42;
```

即使值立即可用，await 也会：
1. 包装成 `Promise.resolve(42)`
2. 注册 `.then()` 回调
3. 这个回调会在当前同步代码执行完后的微任务阶段执行

这就是 [Async_Await.md:140-159](Async_Await.md:140-159) 示例中 `await null` 会让后续代码异步执行的原因。

### 总结

async/await 的实现本质上是：
- **语法糖**：Generator 的 yield + 自动执行器
- **核心机制**：Promise 的 `.then()` 将代码推迟到微任务
- **暂停效果**：yield 让函数暂停，Promise.then 恢复执行
- **错误处理**：try/catch 转换为 generator.throw()

这种设计让异步代码看起来像同步代码，同时保持了非阻塞的特性。

