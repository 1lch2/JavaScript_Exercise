package org.bd.java_exercise.generics;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GenericMethod {

    /**
     * Generic method sample.
     *
     * @param input input value
     * @param <T> generic type of input
     */
    public static <T> void log(T input) {
        if (input == null) {
            System.out.println("Null input.");
            return;
        }

        // 使用泛型方法可以泛化方法的参数类型，不局限于某一种类型
        System.out.println(input.toString());
        System.out.println("input type: " + input.getClass().getSimpleName() + "\n");
    }

    /**
     * Generic method with generic class return type.
     *
     * @param param input param
     * @param <T> subclass of Number
     * @return a List object
     */
    public static <T extends Number> List<T> func(T param) {
        // 根据传入的参数类型返回指定泛型类的实例
        List<T> res = new ArrayList<>(2);
        res.add(param);

        log("generic type: " + param.getClass().getSimpleName());
        return res;
    }

    public static void main(String[] args) {
        log("this is a string");
        log(3.14159265F);

        Map<Integer, String> mapObj = new HashMap<>(3);
        mapObj.put(0, "number 0");
        mapObj.put(1, "first element");
        log(mapObj);

        List<Integer> listObj = new ArrayList<>(2);
        listObj.add(9);
        listObj.add(12);
        log(listObj);

        log(func(42));
        log(func(1000000L));
    }
}
