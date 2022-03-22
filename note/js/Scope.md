# JavaScript基础 - 作用域

## 作用域链
作用域链，是由当前环境与上层环境的一系列作用域共同组成，它保证了当前执行环境对符合访问权限的变量和函数的有序访问。

在函数执行过程中，每遇到一个变量，都会经历一次标识符解析过程，以决定从哪里获取和存储数据。

该过程从作用域链头部，也就是当前执行函数的作用域开始，查找同名的标识符，如果找到了就返回这个标识符对应的值，如果没找到继续搜索作用域链中的下一个作用域，如果搜索完所有作用域都未找到，则认为该标识符未定义。


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

