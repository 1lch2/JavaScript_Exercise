# JavaScript基础 - 箭头函数
## 语法
ES6新增语法，使用`=>`来声明匿名函数。

左侧只有一个参数时可以省略括号，右侧不使用大括号时当做直接返回表达式内容。以下两种方式等价。
```js
let sum = (a, b) => a + b;
```
```js
let sum = function(a, b) {
    return a + b;
}
```

## 注意事项
1. 箭头函数没有自己的`this`

    箭头函数的this指向上层作用域中的this。

    箭头函数实际上可以让this指向固定化，绑定this使得它不再可变
    ```js
    function foo() {
        setTimeout(() => {
            console.log('id:', this.id);
        }, 100);
    }
    
    var id = 21;
    
    foo.call({ id: 42 });
    // id: 42
    ```
    setTimeout()的参数是一个箭头函数，这个箭头函数的定义生效是在foo函数生成时，而它的真正执行要等到 100 毫秒后。如果是普通函数，执行时this应该指向全局对象window，这时应该输出21。但是，箭头函数导致this总是指向函数定义生效时所在的对象（本例是{id: 42}），所以打印出来的是42。

    上述代码经过Babel转译后是这样
    ```js
    function foo() {
        var _this = this;

        setTimeout(function () {
            console.log('id:', _this.id);
        }, 100);
    }
    ```

2. 无法作为构造函数使用
3. 箭头函数的this指向无法改变，使用call，bind，apply传递绑定对象无效，但是可以正常传参
    > 箭头函数不会创建自己的this，它只会从自己的作用域链的上一层继承this

    ```js
    const obj = {
      a: () => {
        console.log(this)
      }
    }
    obj.a.call('123')  // window
    ```

4. 箭头函数的`prototype`属性值为`undefined`
5. 以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments（这个属性只有在以function 关键字声明的函数中才有）、super、new.target。
