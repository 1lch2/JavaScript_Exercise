# TS 对象类型
## readonly 属性
标记为`readonly`的属性在类型检查时不能被写入，在运行时没有区别。

```ts
interface Type {
    readonly prop: {name: string, age: number};
}
```

类似 const，标记为 readonly 的属性并不是完全不能改变，只是这个属性的指向不能变，被指向的对象的属性依然可以变。

对于数组，有专门的 `ReadonlyArray`，这个类型不使用 new 创建变量，而是直接用现有的数组赋值：
```ts
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

元组也可以使用readonly标记只读：
```ts
function doSomething(pair: readonly [string, number]) {
  // ...
}
```

或者使用 `as const` 标记为字面量类型

## 索引签名

```ts
interface StringArray {
  [index: number]: string;
}
 
const myArray: StringArray = getStringArray();
const secondItem = myArray[1];
```

上例的意思是，当 StringArray 使用 number 作为索引时，会返回一个 string。

只有`string`，`number`，`symbol`，模板字符串，以及由前面几类组合的联合类型才能作为索引的类型。

同时，使用了索引签名的接口中的其他属性的类型，必须匹配索引签名标记的返回类型，示例如下：
```ts
interface NumberDictionary {
  [index: string]: number;
 
  length: number; // ok
  name: string; // ❌
  // Property 'name' of type 'string' is not assignable to 'string' index type 'number'.
}
```

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
keyof 关键字接受一个对象类型，返回由它的key组成的string或number字面量联合类型。

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

