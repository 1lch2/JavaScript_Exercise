# Webpack - 基础
## 用途
- 模块打包。可以将不同模块的文件打包整合在一起，并且保证它们之间的引用正确，执行有序。利用打包我们就可以在开发的时候根据我们自己的业务自由划分文件模块，保证项目结构的清晰和可读性。
- 编译兼容。通过 webpack 的 Loader 机制，不仅仅可以帮助我们对代码做polyfill，还可以编译转换诸如.less, .vue, .jsx这类在浏览器无法识别的格式文件，让我们在开发的时候可以使用新特性和新语法做开发，提高开发效率。
- 能力扩展。通过 webpack 的 Plugin 机制，我们在实现模块化打包和编译兼容的基础上，可以进一步实现诸如按需加载，代码压缩等一系列功能，帮助我们进一步提高自动化程度，工程效率以及打包输出的质量。

## 核心概念
### Entry
entry 指示 webpack 从哪个JS文件开始打包，分析依赖关系图。

默认起点路径为`./src/index.js`，在 webpack.config.js 中配置路径，示例如下：
```js
module.exports = {
  entry: './path/to/my/entry/file.js',
};
```

### Output
output 指示webpack输出打包文件的路径，以及如何命名打包结果文件。

默认输出路径为`./dist`，打包生成的JS文件名默认是`main.js`，生成的其他的文件会在同一目录下。在 webpack.config.js 中配置示例如下：
```js
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    // __dirname 代表配置文件所在的目录，即根目录
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js',
  },
};
```

### Loader
webpack 默认只能打包JS和JSON，为了处理其他文件类型，需要使用不同loader将他们转换为有效的模块（module）。

在 webpack 的配置中，loader 有两个属性：
- test 属性，识别出哪些文件会被转换。
- use 属性，定义出在进行转换时，应该使用哪个 loader。

配置示例如下：
```js
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js',
  },
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
};
```
上述规则的效果如下：在`require()`或`import`语句中解析到`.txt`文件时，先使用`raw-loader`进行转换。

处理一个文件可以使用多个loader，loader的执行顺序和配置中的顺序是**相反**的，最后一个loader最先执行，第一个loader最后执行。

第一个执行的loader接受源文件作为参数内容，其他的loader接受前一个loader的返回值作为自己的参数，最后一个执行的loader会返回此模块的JavaScript源码。

#### 常见 loader
- file-loader: 文件加载
- url-loader： 文件加载，可以设置阈值，小于时把文件base64编码
- image-loader: 加载并压缩图片
- json-loader: webpack默认已经包含了
- babel-loader： ES6+转成ES5
- ts-loader: 将ts转成js
- awesome-typescript-loader: 比ts-loader性能好一些
- css-loader：处理@import和url这样的外部资源
- style-loader： 在head创建style标签把样式插入
- postcss-loader: 扩展css语法，使用postcss各种插件autoprefixer，cssnext，cssnano
- eslint-loader， tslint-loader:通过这两种检查代码，tslint不再维护
- vue-loader: 加载vue单文件组件
- i18n-loader： 国际化
- cache-loader：性能开销大的loader前添加，将结果缓存到磁盘
- svg-inline-loader:压缩后的svg注入代码
- source-map-loader: 加载source map文件，方便调试
- expose-loader: 暴露对象为全局变量
- imports-loader、exports-loader等可以想模块注入变量或者提供导出模块功能
- raw-loader： 可以将文件以字符串的形式返回


### Plugin
plugin 用来执行范围更广的任务，包括：打包优化，资源管理，注入环境变量。

> 对比 loader：loader 运行在打包文件之前，而 plugins 在整个编译周期都起作用

使用插件需要用`require()`语法，并添加到`plugin`数组中。一般使用 option 选项自定义，也可以使用`new`操作符来创建插件实例，这种方式可以在同一个配置文件中多次使用同一个插件。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // 用于访问内置插件

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
  plugins: [new HtmlWebpackPlugin({ template: './src/index.html' })],
};
```
在上面的示例中，html-webpack-plugin 为应用程序生成一个 HTML 文件，并自动将生成的所有 bundle 注入到此文件中。


#### 常见 plugin
- HtmlWebpackPlugin：在打包结束后，⾃动生成⼀个 html ⽂文件，并把打包生成的js 模块引⼊到该 html 中
- clean-webpack-plugin：删除（清理）构建目录
- mini-css-extract-plugin：提取 CSS 到一个单独的文件中


### Mode
指示 webpack 使用相应模式的配置。有三个选项：none, production, development
- none：不使用任何默认优化选项
- production：会将 DefinePlugin 中 `process.env.NODE_ENV` 的值设置为 production。为模块和 chunk 启用确定性的混淆名称，FlagDependencyUsagePlugin，FlagIncludedChunksPlugin，ModuleConcatenationPlugin，NoEmitOnErrorsPlugin 和 TerserPlugin 。
- development：会将 DefinePlugin 中 `process.env.NODE_ENV` 的值设置为 development. 为模块和 chunk 启用有效的名。

## 配置示例
[文件出处：Youtube - Traversy Media: Webpack Crash Course](https://github.com/bradtraversy/webpack-starter/blob/main/webpack.config.js)

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: 'development',
  entry: {
    bundle: path.resolve(__dirname, 'src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash].js',
    clean: true,
    assetModuleFilename: '[name][ext]',
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),
    },
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack App',
      filename: 'index.html',
      template: 'src/template.html',
    }),
    new BundleAnalyzerPlugin(),
  ],
}
```
