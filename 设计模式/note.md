## 设计模式

1. 开闭原则：拓展开放，修改关闭
2. 单一职责原则： 岗位职位单一，互不重叠
3. 依赖倒置原则：上层不依赖下层的实现
```ts
    interface Shop {
        init(store: Store)
    }
    class ShopA implement Shop {
        init(store: Store) {
            store.shopA = this;
        }
        sell() {
            console.log('sell')
        }
    }
    class Store {
        private static shopMap = new Map();
        constructor() {
            Store.shopMap.forEach((v, k) => {
                v.init(this);
            })
        }
        static inject(shop: Shop) {
            Store.shopmap.set(shop.constructor.name, shop);
        }
    }
```
4. 接口隔离原则
5. 里氏替换原则：子类可以拓展，不能修改

## 创建型
#### 1. 工厂模式
#### 2. 建造者
#### 3. 单例模式

## 结构型
#### 1. 适配器
#### 2. 装饰器
#### 3. 代理模式

## 行为型
#### 1. 命令模式
#### 2. 模板模式
#### 3. 观察模式
#### 4. 职责链模式
```ts
// 观察者
class Subject {
    private state: number
    private observerList: Array<AbstractObserver> = [];

    constructor(state: number) {
        this.state = state;
    }

    attach(observer: AbstractObserver) {
        this.observerList.push(observer);
    }

    setState(state: number) {
        this.notifyAllObserver(state);
        return this.state = state;
    }

    private notifyAllObserver(state: number) {
        this.observerList.forEach(observer => {
            observer.update(state);
        })
    }
}

abstract class AbstractObserver {
    constructor(subject: Subject) {
        subject.attach(this);
    }

    abstract update(state: number): void
}

class Observer extends AbstractObserver {
    constructor(subject: Subject) {
        super(subject)
    }

    update(state: number): void {
        console.log('数据更新了' + state)
    }
}
const subject = new Subject(18);
const observer = new Observer(subject)
subject.setState(20);
```
```ts
// 发布订阅
class EventEmitter {
    private depsMap = new Map<string, Array<Function>>();

    publish(event: string, ...rest: Array<any>) {
        if(!this.depsMap.has(event)) {
            this.depsMap.set(event, []);
        }
        this.depsMap.get(event).forEach(fn => fn(...rest));
    }

    subscribe(event: string, fn: Function) {
        if(!this.depsMap.has(event)) {
            this.depsMap.set(event, [])
        }
        this.depsMap.get(event).push(fn);
    }
}
const event = new EventEmitter()
event.subscribe('update', (str) => {
    console.log('订阅了' + str);
})
event.publish('update', 'str');
```