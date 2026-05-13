package org.bd.java_exercise.generics.generator;

public class Coffee {

    private static int counter = 0;
    private final int id = counter++;

    @Override
    public String toString() {
        return getClass().getSimpleName() + " id: [" + id + "]";
    }
}
