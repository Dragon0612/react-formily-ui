/**
 * React Hooks 学习示例
 * 展示 React 常用 Hooks 的简单易懂用法
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
import { Card, Typography, Space, Button, Input, Tag, Divider, Alert } from 'antd'
import type { InputRef } from 'antd'

const { Title, Paragraph, Text } = Typography

// ========== 示例 1: useState - 状态管理 ==========
const UseStateExample = () => {
  // useState 用于在函数组件中添加状态
  const [count, setCount] = useState(0) // 数字状态
  const [name, setName] = useState('小明') // 字符串状态
  const [isOnline, setIsOnline] = useState(false) // 布尔状态

  return (
    <Card title="1. useState - 状态管理" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>计数器：</Text>
          <Tag color="blue" style={{ fontSize: 18, padding: '4px 12px' }}>
            {count}
          </Tag>
          <Space>
            <Button size="small" onClick={() => setCount(count + 1)}>
              +1
            </Button>
            <Button size="small" onClick={() => setCount(count - 1)}>
              -1
            </Button>
            <Button size="small" onClick={() => setCount(0)}>
              重置
            </Button>
          </Space>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>姓名：</Text>
          <Tag color="green">{name}</Tag>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入姓名"
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>在线状态：</Text>
          <Tag color={isOnline ? 'green' : 'red'}>
            {isOnline ? '在线' : '离线'}
          </Tag>
          <Button
            size="small"
            type={isOnline ? 'default' : 'primary'}
            onClick={() => setIsOnline(!isOnline)}
            style={{ marginLeft: 8 }}
          >
            {isOnline ? '下线' : '上线'}
          </Button>
        </div>

        <Alert
          message="useState 说明"
          description="useState 返回一个数组：[状态值, 更新函数]。调用更新函数会触发组件重新渲染。"
          type="info"
          showIcon
          style={{ marginTop: 12 }}
        />
      </Space>
    </Card>
  )
}

// ========== 示例 2: useEffect - 副作用处理 ==========
const UseEffectExample = () => {
  const [count, setCount] = useState(0)
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const [logs, setLogs] = useState<string[]>([])

  // useEffect 用于处理副作用（如数据获取、订阅、DOM 操作等）
  
  // 1. 只在组件挂载时执行一次（依赖数组为空）
  useEffect(() => {
    setLogs((prev) => [...prev, '组件首次挂载'])
    
    // 清理函数：组件卸载时执行
    // 注意：清理函数中不应该调用 setState，因为组件可能已经卸载
    return () => {
      // 清理函数通常用于清理副作用（如取消订阅、清除定时器等）
      // 这里只是演示，实际不应该在清理函数中更新状态
      console.log('组件卸载了')
    }
  }, [])

  // 3. 当 count 变化时执行
  useEffect(() => {
    setLogs((prev) => [...prev.slice(-9), `count 变化为 ${count}`])
  }, [count])

  // 4. 定时器示例
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    // 清理定时器
    return () => clearInterval(timer)
  }, [])

  return (
    <Card title="2. useEffect - 副作用处理" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>当前时间：</Text>
          <Tag color="purple" style={{ fontSize: 16 }}>
            {time}
          </Tag>
        </div>

        <div>
          <Text strong>计数器：</Text>
          <Tag color="blue">{count}</Tag>
          <Button size="small" onClick={() => setCount(count + 1)} style={{ marginLeft: 8 }}>
            增加
          </Button>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>执行日志（最近10条）：</Text>
          <div
            style={{
              background: '#f5f5f5',
              padding: 12,
              borderRadius: 4,
              maxHeight: 150,
              overflow: 'auto',
              fontSize: 12,
              fontFamily: 'monospace',
              marginTop: 8,
            }}
          >
            {logs.length === 0 ? (
              <Text type="secondary">暂无日志</Text>
            ) : (
              logs.slice(-10).map((log, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <Alert
          message="useEffect 说明"
          description="useEffect 接收两个参数：1) 副作用函数 2) 依赖数组。依赖数组为空时只执行一次，有依赖时依赖变化才执行。返回清理函数用于清理副作用。"
          type="info"
          showIcon
          style={{ marginTop: 12 }}
        />
      </Space>
    </Card>
  )
}

// ========== 示例 3: useRef - 引用 DOM 或保存值 ==========
const UseRefExample = () => {
  const [count, setCount] = useState(0)
  const inputRef = useRef<InputRef>(null) // 引用 Ant Design Input 组件
  const prevCountRef = useRef<number>(0) // 保存上一次的值（不触发重新渲染）

  // 当 count 变化时，保存上一次的值
  useEffect(() => {
    prevCountRef.current = count
  }, [count])

  const focusInput = () => {
    inputRef.current?.focus() // 聚焦到输入框
  }

  return (
    <Card title="3. useRef - 引用和保存值" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>计数器：</Text>
          <Tag color="blue">{count}</Tag>
          <Tag color="orange">上一次的值：{prevCountRef.current}</Tag>
          <Button size="small" onClick={() => setCount(count + 1)} style={{ marginLeft: 8 }}>
            +1
          </Button>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>输入框（使用 ref 聚焦）：</Text>
          <Space>
            <Input ref={inputRef} placeholder="点击按钮聚焦到这里" style={{ width: 200 }} />
            <Button size="small" onClick={focusInput}>
              聚焦输入框
            </Button>
          </Space>
        </div>

        <Alert
          message="useRef 说明"
          description="useRef 返回一个可变的 ref 对象，.current 属性可以保存值或引用 DOM 元素。修改 .current 不会触发组件重新渲染。"
          type="info"
          showIcon
          style={{ marginTop: 12 }}
        />
      </Space>
    </Card>
  )
}

// ========== 示例 4: useCallback - 记忆化函数 ==========
// 子组件：用于演示 useCallback 的作用
const ChildButton = React.memo(({ 
  onClick, 
  label 
}: { 
  onClick: () => void
  label: string 
}) => {
  const renderCount = useRef(0)
  renderCount.current++
  
  return (
    <div style={{ padding: 8, background: '#f5f5f5', borderRadius: 4, marginBottom: 8 }}>
      <Button onClick={onClick} size="small">
        {label}
      </Button>
      <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>
        (已渲染 {renderCount.current} 次)
      </Text>
    </div>
  )
})

const UseCallbackExample = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [renderCount, setRenderCount] = useState(0)

  // ❌ 普通函数：每次父组件渲染都会创建新函数
  // 导致子组件认为 props 变化了，会重新渲染
  const normalIncrement = () => {
    setCount((c) => c + 1)
  }

  // ✅ useCallback：只有当依赖变化时才创建新函数
  // 即使父组件重新渲染，只要依赖没变，函数引用不变
  // 子组件就不会重新渲染（配合 React.memo 使用）
  const memoizedIncrement = useCallback(() => {
    setCount((c) => c + 1)
  }, []) // 空依赖数组，函数永远不会变

  // 这个函数依赖 count，所以 count 变化时会重新创建
  const memoizedWithDependency = useCallback(() => {
    console.log('当前 count:', count)
    alert(`当前计数是: ${count}`)
  }, [count]) // 依赖 count，count 变化时函数会重新创建

  // 模拟父组件渲染
  useEffect(() => {
    setRenderCount((c) => c + 1)
  })

  return (
    <Card title="4. useCallback - 记忆化函数（防止不必要的重新渲染）" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="核心概念"
          description="useCallback 就像给函数拍了一张'快照'，只有当依赖变化时才拍新快照。这样可以避免子组件因为函数引用变化而重新渲染。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Text strong>父组件已渲染：</Text>
          <Tag color="purple" style={{ fontSize: 16 }}>
            {renderCount} 次
          </Tag>
        </div>

        <div>
          <Text strong>计数器：</Text>
          <Tag color="blue" style={{ fontSize: 16 }}>
            {count}
          </Tag>
          <Button size="small" onClick={() => setCount(count + 1)} style={{ marginLeft: 8 }}>
            +1
          </Button>
        </div>

        <div>
          <Text strong>姓名（改变这个不会影响按钮函数）：</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入姓名"
            style={{ width: 200, marginTop: 8 }}
          />
        </div>

        <Divider style={{ margin: '16px 0' }}>子组件渲染对比</Divider>

        <div>
          <Text strong style={{ color: '#ff4d4f' }}>❌ 普通函数（每次父组件渲染都重新创建）：</Text>
          <ChildButton 
            onClick={normalIncrement} 
            label="普通函数按钮（点击看渲染次数）"
          />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            每次父组件渲染（比如输入姓名），这个按钮都会重新渲染，即使函数功能没变
          </Text>
        </div>

        <div style={{ marginTop: 16 }}>
          <Text strong style={{ color: '#52c41a' }}>✅ useCallback（函数引用稳定）：</Text>
          <ChildButton 
            onClick={memoizedIncrement} 
            label="记忆化函数按钮（点击看渲染次数）"
          />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            只有点击按钮时才会重新渲染，输入姓名时不会重新渲染（因为函数引用没变）
          </Text>
        </div>

        <div style={{ marginTop: 16 }}>
          <Text strong style={{ color: '#1890ff' }}>✅ useCallback（有依赖）：</Text>
          <ChildButton 
            onClick={memoizedWithDependency} 
            label="依赖 count 的函数（count 变化时重新创建）"
          />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            当 count 变化时，函数会重新创建，子组件也会重新渲染
          </Text>
        </div>

        <Alert
          message="实际应用场景"
          description={
            <div>
              <p><strong>什么时候用 useCallback？</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>将函数作为 props 传递给用 React.memo 包装的子组件</li>
                <li>将函数作为其他 Hook 的依赖（如 useEffect、useMemo）</li>
                <li>避免在依赖数组中频繁变化导致副作用重复执行</li>
              </ul>
              <p style={{ marginTop: 8 }}><strong>什么时候不用？</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>函数只在一个组件内部使用，不传递给子组件</li>
                <li>子组件没有用 React.memo 优化</li>
                <li>函数创建成本很低，优化意义不大</li>
              </ul>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Space>
    </Card>
  )
}

// ========== 示例 5: useMemo - 记忆化计算结果 ==========
const UseMemoExample = () => {
  const [count, setCount] = useState(0)
  const [multiplier, setMultiplier] = useState(2)
  const [name, setName] = useState('')
  
  // 使用 ref 来跟踪计算次数（不会触发重新渲染）
  const calculationCountRef = useRef(0)
  const memoCalculationCountRef = useRef(0)

  // ❌ 普通计算：每次组件渲染都重新计算（即使 count 和 multiplier 没变）
  // 比如输入 name 时，组件重新渲染，这个计算也会重新执行
  calculationCountRef.current++
  const normalResult = count * multiplier
  console.log('普通计算执行了', calculationCountRef.current, '次，结果:', normalResult)

  // ✅ useMemo：只有当依赖（count, multiplier）变化时才重新计算
  // 输入 name 时，组件重新渲染，但这个计算不会重新执行（因为依赖没变）
  const memoizedResult = useMemo(() => {
    memoCalculationCountRef.current++
    console.log('记忆化计算执行了', memoCalculationCountRef.current, '次，结果:', count * multiplier)
    return count * multiplier
  }, [count, multiplier])

  // 复杂计算示例：模拟耗时操作
  const expensiveResult = useMemo(() => {
    console.log('执行复杂计算（耗时操作）')
    let sum = 0
    // 模拟复杂计算
    for (let i = 0; i < count * 10000; i++) {
      sum += i
    }
    return sum
  }, [count])

  // 过滤列表示例
  const [searchText, setSearchText] = useState('')
  const products = ['苹果', '香蕉', '橙子', '葡萄', '西瓜', '草莓', '芒果']
  
  // ✅ useMemo 过滤：只有 searchText 变化时才重新过滤
  // 如果不用 useMemo，每次组件渲染（比如输入 name）都会重新过滤
  const memoizedFilteredProducts = useMemo(() => {
    console.log('重新过滤商品列表')
    return products.filter(p => p.includes(searchText))
  }, [searchText])

  return (
    <Card title="5. useMemo - 记忆化计算结果（避免重复计算）" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="核心概念"
          description="useMemo 就像给计算结果拍了一张'快照'，只有当依赖变化时才重新计算。这样可以避免在每次渲染时都执行昂贵的计算。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Text strong>计数器：</Text>
          <Tag color="blue">{count}</Tag>
          <Button size="small" onClick={() => setCount(count + 1)} style={{ marginLeft: 8 }}>
            +1
          </Button>
        </div>

        <div>
          <Text strong>乘数：</Text>
          <Tag color="green">{multiplier}</Tag>
          <Button size="small" onClick={() => setMultiplier(multiplier + 1)} style={{ marginLeft: 8 }}>
            +1
          </Button>
        </div>

        <div>
          <Text strong>姓名（改变这个会触发组件重新渲染，但不应该触发计算）：</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入姓名"
            style={{ width: 200, marginTop: 8 }}
          />
        </div>

        <Divider style={{ margin: '16px 0' }}>计算对比</Divider>

        <div>
          <Text strong style={{ color: '#ff4d4f' }}>❌ 普通计算：</Text>
          <Tag color="orange" style={{ fontSize: 16, marginLeft: 8 }}>
            {normalResult}
          </Tag>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            已计算 {calculationCountRef.current} 次（每次渲染都计算，包括输入姓名时）
          </Text>
        </div>

        <div style={{ marginTop: 12 }}>
          <Text strong style={{ color: '#52c41a' }}>✅ useMemo 计算：</Text>
          <Tag color="purple" style={{ fontSize: 16, marginLeft: 8 }}>
            {memoizedResult}
          </Tag>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            已计算 {memoCalculationCountRef.current} 次（只有 count 或 multiplier 变化时才计算）
          </Text>
        </div>

        <div style={{ marginTop: 12 }}>
          <Text strong>复杂计算结果（耗时操作）：</Text>
          <Tag color="red" style={{ fontSize: 16, marginLeft: 8 }}>
            {expensiveResult.toLocaleString()}
          </Tag>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            这个计算很耗时，用 useMemo 可以避免重复计算
          </Text>
        </div>

        <Divider style={{ margin: '16px 0' }}>实际应用：商品列表过滤</Divider>

        <div>
          <Text strong>搜索商品：</Text>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="输入商品名称"
            style={{ width: 200, marginTop: 8 }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <Text strong>搜索结果：</Text>
          <div style={{ marginTop: 8 }}>
            {memoizedFilteredProducts.length > 0 ? (
              <Space wrap>
                {memoizedFilteredProducts.map((p, i) => (
                  <Tag key={i} color="blue">{p}</Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary">没有找到匹配的商品</Text>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            💡 打开控制台查看：只有搜索文本变化时才会重新过滤
          </Text>
        </div>

        <Alert
          message="实际应用场景"
          description={
            <div>
              <p><strong>什么时候用 useMemo？</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>执行昂贵的计算（如大量数据过滤、排序、转换）</li>
                <li>创建对象或数组作为 props 传递给子组件（配合 React.memo）</li>
                <li>避免在每次渲染时都创建新的引用类型（对象、数组）</li>
              </ul>
              <p style={{ marginTop: 8 }}><strong>什么时候不用？</strong></p>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                <li>计算非常简单（如简单的加减乘除）</li>
                <li>依赖经常变化，记忆化没有意义</li>
                <li>计算成本很低，优化意义不大</li>
              </ul>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Space>
    </Card>
  )
}

// ========== 示例 6: useContext - 使用上下文 ==========
// 创建上下文
const ThemeContext = createContext<{ theme: string; toggleTheme: () => void } | null>(null)

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light')

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

const ThemedButton = () => {
  const context = useContext(ThemeContext)

  if (!context) return null

  const { theme, toggleTheme } = context

  return (
    <Button onClick={toggleTheme} type={theme === 'light' ? 'default' : 'primary'}>
      当前主题：{theme === 'light' ? '浅色' : '深色'}（点击切换）
    </Button>
  )
}

const UseContextExample = () => {
  return (
    <Card title="6. useContext - 使用上下文" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <ThemeProvider>
          <ThemedButton />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
            💡 提示：ThemedButton 组件通过 useContext 获取主题上下文，无需通过 props 传递。
          </Text>
        </ThemeProvider>

        <Alert
          message="useContext 说明"
          description="useContext 用于在组件中访问 React Context 的值，避免通过 props 层层传递数据。"
          type="info"
          showIcon
          style={{ marginTop: 12 }}
        />
      </Space>
    </Card>
  )
}

// ========== 主组件 ==========
const ReactHooksExample = () => {
  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          React Hooks 学习示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          React Hooks 是 React 16.8 引入的新特性，让函数组件也能使用状态和生命周期等功能。
          Hooks 是一些特殊的函数，以 "use" 开头，可以在函数组件中"钩入" React 的特性。
        </Paragraph>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <UseStateExample />
        <UseEffectExample />
        <UseRefExample />
        <UseCallbackExample />
        <UseMemoExample />
        <UseContextExample />

        {/* Hooks 总结 */}
        <Card title="React Hooks 总结" type="inner">
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <div>
              <Text strong>常用 Hooks：</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text strong>useState：</Text>
                <Text> 用于在函数组件中添加状态管理</Text>
              </li>
              <li>
                <Text strong>useEffect：</Text>
                <Text> 用于处理副作用（数据获取、订阅、DOM 操作等）</Text>
              </li>
              <li>
                <Text strong>useRef：</Text>
                <Text> 用于引用 DOM 元素或保存不触发渲染的值</Text>
              </li>
              <li>
                <Text strong>useCallback：</Text>
                <Text> 用于记忆化函数，优化性能</Text>
              </li>
              <li>
                <Text strong>useMemo：</Text>
                <Text> 用于记忆化计算结果，优化性能</Text>
              </li>
              <li>
                <Text strong>useContext：</Text>
                <Text> 用于访问 React Context，避免 props 层层传递</Text>
              </li>
            </ul>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>Hooks 使用规则：</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>只能在函数组件的顶层调用 Hooks，不能在循环、条件或嵌套函数中调用</Text>
              </li>
              <li>
                <Text>只能在 React 函数组件或自定义 Hooks 中调用 Hooks</Text>
              </li>
              <li>
                <Text>Hooks 名称必须以 "use" 开头</Text>
              </li>
            </ul>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default ReactHooksExample

