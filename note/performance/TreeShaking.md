# Tree Shaking（摇树优化）

## 1. 核心概念概览

**"Tree Shaking 是一种死代码消除（Dead Code Elimination）技术，通过静态分析移除 JavaScript 中未被引用的多余代码，就像摇树把枯叶（无用代码）抖落一样。"**

* **核心特点**：Tree Shaking 是**编译时优化**，非运行时，因此不影响业务逻辑
* **技术基础**：依赖 ES6 模块的静态导入导出特性
* **工作原理**：打包工具在构建时静态分析模块依赖图，移除未引用的代码

## 2. 深度拆解：核心原理与前提条件

### 2.1 为什么必须是 ES6 模块？

**关键原因**：
* `import/export` 是静态的，导入导出关系在编译时就能确定
* CommonJS 的 `require()` 是动态的，只能在运行时确定依赖
* ES6 模块的导入导出是只读绑定，无法被修改

```js
// ✅ 可被 Tree Shaking
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

import { add } from './math'; // 只使用 add，subtract 会被移除

// ❌ 无法被 Tree Shaking
module.exports = { add, subtract };
const math = require('./math'); // 整体引入
```

### 2.2 静态分析机制

打包工具（如 Webpack/Rollup）在构建时的执行步骤：

1. **解析**：解析所有 `import/export` 语句
2. **构建**：构建模块依赖图（Module Graph）
3. **标记**：标记所有被引用到的代码
4. **移除**：未标记的代码视为"死代码"并移除

## 3. 深度拆解：Webpack 中的 Tree Shaking 实现

### 3.1 配置要求（Webpack 4+）

```js
// webpack.config.js
module.exports = {
  mode: 'production', // 生产模式自动开启

  // 手动配置：
  optimization: {
    usedExports: true, // 标记未使用代码
    minimize: true,    // 使用 TerserPlugin 压缩
  },

  // 关键配置：确保使用 ESM
  resolve: {
    mainFields: ['module', 'main'], // 优先使用 ESM 版本
  }
}
```

### 3.2 package.json 配置

```json
{
  "sideEffects": false,  // 全局无副作用

  // 有选择地标记：
  "sideEffects": ["*.css", "*.less"] // 仅这些文件有副作用
}
```

## 4. 深度拆解：Side Effects（副作用）详解

### 4.1 什么是副作用？

**定义**：模块执行时除了导出成员外，还修改了全局状态

**常见示例**：
* 修改全局变量
* 添加原型方法
* 直接操作 DOM

```js
// sideEffects: true（不可被移除）
import './polyfill'; // 执行即修改全局
Array.prototype.myMethod = () => {};

// 配置正确示例
{
  "sideEffects": ["./src/polyfill.js", "*.css"]
}
```

### 4.2 前端典型应用

* **第三方库优化**：Lodash、moment.js 等库的选择性引入
* **组件库优化**：Ant Design、Element UI 等的按需加载
* **工具函数库**：Ramda、Lodash-es 等函数的精确引入

## 5. 深度拆解：验证与优化实践

### 5.1 验证 Tree Shaking 是否生效

**方法一**：查看打包输出

```bash
# 添加 stats 信息
webpack --mode production --stats-used-exports
```

**方法二**：Webpack Bundle Analyzer

```js
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

plugins: [new BundleAnalyzerPlugin()]
```

**方法三**：代码注释标记

```js
// 在 production 构建后搜索未被使用的导出
// 会被标记为 /* unused harmony export functionName */
```

### 5.2 实际案例：Lodash 优化

```js
// ❌ 错误：引入整个库
import _ from 'lodash';
_.get(obj, 'path');

// ✅ 正确1：按需引入
import get from 'lodash/get';

// ✅ 正确2：使用 lodash-es
import { get } from 'lodash-es';

// ✅ 正确3：babel-plugin-lodash
// 自动转换：import _ from 'lodash' → import get from 'lodash/get'
// 效果：从 70kb → 可降至几 kb
```

## 6. 核心对比表

| 特性 | Tree Shaking | 传统打包 |
| :---- | :---- | :---- |
| **模块类型** | 仅支持 ES6 模块（ESM） | 支持 CommonJS 和 ES6 |
| **分析时机** | 编译时静态分析 | 运行时动态处理 |
| **代码移除** | 精确移除未使用代码 | 整体打包，无法精确优化 |
| **优化效果** | **显著减少包体积** | 受限于模块系统 |
| **依赖要求** | 严格依赖 ESM 语法 | 相对宽松 |
| **典型工具** | Webpack 4+、Rollup、Vite | Webpack 3 及以下、Browserify |

## 7. 常见问题与解决方案

| 问题 | 原因 | 解决方案 |
| :---- | :---- | :---- |
| **Tree Shaking 失效** | 使用了 CommonJS 语法 | 统一使用 ESM；检查依赖包是否提供 ESM 版本 |
| **误删必要代码** | `sideEffects` 配置错误 | 精确标记有副作用的文件 |
| **Babel 转译问题** | Babel 将 ESM 转为 CommonJS | 配置 `@babel/preset-env` 的 `modules: false` |
| **类（class）的摇树问题** | 类的副作用难以静态分析 | 使用函数式编程；避免在类定义中执行副作用 |

### 7.1 Babel 配置关键设置

```js
// .babelrc 关键配置
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false // 保留 ESM 语法
    }]
  ]
}
```

## 8. 进阶知识点

### 8.1 Rollup vs Webpack

* **Rollup**：更激进的 Tree Shaking，适合库开发
* **Webpack**：更完善的生态，适合应用开发

### 8.2 深度作用域分析（Deep Scope Analysis）

Webpack 5+ 能分析模块内部的作用域，即使：

```js
export function a() { /* ... */ }
export function b() { /* ... */ }

// 只使用 a 中的部分代码
import { a } from './module';
a();
```

### 8.3 动态导入的限制

```js
// 无法被 tree shaking
const module = await import('./big-module');
// 因为动态导入返回 Promise，静态分析困难
```

## 9. 面试回答模板

**Q: 请解释下什么是 Tree Shaking？**

**A:** "Tree Shaking 是死代码消除技术，核心要点包括：

* **前提**：依赖 ES6 模块的静态导入导出特性
* **原理**：打包时静态分析模块依赖图，移除未引用的代码
* **配置**：Webpack 中需设置 `mode: production`，并正确配置 `sideEffects` 避免误删
* **验证**：可通过打包体积分析工具或查看 `unused harmony export` 注释确认
* **注意**：要区分副作用代码，Babel 需配置 `modules: false` 保留 ESM 语法"
