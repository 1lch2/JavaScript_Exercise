# JavaScript 对象的属性描述符

在 JavaScript 中，属性描述符（Property Descriptor）是一个描述对象属性行为的元数据对象。它让你能精确控制属性的特性，比如是否可写、是否可枚举等。

描述符主要分为两种：

1. **数据描述符**（Data Descriptor）：描述属性的值和特性。
2. **存取描述符**（Accessor Descriptor）：描述属性的 getter 和 setter 函数。

## 数据描述符（Data Descriptor）

数据描述符用于描述一个属性的值和特性，包含以下可选键值：

- `value`：属性的值。
- `writable`：如果为 `true`，属性的值可以被修改；如果为 `false`，属性的值不可修改（默认为 `false`）。
- `enumerable`：如果为 `true`，属性会出现在对象的枚举属性中（例如 `for...in` 循环中）；如果为 `false`，属性不会出现在枚举中（默认为 `false`）。
- `configurable`：如果为 `true`，属性描述符可以被修改或删除；如果为 `false`，属性描述符不可修改或删除（默认为 `false`）。

## 存取描述符（Accessor Descriptor）

存取描述符用于描述属性的 getter 和 setter 函数，包含以下可选键值：

- `get`：一个给属性提供 getter 的方法，如果没有 getter 则为 `undefined`。
- `set`：一个给属性提供 setter 的方法，如果没有 setter 则为 `undefined`。
- `enumerable`：同上。
- `configurable`：同上。

总结如下表格：
| 描述符 | 类型 | 默认值 | 作用 |
| ------------------ | -------- | ----------- | ------------------------------------------------- |
| **`value`** | 任意 | `undefined` | 属性的实际值 |
| **`writable`** | Boolean | `false` | 若为 `false`，属性值不可修改（严格模式下会报错） |
| **`enumerable`** | Boolean | `false` | 若为 `false`，属性不会出现在 `for...in` 和 `Object.keys()` 中 |
| **`configurable`** | Boolean | `false` | 若为 `false`，属性不可删除，描述符不可修改（`writable` 除外） |
| **`get`** | Function | `undefined` | 读取属性时调用的函数 |
| **`set`** | Function | `undefined` | 设置属性时调用的函数 |

## 常用操作 API

获取描述符

```js
// 获取单个属性的描述符
let desc = Object.getOwnPropertyDescriptor(obj, "propName");

// 获取对象所有属性的描述符
let allDesc = Object.getOwnPropertyDescriptors(obj);
```

定义描述符

```js
// 定义单个属性
Object.defineProperty(obj, "prop", {
  value: 42,
  writable: false,
  enumerable: true,
});

// 定义多个属性
Object.defineProperties(obj, {
  prop1: { value: 1, writable: true },
  prop2: {
    get() {
      return 2;
    },
  },
});
```

## 示例

创建一个名为 id 的只读属性

```js
const obj = {};
Object.defineProperty(obj, "id", {
  value: 1001,
  writable: false, // 不可修改
  configurable: false, // 不可删除
});

obj.id = 2000; // 静默失败（严格模式会报错）
console.log(obj.id); // 1001
```

## 注意事项

- 描述符类型互斥：数据描述符和存取描述符不能混用（即不能同时定义 value/writable 和 get/set）
- 默认值陷阱：使用 defineProperty 定义属性时，未指定的描述符默认为 false
- 不可配置性：一旦设置 configurable: false，就无法再改回 true（单向操作）
