# TS - 函数

TS 函数的声明和使用与 JS 基本相同，也是使用 `function` 关键字或者是箭头函数，亦或者是作为参数的匿名函数。

TS 为函数增加了参数和返回值的类型声明，类型可以是基本类型，联合类型，泛型，接口等。示例如下：

```ts
function greetings(name: string | string[]): string {
  if (Array.isArray(name)) {
    console.log("Hello, " + name.join(" and "));
  } else {
    console.log("Welcome lone traveler " + name);
}
```

函数也可以作为类型声明。
```ts
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}
```

## 泛型函数
参见[TS 泛型](./Generics.md#泛型函数)

## 可选参数 
函数参数可以包含可选的参数，示例如下：

```ts
function greetings(name: string, type?: string) {
    ...
}
```

这种情况下，type 变量的类型实际上变成了 `string | undefined`，因此在使用时需要判断是否为空。而一种处理的办法就是提供默认值。

```ts
function fn(x = 10) {
  ...
}
```
效果等于 x 输入为 undefined 时将其赋值为 10。

### 回调中的可选参数
TS对于回调中的可选参数与JS处理不太一样，以下面的手搓 forEach 函数为例：
```ts
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], i);
  }
}
```

实际上使用时，TS会警告第二个参数可能为空：
```ts
myForEach([1, 2, 3], (a, i) => {
  console.log(i.toFixed());
  // Object is possibly 'undefined'.
});
```

TS中，如果想调用函数而不传某个参数的话，就不要把它写成可选参数。


## 函数重载
TS的函数重载和Java完全不同

TS的函数重载需要定义重载签名和一个实现签名。重载签名是一组带有参数和返回类型的函数，但没有主体。实现签名是一个具有函数主体的函数。示例如下：
```ts
function add(x: number, y: number): number;
function add(x: string, y: string): string;
function add(x: any, y: any): any {
    return x + y;
}

let result1 = add(1, 2);
let result2 = add("Hello", "World");
```


实现签名的参数必须为重载签名的超集，否则编译器会报错。下面是个经典错误案例：
```ts
function fn(x: string): void;
function fn() {
  // ...
}
fn();
// Expected 1 arguments, but got 0.
```

## this
TS可以在函数内声明 this 的类型，例如：
```ts
class MyClass {
  myProperty: string = "Hello";
  myMethod(this: MyClass) {
    console.log(this.myProperty);
  }
}
```

> 利用接口的多个调用签名也可以实现函数重载，不过不如传统方式好：[接口定义多个调用签名](Interface.md#多个调用签名)

## 参数解构
类似ES6的操作，可以在函数参数或者函数体内解构参数。
```ts
function sum({ a, b, c }) {
  console.log(a + b + c);
}
sum({ a: 10, b: 3, c: 9 });
```

但是，不能直接在解构的参数里做类型注释，也就是以下写法是错误的。
```ts
// ❌
function sum({ a: number, b: number, c: number }) {
  console.log(a + b + c);
}
```

正确写法有两种，一种是将参数对象定义为类型别名，另一种是整个注释对象：
```ts
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
  ...
}
```

```ts
function sum({ a, b, c }: { a: number, b: number, c: number }) {
  ...
}
```

## 调用签名
参见[调用签名](./Interface.md#调用签名)

