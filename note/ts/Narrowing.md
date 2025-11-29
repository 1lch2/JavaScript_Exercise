# 类型收缩

TS 可以理解由 if 构成的判断类型的语句，称为类型守卫。

示例如下：

```ts
function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input;
  }
  return padding + input;
}
```

对于不同的类型，需要用不同的关键字来做类型守卫

## typeof 类型首位

typeof 可以用来判断以下类型：

- "string"
- "number"
- "bigint"
- "boolean"
- "symbol"
- "undefined"
- "object"
- "function"

**注意**，这里没有 `null`。对于 null 的检查在下一部分阐述。

## 真实性收缩

类似 JS，TS 中的 if 会对传入的参数做类型转换，并不要求传入的只能是布尔类型。

以下的值会被转换为 `false`，其余的都是 true：

- 0
- NaN
- "" (空字符串)
- 0n (BigInt 类型的 0)
- null
- undefined

## 相等性收缩

利用 `==`，`===`，`!=`，`!==`来判断类型和空值。

## `in` 操作符

`in` 操作符可以判断某对象是否有指定名称的属性。示例如下：

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }
  return animal.fly();
}
```

## 类型谓词

类型谓词是 TypeScript 中的一个特性，它允许你定义一个函数，该函数用于检查某个值是否属于特定类型。类型谓词的语法是 `parameterName is Type`，其中 `parameterName` 是函数的参数名称，而 `Type` 是要检查的类型。

使用类型谓词的原因之一是为了在 TypeScript 中实现类型保护。当你使用类型谓词来检查某个值是否属于特定类型时，TypeScript 会自动将该值的类型缩小为指定的类型。这样，在后续代码中就可以安全地访问该值上属于指定类型的属性和方法。

示例如下：

```ts
function isString(value: any): value is string {
  return typeof value === "string";
}
```

借助这个 isString 函数，TS 可以推断语句内部的类型，示例如下：

```ts
let value: any = "hello";

if (isString(value)) {
  // TypeScript 知道 value 是一个字符串
  console.log(value.toUpperCase()); // 输出 'HELLO'
}
```

## 可辨识联合类型（Discriminated unions）

当某个联合类型中的每个类型都包含了一个共同的字面量属性时，TS 会将这个联合类型视为可辨识联合类型，并能够借助类型守卫来确定联合中的具体成员。

先来看一个反例，定义一个包含字面量类型属性的接口，用来区分属性是否存在。

```ts
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

利用字面量类型的机制，可以避免拼写错误之类的低级错误导致的问题。然而这样写会导致类型守卫起不到预期的效果：

```ts
function getArea(shape: Shape) {
  if (shape.kind === "circle") {
    // Object is possibly 'undefined'.
    return Math.PI * shape.radius ** 2;
  }
}
```

TS 无法推断 shape 变量的其他成员是否存在，本来其他属性也没有在声明时和 kind 产生什么联系。如果直接给 radius 属性用非空断言也能排除 TS 报错，但这么干本身就可能会引来错误。

正确处理方式是将两个类型联合起来，把字面量类型的属性作为公共属性，示例如下：

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

type Shape = Circle | Square;
```

这样 TS 可以通过 kind 属性的值来推断变量具体是哪一种类型了，剩下的就是用一般的类型守卫收缩类型即可。

## never 类型

never 类型可以赋给任意其他类型的变量，但是其他类型变量都不能转为 never 类型。可以利用 never 的特点来对 switch 语句进行完全性检查，示例如下：

```ts
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}
```

如果之后给联合类型 Shape 多加了一个类型，但是忘记在 switch 语句里加上对应的声明，那 default 部分就会报错。

## if 块之外类型回归输入参数
以下面的代码为例
```ts
function testTypeNarrowing(input: string | number | boolean) {
  if (typeof input === 'string') {
    console.log('string !');
  } else if (typeof input === 'number') {
    console.log('number !');
  } else {
    console.log('bool !');
  }

  console.log(input.toString());
}
```
最后一行 console.log 不会报错，这时候 input 的类型是 `string | number | boolean`。
