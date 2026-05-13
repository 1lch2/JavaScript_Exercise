package org.bd.java_exercise.generics.generator;

/**
 * Generator generics interface, used for generating classes.
 * @param <T>
 */
public interface Generator<T extends Coffee> {

    T next();
}
