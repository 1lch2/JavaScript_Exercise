# JavaScript基础 - Object 方法
## 构造函数
```js
let obj = new Object(value);
```

- 如果给定的值是 null 或 undefined, 它会创建并返回一个空对象。
否则，它将返回一个和给定的值相对应的类型的对象。
- 如果给定值是一个已经存在的对象，则会返回这个已经存在的值（相同地址）。

## 静态方法
### Object.create(obj)
创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。
参见：[create object](../../src/functions/createObject.js)

### Object.entries(obj)
返回一个给定对象自身可枚举属性的键值对数组
```js
let obj = {
  a: 'somestring',
  b: 42
};

for (const [key, value] of Object.entries(object1)) {
  console.log(`${key}: ${value}`);
}
// "a: somestring"
// "b: 42"
```

上文遍历效果等同于使用`for-in`循环。

### Object.keys(obj)
返回一个包含所有给定对象自身可枚举属性名称的数组。

### Object.defineProperty()
直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，**并返回此对象**。

```js
let obj = {
    a: "a"
}

Object.defineProperty(obj, "newProp", {
    value: 42,
    writable: false
});

console.log(obj); // {a: "a", newProp: 42}
```

## 实例属性
- `Object.prototype.constructor`：指向对象的构造函数
- `Object.prototype.__proto__`：指向原型

参见：[JS中的原型](./Prototype.md)

### 访问对象属性
JS中可以使用`.property`和`["property"]`两种方法访问对象属性，包括对象上定义的方法。以下两种方式等价.

```js
let obj = {
  val: 1,
  hi: function(name) {
    console.log("hello " + name);
  }
}

obj.val; // 1
obj.hi("world"); // hello world

obj["val"]; // 1
obj["hi"]("world"); // hello world
```

如果对数字字面量使用方法，并且数字文字没有指数且没有小数点，请在方法调用之前的点之前留出空格，以防止点被解释为小数点。
```js
12.toString(); // Uncaught SyntaxError: Invalid or unexpected token
12 .toString(); // "12"
```

## 实例方法
### Object.prototype.hasOwnProperty()
返回一个布尔值，用于表示一个对象自身是否包含指定的属性，该方法并不会查找原型链上继承来的属性。

### Object.prototype.isPrototypeOf()
返回一个布尔值，用于表示该方法所调用的对象是否在指定对象的原型链中。

### Object.prototype.toString()
返回一个代表该对象的字符串。

### Object.prototype.valueOf()
返回指定对象的原始值。
