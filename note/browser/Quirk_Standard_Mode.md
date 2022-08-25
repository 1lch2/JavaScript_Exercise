# 浏览器 - 标准模式和怪异模式
目前浏览器的排版引擎使用三种模式：
- 怪异模式（Quirks mode）
- 接近标准模式（Almost standards mode）
- 标准模式（Standards mode）。

在怪异模式下，排版会模拟 Navigator 4 与 Internet Explorer 5 的非标准行为。为了支持在网络标准被广泛采用前，就已经建好的网站，这么做是必要的。

在标准模式下，行为即（但愿如此）由 HTML 与 CSS 的规范描述的行为。在接近标准模式下，只有少数的怪异行为被实现。

浏览器如何决定使用哪个模式？

对 HTML 文件来说，浏览器使用文件开头的 DOCTYPE 来决定用怪异模式处理或标准模式处理。为了确保你的页面使用标准模式，请确认你的页面如同本范例一样拥有 DOCTYPE：
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset=UTF-8>
    <title>Hello World!</title>
  </head>
  <body>
  </body>
</html>
```

