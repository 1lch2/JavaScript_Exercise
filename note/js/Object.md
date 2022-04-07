# JavaScript基础 - Object 方法
## 构造函数
```js
let obj = new Object(value);
```

- 如果给定的值是 null 或 undefined, 它会创建并返回一个空对象。
否则，它将返回一个和给定的值相对应的类型的对象。
- 如果给定值是一个已经存在的对象，则会返回这个已经存在的值（相同地址）。

## 静态方法
### Object.create()
创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。
参见：[create object](../../src/functions/createObject.js)

### Object.entries()
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

TODO: 