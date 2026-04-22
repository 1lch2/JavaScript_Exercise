# 稀疏数组

数组可以包含“空槽”，这与用值 undefined 填充的槽不一样。空槽可以通过以下方式之一创建：

```js
// Array 构造函数：
const a = Array(5); // [ <5 empty items> ]

// 数组字面量中的连续逗号：
const b = [1, 2, , , 5]; // [ 1, 2, <2 empty items>, 5 ]

// 直接给大于 array.length 的索引设置值以形成空槽：
const c = [1, 2];
c[4] = 5; // [ 1, 2, <2 empty items>, 5 ]

// 通过直接设置 .length 拉长一个数组：
const d = [1, 2];
d.length = 5; // [ 1, 2, <3 empty items> ]

// 删除一个元素：
const e = [1, 2, 3, 4, 5];
delete e[2]; // [ 1, 2, <1 empty item>, 4, 5 ]
```

在某些操作中，空槽的行为就像它们被填入了 undefined 那样。

```js
const arr = [1, 2, , , 5]; // 创建一个稀疏数组

// 通过索引访问
console.log(arr[2]); // undefined

// For...of
for (const i of arr) {
  console.log(i);
}

// 输出：1 2 undefined undefined 5

// 展开运算
const another = [...arr]; // "another" 为 [ 1, 2, undefined, undefined, 5 ]
```

在其他方法，特别是数组迭代方法时，空槽是被跳过的。

```js
const mapped = arr.map((i) => i + 1); // [ 2, 3, <2 empty items>, 6 ]
arr.forEach((i) => console.log(i)); // 1 2 5
const filtered = arr.filter(() => true); // [ 1, 2, 5 ]
const hasFalsy = arr.some((k) => !k); // false

// 属性迭代
const keys = Object.keys(arr); // [ '0', '1', '4' ]
for (const key in arr) {
  console.log(key);
}
// 输出：'0' '1' '4'
// 在对象中使用展开，使用属性枚举，而不是数组的迭代器
const objectSpread = { ...arr }; // { '0': 1, '1': 2, '4': 5 }
```

## 为什么允许稀疏数组？

JavaScript 数组本质上是带有数字键的对象。早期设计中，为了灵活性，允许创建稀疏数组。这使得内存使用更高效（只为实际元素分配内存），但可能导致性能问题，因为引擎可能使用哈希表而不是连续内存块。

## 如何检测稀疏数组？

- 使用 `in` 运算符：`1 in arr` 如果为 false，则索引 1 是空槽。
- 使用 `Object.keys(arr).length !== arr.length` 来检查是否有空槽。

## 最佳实践

避免创建稀疏数组，除非必要。对于稀疏数据，使用对象或 Map 更合适。
