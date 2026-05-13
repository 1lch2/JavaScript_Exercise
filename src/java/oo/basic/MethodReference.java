package org.bd.java_exercise.oo.basic;

public class MethodReference {

    public static void main(String[] args) {
        // 只能用方法接口来作为方法引用的类型
        SomeMethod some = MethodReference::hello;

        // 将方法引用作为参数传入另一个方法
        foo(some);
    }

    public static void hello() {
        System.out.println(">>> hello from java.");
    }

    private interface SomeMethod {
        void hello();
    }

    /**
     * 接收方法接口类型的对象作为参数，此处直接传入了方法引用
     *
     * @param obj 方法接口
     */
    public static void foo(SomeMethod obj) {
        obj.hello();
    }
}
