# Fetch 对比 XHR
## Fetch

- 基于 Promise 设计，支持 async/await
- 更加底层，提供的 API 丰富（request, response）
- 脱离了 XHR，是 ES 规范里新的实现方式

### Fetch 的优势
- 语法简洁，更加语义化
- 基于标准 Promise 实现，支持 async/await
- 更加底层，提供的 API 丰富（request, response）
- 脱离了 XHR，是 ES 规范里新的实现方式

### Fetch 的不足
- fetch 只对网络请求报错，对 400，500 都当做成功的请求，需要封装去处理
- fetch 默认不会带 cookie，需要添加配置项
- fetch 不支持 abort，不支持超时控制，使用 setTimeout 及 Promise.reject 的实现的功能并不靠谱

### 封装 fetch
```js
function request(url, options) {
  return fetch(url, options)
    .then(response => {

      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .catch(error => {
      console.error(error);
    });
}
```

## XHR
最常用的请求库 Axios 就是基于XHR的。

- 所有浏览器都支持的传统 Ajax 技术
- 基于事件的传统写法，存在回调地狱问题
- 本身是同步的值，但发送网络请求又是异步的，所以存在一定的矛盾

### XHR 的优势
- 兼容性好
- 使用简单
- 可配置性强

### XHR 的不足
- 回调地狱
- 代码复杂
- 封装不够好