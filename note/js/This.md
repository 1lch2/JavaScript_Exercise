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

坑示例：
```js
// 绑定在全局变量上
var length = 10;

// nodejs 下为 undefined，浏览器下为 10
function fn() {
  console.log(this.length);
}

let obj = {
  length: 5,
  fff: function() {
    // 这里的this是 obj，但是fn本身运行时并没有绑定这里的this
    fn();

    // 若想显示预期的 5 ，则应该显式绑定this
  }
}

obj.fff();
```

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
构造函数通常有两个约定：
1. 命名以大写字母开头
2. 只能使用`new`操作符来执行

使用 new 调用函数会执行以下操作
1. 创建一个空对象，构造函数中的this指向这个空对象
2. 这个新对象被执行 [[原型]] 连接
3. 执行构造函数方法，属性和方法被添加到this引用的对象中
4. 如果构造函数中没有返回其它对象，那么返回this，即创建的这个的新对象，否则，返回构造函数中返回的对象。

实现 new 关键字参考：[newObj](../../src/functions/newObj.js)

### 绑定例外
给bing，apply，call的`thisArg`传入null或undefined时，会忽略这个参数，调用时使用默认绑定规则。

### 绑定优先级
new绑定 > 显式绑定 > 隐式绑定 > 默认绑定


### 箭头函数
箭头函数内的this继承自外层代码块

```js
let obj = {
    name: "a", 
    hi: () => {
        console.log(this)
    }
}

obj.hi(); // window
```

```js
let ooo = {
  name: "b",
  hi: function() {
      console.log(this)
  }
}

ooo.hi(); // ooo
```

## ES6 class 中的 this
当调用静态或原型方法时没有指定 this 的值，那么方法内的 this 值将被置为 undefined。

```js
class Animal {
  speak() {
    return this;
  }
  static eat() {
    return this;
  }
}

let obj = new Animal();
obj.speak(); // Animal {}
let speak = obj.speak;
speak(); // undefined

Animal.eat() // class Animal
let eat = Animal.eat;
eat(); // undefined
```

### class 中的 this 指向问题
为了解决上述问题，保证将class 中的方法赋值给其他变量再调用时的this指向不变，可以在对象实例化时将sum中的this绑定到实例化对象中，示例如下:

```js
class A {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  
    // 显式绑定this
    this.sum = this.sum.bind(this);
  }
  
  sum() {
    return this.a + this.b;
  }
}

let a = new A(1, 2);
let s = a.sum;
s(); // 3
```

## 如何访问到自己想要的 this ？
引用自 Stack Overflow：[How to access the correct `this` inside a callback](https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback)

### 1. 使用箭头函数
箭头函数没有自己的this，它会在作用域内找到最近的this

### 2. 不用 this
用别的变量指向 this，再使用那个对象访问this

```js
function Method(data) {
    this.data = data;
    let self = this;
    this.func = function() {
        console.log(self.data);
    }
}
```

### 3. 为回调绑定this
```js
function Method(data) {
    this.data = data;
    // 使用括号是为了增强可读性
    this.func = (function() {
        console.log(this.data);
    }).bind(this);
}
```