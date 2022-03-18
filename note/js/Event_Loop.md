# JavaScript基础 - 事件循环
## 运行栈
JS的函数和代码执行逻辑和其他语言相同，对于同步操作，会按照调用顺序将对应函数压入运行栈中。举例如下：
```js
function a() {
    return b();
}

function b() {
    return c();
}

function c() {
    return 1 + 1;
}
```
栈中的操作可以表示为：
| Run stack |
|-----------|
| c()       |
| b()       |
| a()       |
| main()    |

从顶部将函数弹出并执行。

## 异步操作
由于JS单线程的特性，如果遇到了需要长时间执行的任务，会阻塞后续代码的执行。JS虽然是单线程，但是靠着事件循环的机制实现了异步任务。

常见的异步任务有`setTimeout(func, time)`，`Promise`等。

对于代码中的异步操作，浏览器（或者Node）并不会直接将其压入运行栈中，而是压入另一个任务队列（task queue）。仅当运行栈为空时，才从任务队列中取出一个任务并执行。

举例如下：
```js
console.log("start");

function a() {
    console.log("a");
}

setTimeout(() => {
    console.log("timeout")
}, 0);

a();
```
这里首先将`console.log("start");`压入栈并弹出执行，然后遇到`setTimeout`，将其回调压入任务队列。然后将`a()`压入栈，弹出并执行。这时运行栈为空，将任务队列中的回调压入运行栈并执行。

结果为：
```
start
a
timeout
```

## 宏任务，微任务
由于浏览器会有定时的渲染操作，渲染操作是同步的，如果在两次渲染之间出现大量异步任务，则有可能阻塞渲染。因此，引入了微任务（micro task）的概念，而原本的任务也被归为宏任务（macro task）。

微任务包括`process.nextTick`（暂不考虑）和`Promise.then`。

宏任务包括`setTimeout`，`setInterval`和`script`（整体代码）。

**注意：**`Promise`本身是立即执行的同步任务，只有`then()`才是异步的微任务。

加入了微任务以后，事件循环的逻辑变成了这样：
1. 同步任务压入运行栈
2. 异步任务分别压入宏任务和微任务队列
3. 当运行栈为空时，先检查微任务队列，执行其中所有任务
4. 取出一个宏任务并执行，若运行中遇到微任务，压入队列。

举例如下：
```js
console.log('1');

setTimeout(function() {
    console.log('2');
    new Promise(function(resolve) {
        console.log('3');
        resolve();
    }).then(function() {
        console.log('4');
    })
})
new Promise(function(resolve) {
    console.log('5');
    resolve();
}).then(function() {
    console.log('6');
})

console.log('7');
```

运行结果
```
1
5
7
6
2
3
4
```

运行过程分析：
1. 运行第一个log，输出1
2. 将timeout回调压入宏任务队列
3. 运行promise构造方法内部的log，输出5，将其回调压入微任务队列
4. 运行第二个log，输出7
5. 此时运行栈为空，开始运行微任务队列，输出6
6. 此时微任务队列为空，开始运行宏任务队列，输出2
7. 遇到promise，运行输出3，将回调压入微任务队列
8. 宏任务队列为空，执行微任务队列，输出4
9. 结束

### async, await 语法
`aync`关键字用于修饰函数，代表这个函数返回的是一个`Promise`。只有在async函数内才能使用`await`关键字。

`await`关键字相当于对promise调用了then，然后将它后面的代码添加到await部分的then回调里。举例如下
```js
async function async1(){
  await async2()
  console.log('async1 end')
}
```
相当于
```js
async function async1() {
  return new Promise(resolve => {
    resolve(async2())
  }).then(() => {
    console.log('async1 end')
  })
}
```

## 关于 setTimeout
在循环中运行`setTimeout`会向宏任务队列中加入多个计时器，但是这几个计时器是同时计时的，在计时结束后运行传入的回调。下例中的代码会在一秒后按序同时输出三个数字
```js
function closure(n) {
  for(let i = 0; i < n; i++) {
    setTimeout(() => {
      console.log("i = " + i);
    }, 1000)
  }
}

closure(3); // 0, 1, 2
```

因此如果想实现每隔一秒钟输出一个数字的效果，应该让多个计时器的倒数时间相差1秒。如下例
```js
function closure(n) {
  for(let i = 0; i < n; i++) {
    setTimeout(() => {
      console.log("i = " + i);
    }, 1000 * i)
  }
}

closure(3); // 0, 1, 2
```

需要注意的是，由于`var`关键词声明的变量没有块级作用域，因此以下代码会输出三个相同的数字。
```js
for(var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);
    }, i * 1000);
}
// 3, 3, 3
```
循环结束时，`i`已经变成了 3 ，且三个计时器引用了同一个全局变量，因此输出3个3。而使用`let`声明的`i`，由于闭包机制被保存到了三个不同的闭包中，三个不同的变量互不干扰。

参见：[Why let and var bindings behave differently using setTimeout function?](https://stackoverflow.com/questions/31285911/why-let-and-var-bindings-behave-differently-using-settimeout-function)

## 总结
加入浏览器渲染任务以后，事件循环的机制可以用如下伪代码表示
```js
while(true) {
    queue = getNextQueue();
    task = queue.pop();
    execute(task);

    while(microTaskQueue.hasTasks()) {
        doMicroTask();
    }

    if(isRepaintTime()) {
        repaint();
    }
}
```