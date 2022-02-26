# JavaScript基础 - 函数
## 函数声明
函数声明是在主代码流中声明为单独语句的函数。
```js
function hello(msg) {
    console.log("hello" + msg);
    return msg;
}
```
在函数声明被定义之前，它就可以被调用。例如，一个全局函数声明对整个脚本来说都是可见的，无论它被写在这个脚本的哪个位置。

当 JavaScript 准备 运行脚本时，首先会在脚本中寻找全局函数声明，并创建这些函数。我们可以将其视为“初始化阶段”。在处理完所有函数声明后，代码才被执行。所以运行时能够使用这些函数。

严格模式下，当一个函数声明在一个代码块内时，它在该代码块内的任何位置都是可见的。但在代码块外不可见。

JS的函数无法重载，后声明的同名函数会覆盖前面的声明，重新对函数引用赋值也会修改函数。

## 函数表达式
函数表达式是在一个表达式中或另一个语法结构中创建的函数。
```js
let hello = function(msg) {
    console.log("hello" + msg);
    return msg;
};
```
函数表达式是在代码执行到达时被创建，并且仅从那一刻起可用。
一旦代码执行到赋值表达式 `let sum = function…` 的右侧，此时就会开始创建该函数，并且可以从现在开始使用（分配，调用等）。


## 参数
ECMAScript 函数的参数在内部表现为一个数组。函数被调用时总会接 收一个数组，但函数并不关心这个数组中包含什么。参见后文的arguments属性部分。

命名参数不会创建让之后的调用必须匹配的函数签名。这是因为根本不存在验证命名参数的机制。

### 默认参数
ES6加入了参数默认值
```js
function hi(name = "unknown") {
    console.log("hi, " + name);
}
```
在使用默认参数时，arguments 对象的值不反映参数的默认值，只反映传给函数的参数。

## 函数内部
### length
函数引用拥有 prototype 和 length 两个属性。

length 属性返回函数定义中的参数个数。

### arguments
ES5标准中，函数内部除了this还有一个特殊对象，arguments。

`arguments` 对象是一个类数组对象(但不是 `Array` 的实例)，因此可以使用中括号语法访问其中的元素(第一个参数是 `arguments[0]`，第二个参数是 `arguments[1]`)。

而要确定传进来多少个参数， 可以访问 `arguments.length` 属性。

举个例子：
```js
function hi(name, message) {
    console.log("hi, " + name + ", " + message);
}
```
可以通过使用`arguments`参数取到同样的参数值，将函数写成不声明参数。
```js
function hi() {
    console.log("hi, " + arguments[0] + ", " + arguments[1]);
}
```

### arguments.callee
arguments 对象有一个 callee 属性，是一个指向 arguments 对象所在函数的指针。
```js
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * factorial(num - 1);
    }
}
```
这个函数要正确执行就必须保证函数名是 factorial，从而导致了紧密耦合。使用 arguments.callee 就可以让函数逻辑与函数名解耦:

改造后如下：
```js
function factorial(num) {
    if (num <= 1) {
        return 1;
    } else {
        return num * arguments.callee(num - 1);
    }
}
```

### new.target
ES6新增了可以检测对象是否通过 new 操作符实例化的属性。
若函数是正常调用的，则 new.target 值为 undefined。
若函数通过 new 操作调用，则 new.target 将引用被调用的构造函数。

```js
function King() {
    if (!new.target) {
        throw 'King must be instantiated using "new"';
    }
    console.log('King instantiated using "new"');
}
new King(); // King instantiated using "new"
King();     // Error: King must be instantiated using "new"
```

## 箭头函数
### 基本语法
以下两种方式等价。
```js
let sum = (a, b) => a + b;
```
```js
let sum = function(a, b) {
    return a + b;
}
```

### 区别
1. 箭头函数没有arguments属性，这个属性只有在以function 关键字声明的函数中才有
2. 箭头函数没有prototype