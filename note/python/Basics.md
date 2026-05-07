# Python 基础笔记

> 现代 Python (3.10+) 核心语法与数据结构。

---

## 1. 基础语法

Python 使用缩进来定义代码块，不再需要花括号。

### 变量与常用类型

```python
name: str = "Python"
age: int = 25
is_active: bool = True
price: float = 19.99
```

---

## 2. 核心数据结构

### 2.1 List 列表 (对应 JS 的 Array)

Python 的 `list` 是动态数组，可以容纳不同类型的元素。

#### 核心操作

- **增**: `.append(x)` (push), `.insert(index, x)`, `.extend(iterable)` (concat)。
- **删**: `.pop()` (移除末尾), `.remove(value)` (移除首个匹配项), `del my_list[0]`。
- **查/切片 (Slicing)**: Python 的切片功能极强。
- **解构 (Unpacking)**: 类似 JS 的 `[a, ...rest] = arr`。

```python
fruits = ["apple", "banana"]

# 切片操作 [start:stop:step]
nums = [0, 1, 2, 3, 4, 5]
print(nums[1:4])    # [1, 2, 3] (左闭右开)
print(nums[::-1])   # [5, 4, 3, 2, 1, 0] (快速反转)

# 解构
first, *others = nums  # first=0, others=[1, 2, 3, 4, 5]

# 列表推导式 (List Comprehension) -> 对应 JS 的 .map() 和 .filter()
# 语法: [expression for item in iterable if condition]
doubled_even = [x * 2 for x in nums if x % 2 == 0] # [0, 4, 8]
```

### 2.2 Dict 字典 (对应 JS 的 Map 或 Object)

Python 3.7+ 的 `dict` 是有序的。

#### 核心操作

- **访问**: `d["key"]` (若不存在会报 KeyError) 或 `d.get("key", default)` (安全访问)。
- **合并**: `d1 | d2` (Python 3.9+ 类似 JS 的 `{...d1, ...d2}`)。
- **遍历**: 默认遍历 key，使用 `.items()` 遍历键值对。

```python
user = {"name": "Alice", "age": 25}

# 安全获取
role = user.get("role", "guest")

# 字典推导式
square_dict = {x: x**2 for x in range(3)} # {0: 0, 1: 1, 2: 4}

# 遍历
for key, value in user.items():
    print(f"{key}: {value}")
```

### 2.3 Set 集合 (对应 JS 的 Set)

无序、不重复。常用于去重或数学交并集运算。

#### 核心操作

- **运算**: `&` (交集), `|` (并集), `-` (差集)。

```python
s1 = {1, 2, 3}
s2 = {3, 4, 5}

print(s1 & s2)  # {3}
print(s1 | s2)  # {1, 2, 3, 4, 5}

# 去重
unique_list = list(set([1, 1, 2, 2, 3])) # [1, 2, 3]
```

### 2.4 Tuple 元组 (JS 中通常用 Array 代替)

元组是**不可变 (Immutable)** 的。如果一组数据不需要修改（如坐标、数据库配置），通常用元组，性能更好且更安全。

```python
# 元组
point = (10, 20)
# point[0] = 30 # 会报错，不可修改

# 函数返回多个值时，本质是返回一个元组
def get_status():
    return 200, "OK"

code, msg = get_status() # 解构赋值
```

### 数据结构对比表

| 功能           | JavaScript              | Python                         |
| :------------- | :---------------------- | :----------------------------- |
| **数组**       | `Array`                 | `list`                         |
| **键值对**     | `Map` / `Object`        | `dict`                         |
| **集合**       | `Set`                   | `set`                          |
| **不可变序列** | (无直接对应)            | `tuple`                        |
| **映射操作**   | `list.map(x => ...)`    | `[... for x in list]` (推导式) |
| **过滤操作**   | `list.filter(x => ...)` | `[... for x in list if ...]`   |
| **对象合并**   | `{...obj1, ...obj2}`    | `dict1 \| dict2` (Py 3.9+)     |

---

## 3. 函数与类型注解

### 3.1 函数定义与参数

Python 函数支持默认参数、关键字参数和多种参数传递方式。

```python
# 默认参数：调用时可省略
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}"

greet("Alice")                # "Hello, Alice"
greet("Alice", greeting="Hi") # "Hi, Alice" — 关键字参数可跳过顺序
```

#### 可变参数 *args 与 **kwargs

- `*args`：接收任意数量的位置参数，打包为 **tuple**。
- `**kwargs`：接收任意数量的关键字参数，打包为 **dict**。

```python
def log_request(method: str, *args, **kwargs):
    print(f"[{method}] args={args}, kwargs={kwargs}")

log_request("GET", "/api/users", timeout=30, retry=True)
# [GET] args=('/api/users',), kwargs={'timeout': 30, 'retry': True}

# 解包调用：反过来将 list/dict 展开为参数
params = {"timeout": 30, "retry": True}
log_request("GET", "/api/users", **params)  # 效果同上
```

### 3.2 类型注解 (Type Hints)

类型注解用于标注变量和函数参数的类型，提升代码可读性和 IDE 工具支持。Python 3.10+ 使用 `|` 替代 `Union`。

```python
from typing import Optional

# Python 3.10+：用 | 表示联合类型
def process(value: int | str) -> str:
    return str(value)

# Optional[T] 等价于 T | None
def find_user(user_id: int) -> dict | None:
    if user_id > 0:
        return {"id": user_id}
    return None

# 容器类型注解
def get_scores(names: list[str]) -> dict[str, float]:
    return {name: 0.0 for name in names}
```

#### Literal 与 TypeAlias

```python
from typing import Literal

# Literal 限定参数只能是特定值
def set_mode(mode: Literal["read", "write", "append"]):
    print(f"Mode: {mode}")

# TypeAlias 为复杂类型起别名
type Vector = list[float]
type Matrix = list[Vector]

def dot_product(a: Vector, b: Vector) -> float:
    return sum(x * y for x, y in zip(a, b))
```

### 3.3 Lambda 表达式

Lambda 是匿名函数，适用于简短的一次性逻辑，常作为高阶函数的参数。

```python
# 语法：lambda 参数: 表达式
square = lambda x: x ** 2
print(square(5))  # 25

# 常见搭配：sorted / map / filter
students = [("Alice", 90), ("Bob", 75), ("Charlie", 88)]

# 按成绩排序
sorted(students, key=lambda s: s[1])  # [("Bob", 75), ("Charlie", 88), ("Alice", 90)]

# 提取姓名
names = list(map(lambda s: s[0], students))  # ["Alice", "Bob", "Charlie"]

# 过滤及格
passed = list(filter(lambda s: s[1] >= 80, students))  # [("Alice", 90), ("Charlie", 88)]
```

### 3.4 闭包 (Closure)

闭包是指内部函数引用了外部函数的变量，即使外部函数已执行完毕，该变量依然被保留。

```python
def make_counter(start: int = 0):
    count = start
    def counter():
        nonlocal count  # 声明修改外层变量
        count += 1
        return count
    return counter

c = make_counter()
print(c())  # 1
print(c())  # 2
print(c())  # 3
```

### 3.5 装饰器 (Decorator)

装饰器本质上是一个接收函数作为参数并返回新函数的高阶函数，用于在不修改原函数代码的情况下扩展其行为。

```python
import time
from functools import wraps

def timer(func):
    @wraps(func)  # 保留原函数的元信息（名称、文档等）
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} 耗时 {elapsed:.4f}s")
        return result
    return wrapper

@timer
def heavy_compute(n: int) -> int:
    return sum(i ** 2 for i in range(n))

heavy_compute(1_000_000)
# heavy_compute 耗时 0.1234s
```

#### 带参数的装饰器

当装饰器本身需要参数时，需要多嵌套一层函数。

```python
def repeat(times: int):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def say_hello(name: str):
    print(f"Hello, {name}")

say_hello("Alice")
# Hello, Alice（输出 3 次）
```

---

## 4. 面向对象与类 (Class)

### 4.1 基础类定义

Python 类通过 `class` 关键字定义，`__init__` 是构造方法，`self` 指向实例自身。

```python
class User:
    # 类变量：所有实例共享
    species = "human"

    def __init__(self, name: str, age: int):
        # 实例变量：每个实例独立
        self.name = name
        self.age = age

    def greet(self) -> str:
        return f"Hello, I'm {self.name}"

    def __repr__(self) -> str:
        return f"User(name={self.name!r}, age={self.age})"

u = User("Alice", 25)
print(u.greet())    # "Hello, I'm Alice"
print(repr(u))      # "User(name='Alice', age=25)"
print(u.species)    # "human"
```

### 4.2 继承与多态

Python 支持多重继承，`super()` 调用父类方法。

```python
class Animal:
    def __init__(self, name: str):
        self.name = name

    def speak(self) -> str:
        raise NotImplementedError

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name}: Woof!"

class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name}: Meow!"

# 多态：同一接口，不同实现
for animal in [Dog("Buddy"), Cat("Kitty")]:
    print(animal.speak())
# Buddy: Woof!
# Kitty: Meow!
```

### 4.3 属性控制：@property

`@property` 将方法伪装为属性访问，常用于计算属性或访问控制。

```python
class Circle:
    def __init__(self, radius: float):
        self._radius = radius  # 约定：单下划线表示"受保护"

    @property
    def radius(self) -> float:
        """getter：读取时触发"""
        return self._radius

    @radius.setter
    def radius(self, value: float):
        """setter：赋值时触发，可加入校验"""
        if value < 0:
            raise ValueError("半径不能为负数")
        self._radius = value

    @property
    def area(self) -> float:
        """只读属性：没有 setter"""
        return 3.14159 * self._radius ** 2

c = Circle(5)
print(c.area)      # 78.53975 — 像属性一样访问
c.radius = 10      # 通过 setter 修改
# c.area = 100     # AttributeError: can't set — 只读
```

### 4.4 类方法与静态方法

```python
class DateUtils:
    def __init__(self, year: int, month: int, day: int):
        self.year = year
        self.month = month
        self.day = day

    @classmethod
    def from_string(cls, date_str: str):
        """类方法：替代构造器，接收 cls 作为第一个参数"""
        y, m, d = date_str.split("-")
        return cls(int(y), int(m), int(d))

    @staticmethod
    def is_valid(date_str: str) -> bool:
        """静态方法：与类相关但不需要实例或类引用"""
        parts = date_str.split("-")
        return len(parts) == 3 and all(p.isdigit() for p in parts)

d = DateUtils.from_string("2026-05-03")  # 工厂方法
print(DateUtils.is_valid("2026-05-03"))   # True
```

| 方法类型 | 第一个参数 | 典型用途 |
| :------- | :--------- | :------- |
| 实例方法 | `self`     | 操作实例数据 |
| 类方法   | `cls`      | 替代构造器、工厂方法 |
| 静态方法 | 无         | 工具函数，与类逻辑相关但不依赖实例/类 |

### 4.5 魔术方法 (Dunder Methods)

魔术方法以双下划线开头和结尾，用于自定义类的内置行为。

```python
class Vector:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __add__(self, other: "Vector") -> "Vector":
        return Vector(self.x + other.x, self.y + other.y)

    def __eq__(self, other: object) -> bool:
        if not isinstance(other, Vector):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __len__(self) -> int:
        return int((self.x ** 2 + self.y ** 2) ** 0.5)

    def __repr__(self) -> str:
        return f"Vector({self.x}, {self.y})"

a = Vector(1, 2)
b = Vector(3, 4)
print(a + b)       # Vector(4, 6)
print(a == b)      # False
print(len(a))      # 2
```

常用魔术方法速查：

| 方法 | 触发方式 | 用途 |
| :--- | :------- | :--- |
| `__init__` | `Class()` | 构造 |
| `__repr__` | `repr(obj)` | 调试用字符串 |
| `__str__` | `str(obj)`, `print(obj)` | 用户友好的字符串 |
| `__add__` | `a + b` | 加法 |
| `__eq__` | `a == b` | 相等判断 |
| `__len__` | `len(obj)` | 长度 |
| `__getitem__` | `obj[key]` | 索引访问 |
| `__iter__` | `for x in obj` | 迭代 |
| `__call__` | `obj()` | 使实例可调用 |

### 4.6 Dataclass

`@dataclass` 自动生成 `__init__`、`__repr__`、`__eq__` 等方法，适合定义纯数据结构。

```python
from dataclasses import dataclass, field

@dataclass
class Point:
    x: int
    y: int

p = Point(x=10, y=20)
print(p)        # Point(x=10, y=20) — 自动生成 repr
print(p.x)      # 10
```

#### Dataclass 进阶用法

```python
from dataclasses import dataclass, field

@dataclass
class Config:
    # 有默认值的字段必须排在后面
    host: str = "localhost"
    port: int = 8080

    # 可变默认值必须用 default_factory
    tags: list[str] = field(default_factory=list)

    # repr=False 从 __repr__ 中排除该字段
    secret: str = field(default="hidden", repr=False)

    # post_init 中可做初始化逻辑
    def __post_init__(self):
        if self.port < 0:
            raise ValueError("端口不能为负数")

c = Config(host="0.0.0.0", port=3000, tags=["api", "v2"])
print(c)  # Config(host='0.0.0.0', port=3000, tags=['api', 'v2'])
```

#### frozen 与 slots

```python
@dataclass(frozen=True)   # 不可变，类似 tuple
class Immutable:
    x: int
    y: int

# imm.x = 99  # FrozenInstanceError

@dataclass(slots=True)    # Python 3.10+，使用 __slots__ 优化内存
class Optimized:
    x: int
    y: int
```

---

## 5. 异步编程 (Async / Await)

`async/await` 是 Python 处理 IO 密集型任务的核心机制。

```python
import asyncio

async def fetch_data():
    print("开始获取数据...")
    await asyncio.sleep(1)  # 模拟 IO 耗时操作
    return {"data": "success"}

async def main():
    result = await fetch_data()
    print(result)

# asyncio.run(main())
```

---

## 6. 开发环境与依赖管理

现代 Python 开发建议为每个项目创建独立环境。

- **创建虚拟环境:** `python -m venv .venv`
- **激活环境:**
  - Windows: `.venv\Scripts\activate`
  - macOS/Linux: `source .venv/bin/activate`
- **安装依赖:** `pip install <package_name>`
