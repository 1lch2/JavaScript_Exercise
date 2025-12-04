# TS 声明文件

`declare` 是 TypeScript 中用于类型声明的关键字，它告诉编译器某个实体（变量、函数、类等）已经存在，无需生成实际的 JavaScript 代码。主要用于与现有 JavaScript 代码或第三方库集成。

## 作用

- 类型补充：为纯 JavaScript 代码添加类型信息
- 不产生代码：声明不会编译成任何 JS 代码
- 避免重复定义：防止编译器报错"Cannot redeclare block-scoped variable"

## 使用场景

### 声明全局变量（在 .d.ts 文件中）

当使用 CDN 引入的库时，全局作用域的变量需要声明：

```ts
// global.d.ts
declare const $: (selector: string) => any;
declare let __DEV__: boolean;

// 然后在 TS 文件中直接使用
$("#app"); // 不会报错
```

### 声明模块（为没有类型定义的库）

当使用的 npm 包缺少 @types 时：

```ts
// types/some-lib.d.ts
declare module "some-lib" {
  export function init(config: { timeout: number }): void;
  export const version: string;
}

// 使用时
import { init } from "some-lib";
init({ timeout: 1000 }); // 有类型提示了
```

### 扩展全局类型（模块增强）

为现有对象添加自定义属性：

```ts
// 扩展 Window 对象
declare global {
  interface Window {
    myApp: {
      version: string;
    };
  }
}

// 使用
window.myApp.version; // 有类型检查
```

### 声明外部变量（如环境变量）

在 Node.js 或构建工具中的环境变量：

```ts
// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production";
    readonly API_KEY: string;
  }
}
```

## 关键注意事项

- 文件命名：全局声明通常放在 .d.ts 文件中
- 模块与全局：在 .d.ts 文件中，顶层 import/export 会使文件变成模块，此时用 declare global 扩展全局作用域
- 不要滥用：只在必要时使用，优先选择安装 @types 包或官方类型定义
- 三斜杠指令：在文件顶部使用 `/// <reference types="..." />` 引用类型定义
