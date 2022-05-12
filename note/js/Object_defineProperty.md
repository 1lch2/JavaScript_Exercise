# Object.defineProperty
`Object.defineProperty()` 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

## 语法
`Object.defineProperty(obj, prop, descriptor)`
- obj：要定义属性的对象
- prop：要修改的属性名（String）或者Symbol
- descriptor：要定义或修改的属性的描述符，用对象表示，属性如下：
    - value: 该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
    - get：该属性的 getter 函数。默认为 undefined
    - set：该属性的 setter 函数。默认为 undefined
    - configurable：描述符是否可以被改变，包括被删除。默认 false
    - writable：是否可以被赋值符`=`改变值。默认 false
    - enumerable：是否出现在对象的枚举属性中。默认 false

### 属性描述符
对象里目前存在的属性描述符有两种主要形式：数据描述符和存取描述符。
- 数据描述符是一个具有值的属性，该值可以是可写的，也可以是不可写的。
- 存取描述符是由 getter 函数和 setter 函数所描述的属性。
  
**一个描述符只能是这两者其中之一，不能同时是两者。**

## 示例
### 创建属性
如果对象中不存在指定的属性，`Object.defineProperty()` 会创建这个属性。当描述符中省略某些字段时，这些字段将使用它们的默认值。

```js
let obj = {};
// 添加数据描述符
Object.defineProperty(obj, "val", {
    value: 42,
    writable: true;
});

console.log(obj.val); // 42

Object.defineProperty(obj, "key", {
    get: function() {
        console.log("get a value");
        return this.val;
    },
    set: function(value) {
        this.val = value;
        console.log("value set to: " + value);
    }
});

// 数据描述符和存取描述符不能混合使用
Object.defineProperty(o, "conflict", {
  value: 0x9f91102,
  get() { return 0xdeadbeef; }
});
// TypeError: value appears only in data descriptors, get appears only in accessor descriptors
```

### 修改属性
如果属性已经存在，`Object.defineProperty()` 将尝试根据描述符中的值以及对象当前的配置来修改这个属性。

如果旧描述符将其 configurable 属性设置为 false，则无法修改属性，只能单向改变 writable 为 false。

#### writable
若 writable 为 false，则属性不能被重新赋值
```js
let obj = {};
// 添加数据描述符
Object.defineProperty(obj, "val", {
    value: 42,
    writable: true;
});

console.log(obj.val); // 42
obj.val = 114514; // 非严格模式下什么都不会发生，严格模式下会抛出错误
console.log(obj.val); // 42
```

#### enumerable
enumerable 定义了对象的属性是否可以在 `for...in` 循环和 `Object.keys()` 中被枚举。

#### configurable 
configurable 特性表示对象的属性是否可以被删除，以及除 value 和 writable 特性外的其他特性是否可以被修改。