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

## 联合类型
包含多种类型，如下所示：
```ts
let age: string | number;

age = 42;
age = "42";
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
