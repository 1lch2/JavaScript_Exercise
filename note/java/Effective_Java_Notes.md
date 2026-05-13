# Effective Java 笔记

## 第2条：遇到多个构造器参数时要考虑使用生成器
[设计模式 - 生成器](./Design_Pattern.md#生成器)

## 第6条：避免创建不必要的对象
以String类为例，直接使用`String str = new String("str")`会创建全新的对象，即使先前已经有了相同的字符串，这个方法也会创建新的实例。

简单地使用 `String str = "str";` 则会复用已经有的常量池中的实例。
关于String的不同声明和构造，参见[这段笔记](./Another_Random_Notes.md)

## 第22条：接口只用于定义类型
当类实现接口时，接口就可以充当这个类实例的类型，表明这个类的实例可以完成某些动作。
例：让一个继承抽象的Device类实现PhoneCallable接口以表明这个设备可以拨打电话。
```java
/** 抽象类 */
public abstract class Device {
	String deviceName;
	
	public abstract void powerOn();
}

/** 接口 */
public interface PhoneCallable {
	void makePhoneCall(String phoneNumber);
}

/** 继承类实现接口 */
public class Phone extends Device implements PhoneCallable {
	String deviceName = "phone";
	String targetPhoneNumber;
	
	@Override
	public void powerOn() {
		// Switch on
	}

	@Override
	public void makePhoneCall(String phoneNumber) {
		// Make phone call
	}
}
```

## 第52条：慎用重载
如下代码
```java
public class Reload {

    public static void main(String[] args) {
        Collection<?>[] collections = {
                new HashSet<String>(),
                new ArrayList<String>(),
                new HashMap<String, Integer>().values()
        };

        for (Collection<?> c : collections) {
            System.out.println(reload(c));
        }
    }

    public static String reload(Set<?> set) {
        return "set";
    }

    public static String reload(List<?> list) {
        return "list";
    }

    public static String reload(Collection<?> collection) {
        return "unknown";
    }
}
```
在实际运行中会打印三次“unknown”，而非依次运行三个重载的方法。在运行中类型不同，但是编译时类型都是Collection<?>，因此选择了唯一一个合适的方法。

**对于重载方法的选择是静态的，而对于被覆盖的方法选择是动态的**，也就是运行时类型不影响被选择的重载方法。

> 此处的覆盖指重写，即有相同签名的方法

**对于重载方法的建议**:
1. 永远不要导出有相同参数数目的重载方法
2. 不用重载，给方法起不同的名来区分


## 第57条：将局部变量的作用域最小化
Java可以在任何允许出现语句的地方进行变量声明，但是在使用前声明变量会造成混乱，影响阅读者的理解。

除此之外，过早地声明局部变量不仅会使它的作用域过早地扩展，而且结束得过早。在使用局部变量的块之外进行声明，当程序退出使用局部变量的块后，该变量仍然可用，可能会导致灾难性后果。

直接上建议：要使局部变量的作用域最小化，最有力的方法就是在第一次要使用它的地方进行声明。

下面是一个在循环中使用局部变量的例子，在这种情况下，使用for循环要优于while循环
```java
for (Iterator<Element> i = c.iterator(); i.hasNExt(); ) {
	Element e = i.next();
	...
}
```

这个例子中，迭代器被限制在for循环内。
```java
Iterator<Element> i = c.iterator();
while (i.hasNext()) {
	Element e = i.next();
	...
}
```

这个例子中迭代器在循环结束后仍然可用，一旦在之后引用迭代器时写错变量名就会导致运行正常但是逻辑错误的bug。

而这种bug在for循环中不会出现，因为根本过不了编译检查。

## 第58条：for-each循环优先于传统for循环
一个经典的for-each循环示例
```java
for (Element e : elements) {
	// 被遍历的对象需要实现Iterable接口
	Log.d("TAG", e.toString());
}
```

相比较传统for循环，for-each循环的可读性更强，通过完全隐藏迭代器或索引变量，能在遍历引用类型时能少创建不必要的下标变量，避免了混乱和出错。

对于嵌套型迭代，for-each相对传统的for循环优势会更加明显，可以有效避免在不同循环间使用错误的索引变量的发生。

当然，for-each也不是万能的。以下三种情况无法使用for-each循环：
1. 解构过滤：
    如果需要遍历集合并删除指定元素，就需要显式的迭代器来调用它的remove方法。
2. 转换
    如果需要遍历列表或者数组并更换部分或全部元素值，就需要数组索引或者列表迭代器。
3. 平行迭代
    如果需要平行地遍历多个集合，就需要显式控制迭代器或者索引变量。
对于for-each和for循环的性能，两者理论上不会有差别，因为JVM会将for-each翻译为传统的for循环，参考链接如下：[Java loop efficiency (“for” vs. “foreach”)](https://stackoverflow.com/questions/9226483/java-loop-efficiency-for-vs-foreach)

上文中提到的迭代器指Iterator，使用迭代器的传统迭代大概长这样：
```java
for (Iterator<Element> i = c.iterator(); i.hasNext(); ) {
	Element e = i.next();
	// Do something here.
}
```

## 第63条：了解字符串连接的性能
原因如下：

Java的String对象是不可变的，每次重新赋值实际上是创建了一个全新的对象。

在拼接字符串时，使用+符号时，javac编译器创建了一个StringBuilder对象用来构造最终的String对象。每一次调用+实际上是调用了StringBuilder的append()方法。最后调用toString()来构造最终的结果。

在循环中拼接字符串，常使用的方法是用+=来拼接，这种方法实际上会反复创建StringBuilder对象，造成不必要的性能和内存开支。

## 第77条：不要忽略异常
空catch块毫无意义，至少要记录异常
```java
try{
    ...
} catch (Exception e) {
	e.printStackTrace();
}
```

如果要忽略异常，catch块中应该包含说明原因的注释，并且变量命名为ignored

## 第64条：通过接口引用对象
也就是使用接口声明对象，或者说作为对象的类型，对应使用接口作为类型的建议。

最简单的情况，当声明某个Set时，使用抽象的接口作为类型，然后用具体实现类初始化对象
```java
Set<String> strSet = new LinkedHashSet<>();
```

如果没有合适的接口，直接使用类来引用对象也是完全可行的，但是要用类层次结构中提供了必要功能的最小的具体类来引用对象。

## 第85条：其他方法优先于Java序列化
原因大概就是：Java序列化的安全问题很大，与其费劲研究怎么让它安全，不如干脆不用。

> 在Android里可以用Parcelable接口来代替Serializable。如果是跨平台的序列化，可以用JSON。
