import { useState, useEffect } from 'react'
import { Card, Space, Button, Input, Tag, Divider, Alert, Collapse, message, Segmented, Dropdown, Typography } from 'antd'
// 引入 lodash 的常用函数，结合 chain 形成“管道式”数据处理
import { chain, sumBy, orderBy, flatMap, thru, pick, omit, union, intersection } from 'lodash'
import { SortAscendingOutlined, PartitionOutlined, AppstoreOutlined, SearchOutlined, CopyOutlined } from '@ant-design/icons'

export default function LodashLearning () {
  const users = [
    {
      id: 1,
      name: 'Alice',
      age: 28,
      role: 'admin',
      active: true,
      orders: [
        { id: 'o-101', amount: 199.99 },
        { id: 'o-102', amount: 59.5 },
      ],
    },
    {
      id: 2,
      name: 'Bob',
      age: 34,
      role: 'editor',
      active: true,
      orders: [
        { id: 'o-201', amount: 399.0 },
        { id: 'o-202', amount: 25.0 },
        { id: 'o-203', amount: 80.0 },
      ],
    },
    {
      id: 3,
      name: 'Charlie',
      age: 22,
      role: 'viewer',
      active: false,
      orders: [{ id: 'o-301', amount: 15.0 }],
    },
    {
      id: 4,
      name: 'Eva',
      age: 26,
      role: 'editor',
      active: true,
      orders: [
        { id: 'o-401', amount: 120.0 },
        { id: 'o-402', amount: 320.0 },
      ],
    },
  ]

  const rawNames = [' alice ', 'Bob', 'ALICE', 'eVa', 'bob ']

  const [groupStats, setGroupStats] = useState<Array<{ role: string; avgAge: number; count: number }>>([])
  const [topSpenders, setTopSpenders] = useState<Array<{ name: string; total: number }>>([])
  const [namesResult, setNamesResult] = useState<string[]>([])
  const [searchText, setSearchText] = useState('')
  const [searchNames, setSearchNames] = useState<string[]>([])
  const [sortedMulti, setSortedMulti] = useState<Array<{ name: string; total: number }>>([])
  const [ordersFlat, setOrdersFlat] = useState<Array<{ user: string; orderId: string; amount: number }>>([])
  const [withSummary, setWithSummary] = useState<Array<{ name: string; orderCount: number }>>([])
  const [weightedSorted, setWeightedSorted] = useState<Array<{ name: string; score: number; total: number; age: number }>>([])
  const [pickedUsers, setPickedUsers] = useState<Array<{ name: string; role: string }>>([])
  const [sortedNested, setSortedNested] = useState<Array<{ role: string; name: string; total: number }>>([])
  const [setOpsResult, setSetOpsResult] = useState<{ union: string[]; intersect: string[] }>({ union: [], intersect: [] })

  const renderPipeline = (steps: string[]) => (
    <Space wrap>
      <Tag color="processing">管道</Tag>
      {steps.map((s, i) => (
        <Tag key={`${s}-${i}`}>{s}</Tag>
      ))}
    </Space>
  )

  const PerfAlert = (props: { tips: string[] }) => (
    <Alert
      message="性能提示"
      description={
        <div>
          {props.tips.map((t, i) => (
            <div key={`${t}-${i}`}>{t}</div>
          ))}
        </div>
      }
      type="warning"
      showIcon
    />
  )

  const renderInfo = (steps: string[], tips: string[], snippet: string, fullCode: string) => (
    <Collapse
      size="small"
      defaultActiveKey={collapseKeys()}
      items={[
        {
          key: 'info',
          label: '步骤与提示',
          children: (
            <Space direction="vertical" style={{ width: '100%' }}>
              {renderPipeline(steps)}
              <PerfAlert tips={tips} />
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(snippet)
                    message.success('已复制示例代码')
                  } catch {
                    message.error('复制失败，请手动选择代码')
                  }
                }}
              >
                复制示例代码
              </Button>
            </Space>
          ),
        },
        {
          key: 'code',
          label: '完整代码',
          children: (
            <div>
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: 12,
                  borderRadius: 6,
                  fontSize: 12,
                  overflow: 'auto',
                }}
              >
                {fullCode}
              </pre>
              <Button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(fullCode)
                    message.success('已复制完整代码')
                  } catch {
                    message.error('复制失败，请手动选择代码')
                  }
                }}
              >
                复制完整代码
              </Button>
            </div>
          ),
        },
      ]}
    />
  )

  const codeGroupStats = `function runGroupStats() {
  const result = chain(users)
    .filter((u: (typeof users)[number]) => u.active)
    .groupBy('role')
    .map((arr: Array<(typeof users)[number]>, role: string) => ({
      role,
      avgAge: Number((sumBy(arr, 'age') / arr.length).toFixed(1)),
      count: arr.length,
    }))
    .sortBy('avgAge')
    .value()
  setGroupStats(result)
}`

  const codeTopSpenders = `function runTopSpenders() {
  const result = chain(users)
    .map((u: (typeof users)[number]) => ({
      name: u.name,
      total: Number(sumBy(u.orders, 'amount').toFixed(2)),
    }))
    .thru((list: Array<{ name: string; total: number }>) =>
      orderBy(list, ['total', 'name'], ['desc', 'asc'])
    )
    .take(3)
    .value()
  setTopSpenders(result)
}`

  const codeNamesNormalize = `function runNamesNormalize() {
  const result = chain(rawNames)
    .map((s: string) => s.trim().toLowerCase())
    .uniq()
    .sort()
    .value()
  setNamesResult(result)
}`

  const codeMultiSort = `function runMultiSort() {
  const result = chain(users)
    .map((u: (typeof users)[number]) => ({
      name: u.name,
      total: Number(sumBy(u.orders, 'amount').toFixed(2)),
    }))
    .thru((list: Array<{ name: string; total: number }>) =>
      orderBy(list, ['total', 'name'], ['desc', 'asc'])
    )
    .take(5)
    .value()
  setSortedMulti(result)
}`

  const codeFlatMapOrders = `function runFlatMapOrders() {
  const result = chain(users)
    .flatMap((u: (typeof users)[number]) =>
      u.orders.map((o: { id: string; amount: number }) => ({
        user: u.name,
        orderId: o.id,
        amount: o.amount,
      }))
    )
    .thru((list: Array<{ user: string; orderId: string; amount: number }>) =>
      orderBy(list, ['amount'], ['desc'])
    )
    .value()
  setOrdersFlat(result)
}`

  const codeThruSummary = `function runThruSummary() {
  const result = chain(users)
    .map((u: (typeof users)[number]) => ({
      name: u.name,
      orderCount: u.orders.length,
    }))
    .thru((arr: Array<{ name: string; orderCount: number }>) => {
      const total = arr.reduce((acc, cur) => acc + cur.orderCount, 0)
      return [...arr, { name: '合计', orderCount: total }]
    })
    .value()
  setWithSummary(result)
}`

  const codeWeightedSort = `function runWeightedSort() {
  const result = chain(users)
    .map((u: (typeof users)[number]) => {
      const total = sumBy(u.orders, 'amount')
      const score = Number((total * 0.7 + u.age * 0.3).toFixed(2))
      return { name: u.name, total: Number(total.toFixed(2)), age: u.age, score }
    })
    .thru((list: Array<{ name: string; score: number; total: number; age: number }>) =>
      orderBy(list, ['score', 'name'], ['desc', 'asc'])
    )
    .value()
  setWeightedSorted(result)
}`

  const codePickOmit = `function runPickOmit() {
  const result = chain(users)
    .filter((u: (typeof users)[number]) => u.active)
    .map((u: (typeof users)[number]) => pick(u, ['name', 'role', 'age', 'orders']))
    .map((u: { name: string; role: string; age: number; orders: Array<{ id: string; amount: number }> }) =>
      omit(u, ['orders', 'age'])
    )
    .value() as Array<{ name: string; role: string }>
  setPickedUsers(result)
}`

  const codeNestedMultiSort = `function runNestedMultiSort() {
  const result = chain(users)
    .map((u: (typeof users)[number]) => ({
      role: u.role,
      name: u.name,
      total: Number(sumBy(u.orders, 'amount').toFixed(2)),
    }))
    .thru((list: Array<{ role: string; name: string; total: number }>) =>
      orderBy(list, ['role', 'total', 'name'], ['asc', 'desc', 'asc'])
    )
    .value()
  setSortedNested(result)
}`

  const codeSetOperations = `function runSetOperations() {
  const normalized = chain(rawNames)
    .map((s: string) => s.trim().toLowerCase())
    .uniq()
    .value()
  const vipNames = ['alice', 'david', 'eva']
  const unionRes = chain(normalized).thru((arr: string[]) => union(arr, vipNames)).sort().value()
  const intersectRes = chain(normalized).thru((arr: string[]) => intersection(arr, vipNames)).sort().value()
  setSetOpsResult({ union: unionRes, intersect: intersectRes })
}`

  const codeSearch = `function runSearch() {
  const text = searchText.trim().toLowerCase()
  const result = chain(users)
    .filter((u: (typeof users)[number]) => u.name.toLowerCase().includes(text))
    .map((u: (typeof users)[number]) => u.name)
    .value()
  setSearchNames(result)
}`

  const copyAllCodes = async () => {
    const all = [
      codeGroupStats,
      codeTopSpenders,
      codeNamesNormalize,
      codeMultiSort,
      codeFlatMapOrders,
      codeThruSummary,
      codeWeightedSort,
      codePickOmit,
      codeNestedMultiSort,
      codeSetOperations,
      codeSearch,
    ].join('\n\n')
    try {
      await navigator.clipboard.writeText(all)
      message.success('已复制全部示例代码')
    } catch {
      message.error('复制失败，请手动选择代码')
    }
  }

  const codesByCategory: Record<string, string[]> = {
    排序: [codeMultiSort, codeWeightedSort, codeNestedMultiSort, codeTopSpenders],
    展开与汇总: [codeFlatMapOrders, codeThruSummary],
    规范化与集合: [codeNamesNormalize, codeSetOperations],
    过滤与搜索: [codeGroupStats, codePickOmit, codeSearch],
  }

  const copyCategory = async (name: keyof typeof codesByCategory) => {
    const joined = codesByCategory[name].join('\n\n')
    try {
      await navigator.clipboard.writeText(joined)
      message.success(`已复制 ${name} 示例代码`)
    } catch {
      message.error('复制失败，请手动选择代码')
    }
  }

  const [collapseDefault, setCollapseDefault] = useState<'none' | 'steps' | 'code' | 'all'>('none')
  const collapseKeys = () => {
    if (collapseDefault === 'steps') return ['info']
    if (collapseDefault === 'code') return ['code']
    if (collapseDefault === 'all') return ['info', 'code']
    return []
  }
  const collapseDesc: Record<typeof collapseDefault, string> = {
    none: '全部示例默认收起',
    steps: '默认展开“步骤与提示”',
    code: '默认展开“完整代码”',
    all: '默认展开“步骤与提示”和“完整代码”',
  }
  const categoryMenuItems = [
    { key: '排序', label: '复制排序类代码', icon: <SortAscendingOutlined /> },
    { key: '展开与汇总', label: '复制展开与汇总代码', icon: <PartitionOutlined /> },
    { key: '规范化与集合', label: '复制规范化与集合代码', icon: <AppstoreOutlined /> },
    { key: '过滤与搜索', label: '复制过滤与搜索代码', icon: <SearchOutlined /> },
  ]

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.ctrlKey || !e.shiftKey) return
      if (e.key === '1') copyCategory('排序')
      if (e.key === '2') copyCategory('展开与汇总')
      if (e.key === '3') copyCategory('规范化与集合')
      if (e.key === '4') copyCategory('过滤与搜索')
      if (e.key.toLowerCase() === 'a') copyAllCodes()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  const runGroupStats = () => {
    const result = chain(users)
      .filter((u: (typeof users)[number]) => u.active)
      .groupBy('role')
      .map((arr: Array<(typeof users)[number]>, role: string) => ({
        role,
        avgAge: Number((sumBy(arr, 'age') / arr.length).toFixed(1)),
        count: arr.length,
      }))
      .sortBy('avgAge')
      .value()
    setGroupStats(result)
  }

  const runTopSpenders = () => {
    const result = chain(users)
      .map((u: (typeof users)[number]) => ({
        name: u.name,
        total: Number(sumBy(u.orders, 'amount').toFixed(2)),
      }))
      .sortBy('total')
      .reverse()
      .take(3)
      .value()
    setTopSpenders(result)
  }

  const runNamesNormalize = () => {
    const result = chain(rawNames)
      .map((s: string) => s.trim().toLowerCase())
      .uniq()
      .sort()
      .value()
    setNamesResult(result)
  }

  const runSearch = () => {
    const text = searchText.trim().toLowerCase()
    const result = chain(users)
      .filter((u: (typeof users)[number]) => u.name.toLowerCase().includes(text))
      .map((u: (typeof users)[number]) => u.name)
      .value()
    setSearchNames(result)
  }

  const runMultiSort = () => {
    const result = chain(users)
      .map((u: (typeof users)[number]) => ({
        name: u.name,
        total: Number(sumBy(u.orders, 'amount').toFixed(2)),
      }))
      .thru((list: Array<{ name: string; total: number }>) =>
        orderBy(list, ['total', 'name'], ['desc', 'asc'])
      )
      .take(5)
      .value()
    setSortedMulti(result)
  }

  const runFlatMapOrders = () => {
    const result = chain(users)
      .flatMap((u: (typeof users)[number]) =>
        u.orders.map((o: { id: string; amount: number }) => ({
          user: u.name,
          orderId: o.id,
          amount: o.amount,
        }))
      )
      .sortBy('amount')
      .reverse()
      .value()
    setOrdersFlat(result)
  }

  const runThruSummary = () => {
    const result = chain(users)
      .map((u: (typeof users)[number]) => ({
        name: u.name,
        orderCount: u.orders.length,
      }))
      .thru((arr: Array<{ name: string; orderCount: number }>) => {
        const total = arr.reduce((acc, cur) => acc + cur.orderCount, 0)
        return [...arr, { name: '合计', orderCount: total }]
      })
      .value()
    setWithSummary(result)
  }

  const runWeightedSort = () => {
    const result = chain(users)
      .map((u: (typeof users)[number]) => {
        const total = sumBy(u.orders, 'amount')
        const score = Number((total * 0.7 + u.age * 0.3).toFixed(2))
        return { name: u.name, total: Number(total.toFixed(2)), age: u.age, score }
      })
      .thru((list: Array<{ name: string; score: number; total: number; age: number }>) =>
        orderBy(list, ['score', 'name'], ['desc', 'asc'])
      )
      .value()
    setWeightedSorted(result)
  }

  const runPickOmit = () => {
    const result = chain(users)
      .filter((u: (typeof users)[number]) => u.active)
      .map((u: (typeof users)[number]) => pick(u, ['name', 'role', 'age', 'orders']))
      .map((u: { name: string; role: string; age: number; orders: Array<{ id: string; amount: number }> }) =>
        omit(u, ['orders', 'age'])
      )
      .value() as Array<{ name: string; role: string }>
    setPickedUsers(result)
  }

  // 多层嵌套排序示例：
  // 1) 先按 role 升序；2) 同 role 下按 total（消费总额）降序；3) 再按 name 升序
  const runNestedMultiSort = () => {
    const result = chain(users)
      // 映射出排序所需字段
      .map((u: (typeof users)[number]) => ({
        role: u.role,
        name: u.name,
        total: Number(sumBy(u.orders, 'amount').toFixed(2)),
      }))
      // 使用 orderBy 进行多字段排序（支持不同的排序方向）
      .thru((list: Array<{ role: string; name: string; total: number }>) =>
        orderBy(list, ['role', 'total', 'name'], ['asc', 'desc', 'asc'])
      )
      .value()
    setSortedNested(result)
  }

  // 集合操作（union / intersection）与 chain 组合：
  // 将名字进行规范化后，与“VIP 名单”做并集和交集演示
  const runSetOperations = () => {
    // 规范化原始名字列表
    const normalized = chain(rawNames)
      .map((s: string) => s.trim().toLowerCase())
      .uniq()
      .value()

    const vipNames = ['alice', 'david', 'eva']

    const unionRes = chain(normalized).thru((arr: string[]) => union(arr, vipNames)).sort().value()
    const intersectRes = chain(normalized).thru((arr: string[]) => intersection(arr, vipNames)).sort().value()

    setSetOpsResult({ union: unionRes, intersect: intersectRes })
  }

  return (
    <Card title="Lodash - chain 学习案例" type="inner">
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Alert
          message="chain 用法速览"
          description="将多个操作串联为统一的管道，最后使用 value() 取出结果。适合对数组/对象做筛选、分组、转换、排序等流水线式处理。"
          type="info"
          showIcon
        />
        <Space wrap>
          <Button icon={<CopyOutlined />} onClick={copyAllCodes}>复制全部示例代码</Button>
          <Segmented
            value={collapseDefault}
            onChange={(v) => setCollapseDefault(v as typeof collapseDefault)}
            options={[
              { label: '全部收起', value: 'none' },
              { label: '默认展开步骤', value: 'steps' },
              { label: '默认展开代码', value: 'code' },
              { label: '展开全部', value: 'all' },
            ]}
          />
          <Dropdown
            menu={{
              items: categoryMenuItems,
              onClick: ({ key }) => copyCategory(key as keyof typeof codesByCategory),
            }}
          >
            <Button>复制分类示例代码</Button>
          </Dropdown>
          <Space>
            <Tag color="blue">策略</Tag>
            <Typography.Text type="secondary">{collapseDesc[collapseDefault]}</Typography.Text>
            <Typography.Text type="secondary">
              快捷键：Ctrl+Shift+1/2/3/4 复制分类，Ctrl+Shift+A 复制全部
            </Typography.Text>
          </Space>
        </Space>
        <Space wrap>
          <Segmented
            value={collapseDefault}
            onChange={(v) => setCollapseDefault(v as typeof collapseDefault)}
            options={[
              { label: '全部收起', value: 'none' },
              { label: '默认展开步骤', value: 'steps' },
              { label: '默认展开代码', value: 'code' },
              { label: '展开全部', value: 'all' },
            ]}
          />
          <Dropdown
            menu={{
              items: categoryMenuItems,
              onClick: ({ key }) => copyCategory(key as keyof typeof codesByCategory),
            }}
          >
            <Button>复制分类示例代码</Button>
          </Dropdown>
          <Alert
            message="折叠默认策略"
            description={collapseDesc[collapseDefault]}
            type="info"
            showIcon
          />
        </Space>

        <Card title="示例一：活跃用户按角色分组统计" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runGroupStats}>运行示例</Button>
            {renderInfo(
              ['filter(active)', 'groupBy(role)', 'map(平均年龄&数量)', 'sortBy(avgAge)', 'value'],
              ['先过滤后分组减少分组规模', 'sortBy 返回升序，如需降序可反转或使用 orderBy'],
              "const result = chain(users).filter(u=>u.active).groupBy('role').map((arr, role)=>({ role, avgAge: Number((sumBy(arr,'age')/arr.length).toFixed(1)), count: arr.length })).sortBy('avgAge').value()",
              codeGroupStats
            )}
            <Space wrap>
              {groupStats.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                groupStats.map((g) => (
                  <Tag key={g.role} color="blue">
                    {g.role} | 平均年龄 {g.avgAge} | 数量 {g.count}
                  </Tag>
                ))
              )}
            </Space>
          </Space>
        </Card>

        <Card title="示例二：用户消费 Top 3" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runTopSpenders}>运行示例</Button>
            {renderInfo(
              ['map(订单合计)', 'sortBy(total)', 'reverse', 'take(3)', 'value'],
              ['需要降序时优先使用 orderBy 指定方向', '合计数值尽量复用，避免重复计算'],
              "const result = chain(users).map(u=>({ name: u.name, total: Number(sumBy(u.orders,'amount').toFixed(2)) })).thru(list=>orderBy(list,['total','name'],['desc','asc'])).take(3).value()",
              codeTopSpenders
            )}
            <Space wrap>
              {topSpenders.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                topSpenders.map((u) => (
                  <Tag key={u.name} color="green">
                    {u.name} | 总金额 ¥{u.total}
                  </Tag>
                ))
              )}
            </Space>
          </Space>
        </Card>

        <Card title="示例三：字符串清洗、去重、排序" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runNamesNormalize}>运行示例</Button>
            {renderInfo(
              ['map(trim+lower)', 'uniq', 'sort', 'value'],
              ['先规范化再去重提升准确性', '去重越早，后续排序/遍历开销越小'],
              "const result = chain(rawNames).map(s=>s.trim().toLowerCase()).uniq().sort().value()",
              codeNamesNormalize
            )}
            <Space wrap>
              {namesResult.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                namesResult.map((n) => <Tag key={n}>{n}</Tag>)
              )}
            </Space>
          </Space>
        </Card>

        <Divider />

        <Card title="示例四：多字段排序（orderBy + thru）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runMultiSort}>运行示例</Button>
            {renderInfo(
              ['map(订单合计)', 'thru(orderBy total desc, name asc)', 'take(5)', 'value'],
              ['多字段排序使用 orderBy 明确方向', 'thru 可插入自定义步骤，保持管道清晰'],
              "const result = chain(users).map(u=>({ name: u.name, total: Number(sumBy(u.orders,'amount').toFixed(2)) })).thru(list=>orderBy(list,['total','name'],['desc','asc'])).take(5).value()",
              codeMultiSort
            )}
            <Space wrap>
              {sortedMulti.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                sortedMulti.map((u) => (
                  <Tag key={u.name} color="geekblue">
                    {u.name} | 总金额 ¥{u.total}
                  </Tag>
                ))
              )}
            </Space>
          </Space>
        </Card>

        <Card title="示例五：深度展开（flatMap）整合订单列表" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runFlatMapOrders}>运行示例</Button>
            {renderInfo(
              ['flatMap(用户→订单)', 'sortBy(amount)', 'reverse', 'value'],
              ['数据量大时 flatMap 可能产生较大中间集合', '只展示前 N 项可搭配 take 降低渲染压力'],
              "const result = chain(users).flatMap(u=>u.orders.map(o=>({ user: u.name, orderId: o.id, amount: o.amount }))).thru(list=>orderBy(list,['amount'],['desc'])).value()",
              codeFlatMapOrders
            )}
            <Space wrap>
              {ordersFlat.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                ordersFlat.slice(0, 10).map((o) => (
                  <Tag key={o.orderId} color="gold">
                    {o.user} | {o.orderId} | ¥{o.amount}
                  </Tag>
                ))
              )}
            </Space>
          </Space>
        </Card>

        <Card title="示例六：thru 插入自定义汇总" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runThruSummary}>运行示例</Button>
            {renderInfo(
              ['map(name, orderCount)', 'thru(插入合计)', 'value'],
              ['汇总项可在管道末尾统一插入，保持数据流顺序', 'reduce 聚合统计应避免在渲染阶段重复执行'],
              "const result = chain(users).map(u=>({ name: u.name, orderCount: u.orders.length })).thru(arr=>{ const total = arr.reduce((a,c)=>a+c.orderCount,0); return [...arr, { name:'合计', orderCount: total }]; }).value()",
              codeThruSummary
            )}
            <Space wrap>
              {withSummary.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                withSummary.map((it) => (
                  <Tag key={it.name} color={it.name === '合计' ? 'red' : 'purple'}>
                    {it.name} | 订单数 {it.orderCount}
                  </Tag>
                ))
              )}
            </Space>
          </Space>
        </Card>

        <Card title="示例七：权重排序（总额与年龄加权）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runWeightedSort}>运行示例</Button>
            {renderInfo(
              ['map(total, score)', 'thru(orderBy score desc, name asc)', 'value'],
              ['评分计算与格式化分离，避免在循环中频繁格式化', '权重参数抽离为常量便于复用与调优'],
              "const result = chain(users).map(u=>{ const total = sumBy(u.orders,'amount'); const score = Number((total*0.7 + u.age*0.3).toFixed(2)); return { name: u.name, total: Number(total.toFixed(2)), age: u.age, score }; }).thru(list=>orderBy(list,['score','name'],['desc','asc'])).value()",
              codeWeightedSort
            )}
            <Space wrap>
              {weightedSorted.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                weightedSorted.map((u) => (
                  <Tag key={u.name} color="cyan">
                    {u.name} | 分数 {u.score} | 总额 ¥{u.total} | 年龄 {u.age}
                  </Tag>
                ))
              )}
            </Space>
          </Space>
        </Card>

        <Card title="示例八：pick/omit 与 chain 组合" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runPickOmit}>运行示例</Button>
            {renderInfo(
              ['filter(active)', 'map(pick)', 'map(omit)', 'value'],
              ['先筛选后挑选字段，减少不必要的对象拷贝', '字段剔除尽量在靠前步骤执行'],
              "const result = chain(users).filter(u=>u.active).map(u=>pick(u,['name','role','age','orders'])).map(u=>omit(u,['orders','age'])).value()",
              codePickOmit
            )}
            <Space wrap>
              {pickedUsers.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                pickedUsers.map((u) => (
                  <Tag key={u.name} color="magenta">
                    {u.name} | 角色 {u.role}
                  </Tag>
                ))
              )}
            </Space>
          </Space>
        </Card>

        <Card title="示例九：多层嵌套排序（role → total → name）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runNestedMultiSort}>运行示例</Button>
            {renderInfo(
              ['map(role, name, total)', 'thru(orderBy role asc, total desc, name asc)', 'value'],
              ['使用 orderBy 明确不同字段的排序方向', '尽量避免先 sortBy 再多次处理，直接用多列 orderBy'],
              "const result = chain(users).map(u=>({ role: u.role, name: u.name, total: Number(sumBy(u.orders,'amount').toFixed(2)) })).thru(list=>orderBy(list,['role','total','name'],['asc','desc','asc'])).value()",
              codeNestedMultiSort
            )}
            <Space wrap>
              {sortedNested.length === 0 ? (
                <Tag color="default">暂无结果</Tag>
              ) : (
                sortedNested.map((u) => (
                  <Tag key={`${u.role}-${u.name}`} color="blue">
                    {u.role} | {u.name} | 总额 ¥{u.total}
                  </Tag>
                ))
              )}
            </Space>
          </Space>
        </Card>

        <Card title="示例十：集合操作（union/intersection）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runSetOperations}>运行示例</Button>
            {renderInfo(
              ['map(trim+lower)', 'uniq', 'thru(union/intersection with VIP)', 'sort', 'value'],
              ['集合操作前做规范化以保证对比一致性', '结果排序便于展示与对比'],
              "const normalized = chain(rawNames).map(s=>s.trim().toLowerCase()).uniq().value(); const unionRes = union(normalized, vipNames); const intersectRes = intersection(normalized, vipNames);",
              codeSetOperations
            )}
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Tag color="success">并集</Tag>
                <Space wrap>
                  {setOpsResult.union.length === 0 ? (
                    <Tag color="default">暂无结果</Tag>
                  ) : (
                    setOpsResult.union.map((n) => <Tag key={`u-${n}`}>{n}</Tag>)
                  )}
                </Space>
              </div>
              <div>
                <Tag color="warning">交集</Tag>
                <Space wrap>
                  {setOpsResult.intersect.length === 0 ? (
                    <Tag color="default">暂无结果</Tag>
                  ) : (
                    setOpsResult.intersect.map((n) => <Tag key={`i-${n}`}>{n}</Tag>)
                  )}
                </Space>
              </div>
            </Space>
          </Space>
        </Card>

        <Card title="交互演示：搜索用户名称" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Input
                placeholder="输入名称（如 alice / bob）"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 260 }}
              />
              <Button type="primary" onClick={runSearch}>搜索</Button>
            </Space>
            {renderInfo(
              ['filter(name包含关键词)', 'map(name)', 'value'],
              ['预先将姓名缓存为小写可减少重复转换', '实时搜索建议加入防抖与最小输入长度'],
              "const result = chain(users).filter(u=>u.name.toLowerCase().includes(text)).map(u=>u.name).value()",
              codeSearch
            )}
            <Space wrap>
              {searchNames.length === 0 ? (
                <Tag color="default">无匹配项</Tag>
              ) : (
                searchNames.map((n) => <Tag key={n} color="purple">{n}</Tag>)
              )}
            </Space>
          </Space>
        </Card>
      </Space>
    </Card>
  )
}
