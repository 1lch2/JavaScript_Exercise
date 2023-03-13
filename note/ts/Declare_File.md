# TS 声明文件
## 带属性的对象
代码如下
```ts
let result = myLib.makeGreeting("hello, world");
console.log("The computed greeting is:" + result);
let count = myLib.numberOfGreetings;
```

用 `declare namespace` 描述通过点符号访问的属性和方法
```ts
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```


TODO：