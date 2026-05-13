package org.bd.java_exercise.basics;

import java.util.Arrays;

public class VarArgs {

    public static void main(String[] args) {
        String[] strArray = {"java", "kotlin", "javascript"};
        varArgsMethod(3, strArray);
        varArgsMethod(0);

        varArgsTrap("");
        varArgsTrap("a", "b");
        varArgsTrap("a", "b", "c");
    }

    private static void varArgsMethod(int index, String... args) {
        System.out.println(">>> index: " + index);
        System.out.println(">>> number of args: " + args.length); // args can be treated as an array.
        System.out.println(">>> args: " + Arrays.toString(args));
    }

    private static void varArgsTrap(String first, String... second) {
        System.out.println(">>> first: " + first);
        System.out.println(">>> second length: " + second.length);
        for (int i = 0; i < second.length; i++) {
            System.out.println(">>> second[" + i + "]: " + second[i]);
        }
    }
}
