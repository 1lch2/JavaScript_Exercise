package org.bd.java_exercise.algorithms;

import java.util.*;

public class Sort {
    public static void main(String[] args) {
        testQuickSort();
    }

    public static void quickSort(int[] seq) {
        // 非递归式快排

        Deque<int[]> stack = new LinkedList<>(); // 使用 Deque 作为栈
        int[] temp = {0, seq.length-1};
        stack.push(temp);

        while (stack.size() > 0){
            int[] index = stack.pop();

            int low = index[0];
            int high = index[1];

            if (low >= high){
                continue;
            }

            int base = seq[low];
            int i = low;
            int j = high;

            while (i < j){
                while (seq[j] > base && i < j){
                    j--;
                }
                if (i < j){
                    seq[i] = seq[j];
                    i++;
                }

                while (seq[i] < base && i < j){
                    i++;
                }
                if (i < j){
                    seq[j] = seq[i];
                    j--;
                }
            }

            seq[i] = base;

            temp[0] = low;
            temp[1] = i - 1;
            stack.push(temp.clone()); // 使用clone() 避免引用导致值被修改
            temp[0] = i+1;
            temp[1] = high;
            stack.push(temp.clone());
        }
    }

    private static void testQuickSort() {
        int[] seq = {2, 3, 10, 1, 2, 4, 7, 5, 9, 12, 0, 1, 1, 30, 8};
        int[] seq_copy = seq.clone(); // 使用拷贝方法避免地址引用导致对象内容被修改

        System.out.println("Using qsort:\nBefore: " + Arrays.toString(seq));
        Sort.quickSort(seq);
        System.out.println("After: " + Arrays.toString(seq));
        
        System.out.println("\nUsing Arrays.sort():\nBefore: " + Arrays.toString(seq_copy));
        Arrays.sort(seq_copy);
        System.out.println("After: " + Arrays.toString(seq_copy));
    }
}