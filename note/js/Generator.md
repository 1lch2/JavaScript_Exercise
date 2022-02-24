# JavaScript基础 - Generator函数
## 定义
1. function关键字与函数名之间有一个星号；
2. 函数体内部使用yield表达式，定义不同的内部状态


```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```

## 使用方法

// TODO: