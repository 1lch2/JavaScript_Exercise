// 定义一个任务接口，用于封装需要执行的异步函数及其 Promise 的 resolve 和 reject 方法
interface Task<T> {
  task: () => Promise<T>; // 实际要执行的异步函数
  resolve: (value: T) => void; // 当任务成功时，调用此方法来解决 Promise
  reject: (reason: any) => void; // 当任务失败时，调用此方法来拒绝 Promise
}

/**
 * Scheduler 类，用于控制并发任务的数量
 * 设计思路：
 * 这是一个并发控制器，常用于需要限制网络请求或其他异步任务并发数的场景。
 * 核心原理是维护一个任务队列和一个正在运行的任务计数器。
 * 1. `add` 方法接收一个异步任务，但不立即执行，而是将其封装成一个 `Task` 对象放入队列 `queue` 中。
 *    此方法返回一个 Promise，使得调用者可以 `await` 单个任务的完成。
 * 2. `runNext` 方法是调度器的核心。它检查当前运行的任务数是否已达到上限，以及队列中是否有等待的任务。
 * 3. 如果可以执行新任务，它会从队列中取出一个任务，增加运行计数器，然后执行该任务。
 * 4. 任务执行完毕后（无论成功还是失败），在 `finally` 块中减少运行计数器，并再次调用 `runNext`，
 *    这形成了一个“链式反应”，确保只要队列中还有任务，就会被取出执行，直到队列为空。
 */
export class Scheduler {
  private maxConcurrency: number; // 最大并发数
  private runningCount: number; // 当前正在运行的任务数
  private queue: Array<Task<any>>; // 等待执行的任务队列

  /**
   * @param maxConcurrency - 同时运行的最大任务数
   */
  constructor(maxConcurrency: number) {
    if (maxConcurrency <= 0) {
      throw new Error("最大并发数必须大于 0");
    }
    this.maxConcurrency = maxConcurrency;
    this.runningCount = 0;
    this.queue = [];
  }

  /**
   * 向调度器添加一个异步任务
   * @param task - 需要执行的异步函数
   * @returns 返回一个 Promise，该 Promise 会在任务完成时解析为任务的结果
   */
  async add<T>(task: () => Promise<T>): Promise<T> {
    // 设计关键：返回一个新的 Promise
    // 这允许外部调用者可以独立地 `await` 每个 `add` 的调用，而不用关心其内部是如何被调度的。
    return new Promise<T>((resolve, reject) => {
      // 将任务函数和其 Promise 的控制器（resolve/reject）封装成一个 Task 对象，推入队列
      this.queue.push({
        task,
        resolve,
        reject,
      });

      // 每次添加任务后，都尝试启动下一个任务
      this.runNext();
    });
  }

  /**
   * 如果并发限制允许，则执行队列中的下一个任务
   */
  private runNext(): void {
    // 设计关键：执行守卫
    // 如果正在运行的任务数已达到上限，或者队列已空，则直接返回，停止执行新任务。
    if (this.runningCount >= this.maxConcurrency || this.queue.length === 0) {
      return;
    }

    // 从队列头部取出一个任务来执行（先进先出）
    // '!' 是非空断言，因为我们已经在前面检查过 queue.length > 0
    const task = this.queue.shift()!;

    // 在任务开始前，立刻增加正在运行的任务计数
    this.runningCount++;

    // 执行任务的异步函数
    task
      .task()
      .then((result) => {
        task.resolve(result);
      })
      .catch((error) => {
        task.reject(error);
      })
      .finally(() => {
        // 设计关键：`finally` 保证无论成功或失败，都会执行收尾工作
        // 任务完成后，减少正在运行的任务计数
        this.runningCount--;

        // 设计关键：链式调用
        // 一个任务完成后，立即尝试启动队列中的下一个任务。
        // 这是驱动整个调度器持续运行的核心机制。
        this.runNext();
      });

    // 尝试并行启动任务，直到达到并发上限
    // 这一步是为了在初始添加多个任务时，能快速地将并发数“填满”。
    // 例如，如果上限是3，连续调用 `add` 3次，这个调用可以确保它们尽快同时启动。
    this.runNext();
  }
}

// ========================================
// 示例用法
// ========================================

/**
 * 模拟一个需要一些时间才能完成的异步任务
 * @param id - 任务标识符
 * @param duration - 持续时间（毫秒）
 */
async function simulateTask(id: number, duration: number): Promise<string> {
  console.log(`任务 ${id} 已开始`);
  await new Promise((resolve) => setTimeout(resolve, duration));
  console.log(`任务 ${id} 已完成`);
  return `任务 ${id} 的结果`;
}

/**
 * 演示 Scheduler 的用法
 */
async function demonstrateScheduler(): Promise<void> {
  console.log("=== 调度器演示：最大并发数 2 ===\n");

  // 创建一个允许最大并发数为 2 的调度器
  const scheduler = new Scheduler(2);

  // 添加多个任务
  const promises = [
    scheduler.add(() => simulateTask(1, 1000)),
    scheduler.add(() => simulateTask(2, 1500)),
    scheduler.add(() => simulateTask(3, 500)),
    scheduler.add(() => simulateTask(4, 1000)),
    scheduler.add(() => simulateTask(5, 800)),
  ];

  // 等待所有任务完成
  const results = await Promise.all(promises);

  console.log("\n=== 所有任务已完成 ===");
  console.log("结果:", results);
}

/**
 * 包含错误处理的备用示例
 */
async function demonstrateWithErrors(): Promise<void> {
  console.log("\n=== 带错误处理的演示 ===\n");

  const scheduler = new Scheduler(2);

  const taskWithError = async (
    id: number,
    shouldFail: boolean
  ): Promise<string> => {
    console.log(`任务 ${id} 已开始`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (shouldFail) {
      throw new Error(`任务 ${id} 失败了`);
    }
    console.log(`任务 ${id} 已完成`);
    return `任务 ${id} 的结果`;
  };

  try {
    // 使用 Promise.all 并为可能失败的 Promise 添加 catch 处理器
    const results = await Promise.all([
      scheduler.add(() => taskWithError(1, false)),
      scheduler.add(() => taskWithError(2, false)),
      scheduler
        .add(() => taskWithError(3, true))
        .catch((err) => `捕获到错误: ${err.message}`), // 这个会失败
      scheduler.add(() => taskWithError(4, false)),
    ]);

    console.log("\n=== 所有任务已结束（包括已处理的失败任务） ===");
    results.forEach((result: string, index: number) => {
      console.log(`任务 ${index + 1} 的最终状态: ${result}`);
    });
  } catch (error) {
    // 如果没有对失败的 promise 单独 catch，错误会在这里被捕获
    console.error("发生了意外的错误:", error);
  }
}

// 要运行演示，请取消以下行的注释并直接执行文件
demonstrateScheduler()
  .then(() => {
    return demonstrateWithErrors();
  })
  .catch(console.error);
