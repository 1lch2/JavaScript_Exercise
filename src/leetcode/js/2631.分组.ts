declare global {
  interface Array<T> {
    groupBy(fn: (item: T) => string): Record<string, T[]>;
  }
}

// this makes the file a module so the interface augmentation is scoped locally,
// preventing it from leaking to other scripts.
export {};

Array.prototype.groupBy = function <T>(fn: (item: T) => string) {
  const result: Record<string, T[]> = {};
  const array = this;
  for (let i = 0; i < array.length; i++) {
    const key = fn(array[i]);
    const val = result[key];
    if (val !== undefined) {
      result[key].push(array[i]);
    } else {
      result[key] = [array[i]];
    }
  }
  return result;
};

/**
 * [1,2,3].groupBy(String) // {"1":[1],"2":[2],"3":[3]}
 */
