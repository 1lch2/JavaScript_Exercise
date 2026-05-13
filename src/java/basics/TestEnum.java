package org.bd.java_exercise.basics;

public class TestEnum {
    public static void main(String[] args) {
        testEnum(Weekday.SAT);
        testEnum(Weekday.MON);
    }

    private static void testEnum(Weekday weekday) {
        if (weekday == Weekday.SAT || weekday == Weekday.SUN) {
            System.out.println("Free");
        } else {
            System.out.println("Work");
        }

        // name() 返回常量的名字
        System.out.println("Weekday.MON: " + Weekday.MON.name());

        // ordinal() 返回顺序
        System.out.println("Number of Weekday.SUN: " + Weekday.SUN.ordinal());
    }
}