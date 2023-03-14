# TypeScript 基础
## 基本类型
TS 的基本类型和 JS 一致，同样是 7 种：
- string
- number
- bigint
- boolean
- undefined
- null
- symbol

基本类型不可变，可以重新分配，但值本身不可变。

基本类型之间的赋值可行性如下表所示：
|             | any | unknown | object | void | undefined | null | never |
|:-----------:|:---:|:-------:|:------:|:----:|:---------:|:----:|:-----:|
|    any →    |     |    ✓    |    ✓   |   ✓  |     ✓     |   ✓  |   ✕   |
|  unknown →  |  ✓  |         |    ✕   |   ✕  |     ✕     |   ✕  |   ✕   |
|   object →  |  ✓  |    ✓    |        |   ✕  |     ✕     |   ✕  |   ✕   |
|    void →   |  ✓  |    ✓    |    ✕   |      |     ✕     |   ✕  |   ✕   |
| undefined → |  ✓  |    ✓    |    ✓   |   ✓  |           |   ✓  |   ✕   |
|    null →   |  ✓  |    ✓    |    ✓   |   ✓  |     ✓     |      |   ✕   |
|   never →   |  ✓  |    ✓    |    ✓   |   ✓  |     ✓     |   ✓  |       |

## 联合类型
包含多种类型，如下所示：
```ts
let age: string | number;

age = 42;
age = "42";
```

### 使用方式
使用联合类型时，**不能**直接使用仅在其中一种类型上可用的方法，TS只会展示所有类型上都可用的方法，示例如下：

```ts
function printId(id: number | string) {
  console.log(id.toUpperCase());
  // Property 'toUpperCase' does not exist on type 'string | number'.
  // Property 'toUpperCase' does not exist on type 'number'.
}
```

修正方式：使用类型守卫来限制类型，
```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id);
  }
}
```

## 数组类型
有两种声明方式：
1. 在变量类型后加 `[]` 
2. 使用数组泛型：

```ts
let array: Array<number> = [0, 1, 2, 3];
```

配合联合类型可以声明存储多个类型的数组：
```ts
let person: (string | number | boolean)[] = ['Danny', 1, true];
```

## any
针对编程时类型不明确的变量使用的一种数据类型，它常用于以下三种情况。

1. 变量的值会动态改变时，比如来自用户的输入，任意值类型可以让这些变量跳过编译阶段的类型检查，示例代码如下：

```ts
let x: any = 1;    // 数字类型
x = 'I am who I am';    // 字符串类型
x = false;    // 布尔类型
```
2. 改写现有代码时，任意值允许在编译时可选择地包含或移除类型检查，示例代码如下：
```ts
let x: any = 4;
x.ifItExists();    // 正确，ifItExists方法在运行时可能存在，但这里并不会检查
x.toFixed();    // 正确
```
3. 定义存储各种类型数据的数组时，示例代码如下：
```ts
let arrayList: any[] = [1, false, 'fine'];
arrayList[1] = 100;
```

## never
never 是其他类型的子类型，代表从不会出现的值，声明为 never 类型的变量只能被 never 类型所赋值。

一般用于抛出异常或无法执行到终止点

```ts
let x: never;
// 运行正确，never 类型可以赋值给 never类型
x = (()=>{ throw new Error('exception')})();
```

## null & undefined
根据 strictNullChecks 这个选项的开启与否，TS对于 null 和 undefined 的行为也不同。

## void
一般用来标记函数没有返回值。与 undefined 不同，函数如果返回值为 undefined 则应该显式地写出返回值类型为 undefined。

### 关闭
可能为 null 或 undefined 的值能正常访问，这两个值也可以被赋给 any 类型的变量。

### 开启
对于可能为 null 或 undefined 的值，必须先判断是否为空才能再调用方法或者属性，示例如下：
```ts
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```


## 对象类型
TS 中将对象作为类型必须指定属性的类型
```ts
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 3, y: 7 });
```

通过使用 `?` 可以将某个属性标记为可选。
```ts
function printName(obj: { first: string; last?: string }) {
  // ...
}
```

> 当某个对象的属性为可选，且传参时不存在时，它的值为`undefined`，因此有可选属性或参数的地方需要对可选部分判断是否为 undefined。

当定义一个对象的签名时，通常会使用 接口（interface）。具体参考[Interface](./Interface.md)

## 枚举类型
用法类似 Java
```ts
enum Color { Red, Green, Blue };
let c: Color = Color.Blue;
console.log(c); // 2
```

可以给枚举值赋值。
```ts
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```
上例中 `Up` 之后的枚举值会递增。

## 类型别名
用 `type` 关键字可以定义类型别名。
```ts
type Point = {
  x: number;
  y: number;
};

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
printCoord({ x: 100, y: 100 });
```

类型别名也可以用来给联合类型命名：
```ts
type ID = number | string;
```

类型别名也能用来给同一个类型起不同的名，TS会自动推断是否为同一类型：
```ts
type NewString = string;

let s: NewStrng;
s = "abc";
```


### 拓展类型别名
使用 `&` 拓展类型别名
```ts
type Animal = {
  name: string
}

type Bear = Animal & { 
  honey: boolean 
}

const bear = getBear();
bear.name;
bear.honey;
```

## 断言
### 类型断言
使用关键词 `as` 可以为 TS 无法自动推断类型的变量设定类型。

举例：如果调用 `document.getElementById`，TypeScript 只知道会返回 HTMLElement 类型的元素，但你确定返回的一定是一个 HTMLCanvasElement 类型的变量。这时就可以用断言来给变量指定类型

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

除了 `as` 也可以用尖括号，效果一样
```ts
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```
> 注意：不要在 tsc，即react文件中用这个语法，尖括号会被误判。

断言不能乱来：
```ts
// 报错
const x = "hello" as number;
```

如果想允许强制类型转换，可以用两次断言，第一次转 any，第二次转想设定的类型
```ts
const a = (expr as any) as T;
```

### 非空断言
表达式后面接 `!` 可以断言表达式结果不是 `null` 或 `undefined`。

下例用 `?` 标记的可能空值被 `!` 抵消了效果。
```ts
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

## 字面量类型
字符串常量本身可以作为字面量类型来用，单独用基本没什么价值，因此经常利用联合来将字面量组合起来。

示例如下，将参数限定为几个固定的值：
```ts
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre"); // Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```


也可以将字面量和非字面量类型组合起来：
```ts
interface Options {
  width: number;
}
function configure(x: Options | "auto") {
  // ...
}
configure({ width: 100 });
configure("auto");

configure("automatic");
// Argument of type '"automatic"' is not assignable to parameter of type 'Options | "auto"'.
```

### 字面量推断
使用对象来初始化变量时，TS不会把变量属性值当成字面量类型，而是认为属性之后会变化。
```ts
const obj = { counter: 0 };
if (someCondition) {
  obj.counter = 1;
}
```

这里并不会把 counter 这个属性的类型当成字面量 `0` 类型，而是一般的 number。

那就有了接下来的问题，当函数接受的参数必须是字面量类型时，传入一个对象会出现类型错误：
```ts
// 这里的参数被推导为了 string
const req = { url: "https://example.com", method: "GET" };
handleRequest(req.url, req.method);
// Argument of type 'string' is not assignable to parameter of type '"GET" | "POST"'.
```

解决办法有两种，一种是给属性加上类型断言，或者是给参数加上类型断言：
```ts
// 二选一
const req = { url: "https://example.com", method: "GET" as "GET" };

handleRequest(req.url, req.method as "GET");
```

另一种是用`as const`将整个变量都转换为类型字面量：
```ts
const req = { url: "https://example.com", method: "GET" } as const;
handleRequest(req.url, req.method);
```

