import { useState, useEffect, useMemo } from 'react'
import { Card, Space, Button, Input, Tag, Divider, Alert, Collapse, message, Segmented, Dropdown, Typography } from 'antd'
// 引入 lodash 的常用函数，结合 chain 形成“管道式”数据处理
import { chain, sumBy, orderBy, flatMap, thru, pick, omit, union, intersection, get, set, cloneDeep, merge, chunk, compact, flattenDepth, keyBy, partition, pickBy, omitBy, isEqual, camelCase, kebabCase, startCase, padStart, truncate, uniqBy, difference, xor, countBy, maxBy, minBy, mapValues, mapKeys, defaultsDeep, flow, flowRight, curry, partial, memoize, once, range, times, zip, unzip, shuffle, sample, sampleSize, groupBy, zipObject, zipObjectDeep, fromPairs, debounce, throttle, differenceBy, intersectionBy, uniqWith, differenceWith, intersectionWith, clamp, inRange } from 'lodash'
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
  const [getSetValue, setGetSetValue] = useState<string>('')
  const [cloneMergeResult, setCloneMergeResult] = useState<{ name: string; theme: string; lang: string } | null>(null)
  const [chunkCompactResult, setChunkCompactResult] = useState<{ chunks: number; compacted: number } | null>(null)
  const [flattenResult, setFlattenResult] = useState<number[]>([])
  const [keyByResult, setKeyByResult] = useState<Record<string, { id: number; name: string }>>({})
  const [partitionResult, setPartitionResult] = useState<{ left: number; right: number }>({ left: 0, right: 0 })
  const [pickOmitByResult, setPickOmitByResult] = useState<{ picked: Record<string, unknown>; omitted: Record<string, unknown> } | null>(null)
  const [isEqualResult, setIsEqualResult] = useState<boolean | null>(null)
  const [textTransform, setTextTransform] = useState<{ camel: string; kebab: string; start: string; padded: string; truncated: string } | null>(null)
  const [collectionOps, setCollectionOps] = useState<{ diff: string[]; xor: string[]; uniqCount: number } | null>(null)
  const [statsExtremes, setStatsExtremes] = useState<{ maxName: string; maxTotal: number; minName: string; minTotal: number; roleCounts: Record<string, number> } | null>(null)
  const [objectOps, setObjectOps] = useState<{ mapped: Record<string, number>; withDefaults: { ui: { theme: string; lang: string } } } | null>(null)
  const [functionTools, setFunctionTools] = useState<{ flow: number; curry: number; partial: string; memoCalled: number; onceVal: string } | null>(null)
  const [rangeTimesResult, setRangeTimesResult] = useState<number[]>([])
  const [zipUnzipResult, setZipUnzipResult] = useState<{ zipped: Array<[string, number]>; unzipped: [string[], number[]] } | null>(null)
  const [randomResult, setRandomResult] = useState<{ sample: string | number | undefined; shuffled: (string | number)[] } | null>(null)
  const [groupRankResult, setGroupRankResult] = useState<Array<{ role: string; total: number }>>([])
  const [zipObjResult, setZipObjResult] = useState<{ obj: Record<string, number>; pairs: Array<[string, number]> } | null>(null)
  const [groupMapResult, setGroupMapResult] = useState<Record<string, { total: number; count: number }>>({})
  const [pages, setPages] = useState<number[][]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [debouncedCount, setDebouncedCount] = useState(0)
  const [throttledCount, setThrottledCount] = useState(0)
  const [debounceInput, setDebounceInput] = useState('')
  const [objSetOpsResult, setObjSetOpsResult] = useState<{ diffBy: string[]; intersectBy: string[] } | null>(null)
  const [uniqWithResult, setUniqWithResult] = useState<{ before: number; after: number } | null>(null)
  const [deepZipResult, setDeepZipResult] = useState<Record<string, unknown> | null>(null)
  const [thrLeadingFalseCount, setThrLeadingFalseCount] = useState(0)
  const [thrTrailingFalseCount, setThrTrailingFalseCount] = useState(0)
  const [withOpsResult, setWithOpsResult] = useState<{ diffIds: number[]; intersectIds: number[] } | null>(null)
  const [flowRightResult, setFlowRightResult] = useState<number | null>(null)
  const [deepUpdateResult, setDeepUpdateResult] = useState<Record<string, unknown> | null>(null)
  const [debouncedMaxCount, setDebouncedMaxCount] = useState(0)
  const [debounceMaxInput, setDebounceMaxInput] = useState('')
  const [withOpsAdvancedResult, setWithOpsAdvancedResult] = useState<{ diff: string[]; intersect: string[] } | null>(null)
  const [flowVsResult, setFlowVsResult] = useState<{ leftToRight: number; rightToLeft: number } | null>(null)
  const [debLeadCount, setDebLeadCount] = useState(0)
  const [debTrailCount, setDebTrailCount] = useState(0)
  const [deepBatchResult, setDeepBatchResult] = useState<{ obj: Record<string, unknown>; updatedKeys: number } | null>(null)
  const [sampleSizeResult, setSampleSizeResult] = useState<Array<string | number>>([])
  const [clampRangeResult, setClampRangeResult] = useState<{ clamp: number; inRangeA: boolean; inRangeB: boolean } | null>(null)
  const [mapKeysResult, setMapKeysResult] = useState<Record<string, number> | null>(null)
  const [sortStabilityResult, setSortStabilityResult] = useState<string[] | null>(null)
  const [uniqPerfResult, setUniqPerfResult] = useState<{ prims: { count: number; ms: number }; objs: { count: number; ms: number }; deep: { count: number; ms: number } } | null>(null)
  const [sortCompareResult, setSortCompareResult] = useState<{ sortByAsc: string[]; orderByDesc: string[] } | null>(null)
  const [uniqCompareResult, setUniqCompareResult] = useState<{ prims: number; objs: number; deep: number } | null>(null)
  const [pickOmitPatternsResult, setPickOmitPatternsResult] = useState<{ afterPick: string[]; afterOmit: string[] } | null>(null)

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

  const codeGetSet = `function runGetSet() {
  const cfg = { ui: { theme: 'light', locale: { lang: 'zh-CN' } }, user: { name: 'Alice' } }
  const lang = get(cfg, 'ui.locale.lang', 'en-US')
  set(cfg, 'ui.theme', 'dark')
  const afterTheme = get(cfg, 'ui.theme')
  setGetSetValue(\`\${lang} → 主题:\${String(afterTheme)}\`)
}`

  const codeCloneMerge = `function runCloneMerge() {
  const defaults = { name: 'Guest', settings: { theme: 'light', lang: 'en' } }
  const overrides = { name: 'Alice', settings: { lang: 'zh-CN' } }
  const cloned = cloneDeep(defaults)
  const merged = merge(cloned, overrides)
  setCloneMergeResult({ name: merged.name, theme: merged.settings.theme, lang: merged.settings.lang })
}`

  const codeChunkCompact = `function runChunkCompact() {
  const arr = [1, 2, null, 3, undefined, 0, 4, false, 5]
  const chunks = chunk(arr, 3)
  const compacted = compact(arr)
  setChunkCompactResult({ chunks: chunks.length, compacted: compacted.length })
}`

  const codeFlattenDepth = `function runFlattenDepth() {
  const nested = [1, [2, [3, [4]]], 5]
  const flat2 = flattenDepth(nested, 2)
  setFlattenResult(flat2)
}`

  const codeKeyBy = `function runKeyBy() {
  const result = keyBy(users.map(u => ({ id: u.id, name: u.name.toLowerCase() })), 'id')
  setKeyByResult(result)
}`

  const codePartition = `function runPartition() {
  const [active, inactive] = partition(users, (u) => u.active)
  setPartitionResult({ left: active.length, right: inactive.length })
}`

  const codePickOmitBy = `function runPickOmitBy() {
  const obj = { a: 1, b: 'x', c: 0, d: null, e: 5 }
  const picked = pickBy(obj, (v) => typeof v === 'number' && v > 0)
  const omitted = omitBy(obj, (v) => v == null || v === 0)
  setPickOmitByResult({ picked, omitted })
}`

  const codeIsEqual = `function runIsEqual() {
  const o1 = { name: 'Alice', roles: ['admin', 'editor'], meta: { active: true } }
  const o2 = { name: 'Alice', roles: ['admin', 'editor'], meta: { active: true } }
  setIsEqualResult(isEqual(o1, o2))
}`

  const codeTextTransform = `function runTextTransform() {
  const s = 'hello world_lodash'
  const camel = camelCase(s)
  const kebab = kebabCase(s)
  const start = startCase(s)
  const padded = padStart('42', 5, '0')
  const truncated = truncate(s, { length: 12 })
  setTextTransform({ camel, kebab, start, padded, truncated })
}`

  const codeCollectionOps = `function runCollectionOps() {
  const a1 = ['alice', 'bob', 'charlie']
  const a2 = ['bob', 'david', 'eva']
  const diffRes = difference(a1, a2)
  const xorRes = xor(a1, a2)
  const withDup = [{ name: 'alice' }, { name: 'bob' }, { name: 'alice' }]
  const uniq = uniqBy(withDup, (x) => x.name)
  setCollectionOps({ diff: diffRes, xor: xorRes, uniqCount: uniq.length })
}`

  const codeStatsExtremes = `function runStatsAndExtremes() {
  const totals = users.map((u) => ({ name: u.name, total: sumBy(u.orders, 'amount') }))
  const maxItem = maxBy(totals, 'total')
  const minItem = minBy(totals, 'total')
  const roleCounts = countBy(users, 'role')
  setStatsExtremes({ maxName: maxItem?.name || '', maxTotal: Number((maxItem?.total || 0).toFixed(2)), minName: minItem?.name || '', minTotal: Number((minItem?.total || 0).toFixed(2)), roleCounts })
}`

  const codeObjectOps = `function runObjectOps() {
  const obj = { a: 1, b: 2, c: 3 }
  const mapped = mapValues(obj, (v) => v * 10)
  const def = { ui: { theme: 'light', lang: 'en' } }
  const cur = { ui: { lang: 'zh-CN' } }
  const withDefaults = defaultsDeep(cur, def)
  setObjectOps({ mapped, withDefaults })
}`

  const codeFunctionTools = `function runFunctionTools() {
  const add = (a: number, b: number) => a + b
  const square = (n: number) => n * n
  const double = (n: number) => n * 2
  const pipeline = flow([(n: number) => n + 1, double, square])
  const resultFlow = pipeline(3)
  const add3 = (a: number, b: number, c: number) => a + b + c
  const curried = curry(add3)
  const resultCurry = curried(1)(2)(3)
  const greet = (g: string, name: string) => g + ', ' + name
  const hiAlice = partial(greet, 'Hi')
  const resultPartial = hiAlice('Alice')
  let called = 0
  const expensive = memoize((x: number) => { called++; return x * 10 })
  const onceFn = once(() => 'ONCE')
  const memoVal = expensive(2) + expensive(2)
  const onceVal = onceFn() + '|' + onceFn()
  setFunctionTools({ flow: resultFlow, curry: resultCurry, partial: resultPartial, memoCalled: called, onceVal })
}`

  const codeZipObjectFromPairs = `function runZipObjectFromPairs() {
  const names = ['alice', 'bob']
  const ages = [28, 34]
  const obj = zipObject(names, ages)
  const pairs = fromPairs(Object.entries(obj))
  setZipObjResult({ obj, pairs })
}`

  const codeGroupMapValues = `function runGroupMapValues() {
  const grouped = groupBy(users, 'role')
  const totals = mapValues(grouped, (arr) => sumBy(arr, (u) => sumBy(u.orders, 'amount')))
  const counts = mapValues(grouped, (arr) => arr.length)
  const combined = Object.keys(grouped).reduce((acc, role) => {
    acc[role] = { total: Number((totals[role] || 0).toFixed(2)), count: counts[role] || 0 }
    return acc
  }, {} as Record<string, { total: number; count: number }>)
  setGroupMapResult(combined)
}`

  const codeRangeChunkPagination = `function runRangeChunkPagination() {
  const seq = range(1, 26)
  const pages = chunk(seq, 5)
  setPages(pages)
  setPageIndex(0)
}
function nextPage() {
  setPageIndex((i) => (pages.length ? (i + 1) % pages.length : 0))
}`

  const codeDebounceThrottle = `function debounceThrottleSetup() {
  const debounced = debounce((val: string) => setDebouncedCount((c) => c + 1), 500)
  const throttled = throttle(() => setThrottledCount((c) => c + 1), 1000)
  // 输入时调用 debounced(value)，快速点击按钮时调用 throttled()
}`
  const codeRangeTimes = `function runRangeTimes() {
  const seq = range(1, 11)
  const squares = times(5, (i) => (i + 1) * (i + 1))
  setRangeTimesResult([...seq, ...squares])
}`

  const codeZipUnzip = `function runZipUnzip() {
  const names = ['alice', 'bob', 'charlie']
  const ages = [28, 34, 22]
  const zipped = zip(names, ages)
  const unzipped = unzip(zipped)
  setZipUnzipResult({ zipped, unzipped })
}`

  const codeSampleShuffle = `function runSampleShuffle() {
  const list = ['a', 'b', 'c', 'd', 'e', 1, 2, 3]
  const s = sample(list)
  const sh = shuffle(list)
  setRandomResult({ sample: s, shuffled: sh })
}`

  const codeGroupRank = `function runGroupRank() {
  const grouped = groupBy(users, 'role')
  const totals = Object.entries(grouped).map(([role, arr]) => ({
    role,
    total: Number(sumBy(arr, (u) => sumBy(u.orders, 'amount')).toFixed(2)),
  }))
  const ranked = orderBy(totals, ['total'], ['desc'])
  setGroupRankResult(ranked)
}`
  const codeDifferenceIntersectionBy = `function runDifferenceIntersectionBy() {
  const l1 = [{ id: 1, name: 'alice' }, { id: 2, name: 'bob' }, { id: 3, name: 'charlie' }]
  const l2 = [{ id: 2, name: 'bob' }, { id: 4, name: 'david' }]
  const diffByName = differenceBy(l1, l2, 'name').map(x => x.name)
  const intersectByName = intersectionBy(l1, l2, 'name').map(x => x.name)
  setObjSetOpsResult({ diffBy: diffByName, intersectBy: intersectByName })
}`
  const codeUniqWith = `function runUniqWith() {
  const list = [{ a: 1, b: { x: 1 } }, { a: 1, b: { x: 1 } }, { a: 2, b: { x: 1 } }]
  const unique = uniqWith(list, isEqual)
  setUniqWithResult({ before: list.length, after: unique.length })
}`
  const codeZipObjectDeep = `function runZipObjectDeep() {
  const keys = ['a.b[0].c', 'a.b[1].c']
  const values = [1, 2]
  const obj = zipObjectDeep(keys, values)
  setDeepZipResult(obj)
}`
  const codeThrottleOptionsCancel = `function throttleOptionsAndCancel() {
  const throttledLeadingFalse = throttle(() => setThrLeadingFalseCount(c => c + 1), 1000, { leading: false, trailing: true })
  const throttledTrailingFalse = throttle(() => setThrTrailingFalseCount(c => c + 1), 1000, { leading: true, trailing: false })
  // 可调用 throttledLeadingFalse.cancel() / throttledTrailingFalse.cancel() 取消排队的调用
}`
  const codeWithOpsAdvanced = `function runWithOpsAdvanced() {
  const l1 = [{ name: 'Alice', role: 'admin' }, { name: 'Bob', role: 'editor' }, { name: 'Eva', role: 'editor' }]
  const l2 = [{ name: 'bob', role: 'editor' }, { name: 'David', role: 'viewer' }]
  const cmp = (a, b) => a.role === b.role && a.name.toLowerCase() === b.name.toLowerCase()
  const diff = differenceWith(l1, l2, cmp).map(x => \`\${x.name}:\${x.role}\`)
  const intersect = intersectionWith(l1, l2, cmp).map(x => \`\${x.name}:\${x.role}\`)
  setWithOpsAdvancedResult({ diff, intersect })
}`
  const codeFlowVs = `function runFlowVs() {
  const inc = (n) => n + 1
  const double = (n) => n * 2
  const square = (n) => n * n
  const left = flow([inc, double, square])(3)
  const right = flowRight([square, double, inc])(3)
  setFlowVsResult({ leftToRight: left, rightToLeft: right })
}`
  const codeDeepBatchUpdate = `function runDeepBatchUpdate() {
  const keys = ['cfg.ui.theme', 'cfg.ui.locale.lang', 'cfg.features.a', 'cfg.features.b']
  const values = ['light', 'en', true, false]
  const obj = zipObjectDeep(keys, values)
  const updates = [['cfg.ui.theme','dark'], ['cfg.ui.locale.lang','zh-CN'], ['cfg.features.b', true]]
  updates.forEach(([k, v]) => set(obj, k, v))
  setDeepBatchResult({ obj, updatedKeys: updates.length })
}`
  const codeDebounceOptions = `function debounceOptionsSetup() {
  const debouncedLeadingTrue = debounce(() => setDebLeadCount(c => c + 1), 300, { leading: true, trailing: false })
  const debouncedTrailingTrue = debounce(() => setDebTrailCount(c => c + 1), 300, { leading: false, trailing: true })
}`
  const codeWithOps = `function runWithOps() {
  const l1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
  const l2 = [{ id: 2 }, { id: 4 }]
  const cmp = (a: { id: number }, b: { id: number }) => a.id === b.id
  const diffIds = differenceWith(l1, l2, cmp).map(x => x.id)
  const intersectIds = intersectionWith(l1, l2, cmp).map(x => x.id)
  setWithOpsResult({ diffIds, intersectIds })
}`
  const codeFlowRight = `function runFlowRight() {
  const inc = (n: number) => n + 1
  const double = (n: number) => n * 2
  const square = (n: number) => n * n
  const pipeline = flowRight([square, double, inc])
  const result = pipeline(3)
  setFlowRightResult(result)
}`
  const codeDeepUpdate = `function runDeepUpdate() {
  const keys = ['cfg.ui.theme', 'cfg.ui.locale.lang']
  const values = ['light', 'en']
  const obj = zipObjectDeep(keys, values)
  set(obj, 'cfg.ui.theme', 'dark')
  const lang = get(obj, 'cfg.ui.locale.lang')
  setDeepUpdateResult({ obj, lang })
}`
  const codeDebounceMaxWait = `function debounceMaxWaitSetup() {
  const debounced = debounce(() => setDebouncedMaxCount(c => c + 1), 300, { maxWait: 1000 })
  // 高频输入时，至少每 1000ms 会强制触发一次
}`
  const codeSampleSize = `function runSampleSize() {
  const list = ['a', 'b', 'c', 'd', 'e', 1, 2, 3]
  const res = sampleSize(list, 4)
  setSampleSizeResult(res)
}`
  const codeClampInRange = `function runClampInRange() {
  const c = clamp(15, 0, 10)
  const a = inRange(3, 0, 5)
  const b = inRange(7, 0, 5)
  setClampRangeResult({ clamp: c, inRangeA: a, inRangeB: b })
}`
  const codeMapKeys = `function runMapKeys() {
  const obj = { a: 1, b: 2, c: 3 }
  const mapped = mapKeys(obj, (v, k) => 'key_' + k.toUpperCase())
  setMapKeysResult(mapped)
}`
  const codePickOmitPatterns = `function runPickOmitPatterns() {
  const u = { id: 1, name: 'Alice', role: 'admin', age: 28, active: true, token: 'secret' }
  const afterPick = Object.keys(pick(u, ['id', 'name', 'role', 'active']))
  const afterOmit = Object.keys(omit(u, ['token', 'age']))
  setPickOmitPatternsResult({ afterPick, afterOmit })
}`
  const codeUniqCompare = `function runUniqCompare() {
  const prims = chain([1,1,2,3,3,4]).uniq().value().length
  const objs = uniqBy([{id:1},{id:2},{id:1},{id:3}], 'id').length
  const deep = uniqWith([{a:{x:1}}, {a:{x:1}}, {a:{x:2}}], isEqual).length
  setUniqCompareResult({ prims, objs, deep })
}`
  const codeSortCompare = `function runSortCompare() {
  const list = [
    { name: 'alice', score: 70 },
    { name: 'bob', score: 85 },
    { name: 'charlie', score: 78 },
    { name: 'david', score: 85 },
  ]
  const asc = chain(list).sortBy('score').map(x => x.name).value()
  const desc = chain(list).thru(arr => orderBy(arr, ['score', 'name'], ['desc', 'asc'])).map(x => x.name).value()
  setSortCompareResult({ sortByAsc: asc, orderByDesc: desc })
}`
  const codeSortStability = `function runSortStability() {
  const list = [
    { name: 'alice', score: 85 },
    { name: 'bob', score: 85 },
    { name: 'charlie', score: 78 },
    { name: 'david', score: 85 },
  ]
  const ordered = chain(list).thru(arr => orderBy(arr, ['score', 'name'], ['asc', 'asc'])).map(x => x.name).value()
  setSortStabilityResult(ordered)
}`
  const codeUniqPerf = `function runUniqPerf() {
  const N = 5000
  const primsList = Array.from({ length: N }, (_, i) => i % 100)
  const objsList = Array.from({ length: N }, (_, i) => ({ id: i % 100, v: i }))
  const deepList = Array.from({ length: N }, (_, i) => ({ a: { x: i % 100 } }))
  const t1 = performance.now()
  const primsRes = chain(primsList).uniq().value().length
  const t2 = performance.now()
  const objsRes = uniqBy(objsList, 'id').length
  const t3 = performance.now()
  const deepRes = uniqWith(deepList, isEqual).length
  const t4 = performance.now()
  setUniqPerfResult({
    prims: { count: primsRes, ms: Number((t2 - t1).toFixed(1)) },
    objs: { count: objsRes, ms: Number((t3 - t2).toFixed(1)) },
    deep: { count: deepRes, ms: Number((t4 - t3).toFixed(1)) },
  })
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
      codeGetSet,
      codeCloneMerge,
      codeChunkCompact,
      codeFlattenDepth,
      codeKeyBy,
      codePartition,
      codePickOmitBy,
      codeIsEqual,
      codeTextTransform,
      codeCollectionOps,
      codeStatsExtremes,
      codeObjectOps,
      codeFunctionTools,
      codeRangeTimes,
      codeZipUnzip,
      codeSampleShuffle,
      codeGroupRank,
      codeDifferenceIntersectionBy,
      codeUniqWith,
      codeZipObjectDeep,
      codeThrottleOptionsCancel,
      codeWithOpsAdvanced,
      codeFlowVs,
      codeDeepBatchUpdate,
      codeDebounceOptions,
      codeSampleSize,
      codeClampInRange,
      codeMapKeys,
      codePickOmitPatterns,
      codeUniqCompare,
      codeSortCompare,
      codeSortStability,
      codeUniqPerf,
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
    数组处理: [codeChunkCompact, codeFlattenDepth, codeKeyBy, codePartition],
    对象与拷贝: [codeGetSet, codeCloneMerge, codePickOmitBy, codeIsEqual],
    字符串与格式: [codeTextTransform],
    函数工具: [codeFunctionTools],
    序列与组合: [codeRangeTimes, codeZipUnzip],
    随机: [codeSampleShuffle],
    分组与排名: [codeGroupRank],
    对象集合运算: [codeDifferenceIntersectionBy, codeUniqWith],
    深层键: [codeZipObjectDeep],
    事件控制进阶: [codeThrottleOptionsCancel],
    比较器进阶: [codeWithOpsAdvanced],
    函数组合对比: [codeFlowVs],
    深层批量更新: [codeDeepBatchUpdate],
    防抖选项: [codeDebounceOptions],
    数值与范围: [codeClampInRange],
    键变换: [codeMapKeys],
    随机增强: [codeSampleSize],
    选择剔除实践: [codePickOmitPatterns],
    去重对比: [codeUniqCompare],
    排序对比: [codeSortCompare],
    排序稳定性: [codeSortStability],
    去重性能对比: [codeUniqPerf],
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
    { key: '数组处理', label: '复制数组处理代码', icon: <AppstoreOutlined /> },
    { key: '对象与拷贝', label: '复制对象与拷贝代码', icon: <AppstoreOutlined /> },
    { key: '字符串与格式', label: '复制字符串与格式代码', icon: <AppstoreOutlined /> },
    { key: '函数工具', label: '复制函数工具代码', icon: <AppstoreOutlined /> },
    { key: '序列与组合', label: '复制序列与组合代码', icon: <AppstoreOutlined /> },
    { key: '随机', label: '复制随机代码', icon: <AppstoreOutlined /> },
    { key: '分组与排名', label: '复制分组与排名代码', icon: <AppstoreOutlined /> },
    { key: '对象集合运算', label: '复制对象集合运算代码', icon: <AppstoreOutlined /> },
    { key: '深层键', label: '复制深层键代码', icon: <AppstoreOutlined /> },
    { key: '事件控制进阶', label: '复制事件控制进阶代码', icon: <AppstoreOutlined /> },
    { key: '比较器进阶', label: '复制比较器进阶代码', icon: <AppstoreOutlined /> },
    { key: '函数组合对比', label: '复制函数组合对比代码', icon: <AppstoreOutlined /> },
    { key: '深层批量更新', label: '复制深层批量更新代码', icon: <AppstoreOutlined /> },
    { key: '防抖选项', label: '复制防抖选项代码', icon: <AppstoreOutlined /> },
    { key: '数值与范围', label: '复制数值与范围代码', icon: <AppstoreOutlined /> },
    { key: '键变换', label: '复制键变换代码', icon: <AppstoreOutlined /> },
    { key: '随机增强', label: '复制随机增强代码', icon: <AppstoreOutlined /> },
    { key: '选择剔除实践', label: '复制选择剔除实践代码', icon: <AppstoreOutlined /> },
    { key: '去重对比', label: '复制去重对比代码', icon: <AppstoreOutlined /> },
    { key: '排序对比', label: '复制排序对比代码', icon: <AppstoreOutlined /> },
    { key: '排序稳定性', label: '复制排序稳定性代码', icon: <AppstoreOutlined /> },
    { key: '去重性能对比', label: '复制去重性能对比代码', icon: <AppstoreOutlined /> },
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
      console.log(users,result)
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

  const runGetSet = () => {
    const cfg = {
      ui: { theme: 'light', locale: { lang: 'zh-CN' } },
      user: { name: 'Alice' },
    }
    const lang = get(cfg, 'ui.locale.lang', 'en-US')
    set(cfg, 'ui.theme', 'dark')
    const afterTheme = get(cfg, 'ui.theme')
    setGetSetValue(`${lang} → 主题:${String(afterTheme)}`)
  }

  const runCloneMerge = () => {
    const defaults = { name: 'Guest', settings: { theme: 'light', lang: 'en' } }
    const overrides = { name: 'Alice', settings: { lang: 'zh-CN' } }
    const cloned = cloneDeep(defaults)
    const merged = merge(cloned, overrides) as { name: string; settings: { theme: string; lang: string } }
    setCloneMergeResult({ name: merged.name, theme: merged.settings.theme, lang: merged.settings.lang })
  }

  const runChunkCompact = () => {
    const arr = [1, 2, null, 3, undefined, 0, 4, false, 5]
    const chunks = chunk(arr, 3)
    const compacted = compact(arr)
    setChunkCompactResult({ chunks: chunks.length, compacted: compacted.length })
  }

  const runFlattenDepth = () => {
    const nested = [1, [2, [3, [4]]], 5]
    const flat2 = flattenDepth(nested, 2) as number[]
    setFlattenResult(flat2)
  }

  const runKeyBy = () => {
    const result = keyBy(
      users.map(u => ({ id: u.id, name: u.name.toLowerCase() })),
      'id'
    ) as Record<string, { id: number; name: string }>
    setKeyByResult(result)
  }

  const runPartition = () => {
    const [active, inactive] = partition(users, (u) => u.active)
    setPartitionResult({ left: active.length, right: inactive.length })
  }

  const runPickOmitBy = () => {
    const obj = { a: 1, b: 'x', c: 0, d: null, e: 5 }
    const picked = pickBy(obj, (v) => typeof v === 'number' && (v as number) > 0)
    const omitted = omitBy(obj, (v) => v == null || v === 0)
    setPickOmitByResult({ picked, omitted })
  }

  const runIsEqual = () => {
    const o1 = { name: 'Alice', roles: ['admin', 'editor'], meta: { active: true } }
    const o2 = { name: 'Alice', roles: ['admin', 'editor'], meta: { active: true } }
    setIsEqualResult(isEqual(o1, o2))
  }

  const runRangeTimes = () => {
    const seq = range(1, 11)
    const squares = times(5, (i: number) => (i + 1) * (i + 1))
    setRangeTimesResult([...seq, ...squares])
  }

  const runZipUnzip = () => {
    const names = ['alice', 'bob', 'charlie']
    const ages = [28, 34, 22]
    const zipped = zip(names, ages) as Array<[string, number]>
    const unzipped = unzip(zipped) as [string[], number[]]
    setZipUnzipResult({ zipped, unzipped })
  }

  const runSampleShuffle = () => {
    const list: Array<string | number> = ['a', 'b', 'c', 'd', 'e', 1, 2, 3]
    const s = sample(list)
    const sh = shuffle(list)
    setRandomResult({ sample: s, shuffled: sh })
  }

  const runGroupRank = () => {
    const grouped = groupBy(users, 'role')
    const totals = Object.entries(grouped).map(([role, arr]) => ({
      role,
      total: Number(sumBy(arr, (u) => sumBy(u.orders, 'amount')).toFixed(2)),
    }))
    const ranked = orderBy(totals, ['total'], ['desc'])
    setGroupRankResult(ranked)
  }

  const runZipObjectFromPairs = () => {
    const names = ['alice', 'bob']
    const ages = [28, 34]
    const obj = zipObject(names, ages) as Record<string, number>
    const pairs = fromPairs(Object.entries(obj)) as Array<[string, number]>
    setZipObjResult({ obj, pairs })
  }

  const runGroupMapValues = () => {
    const grouped = groupBy(users, 'role')
    const totals = mapValues(grouped, (arr) => sumBy(arr, (u) => sumBy(u.orders, 'amount')))
    const counts = mapValues(grouped, (arr) => arr.length)
    const combined = Object.keys(grouped).reduce((acc, role) => {
      acc[role] = { total: Number((totals[role] || 0).toFixed(2)), count: counts[role] || 0 }
      return acc
    }, {} as Record<string, { total: number; count: number }>)
    setGroupMapResult(combined)
  }

  const runRangeChunkPagination = () => {
    const seq = range(1, 26)
    const p = chunk(seq, 5)
    setPages(p)
    setPageIndex(0)
  }
  const nextPage = () => {
    setPageIndex((i) => (pages.length ? (i + 1) % pages.length : 0))
  }

  const debouncedHandler = useMemo(
    () => debounce((val: string) => setDebouncedCount((c) => c + 1), 500),
    []
  )
  const throttledHandler = useMemo(
    () => throttle(() => setThrottledCount((c) => c + 1), 1000),
    []
  )
  const throttledLeadingFalse = useMemo(
    () => throttle(() => setThrLeadingFalseCount((c) => c + 1), 1000, { leading: false, trailing: true }),
    []
  )
  const throttledTrailingFalse = useMemo(
    () => throttle(() => setThrTrailingFalseCount((c) => c + 1), 1000, { leading: true, trailing: false }),
    []
  )
  const debouncedMaxWait = useMemo(
    () => debounce(() => setDebouncedMaxCount((c) => c + 1), 300, { maxWait: 1000 }),
    []
  )
  const runWithOpsAdvanced = () => {
    const l1 = [{ name: 'Alice', role: 'admin' }, { name: 'Bob', role: 'editor' }, { name: 'Eva', role: 'editor' }]
    const l2 = [{ name: 'bob', role: 'editor' }, { name: 'David', role: 'viewer' }]
    const cmp = (a: { name: string; role: string }, b: { name: string; role: string }) =>
      a.role === b.role && a.name.toLowerCase() === b.name.toLowerCase()
    const diff = differenceWith(l1, l2, cmp).map(x => `${x.name}:${x.role}`)
    const intersect = intersectionWith(l1, l2, cmp).map(x => `${x.name}:${x.role}`)
    setWithOpsAdvancedResult({ diff, intersect })
  }

  const runFlowVs = () => {
    const inc = (n: number) => n + 1
    const double = (n: number) => n * 2
    const square = (n: number) => n * n
    const left = flow([inc, double, square])(3)
    const right = flowRight([square, double, inc])(3)
    setFlowVsResult({ leftToRight: left, rightToLeft: right })
  }

  const runDeepBatchUpdate = () => {
    const keys = ['cfg.ui.theme', 'cfg.ui.locale.lang', 'cfg.features.a', 'cfg.features.b']
    const values = ['light', 'en', true, false]
    const obj = zipObjectDeep(keys, values) as Record<string, unknown>
    const updates: Array<[string, unknown]> = [
      ['cfg.ui.theme', 'dark'],
      ['cfg.ui.locale.lang', 'zh-CN'],
      ['cfg.features.b', true],
    ]
    updates.forEach(([k, v]) => set(obj, k, v))
    setDeepBatchResult({ obj, updatedKeys: updates.length })
  }
  const debouncedLeadingTrue = useMemo(
    () => debounce(() => setDebLeadCount((c) => c + 1), 300, { leading: true, trailing: false }),
    []
  )
  const debouncedTrailingTrue = useMemo(
    () => debounce(() => setDebTrailCount((c) => c + 1), 300, { leading: false, trailing: true }),
    []
  )
  console.log(chain(users))
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

        <Card title="排序对比：sortBy vs orderBy" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const list = [
                { name: 'alice', score: 70 },
                { name: 'bob', score: 85 },
                { name: 'charlie', score: 78 },
                { name: 'david', score: 85 },
              ]
              const asc = chain(list).sortBy('score').map(x => x.name).value()
              const desc = chain(list).thru(arr => orderBy(arr, ['score', 'name'], ['desc', 'asc'])).map(x => x.name).value()
              setSortCompareResult({ sortByAsc: asc, orderByDesc: desc })
            }}>运行示例</Button>
            {renderInfo(
              ['sortBy(score) → 默认升序', 'orderBy(score desc, name asc)'],
              ['orderBy 可指定方向与多字段', 'sortBy 需要 reverse 实现降序'],
              "const asc=chain(list).sortBy('score').value(); const desc=orderBy(list,['score','name'],['desc','asc'])",
              codeSortCompare
            )}
            <Space wrap>
              {sortCompareResult ? (
                <>
                  <Tag color="blue">sortBy(asc): {sortCompareResult.sortByAsc.join(' → ')}</Tag>
                  <Tag color="geekblue">orderBy(desc): {sortCompareResult.orderByDesc.join(' → ')}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="排序稳定性：相同分数按姓名次序" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const list = [
                { name: 'alice', score: 85 },
                { name: 'bob', score: 85 },
                { name: 'charlie', score: 78 },
                { name: 'david', score: 85 },
              ]
              const ordered = chain(list).thru(arr => orderBy(arr, ['score', 'name'], ['asc', 'asc'])).map(x => x.name).value()
              setSortStabilityResult(ordered)
            }}>运行示例</Button>
            {renderInfo(
              ['orderBy(score asc, name asc)'],
              ['为相同分数提供稳定次序'],
              "orderBy(list,['score','name'],['asc','asc'])",
              codeSortStability
            )}
            <Space wrap>
              {sortStabilityResult ? sortStabilityResult.map((n, i) => <Tag key={`st-${i}`}>{n}</Tag>) : <Tag color="default">暂无结果</Tag>}
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

        <Divider />

        <Card title="常用方法：对象访问与更新（get/set）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runGetSet}>运行示例</Button>
            {renderInfo(
              ['get(读取嵌套)', 'set(更新嵌套)'],
              ['get 可安全读取不存在路径', 'set 可创建缺失路径并赋值'],
              "const lang = get(cfg,'ui.locale.lang','en-US'); set(cfg,'ui.theme','dark')",
              codeGetSet
            )}
            <Space wrap>
              {getSetValue ? <Tag color="blue">{getSetValue}</Tag> : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="常用方法：深拷贝与合并（cloneDeep/merge）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runCloneMerge}>运行示例</Button>
            {renderInfo(
              ['cloneDeep(拷贝默认配置)', 'merge(合并覆盖项)'],
              ['避免浅拷贝导致引用共享', 'merge 深度合并默认与覆盖'],
              "const cloned=cloneDeep(defaults); const merged=merge(cloned,overrides)",
              codeCloneMerge
            )}
            <Space wrap>
              {cloneMergeResult ? (
                <>
                  <Tag color="green">用户 {cloneMergeResult.name}</Tag>
                  <Tag color="cyan">主题 {cloneMergeResult.theme}</Tag>
                  <Tag color="geekblue">语言 {cloneMergeResult.lang}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="常用方法：数组分块与压缩（chunk/compact）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runChunkCompact}>运行示例</Button>
            {renderInfo(
              ['chunk(按大小分块)', 'compact(移除假值)'],
              ['合理分块便于分页处理', 'compact 清理 null/undefined/false/0 等假值'],
              "const chunks=chunk(arr,3); const compacted=compact(arr)",
              codeChunkCompact
            )}
            <Space wrap>
              {chunkCompactResult ? (
                <>
                  <Tag color="purple">块数 {chunkCompactResult.chunks}</Tag>
                  <Tag color="magenta">有效项 {chunkCompactResult.compacted}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="常用方法：多层扁平（flattenDepth）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runFlattenDepth}>运行示例</Button>
            {renderInfo(
              ['flattenDepth(按层级扁平)'],
              ['控制扁平层级，避免完全打平造成信息丢失'],
              "const flat2=flattenDepth(nested,2)",
              codeFlattenDepth
            )}
            <Space wrap>
              {flattenResult.length ? flattenResult.map(n => <Tag key={`f-${n}`}>{n}</Tag>) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="常用方法：构建索引（keyBy）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runKeyBy}>运行示例</Button>
            {renderInfo(
              ['map(预处理)', 'keyBy(按键索引)'],
              ['keyBy 适合快速查找与去重', '预处理键值更稳健'],
              "const result=keyBy(users.map(u=>({id:u.id,name:u.name.toLowerCase()})),'id')",
              codeKeyBy
            )}
            <Space wrap>
              {Object.keys(keyByResult).length ? (
                Object.values(keyByResult).map(item => <Tag key={`k-${item.id}`}>{item.id}:{item.name}</Tag>)
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="常用方法：条件分组（partition）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runPartition}>运行示例</Button>
            {renderInfo(
              ['partition(按条件分两组)'],
              ['相比 filter，更方便获得正/负样本'],
              "const [active,inactive]=partition(users,u=>u.active)",
              codePartition
            )}
            <Space wrap>
              {partitionResult.left + partitionResult.right > 0 ? (
                <>
                  <Tag color="success">活跃 {partitionResult.left}</Tag>
                  <Tag color="warning">不活跃 {partitionResult.right}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="常用方法：按条件挑选/剔除属性（pickBy/omitBy）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runPickOmitBy}>运行示例</Button>
            {renderInfo(
              ['pickBy(挑选匹配属性)', 'omitBy(剔除匹配属性)'],
              ['适合清洗对象，保留/剔除符合条件的属性'],
              "const picked=pickBy(obj, v=>typeof v==='number'&&v>0); const omitted=omitBy(obj, v=>v==null||v===0)",
              codePickOmitBy
            )}
            <Space wrap>
              {pickOmitByResult ? (
                <>
                  <Tag color="blue">保留: {Object.keys(pickOmitByResult.picked).join(', ') || '无'}</Tag>
                  <Tag color="red">剔除: {Object.keys(pickOmitByResult.omitted).join(', ') || '无'}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="常用方法：深比较（isEqual）" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runIsEqual}>运行示例</Button>
            {renderInfo(
              ['isEqual(深度比较)'],
              ['用于判断两个对象结构与值完全一致'],
              "isEqual(o1,o2)",
              codeIsEqual
            )}
            <Space wrap>
              {isEqualResult !== null ? (
                <Tag color={isEqualResult ? 'green' : 'volcano'}>{isEqualResult ? '相等' : '不相等'}</Tag>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="键值构建：zipObject/fromPairs" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runZipObjectFromPairs}>运行示例</Button>
            {renderInfo(
              ['zipObject(键值对构建)', 'fromPairs(键值对还原)'],
              ['快速将两个数组组合为对象', '从对象生成键值对数组'],
              "const obj=zipObject(names,ages); const pairs=fromPairs(Object.entries(obj))",
              codeZipObjectFromPairs
            )}
            <Space wrap>
              {zipObjResult ? (
                <>
                  {Object.entries(zipObjResult.obj).map(([k,v]) => <Tag key={`zo-${k}`}>{k}:{v}</Tag>)}
                  {zipObjResult.pairs.map((p, i) => <Tag key={`fp-${i}`}>{p[0]}:{p[1]}</Tag>)}
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="分组统计表：groupBy + mapValues" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runGroupMapValues}>运行示例</Button>
            {renderInfo(
              ['groupBy(role)', 'mapValues(总额/数量)', 'reduce(组合结果)'],
              ['生成角色总额与数量的统计表', '适合看板与报表'],
              "const grouped=groupBy(users,'role'); const totals=mapValues(grouped,arr=>sumBy(arr,u=>sumBy(u.orders,'amount')))",
              codeGroupMapValues
            )}
            <Space wrap>
              {Object.keys(groupMapResult).length ? (
                Object.entries(groupMapResult).map(([role, v]) => <Tag key={`gm-${role}`}>{role} 总额:{v.total} 数量:{v.count}</Tag>)
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="分页数据：range + chunk" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button type="primary" onClick={runRangeChunkPagination}>生成分页</Button>
              <Button onClick={nextPage} disabled={pages.length === 0}>下一页</Button>
            </Space>
            {renderInfo(
              ['range(生成序列)', 'chunk(分页分块)'],
              ['前端分页可直接对序列分块', '与后端分页配合更佳'],
              "const pages=chunk(range(1,26),5)",
              codeRangeChunkPagination
            )}
            <Space wrap>
              {pages.length ? pages[pageIndex].map((n) => <Tag key={`pg-${n}`}>{n}</Tag>) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="事件控制：debounce/throttle" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Input
                placeholder="输入触发防抖（500ms）"
                value={debounceInput}
                onChange={(e) => {
                  setDebounceInput(e.target.value)
                  debouncedHandler(e.target.value)
                }}
                style={{ width: 260 }}
              />
              <Button onClick={() => throttledHandler()}>快速点击触发节流（1s）</Button>
              <Button onClick={() => (debouncedHandler as unknown as { cancel: () => void }).cancel()}>取消防抖</Button>
              <Button onClick={() => (debouncedHandler as unknown as { flush: () => void }).flush()}>立即执行防抖</Button>
              <Button onClick={() => (throttledHandler as unknown as { cancel: () => void }).cancel()}>取消节流</Button>
            </Space>
            {renderInfo(
              ['debounce(输入防抖)', 'throttle(点击节流)'],
              ['减少高频事件的处理开销', '在 React 中用 useMemo 保持稳定实例'],
              "const debounced=debounce(fn,500); const throttled=throttle(fn,1000)",
              codeDebounceThrottle
            )}
            <Space wrap>
              <Tag color="blue">防抖次数 {debouncedCount}</Tag>
              <Tag color="purple">节流次数 {throttledCount}</Tag>
            </Space>
          </Space>
        </Card>

        <Card title="防抖最大等待：debounce maxWait" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Input
                placeholder="高频输入（300ms 防抖，maxWait 1000ms）"
                value={debounceMaxInput}
                onChange={(e) => {
                  setDebounceMaxInput(e.target.value)
                  debouncedMaxWait()
                }}
                style={{ width: 320 }}
              />
              <Button onClick={() => (debouncedMaxWait as unknown as { cancel: () => void }).cancel()}>取消</Button>
              <Button onClick={() => (debouncedMaxWait as unknown as { flush: () => void }).flush()}>立即执行</Button>
            </Space>
            {renderInfo(
              ['debounce({ maxWait: 1000 })'],
              ['高频事件至少每段时间触发一次', '避免长期不触发导致数据不更新'],
              "const debounced=debounce(fn,300,{maxWait:1000})",
              codeDebounceMaxWait
            )}
            <Space wrap>
              <Tag color="blue">触发次数 {debouncedMaxCount}</Tag>
            </Space>
          </Space>
        </Card>

        <Card title="节流选项与取消：leading/trailing & cancel" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button onClick={() => throttledLeadingFalse()}>触发 leading:false（仅尾部）</Button>
              <Button onClick={() => throttledTrailingFalse()}>触发 trailing:false（仅头部）</Button>
              <Button onClick={() => (throttledLeadingFalse as unknown as { cancel: () => void }).cancel()}>取消尾部触发</Button>
              <Button onClick={() => (throttledTrailingFalse as unknown as { cancel: () => void }).cancel()}>取消头部触发</Button>
            </Space>
            {renderInfo(
              ['throttle({leading:false})', 'throttle({trailing:false})', 'cancel() 取消队列'],
              ['可精细控制首次与末尾触发', '取消可避免排队任务在不需要时执行'],
              "const t1=throttle(fn,1000,{leading:false}); const t2=throttle(fn,1000,{trailing:false}); t1.cancel()",
              codeThrottleOptionsCancel
            )}
            <Space wrap>
              <Tag color="gold">leading:false 次数 {thrLeadingFalseCount}</Tag>
              <Tag color="geekblue">trailing:false 次数 {thrTrailingFalseCount}</Tag>
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

        <Divider />

        <Card title="字符串与格式：camelCase/kebabCase/startCase/padStart/truncate" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const s = 'hello world_lodash'
              const camel = camelCase(s)
              const kebab = kebabCase(s)
              const start = startCase(s)
              const padded = padStart('42', 5, '0')
              const truncated = truncate(s, { length: 12 })
              setTextTransform({ camel, kebab, start, padded, truncated })
            }}>运行示例</Button>
            {renderInfo(
              ['camelCase', 'kebabCase', 'startCase', 'padStart', 'truncate'],
              ['统一大小写与分隔符', '截断与填充用于展示与编号'],
              "const camel=camelCase(s); const kebab=kebabCase(s); const start=startCase(s); const padded=padStart('42',5,'0'); const truncated=truncate(s,{length:12})",
              codeTextTransform
            )}
            <Space wrap>
              {textTransform ? (
                <>
                  <Tag color="blue">{textTransform.camel}</Tag>
                  <Tag color="gold">{textTransform.kebab}</Tag>
                  <Tag color="cyan">{textTransform.start}</Tag>
                  <Tag color="purple">{textTransform.padded}</Tag>
                  <Tag color="magenta">{textTransform.truncated}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="集合扩展：difference/xor/uniqBy" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const a1 = ['alice', 'bob', 'charlie']
              const a2 = ['bob', 'david', 'eva']
              const diffRes = difference(a1, a2)
              const xorRes = xor(a1, a2)
              const withDup = [{ name: 'alice' }, { name: 'bob' }, { name: 'alice' }]
              const uniq = uniqBy(withDup, (x) => x.name)
              setCollectionOps({ diff: diffRes, xor: xorRes, uniqCount: uniq.length })
            }}>运行示例</Button>
            {renderInfo(
              ['difference', 'xor', 'uniqBy'],
              ['集合运算用于差异对比', 'uniqBy 对对象集合去重'],
              "difference(a1,a2); xor(a1,a2); uniqBy(list,x=>x.name)",
              codeCollectionOps
            )}
            <Space wrap>
              {collectionOps ? (
                <>
                  <Tag color="volcano">差集: {collectionOps.diff.join(', ') || '无'}</Tag>
                  <Tag color="geekblue">对称差: {collectionOps.xor.join(', ') || '无'}</Tag>
                  <Tag color="green">去重后数量: {collectionOps.uniqCount}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="去重对比：uniq/uniqBy/uniqWith" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const prims = chain([1,1,2,3,3,4]).uniq().value().length
              const objs = uniqBy([{id:1},{id:2},{id:1},{id:3}], 'id').length
              const deep = uniqWith([{a:{x:1}}, {a:{x:1}}, {a:{x:2}}], isEqual).length
              setUniqCompareResult({ prims, objs, deep })
            }}>运行示例</Button>
            {renderInfo(
              ['uniq(原始值)', 'uniqBy(对象按键)', 'uniqWith(深比较)'],
              ['不同数据形态选择不同方法', '深比较成本较高仅在必要时使用'],
              "uniq([1,1,2]); uniqBy(list,'id'); uniqWith(list,isEqual)",
              codeUniqCompare
            )}
            <Space wrap>
              {uniqCompareResult ? (
                <>
                  <Tag color="blue">prims 去重后: {uniqCompareResult.prims}</Tag>
                  <Tag color="geekblue">objs 去重后: {uniqCompareResult.objs}</Tag>
                  <Tag color="purple">deep 去重后: {uniqCompareResult.deep}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="去重性能对比：原始值/对象/深比较" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const N = 5000
              const primsList = Array.from({ length: N }, (_, i) => i % 100)
              const objsList = Array.from({ length: N }, (_, i) => ({ id: i % 100, v: i }))
              const deepList = Array.from({ length: N }, (_, i) => ({ a: { x: i % 100 } }))
              const t1 = performance.now()
              const primsRes = chain(primsList).uniq().value().length
              const t2 = performance.now()
              const objsRes = uniqBy(objsList, 'id').length
              const t3 = performance.now()
              const deepRes = uniqWith(deepList, isEqual).length
              const t4 = performance.now()
              setUniqPerfResult({
                prims: { count: primsRes, ms: Number((t2 - t1).toFixed(1)) },
                objs: { count: objsRes, ms: Number((t3 - t2).toFixed(1)) },
                deep: { count: deepRes, ms: Number((t4 - t3).toFixed(1)) },
              })
            }}>运行示例</Button>
            {renderInfo(
              ['uniq(原始值)', 'uniqBy(对象按键)', 'uniqWith(深比较)'],
              ['深比较通常最慢', '对象按键次之，原始值最快'],
              "测量性能.now() 统计三种去重耗时",
              codeUniqPerf
            )}
            <Space wrap>
              {uniqPerfResult ? (
                <>
                  <Tag color="blue">prims: {uniqPerfResult.prims.count} 项 | {uniqPerfResult.prims.ms}ms</Tag>
                  <Tag color="geekblue">objs: {uniqPerfResult.objs.count} 项 | {uniqPerfResult.objs.ms}ms</Tag>
                  <Tag color="purple">deep: {uniqPerfResult.deep.count} 项 | {uniqPerfResult.deep.ms}ms</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>
        <Card title="对象集合运算：differenceBy/intersectionBy/uniqWith" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button type="primary" onClick={() => {
                const l1 = [{ id: 1, name: 'alice' }, { id: 2, name: 'bob' }, { id: 3, name: 'charlie' }]
                const l2 = [{ id: 2, name: 'bob' }, { id: 4, name: 'david' }]
                const diffByName = differenceBy(l1, l2, 'name').map(x => x.name)
                const intersectByName = intersectionBy(l1, l2, 'name').map(x => x.name)
                setObjSetOpsResult({ diffBy: diffByName, intersectBy: intersectByName })
              }}>运行 differenceBy/intersectionBy</Button>
              <Button onClick={() => {
                const list = [{ a: 1, b: { x: 1 } }, { a: 1, b: { x: 1 } }, { a: 2, b: { x: 1 } }]
                const unique = uniqWith(list, isEqual)
                setUniqWithResult({ before: list.length, after: unique.length })
              }}>运行 uniqWith 去重</Button>
            </Space>
            {renderInfo(
              ['differenceBy(按字段差集)', 'intersectionBy(按字段交集)', 'uniqWith(按比较器去重)'],
              ['适合对象集合的差异与去重', 'isEqual 进行深比较'],
              "differenceBy(list1,list2,'name'); intersectionBy(list1,list2,'name'); uniqWith(list,isEqual)",
              codeDifferenceIntersectionBy + '\\n\\n' + codeUniqWith
            )}
            <Space wrap>
              {objSetOpsResult ? (
                <>
                  <Tag color="volcano">差集: {objSetOpsResult.diffBy.join(', ') || '无'}</Tag>
                  <Tag color="geekblue">交集: {objSetOpsResult.intersectBy.join(', ') || '无'}</Tag>
                </>
              ) : <Tag color="default">暂无差/交结果</Tag>}
              {uniqWithResult ? (
                <Tag color="green">uniqWith: {uniqWithResult.before} → {uniqWithResult.after}</Tag>
              ) : <Tag color="default">暂无去重结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="选择剔除实践：pick/omit 模式" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const u = { id: 1, name: 'Alice', role: 'admin', age: 28, active: true, token: 'secret' }
              const afterPick = Object.keys(pick(u, ['id', 'name', 'role', 'active']))
              const afterOmit = Object.keys(omit(u, ['token', 'age']))
              setPickOmitPatternsResult({ afterPick, afterOmit })
            }}>运行示例</Button>
            {renderInfo(
              ['pick(先挑核心字段)', 'omit(剔除敏感/不必要字段)'],
              ['挑选靠前减少对象负担', '剔除尽量早进行降低传递成本'],
              "Object.keys(pick(u,['id','name','role','active'])); Object.keys(omit(u,['token','age']))",
              codePickOmitPatterns
            )}
            <Space wrap>
              {pickOmitPatternsResult ? (
                <>
                  <Tag color="green">pick 后字段: {pickOmitPatternsResult.afterPick.join(', ')}</Tag>
                  <Tag color="volcano">omit 后字段: {pickOmitPatternsResult.afterOmit.join(', ')}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="深层键构建：zipObjectDeep" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const keys = ['a.b[0].c', 'a.b[1].c']
              const values = [1, 2]
              const obj = zipObjectDeep(keys, values)
              setDeepZipResult(obj)
            }}>运行示例</Button>
            {renderInfo(
              ['zipObjectDeep(深层键构建)'],
              ['可一次性创建深层嵌套结构'],
              "zipObjectDeep(['a.b[0].c','a.b[1].c'],[1,2])",
              codeZipObjectDeep
            )}
            <Space wrap>
              {deepZipResult ? (
                <Tag color="purple">{JSON.stringify(deepZipResult)}</Tag>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="深层更新：zipObjectDeep + set/get" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const keys = ['cfg.ui.theme', 'cfg.ui.locale.lang']
              const values = ['light', 'en']
              const obj = zipObjectDeep(keys, values)
              set(obj, 'cfg.ui.theme', 'dark')
              const lang = get(obj, 'cfg.ui.locale.lang')
              setDeepUpdateResult({ obj, lang })
            }}>运行示例</Button>
            {renderInfo(
              ['zipObjectDeep(初始化深层结构)', 'set(更新深层属性)', 'get(读取深层属性)'],
              ['适合配置对象初始化与更新'],
              "const obj=zipObjectDeep(keys,values); set(obj,'cfg.ui.theme','dark'); get(obj,'cfg.ui.locale.lang')",
              codeDeepUpdate
            )}
            <Space wrap>
              {deepUpdateResult ? (
                <>
                  <Tag color="cyan">lang: {String(deepUpdateResult.lang)}</Tag>
                  <Tag color="geekblue">{JSON.stringify(deepUpdateResult.obj)}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="统计与极值：countBy/maxBy/minBy" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const totals = users.map((u) => ({ name: u.name, total: sumBy(u.orders, 'amount') }))
              const maxItem = maxBy(totals, 'total')
              const minItem = minBy(totals, 'total')
              const roleCounts = countBy(users, 'role')
              setStatsExtremes({
                maxName: maxItem?.name || '', maxTotal: Number((maxItem?.total || 0).toFixed(2)),
                minName: minItem?.name || '', minTotal: Number((minItem?.total || 0).toFixed(2)),
                roleCounts
              })
            }}>运行示例</Button>
            {renderInfo(
              ['map(订单合计)', 'maxBy', 'minBy', 'countBy(role)'],
              ['快速找到极值与分类统计'],
              "maxBy(totals,'total'); minBy(totals,'total'); countBy(users,'role')",
              codeStatsExtremes
            )}
            <Space wrap>
              {statsExtremes ? (
                <>
                  <Tag color="gold">最大: {statsExtremes.maxName} ¥{statsExtremes.maxTotal}</Tag>
                  <Tag color="purple">最小: {statsExtremes.minName} ¥{statsExtremes.minTotal}</Tag>
                  {Object.entries(statsExtremes.roleCounts).map(([k,v]) => <Tag key={`rc-${k}`}>{k}:{v}</Tag>)}
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="数值与范围：clamp/inRange" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const c = clamp(15, 0, 10)
              const a = inRange(3, 0, 5)
              const b = inRange(7, 0, 5)
              setClampRangeResult({ clamp: c, inRangeA: a, inRangeB: b })
            }}>运行示例</Button>
            {renderInfo(
              ['clamp(限制范围)', 'inRange(是否在范围内)'],
              ['限制数值上下限', '校验数值是否落在区间'],
              "clamp(15,0,10); inRange(3,0,5)",
              codeClampInRange
            )}
            <Space wrap>
              {clampRangeResult ? (
                <>
                  <Tag color="magenta">clamp: {clampRangeResult.clamp}</Tag>
                  <Tag color="green">inRange(3,0,5): {String(clampRangeResult.inRangeA)}</Tag>
                  <Tag color="volcano">inRange(7,0,5): {String(clampRangeResult.inRangeB)}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="对象操作：mapValues/defaultsDeep" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const obj = { a: 1, b: 2, c: 3 }
              const mapped = mapValues(obj, (v) => v * 10)
              const def = { ui: { theme: 'light', lang: 'en' } }
              const cur = { ui: { lang: 'zh-CN' } }
              const withDefaults = defaultsDeep(cur, def)
              setObjectOps({ mapped, withDefaults })
            }}>运行示例</Button>
            {renderInfo(
              ['mapValues(对象值映射)', 'defaultsDeep(嵌套默认值)'],
              ['适合配置处理与对象批量变换'],
              "mapValues(obj,v=>v*10); defaultsDeep(cur,def)",
              codeObjectOps
            )}
            <Space wrap>
              {objectOps ? (
                <>
                  {Object.entries(objectOps.mapped).map(([k,v]) => <Tag key={`mv-${k}`}>{k}:{v}</Tag>)}
                  <Tag color="cyan">主题 {objectOps.withDefaults.ui.theme}</Tag>
                  <Tag color="geekblue">语言 {objectOps.withDefaults.ui.lang}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="键变换：mapKeys" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const obj = { a: 1, b: 2, c: 3 }
              const mapped = mapKeys(obj, (v, k) => 'key_' + k.toUpperCase())
              setMapKeysResult(mapped as Record<string, number>)
            }}>运行示例</Button>
            {renderInfo(
              ['mapKeys(按规则转换键名)'],
              ['用于统一键名风格或添加前缀'],
              "mapKeys(obj,(v,k)=>'key_'+k.toUpperCase())",
              codeMapKeys
            )}
            <Space wrap>
              {mapKeysResult ? (
                Object.entries(mapKeysResult).map(([k,v]) => <Tag key={`mk-${k}`}>{k}:{String(v)}</Tag>)
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="序列生成：range/times" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runRangeTimes}>运行示例</Button>
            {renderInfo(
              ['range(起止生成序列)', 'times(重复计算)'],
              ['快速生成测试数据与序列', '避免手写循环'],
              "const seq=range(1,11); const squares=times(5,i=>(i+1)*(i+1))",
              codeRangeTimes
            )}
            <Space wrap>
              {rangeTimesResult.length ? rangeTimesResult.map((n, i) => <Tag key={`rt-${i}`}>{n}</Tag>) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="数组组合：zip/unzip" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runZipUnzip}>运行示例</Button>
            {renderInfo(
              ['zip(组合为元组)', 'unzip(还原分组)'],
              ['适合将并行数组组合为对', '还原时保留顺序'],
              "const zipped=zip(names,ages); const unzipped=unzip(zipped)",
              codeZipUnzip
            )}
            <Space wrap>
              {zipUnzipResult ? (
                <>
                  {zipUnzipResult.zipped.map((z, i) => <Tag key={`z-${i}`}>{z[0]}:{z[1]}</Tag>)}
                  <Tag color="green">names: {zipUnzipResult.unzipped[0].join(', ')}</Tag>
                  <Tag color="blue">ages: {zipUnzipResult.unzipped[1].join(', ')}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="随机抽样与乱序：sample/shuffle" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runSampleShuffle}>运行示例</Button>
            {renderInfo(
              ['sample(随机抽一个)', 'shuffle(打乱顺序)'],
              ['构造随机示意数据', '避免手写随机算法'],
              "const s=sample(list); const sh=shuffle(list)",
              codeSampleShuffle
            )}
            <Space wrap>
              {randomResult ? (
                <>
                  <Tag color="gold">sample: {String(randomResult.sample)}</Tag>
                  {randomResult.shuffled.map((v, i) => <Tag key={`sh-${i}`}>{String(v)}</Tag>)}
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="随机增强：sampleSize" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const list = ['a', 'b', 'c', 'd', 'e', 1, 2, 3]
              const res = sampleSize(list, 4)
              setSampleSizeResult(res)
            }}>运行示例</Button>
            {renderInfo(
              ['sampleSize(随机抽N个)'],
              ['用于从集合中随机抽取多个样本'],
              "sampleSize(list,4)",
              codeSampleSize
            )}
            <Space wrap>
              {sampleSizeResult.length ? sampleSizeResult.map((v, i) => <Tag key={`ss-${i}`}>{String(v)}</Tag>) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="分组与排名：groupBy + orderBy" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={runGroupRank}>运行示例</Button>
            {renderInfo(
              ['groupBy(role)', 'map(角色总额)', 'orderBy(total desc)'],
              ['按分组统计后排序得到排名', '适合排行榜等场景'],
              "const grouped=groupBy(users,'role'); const totals=Object.entries(grouped).map(([role,arr])=>({role,total:sumBy(arr,u=>sumBy(u.orders,'amount'))})); orderBy(totals,['total'],['desc'])",
              codeGroupRank
            )}
            <Space wrap>
              {groupRankResult.length ? groupRankResult.map((r) => <Tag key={`gr-${r.role}`}>{r.role}:{r.total}</Tag>) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="函数工具：flow/curry/partial/memoize/once" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const add = (a: number, b: number) => a + b
              const square = (n: number) => n * n
              const double = (n: number) => n * 2
              const pipeline = flow([(n: number) => n + 1, double, square])
              const resultFlow = pipeline(3)
              const add3 = (a: number, b: number, c: number) => a + b + c
              const curried = curry(add3)
              const resultCurry = curried(1)(2)(3)
              const greet = (g: string, name: string) => g + ', ' + name
              const hiAlice = partial(greet, 'Hi')
              const resultPartial = hiAlice('Alice')
              let called = 0
              const expensive = memoize((x: number) => { called++; return x * 10 })
              const onceFn = once(() => 'ONCE')
              const memoVal = expensive(2) + expensive(2)
              const onceVal = onceFn() + '|' + onceFn()
              setFunctionTools({ flow: resultFlow, curry: resultCurry, partial: resultPartial, memoCalled: called, onceVal })
            }}>运行示例</Button>
            {renderInfo(
              ['flow(组合函数)', 'curry(柯里化)', 'partial(部分应用)', 'memoize(记忆)', 'once(只执行一次)'],
              ['适合构建可复用的计算管道', '对性能敏感的函数可记忆或限制执行次数'],
              "flow([f1,f2]); curry(fn)(a)(b); partial(fn,arg); memoize(fn); once(fn)",
              codeFunctionTools
            )}
            <Space wrap>
              {functionTools ? (
                <>
                  <Tag color="blue">flow: {functionTools.flow}</Tag>
                  <Tag color="green">curry: {functionTools.curry}</Tag>
                  <Tag color="magenta">partial: {functionTools.partial}</Tag>
                  <Tag color="volcano">memo calls: {functionTools.memoCalled}</Tag>
                  <Tag color="purple">once: {functionTools.onceVal}</Tag>
                </>
              ) : <Tag color="default">暂无结果</Tag>}
            </Space>
          </Space>
        </Card>

        <Card title="函数组合（反向）：flowRight" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => {
              const inc = (n: number) => n + 1
              const double = (n: number) => n * 2
              const square = (n: number) => n * n
              const pipeline = flowRight([square, double, inc])
              const result = pipeline(3)
              setFlowRightResult(result)
            }}>运行示例</Button>
            {renderInfo(
              ['flowRight([square, double, inc])'],
              ['从右到左组合函数，等价 compose'],
              "const pipeline=flowRight([square,double,inc]); pipeline(3)",
              codeFlowRight
            )}
            <Space wrap>
              {flowRightResult !== null ? <Tag color="blue">结果 {flowRightResult}</Tag> : <Tag color="default">暂无结果</Tag>}
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
