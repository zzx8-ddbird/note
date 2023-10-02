## this 相关

#### 作用域
> * `var` `function` 会声明提升，然后赋值
> * `function` 声明函数，以最后一个为准

#### 手写 `call`
```js
    Function.prototype.myCall = function(ctx) {
        ctx = ctx === null || undefined ? globalThis : Object(ctx);
        const fn = ctx.fn ? ctx.fn : null;
        ctx.fn = this;
        const args = Array.from(arguments).slice(1);
        const res = args[0] ? ctx.fn(...args) : ctx.fn();
        fn ? ctx.fn = fn : delete ctx.fn;
        return res;
    }
```
#### 手写 `apply`
```js
    Function.prototype.myApply = function(ctx) {
        ctx = ctx === null || undefined ? globalThis : Object(ctx);
        const fn = ctx.fn ? ctx.fn : null;
        ctx.fn = this;
        const args = Array.from(arguments)
        const res = args[1] ? ctx.fn(...args[1]) : ctx.fn();
        fn ? ctx.fn = fn : delete ctx.fn;
        return res;
    }
```
#### 手写 `bind`
```js
    Function.prototype.myBind = function(ctx) {
        const args = arguments[1];
        return () => {
            return this.myApply(ctx, args);
        }
    }
```

## 原型链相关

#### 函数式生成对象
```js
    function Course() {
        const _isClass = this instanceof Course;
        if(!_isClass) {
            return new Course();
        }
        this.name = name;
        this.age = age;
        this.getName() {
            return this.name;
        }
    }
```
#### `new`原理
> * 创建了一个空对象，作为返回的对象实例
> * 将生成空对象的原型对象指向了构造函数的prototype属性
> * 将当前的实例对象赋值给了内部的this
> * 执行函数内部代码

#### 函数实现继承
```js
    function Father(name, age) {
        this.name = name;
        this.age = age;
    }
    Father.prototype.getName = function() {
        return this.name;
    }
    function Chldren(...args) {
        Father.call(this, ...args);
    }
    Chldren.prototype = Object.create(Father.prototype);
    Chldren.prototype.constrcutor = Chldren;
```
#### 手写 `new`
```js
    function newFunction(func, ...args) {
        const obj = Object.create(func.prototype);
        func.call(obj, ...args);
        return obj;
    }
```
#### 手写`instandof`
```js
    function newInstanceof(obj, fn) {
        if(typeof fn !== 'function') {
            throw new Error('Uncaught TypeError: Right-hand side of 'instanceof' is not callableat <anonymous>:1:4')
        }
        let pot = Object.getPrototypeOf(obj);
        let potf = fn.prototype;
        if(pot === null || pot == undefined) {
            return false;
        } else {
            return pot === potf || newInstanceof(pot, fn);
        }
    }
```
## Promise及其异步任务
```js
    const newPromise = (function() {
        const pending = 'pending';
        const fulfilled = 'fulfilled';
        const rejected = 'rejected';

        return function(fn) {
            this.status = pending;
            this.callbackFunction = fn;
            newPromise.prototype.then = function(resolveFn, rejectFn) {
                const resolve = function() {
                    resolveFn(...Array.prototype.slice.call(arguments))
                }
                const reject = function() {
                    rejectFn(...Array.prototype.slice.call(arguments));
                }
                try {
                    this.callbackFunction(resolve, reject);
                } catch (error) {
                    this.callbackFunction(reject);
                }
            }
        }
    }());
    new newPromise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 1000);
        setTimeout(() => {
            reject(2);
        }, 2000);
    }).then((resolve) => {
        console.log(resolve);
    }, (reject) => {
        console.log(reject);
    })
```

### 1. 浏览器原理
1. *`GUI`渲染引擎*：
>* 解析`HTML|CSS`，构建`DOM树|CSSOM树` =>布局 =>绘制；
>* 与阻塞`js`引擎线程，执行`js`线程，`GUI`被挂起，任务队列空闲，主线程执行GUI渲染；
2. *`JS`引擎线程*：
>* 处理JS，解析执行脚本；
>* 处理和和维护事件队列；
>* 阻塞`GUI`渲染；
3. *定时器触发线程*：
>* 处理定时器 - `setTimeout | setInterval`
>* 接受JS引擎分配的定时器任务，并执行
>* 处理完成交由事件触发线程
4. *事件触发线程*：
>* 接受所有事件
>* 将回调事件以此加入事件队列尾部，并由JS引擎处理
5. *`HTTP`异步线程*：
>* 执行异步请求
>* 接受JS引擎线程请求操作
>* 监听回调，交由事件触发器
### 2. `EVENT-LOOP`
## `js`内置对象，事件模型
#### `BOM`
> 1. location --URL相关
> 2. history --浏览历史相关
> 3. navigaoter --系统信息
> 4. screen --屏幕相关 `网页内容size => offsetHeight = clientHeight + 轮动条 + 边框`  `Element.getBoundingClientRect() //返回元素相关`
#### 事件模型
> 1. event.stopPropagation -- 阻止冒泡
> 2. event.preventDefault -- 阻止默认事件
> 3. event.stopImmediatePropagation -- 阻止多个同类事件
#### 兼容IE事件
```js
    class BindEvent {
        constructor(element) {
            this.element = element;
        }
        addEventListener(type, handler) {
            if(this.element.addEventListener) {
                this.element.addEventListener(type, handler, false);
            } else if(this.element.dattachEvent) {
                this.element.dattachEvent('on' + type, () => {
                    handler.call(this.element);
                });
            } else {
                this.element['on' + type] = handler;
            }
        }
        removeEventListener(type, handler) {
            if(this.element.removeEventListener) {
                this.element.addEventListener(type, handler, false);
            } else if(this.element.detachEvent) {
                this.element.detachEvent('on' + type, () => {
                    handler.call(this.element);
                });
            } else {
                this.element['on' + type] = null;
            }
        }
        static stopPropagation(e) {
            if(e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        }
        static preventDefault(e) {
            if(e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        }
    }
```
#### 事件代理-冒泡事件
```js
    element.addEventListener(eventType, (e) => {
        if(e.target.nodeName === element) {

        }
    }, false)
```
#### 封装HTTP请求
```js
    function ajax({url, method, async=true, timeout=30000, data={payload: 'text'}}) {
        const xhr = new XMLHttpRequest();
        xhr.ontimeout = () => reject('超时');
        xhr.onerror = (err) => reject(err);

        let _params = [];
        let encodeData = '';

        if(data instanceof Object) {
            Object.keys(data).forEach(key => {
                _params.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);               
            })
            encodeData = _params.join('&');
        }

        if(method === 'get') {
            const index = url.indexOf('?');
            if(index === -1) url += '?';
            else if(index !== url.length-1) url += '&';
            url += encodeData;
        }

        xhr.open(method, url, async);

        if(method === 'get') {
            xhr.send(null);
        } else {
            xhr.setRequestHeader(
                'Content-type', 'application/www.form.urlencoded;charset=UTF-8'
            );
            xhr.send(encodeData);
        }
        return new Promise((resolve, reject) => {
            xhr.onreadystatechange = () => {
                if(xhr.readyState === xhr.DONE) {
                    if(xhr.status === 200) {
                        resolve(xhr.responseText);
                    } else {
                        reject()
                    }
                }
            }
        })
    }
```
#### 性能分析api
> Navigation Timing API -- `performance.timing`
#### 前端性能提升
> * 首屏渲染优化
> * 逻辑交互优化

#### 性能评估插件 CVM-(Core Web Vitals Annotations)

#### 大厂监控体系
> - 埋点上报
> - 数据处理
> - 可视化展示

## 函数式编程
#### 按功能拆分，单一职责
#### 函数柯里化
```js
    function add() {
        let args = Array.prototype.slice.call(arguments);

        let inner = function() {
            args.push(...arguments);
            return arguments[0] ? inner : inner.toString();
        }
        inner.toString = () => args.reduce((p, c) => p + c);

        return inner;
    }
    add(1)(2)(3)(4)();
```
#### 函数式组装
```js
    compose(str, (str) => str.split(''), (arr) => arr.sort(), (arr) => arr.reduce((p, c) => p+c, ''));
    function compose() {
        let args = Array.prototype.slice.call(arguments);
        return args[1] ? compose(args[1](args[0]), ...args.slice(2)) : args[0];
    }
```
#### 函数式链式
```js
    function Chain(content) {
        this.content = content;
        Chain.prototype.map = function(fn) {
            return new Chain(fn(this.content));
        }
        Chain.prototype.toString = function() {
            return this.content;
        }
    }
    new Chain('email').map((str) => str.split('')).map((arr) => [arr[0].toUpperCase(), ...arr.slice(1)]).map((arr) => arr.reduce((p, c) => p+c, '')).toString();
```
## TypeScript
#### 类型
1. tuple --元组
2. enum --元组
3. any --任意类型
4. unknown --位置类型，禁止更改传递
5. never --永不反悔，死循环 | 抛错
6. void --无返回
7. object | Object | {}
#### 类型守卫
* in
* typeof
* instanceof
* keyof
#### 原理解析
> - 源码输入
> - 扫描器 `scanner` => 识别内容范围生成数据流
> - 解析器 `parser` => 生成语法树 AST
> - 绑定器 `binder` => 创建 symbols
> - 校验器 `checker` => 检查TS语法错误
> - 发射器 `emitter` => 根据每个节点的检查结果产出node翻译成js
## TS实战
#### 元数据 `Reflect.defineMetadata`
#### 通过装饰器设置路由
#### 事件注册 `eventemitter3` 插件
#### ES
## 递归返回值不要计算，尽量用自递归