# Express 路由
## 路由方法

## 路由路径
### 字符串匹配
精确匹配路由路径
```js
app.get('/', (req, res) => {
  res.send('root');
})
```

### 字符串模式匹配
此路由路径会将请求匹配到/acd和/abcd
```js
app.get('/ab?cd', (req, res) => {
  res.send('ab?cd');
})
```

此路由路径将请求匹配到/abcd、/abbcd、/abbbcd等
```js
app.get('/ab+cd', (req, res) => {
  res.send('ab+cd');
})
```

此路由路径将请求匹配到/abcd、/abxcd、/ab123cd、/abRANDOMcd等
```js
app.get('/ab*cd', (req, res) => {
  res.send('ab*cd');
})
```

此路由路径将请求匹配到/abe、/abcde
```js
app.get('/ab(cd)?e', (req, res) => {
  res.send('ab(cd)?e');
})
```

### 含参的通配路由
在路由中使用参数进行通配表示。而该参数所表示的具体数值会在变量 params 中获取到，下面是简单的代码示例：
```js
app.get("/users/:userid", function(req, res) {
    // 将userId转换为整型
    var userId = parseInt(req.params.userid, 10);
    // ...
});
```

注意：`/users/` 或者 `/users/123/posts` 不会被匹配

### 正则表达式匹配路由
若只需要匹配 `/users/123` 和 `/users/456` 这种通配参数为数字的动态路由的同时忽略其他路由格式，那么可以将代码改为：
```js
app.get(/^\/users\/(\d+)$/, function(req, res) {
    var userId = parseInt(req.params[0], 10);
    // ...
})
```
这样就通过正则表达式代码将通配参数限定为数字类型

