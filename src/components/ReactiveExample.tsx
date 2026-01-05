import { observable, autorun, reaction, toJS } from '@formily/reactive'
import { observer } from '@formily/reactive-react'
import { Card, Typography, Space, Button, Tag } from 'antd'
import { useState, useEffect } from 'react'

const { Title, Paragraph, Text } = Typography

// ========== 示例 1: observable - 创建响应式对象 ==========
const userStore = observable({
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
})

// ========== 示例 2: computed - 计算属性 ==========
const computedStore = observable({
  price: 100,
  quantity: 2,
  // 计算属性：总价
  get total() {
    return this.price * this.quantity
  },
  // 计算属性：折扣价（满200打9折）
  get discountPrice() {
    return this.total >= 200 ? this.total * 0.9 : this.total
  },
})

// ========== 示例 3: 嵌套对象 ==========
const nestedStore = observable({
  user: {
    profile: {
      name: '李四',
      age: 30,
    },
    settings: {
      theme: 'light',
      language: 'zh-CN',
    },
  },
})

// ========== 示例 4: 数组 ==========
const listStore = observable({
  items: [
    { id: 1, name: '商品1', price: 99 },
    { id: 2, name: '商品2', price: 199 },
  ],
  get totalPrice() {
    return this.items.reduce((sum, item) => sum + item.price, 0)
  },
})

const ReactiveExample = () => {
  const [logs, setLogs] = useState<string[]>([])
  const [autorunDispose, setAutorunDispose] = useState<(() => void) | null>(null)
  const [reactionDispose, setReactionDispose] = useState<(() => void) | null>(null)

  const addLog = (message: string) => {
    setLogs((prev) => [...prev.slice(-19), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // ========== autorun 示例 ==========
  const setupAutorun = () => {
    if (autorunDispose) {
      autorunDispose()
      setAutorunDispose(null)
      addLog('❌ autorun 已停止')
      return
    }

    // autorun 会自动追踪内部访问的 observable 属性
    const dispose = autorun(() => {
      const message = `autorun: name=${userStore.name}, age=${userStore.age}`
      addLog(message)
      console.log(message)
    })

    setAutorunDispose(() => dispose)
    addLog('✅ 已启动 autorun 监听 userStore')
  }

  // ========== reaction 示例 ==========
  const setupReaction = () => {
    if (reactionDispose) {
      reactionDispose()
      setReactionDispose(null)
      addLog('❌ reaction 已停止')
      return
    }

    // reaction 可以更精确地控制何时执行
    const dispose = reaction(
      () => computedStore.total, // 追踪的数据源
      (total) => {
        // 当 total 变化时执行
        const message = `reaction: 总价变化为 ${total}`
        addLog(message)
        console.log(message)
      }
    )

    setReactionDispose(() => dispose)
    addLog('✅ 已启动 reaction 监听 total')
  }

  // 清理函数
  useEffect(() => {
    return () => {
      autorunDispose?.()
      reactionDispose?.()
    }
  }, [autorunDispose, reactionDispose])

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          @formily/reactive 核心学习示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          这个示例展示了 @formily/reactive 的核心概念：observable、autorun、computed、reaction 等。
        </Paragraph>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* 示例 1: observable 基础用法 */}
        <Card title="示例 1: observable - 响应式对象" type="inner">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>当前值：</Text>
              <Tag color="blue">name: {userStore.name}</Tag>
              <Tag color="green">age: {userStore.age}</Tag>
              <Tag color="orange">email: {userStore.email}</Tag>
            </div>
            <Space>
              <Button
                size="small"
                onClick={() => {
                  userStore.name = '王五'
                  addLog('修改 name 为 "王五"')
                }}
              >
                修改 name
              </Button>
              <Button
                size="small"
                onClick={() => {
                  userStore.age++
                  addLog(`age 自增为 ${userStore.age}`)
                }}
              >
                age +1
              </Button>
              <Button
                size="small"
                onClick={() => {
                  userStore.email = 'wangwu@example.com'
                  addLog('修改 email')
                }}
              >
                修改 email
              </Button>
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 提示：修改这些值会触发 autorun 自动执行（如果已启动）
            </Text>
          </Space>
        </Card>

        {/* 示例 2: computed 计算属性 */}
        <Card title="示例 2: computed - 计算属性" type="inner">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>价格：</Text>
              <Tag color="blue">{computedStore.price} 元</Tag>
            </div>
            <div>
              <Text strong>数量：</Text>
              <Tag color="green">{computedStore.quantity}</Tag>
            </div>
            <div>
              <Text strong>总价（自动计算）：</Text>
              <Tag color="red" style={{ fontSize: 16 }}>
                {computedStore.total} 元
              </Tag>
            </div>
            <div>
              <Text strong>折扣价（满200打9折）：</Text>
              <Tag color="purple" style={{ fontSize: 16 }}>
                {computedStore.discountPrice} 元
              </Tag>
            </div>
            <Space>
              <Button
                size="small"
                onClick={() => {
                  computedStore.price += 10
                  addLog(`价格调整为 ${computedStore.price}`)
                }}
              >
                价格 +10
              </Button>
              <Button
                size="small"
                onClick={() => {
                  computedStore.quantity++
                  addLog(`数量调整为 ${computedStore.quantity}`)
                }}
              >
                数量 +1
              </Button>
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 提示：total 和 discountPrice 是计算属性，会自动更新
            </Text>
          </Space>
        </Card>

        {/* 示例 3: 嵌套对象 */}
        <Card title="示例 3: 嵌套对象响应式" type="inner">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>用户信息：</Text>
              <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, fontSize: 12 }}>
                {JSON.stringify(toJS(nestedStore.user), null, 2)}
              </pre>
            </div>
            <Space>
              <Button
                size="small"
                onClick={() => {
                  nestedStore.user.profile.name = '赵六'
                  addLog('修改嵌套对象 name')
                }}
              >
                修改 name
              </Button>
              <Button
                size="small"
                onClick={() => {
                  nestedStore.user.settings.theme =
                    nestedStore.user.settings.theme === 'light' ? 'dark' : 'light'
                  addLog(`切换主题为 ${nestedStore.user.settings.theme}`)
                }}
              >
                切换主题
              </Button>
            </Space>
          </Space>
        </Card>

        {/* 示例 4: 数组 */}
        <Card title="示例 4: 响应式数组" type="inner">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>商品列表：</Text>
              <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                {listStore.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.price} 元
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Text strong>总价（自动计算）：</Text>
              <Tag color="red" style={{ fontSize: 16 }}>
                {listStore.totalPrice} 元
              </Tag>
            </div>
            <Space>
              <Button
                size="small"
                onClick={() => {
                  const newId = listStore.items.length + 1
                  listStore.items.push({
                    id: newId,
                    name: `商品${newId}`,
                    price: Math.floor(Math.random() * 200) + 50,
                  })
                  addLog(`添加商品${newId}`)
                }}
              >
                添加商品
              </Button>
              <Button
                size="small"
                onClick={() => {
                  if (listStore.items.length > 0) {
                    listStore.items.pop()
                    addLog('删除最后一个商品')
                  }
                }}
              >
                删除商品
              </Button>
              <Button
                size="small"
                onClick={() => {
                  if (listStore.items.length > 0) {
                    listStore.items[0].price += 10
                    addLog('第一个商品价格 +10')
                  }
                }}
              >
                修改价格
              </Button>
            </Space>
          </Space>
        </Card>

        {/* 示例 5: autorun 和 reaction */}
        <Card title="示例 5: autorun 和 reaction" type="inner">
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text strong>执行日志：</Text>
              <div
                style={{
                  background: '#f5f5f5',
                  padding: 12,
                  borderRadius: 4,
                  maxHeight: 200,
                  overflow: 'auto',
                  fontSize: 12,
                  fontFamily: 'monospace',
                }}
              >
                {logs.length === 0 ? (
                  <Text type="secondary">暂无日志，点击下方按钮开始监听</Text>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} style={{ marginBottom: 4 }}>
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
            <Space>
              <Button
                size="small"
                type={autorunDispose ? 'default' : 'primary'}
                onClick={setupAutorun}
              >
                {autorunDispose ? '停止 autorun' : '启动 autorun'}
              </Button>
              <Button
                size="small"
                type={reactionDispose ? 'default' : 'primary'}
                onClick={setupReaction}
              >
                {reactionDispose ? '停止 reaction' : '启动 reaction'}
              </Button>
              <Button size="small" onClick={() => setLogs([])}>
                清空日志
              </Button>
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              💡 提示：启动监听后，修改示例1或示例2的值，观察自动触发的日志
            </Text>
          </Space>
        </Card>

        {/* 核心概念说明 */}
        <Card title="核心概念说明" type="inner">
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <div>
              <Text strong>1. observable：</Text>
              <Text>创建响应式对象，当属性变化时自动通知依赖它的地方</Text>
            </div>
            <div>
              <Text strong>2. computed：</Text>
              <Text>计算属性，基于其他 observable 值自动计算，有缓存机制</Text>
            </div>
            <div>
              <Text strong>3. autorun：</Text>
              <Text>自动追踪函数内部访问的 observable，当它们变化时自动重新执行</Text>
            </div>
            <div>
              <Text strong>4. reaction：</Text>
              <Text>更精确的响应式副作用，可以分别定义追踪的数据源和副作用函数</Text>
            </div>
            <div>
              <Text strong>5. toJS：</Text>
              <Text>将 observable 对象转换为普通 JavaScript 对象</Text>
            </div>
            <div>
              <Text strong>6. observer：</Text>
              <Text>React 组件包装器，使组件能够响应 observable 的变化</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

// 使用 observer 包装组件，使其能够响应 observable 的变化
export default observer(ReactiveExample)

