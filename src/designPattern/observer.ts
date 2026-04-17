/**
 * 观察者接口
 */
interface Observer {
  update(data?: unknown): void;
}

/**
 * 被观察目标
 */
class Subject {
  // 私有化，防止外部直接修改
  private observers: Observer[] = [];

  addObs(obs: Observer) {
    this.observers.push(obs);
  }

  removeObs(obs: Observer) {
    this.observers = this.observers.filter((o) => o !== obs);
  }

  // 通知时传递数据
  notify(data?: unknown) {
    this.observers.forEach((obs) => obs.update(data));
  }

  empty() {
    this.observers = [];
  }
}

// 不同的观察者可以有不同的更新逻辑
class LoggerObserver implements Observer {
  update(data?: unknown) {
    console.log("日志观察者收到更新:", data);
  }
}

class AlertObserver implements Observer {
  update(data?: unknown) {
    console.log("告警观察者收到更新:", data);
  }
}

// 使用
const sub = new Subject();
const obs1 = new LoggerObserver();
const obs2 = new AlertObserver();

sub.addObs(obs1);
sub.addObs(obs2);
sub.notify({ type: "price", value: 100 });
