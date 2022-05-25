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

TODO:

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

TODO