package org.bd.java_exercise.generics.generator;

import org.jetbrains.annotations.NotNull;

import java.util.Iterator;
import java.util.Random;

/**
 * Example from Thinking in Java
 */
public class CoffeeGenerator implements Generator<Coffee>, Iterable<Coffee>{

    private final Class[] types = {Latte.class, Espresso.class, Americano.class, Cappuccino.class};
    private int size = 0;
    private final Random random = new Random(42);

    public CoffeeGenerator() {
    }

    public CoffeeGenerator(int size) {
        this.size = size;
    }

    @NotNull
    @Override
    public Iterator<Coffee> iterator() {
        return new CoffeeIterator();
    }

    @Override
    public Coffee next() {
        try {
            return (Coffee) types[random.nextInt(types.length)].newInstance();
        } catch (InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * Iterator class
     */
    class CoffeeIterator implements Iterator<Coffee> {

        int count = size;

        @Override
        public boolean hasNext() {
            return count > 0;
        }

        @Override
        public Coffee next() {
            count--;
            return CoffeeGenerator.this.next();
        }
    }

    public static void main(String[] args) {
        CoffeeGenerator coffeeGenerator= new CoffeeGenerator();
        for (int i = 0; i < 5; i++) {
            System.out.println("gen.next() = " + coffeeGenerator.next());
        }
        for (Coffee coffee : new CoffeeGenerator(5)) {
            System.out.println("coffee = " + coffee);
        }
    }
}
