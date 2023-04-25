# JavaScript 基础 - 箭头函数

## 语法

ES6 新增语法，使用`=>`来声明匿名函数。

左侧只有一个参数时可以省略括号，右侧不使用大括号时当做直接返回表达式内容。以下两种方式等价。

```js
let sum = (a, b) => a + b;
```

```js
let sum = function (a, b) {
  return a + b;
};
```

## 注意事项

1. 箭头函数没有自己的`this`

   箭头函数的 this 指向上层作用域中的 this。

   箭头函数实际上可以让 this 指向固定化，绑定 this 使得它不再可变

   ```js
   function foo() {
     setTimeout(() => {
       console.log("id:", this.id);
     }, 100);
   }

   var id = 21;

   foo.call({ id: 42 });
   // id: 42
   ```

   setTimeout()的参数是一个箭头函数，这个箭头函数的定义生效是在 foo 函数生成时，而它的真正执行要等到 100 毫秒后。如果是普通函数，执行时 this 应该指向全局对象 window，这时应该输出 21。但是，箭头函数导致 this 总是指向函数定义生效时所在的对象（本例是{id: 42}），所以打印出来的是 42。

   上述代码经过 Babel 转译后是这样

   ```js
   function foo() {
     var _this = this;

     setTimeout(function () {
       console.log("id:", _this.id);
     }, 100);
   }
   ```

2. 无法作为构造函数使用
3. 箭头函数的 this 指向无法改变，使用 call，bind，apply 传递绑定对象无效，但是可以正常传参

   > 箭头函数不会创建自己的 this，它只会从自己的作用域链的上一层继承 this

   ```js
   const obj = {
     a: () => {
       console.log(this);
     },
   };
   obj.a.call("123"); // window
   ```

4. 箭头函数的`prototype`属性值为`undefined`
5. 以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments（这个属性只有在以 function 关键字声明的函数中才有）、super、new.target。

> 不管是箭头函数还是普通声明方式的函数，在对象中作为函数属性的值时候，直接引用同名的变量不会构成递归，实际上还是引用了一个对应名字全局的变量。只有在一般方式声明的对象中才能用 this 来访问到自己从而构成递归

```ts
const onDismiss = () => "dismiss";
const toggle = (props: Prop) => console.log(props.onDismiss() + " toggled");

toggle({
  name: "name",
  onDismiss: () => onDismiss() + " prop"
}); // dismiss prop toggled

interface Prop {
  name: string;
  onDismiss: () => void;
}
const prop: Prop = {
  name: "",
  onDismiss: function () {
    if (this.name === "aaa") {
      return "dismiss " + this.name;
    }
    this.name += "a";
    return this.onDismiss();
  },
};
toggle(prop) // dismiss aaa toggled
```
