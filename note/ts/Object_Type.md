# TS 对象类型

## readonly 属性

标记为`readonly`的属性在类型检查时不能被写入，在运行时没有区别。

```ts
interface Type {
  readonly prop: { name: string; age: number };
}
```

类似 const，标记为 readonly 的属性并不是完全不能改变，只是这个属性的指向不能变，被指向的对象的属性依然可以变。

对于数组，有专门的 `ReadonlyArray`，这个类型不使用 new 创建变量，而是直接用现有的数组赋值：

```ts
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

元组也可以使用 readonly 标记只读：

```ts
function doSomething(pair: readonly [string, number]) {
  // ...
}
```

或者使用 `as const` 标记为字面量类型

## 拓展类型

参考[接口继承](./Interface.md#接口继承)

## 交叉类型

使用`&`来合并两个对象类型（接口）

```ts
interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}

type ColorfulCircle = Colorful & Circle;
```

## keyof

keyof 关键字接受一个对象类型，返回由它的 key 组成的 string 或 number 字面量联合类型。

```ts
type Point = { x: number; y: number };
type P = keyof Point;

// P 等价于联合类型
type P = "x" | "y";
```

## typeof

typeof 除了像在 JS 里用来判断基本类型以外，也可以用来获取某个变量或者函数的返回值的类型。

```ts
let s = "hello";
let n: typeof s;

function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;

// type P = {
//     x: number;
//     y: number;
// }
```

typeof 不能直接用到函数上，只能配合 ReturnType 泛型获取函数返回值类型。
