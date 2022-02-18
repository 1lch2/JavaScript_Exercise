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

待续