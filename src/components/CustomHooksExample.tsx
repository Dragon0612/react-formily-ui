/**
 * 自定义 Hooks 学习示例
 * 展示如何创建和使用自定义 Hooks
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Card, Typography, Space, Button, Input, Tag, Divider, Alert } from 'antd'

const { Title, Paragraph, Text } = Typography

// ========== 自定义 Hook 1: useCounter - 计数器 Hook ==========
/**
 * 自定义 Hook：封装计数器逻辑
 * 作用：将计数器的状态和操作封装在一起，可以在多个组件中复用
 */
const useCounter = (initialValue: number = 0) => {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  const decrement = useCallback(() => {
    setCount((c) => c - 1)
  }, [])

  const reset = useCallback(() => {
    setCount(initialValue)
  }, [initialValue])

  return { count, increment, decrement, reset }
}

const UseCounterExample = () => {
  // 使用自定义 Hook，一行代码就获得了所有计数器功能
  const counter1 = useCounter(0)
  const counter2 = useCounter(10)

  return (
    <Card title="自定义 Hook 1: useCounter - 计数器" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="什么是自定义 Hook？"
          description="自定义 Hook 是一个以 'use' 开头的 JavaScript 函数，可以调用其他 Hook。它让我们可以在多个组件之间复用状态逻辑。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Text strong>计数器 1（初始值 0）：</Text>
          <Tag color="blue" style={{ fontSize: 16, marginLeft: 8 }}>
            {counter1.count}
          </Tag>
          <Space style={{ marginLeft: 8 }}>
            <Button size="small" onClick={counter1.increment}>
              +1
            </Button>
            <Button size="small" onClick={counter1.decrement}>
              -1
            </Button>
            <Button size="small" onClick={counter1.reset}>
              重置
            </Button>
          </Space>
        </div>

        <div>
          <Text strong>计数器 2（初始值 10）：</Text>
          <Tag color="green" style={{ fontSize: 16, marginLeft: 8 }}>
            {counter2.count}
          </Tag>
          <Space style={{ marginLeft: 8 }}>
            <Button size="small" onClick={counter2.increment}>
              +1
            </Button>
            <Button size="small" onClick={counter2.decrement}>
              -1
            </Button>
            <Button size="small" onClick={counter2.reset}>
              重置
            </Button>
          </Space>
        </div>

        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
          💡 提示：两个计数器互不影响，因为它们使用了不同的 Hook 实例
        </Text>
      </Space>
    </Card>
  )
}

// ========== 自定义 Hook 2: useToggle - 切换布尔值 ==========
/**
 * 自定义 Hook：切换布尔值
 * 作用：封装常见的开关逻辑（如显示/隐藏、展开/收起）
 */
const useToggle = (initialValue: boolean = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((v) => !v)
  }, [])

  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return { value, toggle, setTrue, setFalse }
}

const UseToggleExample = () => {
  const modal = useToggle(false)
  const sidebar = useToggle(true)

  return (
    <Card title="自定义 Hook 2: useToggle - 切换布尔值" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>模态框状态：</Text>
          <Tag color={modal.value ? 'green' : 'red'}>
            {modal.value ? '打开' : '关闭'}
          </Tag>
          <Button size="small" onClick={modal.toggle} style={{ marginLeft: 8 }}>
            切换模态框
          </Button>
        </div>

        <div>
          <Text strong>侧边栏状态：</Text>
          <Tag color={sidebar.value ? 'green' : 'red'}>
            {sidebar.value ? '展开' : '收起'}
          </Tag>
          <Space style={{ marginLeft: 8 }}>
            <Button size="small" onClick={sidebar.toggle}>
              切换
            </Button>
            <Button size="small" onClick={sidebar.setTrue}>
              展开
            </Button>
            <Button size="small" onClick={sidebar.setFalse}>
              收起
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

// ========== 自定义 Hook 3: useLocalStorage - 本地存储 ==========
/**
 * 自定义 Hook：同步状态到 localStorage
 * 作用：让状态自动保存到浏览器本地存储，刷新页面后数据不丢失
 */
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  // 从 localStorage 读取初始值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error('读取 localStorage 失败:', error)
      return initialValue
    }
  })

  // 更新状态并同步到 localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error('保存到 localStorage 失败:', error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue] as const
}

const UseLocalStorageExample = () => {
  const [name, setName] = useLocalStorage('user-name', '')
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <Card title="自定义 Hook 3: useLocalStorage - 本地存储" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="实际应用"
          description="这个 Hook 会自动将数据保存到浏览器本地存储，刷新页面后数据不会丢失。常用于保存用户设置、表单草稿等。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Text strong>用户名（会自动保存）：</Text>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入用户名，刷新页面后不会丢失"
            style={{ width: 300, marginTop: 8 }}
          />
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            💡 提示：输入后刷新页面，数据仍然存在
          </Text>
        </div>

        <div style={{ marginTop: 16 }}>
          <Text strong>主题选择：</Text>
          <Space style={{ marginTop: 8 }}>
            <Button
              size="small"
              type={theme === 'light' ? 'primary' : 'default'}
              onClick={() => setTheme('light')}
            >
              浅色
            </Button>
            <Button
              size="small"
              type={theme === 'dark' ? 'primary' : 'default'}
              onClick={() => setTheme('dark')}
            >
              深色
            </Button>
          </Space>
          <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
            当前主题：{theme}（刷新后仍然保持）
          </Text>
        </div>
      </Space>
    </Card>
  )
}

// ========== 自定义 Hook 4: useDebounce - 防抖 ==========
/**
 * 自定义 Hook：防抖
 * 作用：延迟执行函数，常用于搜索框输入、窗口大小调整等场景
 */
const useDebounce = <T,>(value: T, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

const UseDebounceExample = () => {
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebounce(searchText, 500)

  // 模拟搜索 API 调用
  useEffect(() => {
    if (debouncedSearchText) {
      console.log('执行搜索:', debouncedSearchText)
      // 这里可以调用实际的搜索 API
    }
  }, [debouncedSearchText])

  return (
    <Card title="自定义 Hook 4: useDebounce - 防抖" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="实际应用"
          description="防抖可以避免频繁触发操作。比如搜索框，用户输入时不会立即搜索，而是等用户停止输入 500ms 后才搜索，减少不必要的 API 调用。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Text strong>搜索框：</Text>
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="输入搜索关键词（打开控制台查看搜索日志）"
            style={{ width: 300, marginTop: 8 }}
          />
        </div>

        <div>
          <Text strong>当前输入：</Text>
          <Tag color="blue">{searchText || '（空）'}</Tag>
        </div>

        <div>
          <Text strong>防抖后的值（500ms 后更新）：</Text>
          <Tag color="green">{debouncedSearchText || '（空）'}</Tag>
        </div>

        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
          💡 提示：快速输入时，只有停止输入 500ms 后才会触发搜索，打开控制台可以看到日志
        </Text>
      </Space>
    </Card>
  )
}

// ========== 自定义 Hook 5: useFetch - 数据获取 ==========
/**
 * 自定义 Hook：数据获取
 * 作用：封装数据获取逻辑，包括加载状态、错误处理等
 */
const useFetch = <T,>(url: string) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!url) return
    
    setLoading(true)
    setError(null)
    try {
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // 模拟数据
      const mockData = {
        message: '数据加载成功！',
        timestamp: new Date().toLocaleTimeString(),
      } as T

      setData(mockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

const UseFetchExample = () => {
  const { data, loading, error, refetch } = useFetch<{ message: string; timestamp: string }>('/api/data')

  return (
    <Card title="自定义 Hook 5: useFetch - 数据获取" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="实际应用"
          description="这个 Hook 封装了数据获取的完整流程，包括加载状态、错误处理、重新获取等。可以在多个组件中复用。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Button onClick={refetch} loading={loading}>
            {loading ? '加载中...' : '获取数据'}
          </Button>
        </div>

        {loading && (
          <div>
            <Text type="secondary">正在加载数据...</Text>
          </div>
        )}

        {error && (
          <div>
            <Text type="danger">错误：{error}</Text>
          </div>
        )}

        {data && !loading && (
          <div>
            <Text strong>数据：</Text>
            <Tag color="green">{data.message}</Tag>
            <Tag color="blue">{data.timestamp}</Tag>
          </div>
        )}
      </Space>
    </Card>
  )
}

// ========== 主组件 ==========
const CustomHooksExample = () => {
  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          自定义 Hooks 学习示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          自定义 Hook 是一个以 "use" 开头的 JavaScript 函数，可以调用其他 Hook。
          它让我们可以在多个组件之间复用状态逻辑，提高代码的可维护性和复用性。
        </Paragraph>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <UseCounterExample />
        <UseToggleExample />
        <UseLocalStorageExample />
        <UseDebounceExample />
        <UseFetchExample />

        {/* 自定义 Hooks 总结 */}
        <Card title="自定义 Hooks 总结" type="inner">
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <div>
              <Text strong>什么是自定义 Hook？</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>自定义 Hook 是一个以 "use" 开头的 JavaScript 函数</Text>
              </li>
              <li>
                <Text>可以在函数内部调用其他 Hook（如 useState、useEffect）</Text>
              </li>
              <li>
                <Text>用于提取组件逻辑，实现逻辑复用</Text>
              </li>
              <li>
                <Text>多个组件可以共享相同的状态逻辑</Text>
              </li>
            </ul>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>自定义 Hook 的优势：</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>代码复用：将逻辑提取到可重用的函数中</Text>
              </li>
              <li>
                <Text>逻辑分离：将复杂组件拆分为更小的函数</Text>
              </li>
              <li>
                <Text>易于测试：可以单独测试 Hook 的逻辑</Text>
              </li>
              <li>
                <Text>易于维护：逻辑集中管理，修改更方便</Text>
              </li>
            </ul>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>自定义 Hook 命名规则：</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>必须以 "use" 开头（如 useCounter、useToggle）</Text>
              </li>
              <li>
                <Text>使用驼峰命名法</Text>
              </li>
              <li>
                <Text>名称应该清晰表达 Hook 的用途</Text>
              </li>
            </ul>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default CustomHooksExample

