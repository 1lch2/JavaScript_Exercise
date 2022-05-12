# Vue - 响应式原理
## Vue 2: Object.defineProperty
在Vue2.X 响应式中使用到了 defineProperty 进行数据劫持。

语法参考：[Object.defineProperty](../js/Object_defineProperty.md)

模拟如下：
```html
<body>
<div id="app"></div>
<script>
// 模拟 Vue的data
let data = {
    msg: '哈哈',
    age: '18',
};
// 模拟 Vue 实例
let vm = {};
// 把多个属性转化 响应式
function proxyData() {
    // 把 data 中每一项都拿出来操作
    Object.keys(data).forEach((key) => {
        // 对 vm 的 属性 进行数据劫持
        Object.defineProperty(vm, key, {
            // 可枚举
            enumerable: true,
            // 可配置
            configurable: true,
            // 获取数据
            get() {
                return data[key];
            },
            // 设置 属性值
            set(newValue) {
                // 如果传入的值相等就不用修改
                if (newValue === data[key]) {
                    return;
                }
                // 修改数据
                data[key] = newValue;
                document.querySelector('#app').textContent = data[key];
            },
        });
    });
}
// 调用方法
proxyData(data)
</script>
</body>
```

## Vue 3: Proxy
ES6 的 Proxy 语法参考：[Proxy](../js/Proxy.md)

```html
<body>
<div id="app"></div>
<script>
// 模拟 Vue data
let data = {
    msg: '',
    age: ''
}
// 模拟 Vue 的一个实例
// Proxy 第一个
let vm = new Proxy(data, {
    // get() 获取值
    // target 表示需要代理的对象这里指的就是 data
    // key 就是对象的 键
    get(target, key) {
        return target[key];
    },
    // 设置值
    // newValue 是设置的值
    set(target, key, newValue) {
        // 也先判断下是否和之前的值一样 节省性能
        if (target[key] === newValue) {
            return;
        }
        // 进行设置值
        target[key] = newValue;
        document.querySelector('#app').textContent = target[key];
    },
});
</script>
</body>
```