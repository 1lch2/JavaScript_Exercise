# 5 初始化与清理
## 5.2 方法重载
* 构造器是强制重载方法名的一个原因。Java和C++中为了保证构造器的名字是独一无二的，且可以使用多种方式创建一个对象。
* 从原理上讲，即使两个方法的参数数量一样，类型一样，但是顺序不同，那么这两个方法就有不同的方法签名，也可以起到区分的作用。但是最好不要这么做，这种操作会使得代码难以维护。同时参考Effective Java的第52条：[《Effective Java》读书笔记](./Effective_Java_Notes.md) 

* 不能通过返回值来区分重载方法

## 5.4 this关键字
* 在方法内部，如果不需要特地使用this来指定当前对象，就不要加this，编译器会自动添加。实际开发中，可以为类的成员变量使用统一的命名前缀来区分局部变量和类的成员变量。例如：某个类持有的Activity对象可以命名为mActivity，类的方法中使用的局部Activity对象就不添加“m”的前缀。需要引用类的成员变量时就可以省略this，直接使用mActivity。
* 在构造器中可以且仅能调用一次this()，并且必须将作为构造器调用的this放在最开始处

## 5.7 构造器初始化
## 5.7.1 初始化顺序
* 在类的内部，变量定义会在任何方法，包括构造方法执行前被初始化

### 5.7.2 静态变量初始化
* static 关键字不能作用与局部变量，且静态变量不与对象绑定，只会占用一份存储区域
* 显式初始化静态变量

```java
public Class Person {
    static int i;
    static int j;
    static {
        i = 42;
        j = 1;
    }
}
```
这段代码仅在首次生成类的一个对象时执行一次，或者首次访问属于类的静态成员时。
* 非静态实例初始化可以采用类似的方法，但是没有static关键字。这种初始化操作会在每次调用构造器时都运行。
* 除此之外，通过这种初始化方法，可以在匿名内部类中实现类似构造方法的操作，绕开匿名内部类无法提供构造器的限制

```java
public void returnAnonymous() {
    return new Person() {
        int i;
        {
            i = 42;
            Log.d("Anonymous", i);
        }
        public void foo() {
            Log.d("Anonymous", "In anonymous class.")
        }
    }
}
```

## 5.8 数组初始化
* 所有数组都有一个名为length的成员，可以通过它获知数组元素数量，但不能修改它。
* 初始化数组时，可以在最后一个元素后加逗号，示例如下

```java
int arrayInt = {1, 2, 3,}; // 基本类型
Integer[] arrayInt = {new Integer(1), new Integer(2), 3, } //引用类型（3被自动装箱为引用类型）
```

### 5.8.1 可变参数列表
* 在方法中可以用参数类型后加三个点来表示可变参数。可变参数可以传入多个同类型参数，或者直接传入一个数组。可变参数也可以选择不传入任何参数。

```java
public class VarArgs {

    public static void main(String[] args) {
        String[] strArray = {"java", "kotlin", "javascript"};
        varArgsMethod(3, strArray);
        varArgsMethod(0);
    }

    private static void varArgsMethod(int index, String... args) {
        System.out.println(">>> index: " + index);
        System.out.println(">>> number of args: " + args.length); // args can be treated as an array.
        System.out.println(">>> args: " + Arrays.toString(args));
    }
}
```
输出如下
```
>>> index: 3
>>> number of args: 3
>>> args: [java, kotlin, javascript]
>>> index: 0
>>> number of args: 0
>>> args: []
```
* 可变参数会导致重载出现问题，因为有多个不同类型的可变参数方法时，不传入参数会导致编译器无法确定方法。因此，应当只在重载方法的一个版本上使用可变参数，且可变参数应该位于参数列表的最后。
关于可变参数的使用规范，此处应用阿里巴巴Java规范的第一章第四节第3条：相同参数类型，相同业务含义，才可以使用Java的可变参数，避免使用Object。说明：可变参数必须放置在参数列表的最后。（建议开发者尽量不用可变参数编程）

## 5.9 枚举类型
* 枚举类型中可以有构造方法和字段。通过name()和oridinal()可以分别返回常量的名字和次序。

```java
/**
 * enum 本身也是 class (public final class)，可以定义 private 构造方法
 * enum 本身带有类型信息
 * 不同枚举类型不能互相比较
 */
public enum Weekday {

    // 添加构造方法和字段
    MON(1, "星期一"),
    TUE(2, "星期二"),
    WED(3, "星期三"),
    THU(4, "星期四"),
    FRI(5, "星期五"),
    SAT(6, "星期六"),
    SUN(0, "星期日");

    public final int dayVal;
    private final String cnName;

    Weekday(int dayVal, String cnName) {
        this.dayVal = dayVal;
        this.cnName = cnName;
    }

    /**
     * name() 无法被覆写，给 Weekday 添加 toString() 方法，使得输出时更易读
     */
    @Override
    public String toString() {
        return this.cnName;
    }
}

/** -------------- name(), ordinal() ------------- */
// name() 返回常量的名字
System.out.println("Weekday.MON: " + Weekday.MON.name());

// ordinal() 返回顺序
System.out.println("Number of Weekday.SUN: " + Weekday.SUN.ordinal());
```

* 枚举类型可以用在switch语句中

# 6 访问权限控制
## 6.1 包：库单元
* 同一个包下的类通过 <包名>.<类名> 的方式来指定，每个.java文件被称为一个编译单元，一个编译单元只能有一个public类，且名称必须与文件名相同
* Java文件中的每个类在编译后会生成一个对应的.class文件

## 6.2 Java访问权限修饰词
| 修饰词                | 同一个类中 | 同一个包内 | 子类中 | 全局 |
|-----------------------|------------|------------|--------|------|
| private               | Y          | N          | N      | N    |
| (default) no modifier | Y          | Y          | N      | N    |
| protected             | Y          | Y          | Y      | N    |
| public                | Y          | Y          | Y      | Y    |

## 6.4 类访问权限
* 类不能为private，定义一个private类会使得除了它自己意外，其他任何类都无法访问。同样的，类也不能为protected。

# 7 复用类
## 7.1 组合语法
* 编译器并不会对每个对象引用都创建对象，若要初始化对象，可以使用以下办法：
1. 在定义时初始化
2. 在类构造器中初始化
3. 在使用对象前懒初始化，这种方法可以减少额外负担
4. 使用实例初始化

## 7.2 继承语法
* 导出类的构造器中会自动插入对基类构造器的调用，而且是先从基类开始构造，按继承顺序扩散
* 若被继承的父类构造器带有参数，则必须使用super关键字来调用父类的构造器，并传入参数

## 7.7 向上转型
* 在继承图中，从导出类转型成基类是向上移动的，因此称之为向上转型。或者说向上的意思就是从拓展类向被拓展类转型，基类在高处，扩展类按层次向下排列。
* 导出类是基类的超集，它必然具备基类中的方法，因此编译器在“未曾明确表示转型”或“未曾指定特殊标记”的情况下依然允许向上转型。

## 7.8 final关键字
final在Java中通常指的是“无法改变的”，但是根据上下文不同也有细微区别。

### 7.8.1 final数据
* Java中的常量数据必须为基本类型，且用final关键字修饰。在定义常量时必须对其赋值。
* 当对引用类型使用final修饰时，被修饰的对象引用就无法指向另一个对象，但是final对象本身是可以修改的。
* 既是static又是final的域值占据一段不能改变的内存空间。
*  类中的final数据可以声明为空，但是必须在构造函数中初始化。
* 将方法的参数声明为final可以使在方法中无法改变参数引用所指的对象。当在匿名内部类中引用参数时，被引用的参数必须为final

### 7.8.2 final方法
