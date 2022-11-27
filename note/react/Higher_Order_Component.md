# React - 高阶组件

高阶组件是参数为组件，返回值为新组件的函数。使用方式如下例：
```jsx
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

## 场景
多个组件中包含了相同的逻辑，如在组件挂载时添加订阅，组件卸载时取消订阅。这时需要一个抽象，允许我们在一个地方定义这个逻辑，并在许多组件之间共享它。

在这个场景基础上，定义一个函数，该函数将接受一个子组件作为它的其中一个参数，该子组件将订阅数据作为 prop。让我们调用函数 withSubscription：

```jsx
// 第一个参数是被包装组件。
// 第二个参数通过 DataSource 和当前的 props 返回我们需要的数据。

const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

当渲染 CommentListWithSubscription 和 BlogPostWithSubscription 时， CommentList 和 BlogPost 将传递一个 data prop，其中包含从 DataSource 检索到的最新数据：

抽象后的函数如下：
```jsx
// 此函数接收一个组件...
function withSubscription(WrappedComponent, selectData) {
  // ...并返回另一个组件...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ...负责订阅相关的操作...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... 并使用新数据渲染被包装的组件!
      // 请注意，我们可能还会传递其他属性
      return (
        <WrappedComponent data={this.state.data} {...this.props} />
      );
    }
  };
}
```

HOC 不会修改传入的组件，也不会使用继承来复制其行为。相反，HOC 通过将组件包装在容器组件中来组成新组件。HOC 是纯函数，没有副作用。

主要场景概括如下：
- 抽取重复代码，实现组件复用，常见场景：页面复用。
- 条件渲染，控制组件的渲染逻辑（渲染劫持），常见场景：权限控制。
- 捕获/劫持被处理组件的生命周期，常见场景：组件渲染性能追踪、日志打点。

## 实现方式
主要实现方式有以下两种：
1. 属性代理(Props Proxy)
    - 返回一个无状态（stateless）的函数组件
    - 返回一个 class 组件
2. 反向继承(Inheritance Inversion)

### 属性代理
#### 操作 props

最简单的属性代理实现代码如下：
```jsx
// 返回一个无状态的函数组件
function HOC(WrappedComponent) {
  const newProps = { type: 'HOC' };
  return props => <WrappedComponent {...props} {...newProps}/>;
}

// 返回一个有状态的 class 组件
function HOC(WrappedComponent) {
  return class extends React.Component {
    render() {
      const newProps = { type: 'HOC' };
      return <WrappedComponent {...this.props} {...newProps}/>;
    }
  };
}
```
通过属性代理方式实现的高阶组件包装后的组件可以拦截到父组件传递过来的 props，提前对 props 进行一些操作，比如增加一个 type 属性。

#### 抽象 state
> 通过属性代理方式实现的高阶组件无法直接操作原组件的 state，但是可以通过 props 和回调函数对 state 进行抽象。️

常见的例子是实现非受控组件到受控组件的转变：

```jsx
// 高阶组件
function HOC(WrappedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        name: '',
      };
      this.onChange = this.onChange.bind(this);
    }
    
    onChange = (event) => {
      this.setState({
        name: event.target.value,
      })
    }
    
    render() {
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onChange,
        },
      };
      return <WrappedComponent {...this.props} {...newProps} />;
    }
  };
}

// 使用
@HOC
class Example extends Component {
  render() {
    return <input name="name" {...this.props.name} />;
  }
}
```

上面那个长得像Java注解的语法是ES7引入的装饰器（decorator）

#### 通过 props 实现条件渲染
通过属性代理方式实现的高阶组件无法直接实现对原组件进行渲染劫持（即对原组件内部 render 的控制并不是很强），但可以通过 props 来控制是否渲染及传入数据：

```jsx
function HOC(WrappedComponent) {
    /* 省略无关代码... */

    function wrappedComponentStaic () {
      WrappedComponent.sayHello();
    }

    return (props) => (
      <div className={styles.hocWrapper}>
        {
          props.isShow ? (
            <WrappedComponent
              {...props}
            />
          ) : <div>暂无数据</div>
        }
      </div>
    );
}
```

#### 用其他元素包裹传入的组件

我们可以通过类似下面的方式将原组件包裹起来，从而实现布局或者是样式的目的：
```jsx
function withBackgroundColor(WrappedComponent) {
  return class extends React.Component {
    render() {
      return ( 
        <div style={{ backgroundColor: '#ccc' }}>
          <WrappedComponent {...this.props} {...newProps} />
        </div>
      );
    }
  };
}
```

### 反向继承
指的是使用一个函数接受一个组件作为参数传入，并返回一个继承了该传入组件的类组件，且在返回组件的 render() 方法中返回 super.render() 方法。示例如下：

```jsx
const HOC = (WrappedComponent) => {
  return class extends WrappedComponent {
    render() {
      return super.render();
    }
  }
}
```

相较于属性代理方式，使用反向继承方式实现的高阶组件的特点是允许高阶组件通过 this 访问到原组件，所以可以直接读取和操作原组件的 state/ref/生命周期方法。

反向继承方式实现的高阶组件可以通过 super.render() 方法获取到传入组件实例的 render 结果，所以可对传入组件进行渲染劫持（最大特点），如：
- 有条件地展示元素树（element tree）
- 操作由 render() 输出的 React 元素树
- 在任何由 render() 输出的 React 元素中操作 props
- 用其他元素包裹传入组件的渲染结果


TODO: 补充用法


## 具体实践
### 页面组件复用
属性代理是最常见的高阶组件实现方式，它本质上是使用组合的方式，通过将组件包装在容器组件中实现组件逻辑复用的功能。 因此，如果想实现页面复用，可以使用属性代理方式实现的高阶组件。

场景如下：两个页面整体上布局相同，ui交互一样，但是数据来源不同
```jsx
class PageA extends React.Component {
  state = {
    movieList: [],
  }
  /* ... */
  async componentDidMount() {
    const movieList = await fetchMovieListByType('comedy');
    this.setState({
      movieList,
    });
  }
  render() {
    return <MovieList data={this.state.movieList} emptyTips="暂无喜剧"/>
  }
}


class PageB extends React.Component {
  state = {
    movieList: [],
  }
  // ...
  async componentDidMount() {
    const movieList = await fetchMovieListByType('action');
    this.setState({
      movieList,
    });
  }
  render() {
    return <MovieList data={this.state.movieList} emptyTips="暂无动作片"/>
  }
}
```

使用HOC抽取重复逻辑如下：
```jsx
const withFetchingHOC = (WrappedComponent, fetchingMethod, defaultProps) => {
  return class extends React.Component {
    async componentDidMount() {
      const data = await fetchingMethod();
      this.setState({
        data,
      });
    }
    
    render() {
      return (
        <WrappedComponent 
          data={this.state.data} 
          {...defaultProps} 
          {...this.props} 
        />
      );
    }
  }
}
```

修改后原先两个页面组件通过HOC生成
```jsx
const PageA = withFetchingHOC(MovieList, fetchMovieListByType('comedy'), defaultProps);
const PageB = withFetchingHOC(MovieList, fetchMovieListByType('action'), defaultProps);
```

### 权限控制
场景如下：对几个页面增加白名单功能，如果不在白名单中的用户访问这些页面只进行文案提示，不展示相关业务数据。一周（功能验收完成）后去掉白名单，对全部用户开放。

要点如下：
- 多个页面鉴权：鉴权代码不能重复写在页面组件中；
- 不在白名单用户只进行文案提示：鉴权过程业务数据请求之前；
- 一段时间后去掉白名单：鉴权应该完全与业务解耦，增加或去除鉴权应该最小化影响原有逻辑。

封装鉴权流程，利用高阶组件的条件渲染特性，鉴权失败展示相关文案，鉴权成功则渲染业务组件。

实现如下：
```jsx
import { whiteListAuth } from '../lib/utils'; // 鉴权方法

function AuthWrapper(WrappedComponent) {
  return class AuthWrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        permissionDenied: -1,
      };
    }
    
    async componentDidMount() {
      try {
        await whiteListAuth(); // 请求鉴权接口
        this.setState({
          permissionDenied: 0,
        });
      } catch (err) {
        this.setState({
          permissionDenied: 1,
        });
      }
    }
    
    render() {
      if (this.state.permissionDenied === -1) {
        return null; // 鉴权接口请求未完成
      }
      if (this.state.permissionDenied) {
        return <div>功能即将上线，敬请期待~</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

### 组件渲染性能追踪
```jsx
class Home extends React.Component {
  render () {
    return (<h1>Hello World.</h1>);
  }
}

// HOC
function withTiming(WrappedComponent: any) {
  let start = 0;
  let end = 0;

  return class extends WrappedComponent {
    constructor (props: any) {
      super(props);
    }

    componentWillMount() {
      if (super.componentWillMount) {
        super.componentWillMount();
      }
      start = Date.now();
    }

    componentDidMount() {
      if (super.componentDidMount) {
        super.componentDidMount();
      }
      end = Date.now();
      console.error(`${WrappedComponent.name} 组件渲染时间为 ${end - start} ms`);
    }

    render() {
      return super.render();
    }
  };
}

export default withTiming(Home);
```
