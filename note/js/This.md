# JavaScript基础 - this
`this`指向调用方法的对象，相当于一个指针。
> 在绝大多数情况下，函数的调用方式决定了 this 的值（运行时绑定）。this 不能在执行期间被赋值，并且在每次函数被调用时 this 的值也可能会不同。 ——MDN

## this 的绑定规则
### 默认绑定
即不能应用其他绑定规则时使用的绑定，通常是独立函数调用。
```js
function sayHi(){
    console.log('Hello,', this.name);
}
var name = 'YvetteLau';
sayHi(); // Hello, YvetteLau
```
调用`sayHi()`时使用了默认绑定，this指向全局对象（非严格模式）。严格模式下，this指向undefined，而undefined上没有this对象，会抛出错误。

### 隐式绑定
函数调用在某个对象上触发，即调用位置存在上下文对象。
```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
person.sayHi(); // Hello, YvetteLau
```

对象属性链中只有最后一层会影响到调用位置。
```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person2 = {
    name: 'Christina',
    sayHi: sayHi
}
var person1 = {
    name: 'YvetteLau',
    friend: person2
}
person1.friend.sayHi(); // Hello, Christina.
```

#### 绑定丢失
隐式绑定存在绑定丢失的陷阱，容易造成对 this 指向的误解。举例如下：
```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person = {
    name: 'YvetteLau',
    sayHi: sayHi
}
var name = 'Wiliam';
var Hi = person.sayHi;
Hi(); // Hello,Wiliam
```
因为`Hi`直接指向了`sayHi`的引用，调用时和`person`对象没有关系。一般如`func();`这样的没有在对象上调用方法的绑定不是隐式绑定。

除了上述例子，在回调函数中也会发生隐式绑定的丢失。例子：
```js
function sayHi(){
    console.log('Hello,', this.name);
}
var person1 = {
    name: 'YvetteLau',
    sayHi: function(){
        setTimeout(function(){
            console.log('Hello,',this.name);
        })
    }
}
var person2 = {
    name: 'Christina',
    sayHi: sayHi
}

var name='Wiliam';
person1.sayHi();    // Hello, Wiliam

setTimeout(person2.sayHi,100); // Hello, Wiliam
setTimeout(function(){
    person2.sayHi();    // Hello, Christina
},200);
```
1. 第一处，在回调函数中使用默认绑定，非严格模式下this指向全局对象（严格模式下为undefined）
2. 第二处，相当于将一个函数对象传给了一个变量，最后执行了变量引用的方法
3. 第三处，单纯的隐式绑定

### 显式绑定
显式绑定就是通过call, apply, bind的方式，显式地指定this指定的对象。这三个方法的第一个参数对应函数的this指向的对象。

#### call
`func.call(context, arg1, arg2, ...)`
这种方法会运行`func`函数，提供第一个`context`作为this，后面的参数作为传入`func`的参数。

#### apply
`func.apply(context, args)`
效果同call，也会提供this并运行方法，区别在于`args`是一个类数组对象。

#### bind
`func.bind(context, arg1, arg2, ...)`
不同于apply和call，bind不会运行函数，而是返回一个特殊的类似于函数的“外来对象（exotic object）”
> 它可以像函数一样被调用，并且透明地（transparently）将调用传递给 func 并设定 this=context。

> 换句话说，boundFunc 调用就像绑定了 this 的 func。

### new 绑定


### 绑定例外
给bing，apply，call的`thisArg`传入null或undefined时，会忽略这个参数，调用时使用默认绑定规则。

### 绑定优先级
new绑定 > 显式绑定 > 隐式绑定 > 默认绑定
