# JavaScript基础 - 作用域

## 作用域链

// TODO: note marker

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

需要注意的是，由于`var`关键词声明的变量没有块级作用域，因此以下代码会输出三个相同的数字。这里的`i`是函数作用域，每个回调中绑定的是同一个变量。
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

