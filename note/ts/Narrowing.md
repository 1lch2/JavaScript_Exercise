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
类似JS，TS中的 if 会对传入的参数做类型转换，并不要求传入的只能是布尔类型。

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
    return typeof value === 'string';
}
```

借助这个 isString 函数，TS可以推断语句内部的类型，示例如下：
```ts
let value: any = 'hello';

if (isString(value)) {
    // TypeScript 知道 value 是一个字符串
    console.log(value.toUpperCase()); // 输出 'HELLO'
}
```

## 可辨识联合类型（Discriminated unions）

TODO：