# JavaScript基础 - 继承

## 原型链继承
重写原型对象，用新的原型实例代替。

原型链继承中JS把方法的定义抽出来，然后利用原型对象机制连接父和子。

```js
// 父类的构造函数
function Father(name) {
    this.name = name;
}
// 为父类添加方法
Father.prototype.hi = function () {
    console.log(this.name);
}

// 子类的构造函数
function Child(name) {
    this.name = name;
}
// 使用父类的实例覆盖子类的原型对象，完成继承
Child.prototype = new Father();

new Father("father").hi(); // father
new Child("son").hi(); // son
```

## 经典继承（借用构造函数来继承）
使用父类的构造函数来增强子类实例，等同于复制父类的实例给子类（不使用原型）。

```js
// 父类的构造函数
function Father(name) {
    this.name = name;
}

// 子类的构造函数
function Child(name) {
    Father.call(this, name);
}

console.log(new Father("father").name); // father
console.log(new Child("son").name); // son
```

创建子类实例时调用Father构造函数，于是Son的每个实例都会将Father中的属性**复制**一份。换种方式理解，通过call将Father的实例里面的this指向Son。

这种只能继承**父类实例**的属性和方法，不能继承**原型**的属性和方法。

## 组合继承
组合上述两种方法就是组合继承。用原型链实现对原型属性和方法的继承，用借用构造函数技术来实现实例属性的继承。

```js
// 父类的构造函数
function Father(name) {
    this.name = name;
}
// 为父类添加方法
Father.prototype.hi = function () {
    console.log(this.name);
}

// 子类的构造函数
function Child(name) {
    Father.call(this, name);
}
// 使用父类的实例覆盖子类的原型对象，完成继承
Child.prototype = new Father();
// 将构造函数重新指回正确的函数
Child.prototype.constructor = Child;

new Child("kid").hi(); // kid
```

上述操作中，使用`new Father()`重新赋值Child的原型对象后，Child的原型对象的构造函数也会被指向`Father`，导致如下代码成立：
```js
Child.prototype.constructor === Father; // true
```

因此如果替换了prototype对象，那么下一步必然是为新的prototype对象加上constructor属性，并将这个属性指回原来的构造函数。

## 原型式继承
利用一个空对象作为中介，将某个对象直接赋值给空对象构造函数的原型。

```js
function object(obj) {
    // 子类的构造函数
    function Son() {
    }

    Son.prototype = obj;
    return new Son();
}

function Father() {
    this.name = "father";
}

let father = new Father();
let son = object(new Father());

console.log(father.name); // father
console.log(son.name); // father
```

object()对传入其中的对象执行了一次浅复制，将构造函数F的原型直接指向传入的对象。

该方法无法传递参数，且不能多次继承

在ES5中新增了`Object.create()`方法，可以替代上述的`object()`。

## 寄生式继承
在原型式继承的基础上，增强对象，返回构造函数。主要作用就是为构造函数新增属性和方法，以增强函数。

```js
function object(obj) {
    // 子类的构造函数
    function Son() {
    }

    Son.prototype = obj;
    return new Son();
}

function createAnother(original) {
    let clone = object(original);
    // 增强对象
    clone.sayHi = function () {
        console.log("hi, i'm " + this.name);
    }
    return clone
}

function Father() {
    this.name = "father";
}

let father = new Father();
let son = createAnother(new Father());

console.log(father.name); // father
console.log(son.name); // father
```

这种继承方式仍然无法传递参数

## 寄生组合式继承
寄生模式借用构造函数传递参数

```js
function inheritPrototype(Son, Father){
  // 创建对象，创建父类原型的一个副本
  let prototype = Object.create(Father.prototype); 
  // 增强对象，弥补因重写原型而失去的默认的constructor 属性
  prototype.constructor = Son;
  // 指定对象，将新创建的对象赋值给子类的原型
  Son.prototype = prototype;
}

// 父类初始化实例属性和原型属性
function Father(name){
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
Father.prototype.sayName = function(){
  alert(this.name);
};

// 借用构造函数传递增强子类实例属性（支持传参和避免篡改）
function Son(name, age){
  Father.call(this, name);
  this.age = age;
}

// 将父类原型指向子类
inheritPrototype(Son, Father);

// 新增子类原型属性
Son.prototype.sayAge = function(){
  alert(this.age);
}

var son1 = new Son("xyc", 23);
var son2 = new Son("lxy", 23);

son1.colors.push("2"); // ["red", "blue", "green", "2"]
son2.colors.push("3"); // ["red", "blue", "green", "3"]
```

## ES6中的`extends`继承
不能说和Java非常相似，只能说一模一样。

需要注意的是构造函数并非是和类名同名的函数，而是叫做`constructor()`。如果没有显式指定构造函数，则会添加默认方法。

子类在自己的构造函数中必须调用`super()`来通过父类构造函数完成初始化，否则会报错（ReferenceError）。同时，子类的构造函数中只有在调用`super()`之后才能使用`this`。
```js
class Person {
    constructor(name) {
        this.name = name || "default";
    }

    hi() {
        console.log("hi, i'm " + this.name);
    }
}

class Student extends Person {
    constructor(name, age) {
        super(name);
        this.age = age;
    }
}
```

### 关于语法糖
`class`不完全是语法糖，通过`class`创建的函数具有特殊的内部属性标记 `[[IsClassConstructor]]: true`。同时，类方法不可枚举。 类定义将 "prototype" 中的所有方法的 enumerable 标志设置为 false。