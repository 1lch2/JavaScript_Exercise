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

**但是**，这种阻塞效果仅限于传统 for 循环，如果是在数组的 forEach 或者 map 方法中使用，则不会有阻塞效果。