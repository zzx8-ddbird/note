## node
node 是一个架构，js 是架构语言， V8用来解析语言
#### npm | yarn
yarn 安装自动整理pkg依赖，做扁平化管理，npm 执行 `npm dedupe` 命令
peerDependencis - 反向依赖
- 组件发布 npm 仓库
    - npm publish 对组组件进行发包
- commenjs | ES module - 原理是node的文件系统，加载文件在执行

## node API

#### Buffer 二进制缓存区
```js
    //
    const buf = Buffer.from('');
    const buf2 = Buffer.alloc(12);
    buf.copy(buf2, 0, 0, 6);
    buf.toString();
    Buffer.isBuffer(buf);
```
#### stream 用来处理Buffer文件

#### eventEmitter
```js
    const e = new EventEmitter();
    e.on('text', (params) => {})
    e.emit('text', params)
```
- 发布-订阅 (`promise` | `evnetBus` 实现方式)
```js
    // 松耦合，函数式编程
    function EventEmitter() {
        this._events = {}
    }

    EventEmitter.prototype.on = function(eventName, cb) {
        if(!this._events) this._events = {};
        let eventList = this._events[eventName] || (this._events[eventName] = []);
        eventList.push(cb);
    }

    EventEmitter.prototype.off = function(eventName, cb) {
        if(this._events[eventName]) {
            this._events[eventName] = this._events[eventName].filter(item => (item !== cb) && (item.cd !== cb))
        }
    }

    EventEmitter.prototype.once = function(eventName, cb) {
        const once = (...rest) => {
            cb(...rest);
            this.off(eventName, once)
        }
        once.cb = cb;
        this.on(eventName, once)
    }

    EventEmitter.prototype.emit = function(eventName, ...rest) {
        this._events[eventName] && this._events[eventName].forEach(cb => cb(...rest));
    }
```
- 观察者模式
```ts
    // 强耦合，面对对象编程
    class Subject {
        private deps: Array<Observer> = [];
        private state: any = null;
        
        public attach(obs: Observer): void {
            this.deps.push(obs);
        }

        public setState(state: any) {
            this.state = state;
            this.notfiyAllObserver()
        }

        private notfiyAllObserver() {
            this.deps.forEach(deps => {
                deps.run(this.state);
            })
        }
    }
    abstract class Observer {
        private readonly subject: Subject;

        constructor(subject: Subject) {
            this.subject = subject;
            subject.attach(this);
        }

        abstract run(state: any): any;
    }

    class ArrayObserver extends Observer {
        constructor(subject: Subject) {
            super(subject);
        }

        run(state: string) {
            console.log('subject设置了新值：' + state);
        }
    }
```

#### node 事件循环
优先级 Promise => process.nextTick => setImmediate => setTimeout/setInterval
1. timer 执行 setTimeout / setInterval 回调，并且由poll阶段控制
2. pending callbacks 执行部分回调，除了 close，times，setImmediate 设置的回调
3. idle，prepare 系统内部使用，限制阶段
4. poll - 在适当的条件下，node 会在这里阻塞 // 轮询阶段
> 如果没有 timer：
> - 如果 poll 队列不为空，会遍历回调队列，并同步执行
> - 如果 poll 为空：有 setImmediate 则执行，没有 setImmediate 则跳过
5. check 检查阶段
6. close callbacks 关闭回调阶段

## 安全
1. 通信链路 = https
    - 证书
    - 非对称加密
    - 对称加密
2. JWT 或者 authentication cookie 存在哪里

cookie 存储
- HttpOnly cookie / JS enabled / xss enabled
- secure cookie / https
- Samesite cookie / cors enabled / csrf enabled

JWT: [header, payload, signature]

[signature] session cookie [lifecycle: seesion]
httponly, samesite, secure
---
[random number], [payload] parmanent cookie [lifecycle: parmanent] samesite, secure

#### http安全: https://medium.com/lightrail/getting-token-authentication-right-in-a-stateless-single-page-application-57d0c6474e3

## koa
#### 原理
```js
    // 通过递归来执行中间件
    class koa {
        constructor() {
            this.middlewares = [];
        }

        use(cb) {
            this.middlewares.push(cb);
            return this;
        }

        listen() {
            const server = http.createServer(this.callback())
            return server.listen(...arguments);
        }

        callback() {
            const fn = this.compose(this.middlewares);
            ...
        }

        compose(middlewares = []) {
            return ctx => {
                const dispatch = (i) => {
                    const middleware = middlewares[i];
                    if(i === middlewares.length) return;
                    return middleware[i](ctx, () => dispatch(i + 1))
                }
                return dispatch(0);
            }
        }
    }

```
#### 源码详解 https://www.yuque.com/lpldplws/web/sh97a9ok4ed3whup?singleDoc# 《Node框架详解》 密码：uur9

## Node BFF (backend for frontend)

1. 服务端代码的聚合
2. 缓存数据
3. 访问控制

## Node ORM框架 (Object Relation Mapping 对象关系映射)

## HTTP

#### OSI TCP/IP 计算机网路的模型设计

1. 物理层 physical layer
2. 数据链路层 data link layer
3. 网络层 network layer
4. 传输层 transport layer
5. 会话层 session layer
6. 表示层 presentation layer
7. 应用层 application layer

#### TCP UDP
应用层 传输层 网络层 网络接口层
- TCP Transmission Control Protocol 传输控制协议
- UDP User Datagram protocol 用户数据包协议

区别：
- 是否面向连接：TCP 面向连接 UDP 不面向连接
- 是否可靠：TCP 流量和拥塞控制 UDP 只有简单的校验和
- 首部开销：TCP 20字节 UDP 8 字节
- 适用场景：TCP 面向可靠的数据连接 UDP 更适用于实时应用

三次握手建立连接，四次挥手断开连接

#### HTTP `Clint Server `
- 请求报文：method + path + HTTP版本号 GET/shop/get HTTP/1.1
- 相应报文：版本号 + 状态码 + 原因 HTTP/1.1 Not Found

#### websocket

基于 HTTP

## Cookie

1. 维护会话状态；
2. 个性化定制 用户主题色，自定义设置；
3. 分析用户行为；
 
#### Cookie生命周期
- 会话cookie：浏览器关闭自动删除 Expires Max-Age
- 持久cookie：设置了 Expires 或 Max-Age

```js
    document.cookie = 'user=xxx' //  设置
    document.cookie // 获取
```

- secure 只接受HTTPS
- HttpOnly 禁止操作 cookie

1. Cookie 作用域

domain + path： 可以发送给那些服务器的URL

2. SameSite 当设置SameSite后，Cookie允许服务器要求某个cookie咋跨站点不发送
- None 在相同的站点，或者跨站点都可以发送cookie
- Strict 在访问相同站点时发送Cookie
- Lax 默认，可以链接跳转携带

3. 如何提升 Cookie 的安全性
    1. 不让JS操作cookie：HttpOnly
    2. 非HTTTP链接操作：Secure
    3. 设计敏感信息，Cookie有效期短，不设置max-age expires 同时设置SameSite

- xss
- CSRF

银行操作
- 设置SameSite：Strict
- 二次确认
- 保证Cookie在当前会话有效

## Node缓存

1. 提升页面打开效率
2. 减少服务器的负载

缓存：强制缓存 & 协商缓存
两者区别：在于缓存数据要不要与服务器发生交互

#### 强制缓存 (缓存在客户端)
1. Expires：HTTP/1.0 表示缓存的到期时间 取决于客户端时间
2. Cache-Control：HTTP/1.1 最大有效时间 + 第一次请求缓存时间

`res.setHeader('Cache-control', 'max-age=20')`

1. no-cache 禁止使用强制缓存，可以使用协商缓存
2. no-store 禁止使用任何缓存
3. public 默认，不设置
4. private

#### 协商缓存

当强制缓存失效，就需要使用协商缓存，缓存的过期内容取决于服务器

- last-modified 时间戳 

- Etag

根据文件内容，生成的唯一值

## Node 鉴权
- HTTP Basic Authentication
    - HTTP协议最初的鉴权方式
- session-cookie
- JWT (json web token)
- OAuth

> https://www.yuque.com/lpldplws/web/dxeix9g7n8n6x8no?singleDoc# 《HTTPS汇总》 密码：knmx
> https://www.yuque.com/lpldplws/web/dr13wv?singleDoc# 《Node缓存、安全与鉴权》 密码：pdzg

## CLI & 爬虫 (command line interface)

robots.txt 放于跟目录 ASCⅡ编码，告诉第三方哪些内容可以爬取

`<meta name="robots" content="nofollow">`

1. 模拟用户请求 superagent
2. 解析DOM cheerio
3. 模拟用户行为操作

> https://www.yuque.com/lpldplws/web/remygq?singleDoc# 《Node实战》 密码：hl1r