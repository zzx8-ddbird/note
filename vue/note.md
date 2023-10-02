## vue
#### computed 和 watch
**相同点**  
> - 基于VUE的依赖收集机制
> - 当依赖发生变化，进行计算或其他处理
**不同点**
> - computed 依赖多个值的变化
> - watch 监听单个值变化，触发其他操作
> - computed 自动依赖diff监听，没有变化从缓存中读取
> - watch 只能从回调获取值
> - computed 必须有return
> - watch 不一定
> - computed 首次运行就开始赋值
> - watch 首次不运行，`immediate: true` //立即触发，`deep: true`  //深度监听
#### v-for & v-if
> - vue2.x中，v-for优先级更高
> - vue3.x中，v-if优先级更高
#### key
> - 模板编译原理：template => 匹配语法——生成AST：静态+动态 => 转换成AST可执行方案 => render() => dom
> - key: dom diff - 单层复用，双向指针，优先复用，key => 快速识别可复用节点
## vue 进阶
#### 插槽
> - 默认插槽的实现方式 => 整个插槽聚合
> - 多个插槽 => 具名插槽
> - filters过滤器内有没this
#### 继承&混合
> - 执行优先级: extends > mixin > 组件内
> - 变量补充，不会覆盖
#### 整体拓展类 - extend
> 生成一个新实例 `new vue.extend(baseComponent)()`
#### Vue.use(app)
> - `Vue.config.option = {} | install(app, options)`
#### 自定义指令 directives
#### vue-cli
> chalk 命令行高亮工具
> inquirer 命令行交互工具
#### 流程
> * 区分本地模板还是远端模板
> * 区分官方模板还是非官方模板
> * 生成文件
## vue进阶
#### ref相应原理
```js
    function ref(value) {
        let _value = value;
        return {
            get value() {
                return _value;
            },
            set value(newValue) {
                _value = newValue;
                console.log('数据更新：' + _value.toString());
            }
        }
    }
```
#### reactive
```js
    function reactive(obj = {}) {
        return new Proxy(obj, {
            get(target, prop) {
                return target[prop];
            },
            set(target, prop, value) {
                target[prop] = value;
                console.log('数据已更新：' + value.toString());
            },
            deleteProperty(target, prop) {
                delete target[prop];
                console.log('数据已删除');
                return true;
            }
        })
    }
```
### vue3源码结构
> - 编译器：compiler-dom | compiler-core
> - 渲染器：runtime-dom | runtime-core
> - 响应式系统：reactivity
#### 响应式
> - track --依赖收集 => 储存在weakmap中
> - trigger --触发副作用函数 => 取出target => 遍历set中的函数
#### 渲染
> 1. createApp 创建app
> 2. createRenderer 创建渲染器
#### 编译器
> 1. 词法分析 tokenize
> 2. 语义分析 parse tokens转成AST
> 3. transform AST转换成renderer函数
> 4. generate 生成代码
## vue 状态管理 & SSR
#### vuex | pinia 
> - Store: state, getter, mutation, action, modules --大项目
> - Pinia: state, getter, action --小项目 
#### Pinia
> - 通过provide/inject注册到全局，effectScope响应式数据，reactive创建响应式对象
> - 服务端数据预获取，修改Store中state值，状态同步，服务端状态序列化字符串挂载 `window.__PINIA_STATE__` 变量上，客户端激活应用时从HTML中解析状态，注入pinia实例中
## vue 路由
#### 原理
> - createRouter
>    - hash
>       - windoew.addEventListener('hashChange')
>       - 两种实现路由切换的模式：UI 组件、API
>    - history
>       - H5新增API。不刷新页面改变路由

- 兼容性：hash > history
- 美观行：history > hash
- 和服务端的映射：B端用hash、C端用history
#### 路由匹配规则
> 静态路由、动态路由、正则匹配
#### 异步组件
> - defineAsyncComponent - 异步加载 => 需要split-chunk打包
> - KeepLive - 缓存组件 => 组件销毁时，创建container保存数据
> - Teleport - 渲染到DOM视图外，脱离组件数渲染
> - Transition - 过渡动画组件
## vue 路由
#### 原理
> - createRouter
>    - hash
>       - windoew.addEventListener('hashChange')
>       - 两种实现路由切换的模式：UI 组件、API
>    - history
>       - H5新增API。不刷新页面改变路由

- 兼容性：hash > history
- 美观行：history > hash
- 和服务端的映射：B端用hash、C端用history
#### 路由匹配规则
> 静态路由、动态路由、正则匹配
- 路由懒加载 *基于webpack split-chunk*
> - `component: resolve => (require(['@/component'], resolve))`
> - `component: () => import('@/component, 'componentName')`
> - `component: r => require.ensure([], () => r(require('@/component')), 'componentName')`
#### 路由流程
> beforeRouteLeave => beforeEach | beforeRouteUpdate | beforeEnter => beforeRouteEnter => beforeResolve => afterEach
#### 异步组件
> - defineAsyncComponent - 异步加载 => 需要split-chunk打包
> - KeepLive - 缓存组件 => 组件销毁时，创建container保存数据
> - Teleport - 渲染到DOM视图外，脱离组件数渲染
> - Transition - 过渡动画组件
#### vuex3
- 自定义报错 - 为了收集报错
- 基于mixin数据混入
> - 挂载beforeCreate => vue.mixin()混入同一个store实例，并且挂载在$store上
> - 拼装了一个store类，用于生产整个store实例功能
> - 实现响应式的实质new Vue()
#### vuex4
- 基于单例模式，参数注入 provide/inject
#### vue3.x
- compiler-xxx => 编译模块
> - core - 模板解析核心 => 基础函数
> - dom - 浏览器下，HTML + 指令 (v-xxx)
> - sfc - Vue单文件解析系统
> - ssr - 服务端渲染

- runtime-xxx => 运行时
> - core
> - dom
> - test 自动化测试

- 辅助系统
> - reactivity - 响应式核心
> - reactivity-transform - 响应式语法糖($ref等)
> - shared - 共享工具
> - size-check - 包大小工具的测试工具
> - sfc-playground - 代码用例测试工具
> - template-explorer - 模板用例测试工具
> - server-renderer - 服务端渲染相关
- 主入口
vue - vue3主入口
vue-compat - vue2兼容可配置
#### 1. 入口
> ***功能入口 => 边缘检测 | 错误处理***
vue/src/index.ts => compile => render()

#### 2. compiler - 编译模块
compiler-core
- baseParse() - 模板生成AST
- transform() - AST进行整合
- generate() - 完成AST转换后生成code
```js
    /* 保留空格和换行的标签 */
    <pre></pre>
    /* 跳过编译流程，加快渲染 */
    <div v-pre>{{ message }}</div>
```
> *练习: html，dom树，json，相互转化*
#### 3. reactivity
- vue2.x
    - 数据劫持 Object.defineProperty
    - 依赖收集 deps
    - 观察者 observer (`__ob__` 观察者实例阶段添加)
- vue3.x
    - 数据劫持 proxy => esNext
    - 依赖收集 effect
    - 调度器 scheduler

***mockjs 生成随机数据***
