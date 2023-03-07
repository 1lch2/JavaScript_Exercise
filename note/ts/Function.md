# TS - 函数

TS 函数的声明和使用与 JS 基本相同，也是使用 `function` 关键字或者是箭头函数，亦或者是作为参数的匿名函数。

TS 为函数增加了参数和返回值的类型声明，类型可以是基本类型，联合类型，泛型，接口等。示例如下：

```ts
function greetings(name: string | string[]): string {
  return typeof name === "string" ? name : name.join(",");
}
```

函数参数也可以包含可选的参数，示例如下：

```ts
function greetings(name: string, type?: string) {
    ...
}
```

TODO:
