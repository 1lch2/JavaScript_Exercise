# PostCSS

PostCSS 是个用 JS 检查 CSS 的工具。

## 使用

在 Webpack 配置中添加对应的 loader：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
    ],
  },
};
```

然后创建 PostCSS 的配置文件 `postcss.config.js`

```js
module.exports = {
  plugins: [require("autoprefixer"), require("postcss-nested")],
};
```

或者直接使用 JS API 来配置：

```js
const postcssNested = require("postcss-nested");
const autoprefixer = require("autoprefixer");
const postcss = require("postcss");
const fs = require("fs");

fs.readFile("src/app.css", (err, css) => {
  postcss([postcssNested, autoprefixer])
    .process(css, { from: "src/app.css", to: "dest/app.css" })
    .then((result) => {
      fs.writeFile("dest/app.css", result.css);
      if (result.map) fs.writeFile("dest/app.css.map", result.map);
    });
});
```

其中 `postcss(plugins)` 接受一个 plugin 数组，其中传入的 plugin 可以在其中继续对每个 plugin 进行单独配置。

```js
const postcssRuntime = postcss([
  postcssPresetEnv({ ... }),
  postcssModules({ ... }),
  autoPrefixer(),
  postcssPrefixSelector({ ... })
])

postcssRuntime.process(...).then( ... )
```

## 插件（plugin）



TODO:
