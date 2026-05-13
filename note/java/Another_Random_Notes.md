# 基础随记
## 泛型
### 初始化HashSet
初始化HashSet时可以通过构造来初始化HashSet的值，有以下两种方法。
```java
HashSet<String> hashSet = new HashSet<String>() {{ // 注意此处是双大括号
	add.("first");
	add.("second");
}};
HashSet<Sting> hashSet = new HashSet<>(Arrays.asList("first", "second"));
```

## 字符串
String类型是不可变的，String对象指向的字符串字面常量本身不可变，对String对象重新赋值只是修改了引用，而原本被指向的字符串没有变化。
对于字符串的比较，有以下几种情况。

包other
```java
package other;

public class Other { 
    public static String hello = "Hello"; 
}
```

包testPackage
```java
package testPackage;


class Test {
    public static void main(String[] args) {
        String hello = "Hello";
        String lo = "lo";

        System.out.println(hello == "Hello");                   //1. true
        System.out.println(Other.hello == hello);            //2. true
        System.out.println(other.Other.hello == hello);  //3. true
        System.out.println(hello == ("Hel" + "lo"));          //4. true
        System.out.println(hello == ("Hel" + lo));            //5. false
        System.out.println(hello == ("Hel"+lo).intern()); //6. true
    } 
}

class Other { 
    static String hello = "Hello"; 
}
```

以上六种情况的解析如下：
1. 同一个包的同一个类中的字符串字面常量，代表对同一个String对象的引用。
2. 同一个包的不同类的字符串字面常量，代表对同一个String对象的引用。
3. 不同包的不同类的字符串字面常量，代表对同一个String对象的引用。
4. 由常量表达式计算得到的字符串，在编译时创建，并按字面常量对待。
5. 在运行时由拼接得到的字符串是新创建的，因此属于不同对象。
6. 对计算得到的字符串调用intern()得到的结果，和先前存在的字符串字面常量是同一个。
> 参考自The Java® Language Specification, Java SE 8 Edition。

## 线程
对一个Thread对象调用run()和start()是两种截然不同的启动方式。
现象
以以下代码为例：
```java
new Thread(() -> {
    synchronized (lock) {
        System.out.println(">>> Thread started >>>");
    }
}).start();

synchronized (lock) {
    System.out.println(">>> Main thread >>>");
    Thread.sleep(3000);
    System.out.println("3 seconds finished.");
}
```

这段代码中，主线程的同步块会获取锁先执行。等待3秒后，子线程的同步块获得锁，执行传入的Runnable。
输出如下
```
>>> Main thread >>>
3 seconds finished.
>>> Thread started >>>
```

如果将start()替换为run()，则输出如下
```
>>> Thread started >>>
>>> Main thread >>>
3 seconds finished.
```

原因:

从Thread的源码可以看出，run()方法直接调用了传入的Runnable对象的run()，并没有开启新线程：
```java
public void run() {
    if (target != null) {
        target.run();
    }
}
```
而start()会调用一个JDK原生方法start0()来启动新线程。