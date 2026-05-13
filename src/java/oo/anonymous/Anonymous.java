package org.bd.java_exercise.oo.anonymous;

/**
 * Return an anonymous class.
 */
public class Anonymous {

    public static void main(String[] args) {
        Anonymous anonymous = new Anonymous();
        Person person = anonymous.getAnonymous();
        person.foo();
    }

    /**
     * Get an implemented class in anonymous inner class approach.
     *
     * @return Person object
     */
    public Person getAnonymous() {
        return new Person() {
            final int i;

            // 通过初始化方式来实现类似构造方法的效果
            {
                i = 42;
                System.out.println("Initialized in anonymous.");
            }

            @Override
            void foo() {
                System.out.println("in anonymous.");
            }
        };
    }

}
