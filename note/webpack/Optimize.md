# webpack 构建速度优化
## 分析工具
### 使用webpack内置的stats
在package.json中使用stats
```json
{
    ...
    "scripts": {
        "stats": "webpack --json > stats.json"
    },
    ...
}
```
通过 `npm run stats` 即可生产 stas.json 文件，内容包含了构建的统计信息

### 使用 speed-measure-webpack-plugin
可以分析每个loader、plugin的耗时。用法如下：
```js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const webpackConfig = smp.wrap({
  plugins: [new MyPlugin(), new MyOtherPlugin()],
});
```

## 提升性能
### 使用高版本 webpack 和 nodejs

### 多进程、多实例解析构建
使用 thread-loader 去解析资源，每次webpack解析一个模块，thread-loader会将它及它的依赖分配给worker线程中。用例：
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          'thread-loader',
          // your expensive loader (e.g babel-loader)
        ],
      },
    ],
  },
};
```

### 多进程，多实例并行压缩
terser-webpack-plugin 开启parallel参数
```js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // parallel默认值是当前电脑环境CPU数量的2倍减1
      }),
    ],
  },
};
```

> Webpack V5 自带该插件

### 预编译资源模块
- 方法一：使用 html-webpack-externals-plugin （例如将react，react-dom基础包通过cdn引入，不打入bundle中）
- 方法二：使用 SplitChunksPlugin
- 方法三：使用 DLLPlugin 进行分包，DIIReferencePlugin 对 mainfest.json 引用 （官方内置的插件）

### 利用缓存提升二次构建速度
- babel-loader 开启缓存
- terser-webpack-plugin开启缓存
- 使用 cache-loader 或者 hard-source-webpack-plugin

### 缩小构建目标
少构建模块 比如babel-loader不解析node_modules

### 使用Tree Shaking 擦除无用的JavaScript和CSS
