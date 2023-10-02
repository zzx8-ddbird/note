## webpack

#### 打包产物
- 立即执行函数，每个模块都是IIFE，避免泄漏，进行模块化隔离
- 定义了若干全局变量用来储存和归类模块 + webpack的模块化功能区域 + 主入口import的执行 + 主功能代码逻辑
- 通过__webpack_require__进行串联
    - 查看模块是否缓存
    - 生成全新模块并且暴露exports
    - 执行代码模块
    - 返回当前模块导出
    - `__webpack_require__.r` 标识es封装的导出
    - `__webpack_require__.d` 处理es封装模块的具名导出
    - `__webpack_require__.o` hasOwnProperty
    - webpack会对es模块进行二次封装，对齐cjs使得二者模块挂载中兼容

#### webpack 异步分包
1. webpack.ensure
    - 异步加载代码存入全局的缓存中
    - 根据对应id寻找模块进行分包打包
    - 满足条件之后，再会执行具体模块中的代码
2. import按需加载
> mode: production => 默认自动分包

#### HMR 热更新

#### webpack laoders & plugins

#### AST 抽象语法树
词法分析 语法分析

#### v4 => v5 进一步对配置优化 & 优化编译速度主要是包大小
1. 持久化缓存 - 构建结果会持久化存到本地磁盘，二次构建直接利用磁盘缓存进行处理，进而跳过构建过程中的resolve，build
```js
    module.exports = {
        cache: {
            type: 'fileSystem',
            buildDependencies: {
                config: [__filename]
            }
        }
    }
```
2. 资源模块 - 通过规整统一处理资源文件，优化取消资源文件引入的loader，直接与路径去关联优化配置
3. 打包优化
- 优化tree-shaking => 支持跨模块的摇树
- 优化splitChunk => 支持更精细化调整

#### webpack的插件帮助
- cache-loader 针对一些耗时的工作进行缓存
- terser-webpack-plugin 的 cache 以及 parallel

- imagemin-webpack-plugin - 批量压缩图片
- purifycss-webpack - 删除未使用的css
- optimize-css-assets-webpack-plguin - 压缩css

cleanWebpackPlugin - 默认打包清理bndle文件

## vite
* 模式：
1. 冷启动 => 开发状态下不打包
2. 热更新 => 更新源文件的时候有限更新视图
3. 按需更新 => 不刷新所有节点，只更新改动部分

* 原理对比
1. webpack - 编译支撑开发
- 以组件为最小单位打包

2. wite - 路由劫持 + 实时编译
- 以文件(template/js/css)为最小单位打包

#### 特性
- 默认支持TS
- 原生文件的支持
- 支持css文件引入

#### 单元测试 UT 
1. 覆盖率
2. 单元拆分定义 => 逻辑层面单一
3. 环境准备
> jest @type/jest babel-jest @vue/test-utils@next @testin-library/jest-dom ts-jest vue-jest
> 配置babel
> 配置jest

#### E2E 测试
端到端测试 => 业务功能出发 `cypress`
