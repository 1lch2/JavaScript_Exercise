# TS 模块

## 默认导出
声明一个变量并将它作为模块的默认导出

```ts
declare const arg: SomeType;
export = arg;
```

## 导出命名空间
将 arg 导出为全局命名空间，可以通过 arg 来访问模块中导出的全部内容。

```ts
declare const arg: SomeType;
export as namespace arg;
```

TODO：