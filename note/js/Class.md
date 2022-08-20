# ES6 - class 
## 提升
函数声明会提升自己到调用的前方，但类声明不会，以下代码会报错：
```js
let p = new Rectangle(); // ReferenceError
class Rectangle {}
```

## 构造函数
类似 Java，如果不写构造函数则会有个默认的空构造函数。同时也和Java一样，可以使用`super()`调用父类的构造函数。

必须先调用 super 再使用 this。

```js
class Shape {
  constructor(length) {
    this.length = length;
  }
}

class Polygon extends Shape{
  constructor(length, name) {
    super(length);
    this.name = 'Polygon';
  }
}
```

## getter，setter
使用 `get` 和 `set` 声明 getter 与 setter

## 静态方法
使用 `static` 声明静态方法，用法同 Java。

## this
当调用静态或原型方法时没有指定 this 的值，那么方法内的 this 值将被置为 undefined，因为使用 class 会自动启用严格模式。

```js
class Person {
    getThis() {
        return this;
    }
}

let p = new Person();
p.getThis(); // Person {...}

let _getThis = p.getThis;
_getThis(); // undefined
```

这种情况在将类的方法作为参数传递时，则可能需要绑定 this，比如在 React 中传递回调函数。
```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 绑定保证方法调用时的 this 一定是类的实例
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```

