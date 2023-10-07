### 原子化CSS-[`Tailwind`]: https://www.tailwindcss.cn/
### handlessUI - 无样式组件

## react

### 实例阶段
#### constructor

#### getDerivedStateFromProps 从props合并到state中

#### componentWillMount
- 渲染之前执行
- 如果有了getDerivedStateFromProps | getSnapshotBeforeUpdate 则不执行
#### render

#### componentDidMount
---
### 更新阶段
#### componentWillReceiveProps
- 如果有了getDerivedStateFromProps则不执行
- 根据props决定是否更新state

#### getDerivedStateFromProps

#### shouldComponentUpdate
- 返回false，阻止组件更新

#### componentWillUpdate
- 获取组件更新前的一些状态，DOM 位置

#### render
- createElement

#### getSnapshotBeforeUpdate
- 获取更新前快照
- commitBeforeMutationLifeCycle

#### componentDidUpdate
---
### 销毁阶段

#### componentWillUnmount
---
#### useState
`[state, dispatch] = useState(initState)`
> - state: 组件状态，提供给UI渲染
> - dispatch: 用户修改state的方法，同时触发组件更新
> - - dispatch 的值，可以是函数，或者基础类型
> - initState: 初始值
> - - initState 的值，可以是函数，或者基础类型
---
#### useEffect (vue scopeEffect)
`useEffrct(() => destroy, deps)`
- () => destroy, 即callback，第一个参数
- destroy，下次callback执行前调用
- deps，第二个参数，是个数组，执行上一次的destroy，并再次执行callback
#### ref 获取挂载元素 (vue ref)
- class 组件 const ref = createRef(null);
- func 组件 const ref = useRef(null);
- 子组件用 forwardRef((props, ref) => {}) 传递
- 子组件用 useImperativeHandle 向外暴露 对象属性
- - 参数1：ref 接受 传递进来的 ref
- - 参数2：createHandle 返回给 父组件的ref对象
- - 参数3：更新ref对象的依赖
---
#### context (vue provide & inject)
- class xxx.Provider => xxx.Consumer
#### useMemo (vue computed)
- 函数：返回值进行缓存
- deps：依赖项改变，重新计算
#### useCallback 
- 函数：返回值，缓存函数
- deps：依赖项
### 组件本身不需要额外渲染
- 声明周期：shouldComponentUpdate
- PureComponent 
- - 对 props 和 state 进行浅比较 不会深层比较
### redux
- 原理：发布订阅
- 通过dispatch => 触发action => 生成新的state覆盖原有的
### react-router
- 提供核心API，如router | route 相关
### react-router-dom
- 提供BrowserRouter，hashRouter，Link，用DOM触发事件
### history
- 模拟浏览器的history的一个库，V6版本内置  
 
### react 版本
- v15 stack reconciler
    - 从根节点更新
- 16.9 ~ 17.0.2 fiber reconciler
    - 异步可中断的更新
- 18
    - concurrent 模式 ++

### 双缓存

### 流程
- beginWork：创建 workInPrograssFiber
使用 v-dom 和 current fiber 对比， 向下调和
期间会执行 函数组件、类组件，diff 子节点，打上不同的 effectTag