/**
 * React Hooks 学习示例
 * 展示 React 常用 Hooks 的简单易懂用法
 */

import { useState, useEffect, useRef, useCallback, useMemo, useContext, createContext } from 'react'
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
const UseCallbackExample = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  // 普通函数：每次渲染都会创建新函数
  const normalHandler = () => {
    console.log('普通函数被调用')
  }

  // useCallback：只有当依赖变化时才创建新函数
  const memoizedHandler = useCallback(() => {
    console.log('记忆化函数被调用，count =', count)
  }, [count])

  return (
    <Card title="4. useCallback - 记忆化函数" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>计数器：</Text>
          <Tag color="blue">{count}</Tag>
          <Button size="small" onClick={() => setCount(count + 1)} style={{ marginLeft: 8 }}>
            +1
          </Button>
        </div>

        <div>
          <Text strong>姓名：</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入姓名"
            style={{ width: 200 }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <Space>
          <Button size="small" onClick={normalHandler}>
            调用普通函数
          </Button>
          <Button size="small" onClick={memoizedHandler}>
            调用记忆化函数
          </Button>
        </Space>

        <Text type="secondary" style={{ fontSize: 12 }}>
          💡 提示：打开控制台查看函数调用日志。记忆化函数只在 count 变化时重新创建。
        </Text>

        <Alert
          message="useCallback 说明"
          description="useCallback 返回一个记忆化的回调函数，只有当依赖数组中的值变化时才重新创建函数。常用于优化性能，避免不必要的子组件重新渲染。"
          type="info"
          showIcon
          style={{ marginTop: 12 }}
        />
      </Space>
    </Card>
  )
}

// ========== 示例 5: useMemo - 记忆化计算结果 ==========
const UseMemoExample = () => {
  const [count, setCount] = useState(0)
  const [multiplier, setMultiplier] = useState(2)

  // 普通计算：每次渲染都重新计算
  const normalResult = count * multiplier

  // useMemo：只有当依赖变化时才重新计算
  const memoizedResult = useMemo(() => {
    console.log('重新计算 memoizedResult')
    return count * multiplier
  }, [count, multiplier])

  // 复杂计算示例
  const expensiveResult = useMemo(() => {
    console.log('执行复杂计算')
    let sum = 0
    for (let i = 0; i < count * 1000; i++) {
      sum += i
    }
    return sum
  }, [count])

  return (
    <Card title="5. useMemo - 记忆化计算结果" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
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

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>普通计算结果：</Text>
          <Tag color="orange">{normalResult}</Tag>
        </div>

        <div>
          <Text strong>记忆化计算结果：</Text>
          <Tag color="purple">{memoizedResult}</Tag>
        </div>

        <div>
          <Text strong>复杂计算结果：</Text>
          <Tag color="red">{expensiveResult}</Tag>
        </div>

        <Text type="secondary" style={{ fontSize: 12 }}>
          💡 提示：打开控制台查看计算日志。记忆化结果只在依赖变化时重新计算。
        </Text>

        <Alert
          message="useMemo 说明"
          description="useMemo 返回一个记忆化的值，只有当依赖数组中的值变化时才重新计算。常用于优化性能，避免重复的昂贵计算。"
          type="info"
          showIcon
          style={{ marginTop: 12 }}
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

