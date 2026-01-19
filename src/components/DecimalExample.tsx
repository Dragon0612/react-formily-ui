/**
 * Decimal.js 学习示例
 * 展示精确计算库 decimal.js 的用法
 */

import { useState } from 'react'
import Decimal from 'decimal.js'
import { Card, Typography, Space, Button, Input, Tag, Divider, Alert, InputNumber } from 'antd'

const { Title, Paragraph, Text } = Typography

// ========== 示例 1: 基本运算 - 解决浮点数精度问题 ==========
const BasicOperationExample = () => {
  const [result1, setResult1] = useState('')
  const [result2, setResult2] = useState('')

  const testPrecision = () => {
    // ❌ JavaScript 原生计算（有精度问题）
    const nativeResult = 0.1 + 0.2
    setResult1(`原生计算: 0.1 + 0.2 = ${nativeResult}`)

    // ✅ Decimal.js 计算（精确）
    const decimalResult = new Decimal(0.1).add(0.2)
    setResult2(`Decimal.js: 0.1 + 0.2 = ${decimalResult.toString()}`)
  }

  return (
    <Card title="示例 1: 基本运算 - 解决浮点数精度问题" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="问题说明"
          description="JavaScript 的浮点数运算存在精度问题，例如 0.1 + 0.2 不等于 0.3。Decimal.js 可以解决这个问题。"
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <Button onClick={testPrecision}>测试精度问题</Button>

        {result1 && (
          <div>
            <Text type="danger">{result1}</Text>
          </div>
        )}

        {result2 && (
          <div>
            <Text type="success">{result2}</Text>
          </div>
        )}

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>更多示例：</Text>
          <div style={{ marginTop: 8, fontFamily: 'monospace', fontSize: 12 }}>
            <div>0.1 + 0.2 = {new Decimal(0.1).add(0.2).toString()}</div>
            <div>0.3 - 0.1 = {new Decimal(0.3).sub(0.1).toString()}</div>
            <div>0.2 × 3 = {new Decimal(0.2).mul(3).toString()}</div>
            <div>0.3 ÷ 0.1 = {new Decimal(0.3).div(0.1).toString()}</div>
          </div>
        </div>
      </Space>
    </Card>
  )
}

// ========== 示例 2: 四舍五入 ==========
const RoundingExample = () => {
  const [value, setValue] = useState(3.14159)
  const [precision, setPrecision] = useState(2)

  const roundResults = {
    ROUND_UP: new Decimal(value).toFixed(precision, Decimal.ROUND_UP),
    ROUND_DOWN: new Decimal(value).toFixed(precision, Decimal.ROUND_DOWN),
    ROUND_CEIL: new Decimal(value).toFixed(precision, Decimal.ROUND_CEIL),
    ROUND_FLOOR: new Decimal(value).toFixed(precision, Decimal.ROUND_FLOOR),
    ROUND_HALF_UP: new Decimal(value).toFixed(precision, Decimal.ROUND_HALF_UP),
    ROUND_HALF_DOWN: new Decimal(value).toFixed(precision, Decimal.ROUND_HALF_DOWN),
    ROUND_HALF_EVEN: new Decimal(value).toFixed(precision, Decimal.ROUND_HALF_EVEN),
  }

  return (
    <Card title="示例 2: 四舍五入" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>数值：</Text>
          <InputNumber
            value={value}
            onChange={(val) => setValue(val || 0)}
            step={0.01}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text strong>保留小数位数：</Text>
          <InputNumber
            value={precision}
            onChange={(val) => setPrecision(val || 2)}
            min={0}
            max={10}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>四舍五入方式：</Text>
          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
            <div>
              <Tag color="blue">ROUND_UP（向上取整）</Tag>
              <Text style={{ marginLeft: 8 }}>{roundResults.ROUND_UP}</Text>
            </div>
            <div>
              <Tag color="green">ROUND_DOWN（向下取整）</Tag>
              <Text style={{ marginLeft: 8 }}>{roundResults.ROUND_DOWN}</Text>
            </div>
            <div>
              <Tag color="orange">ROUND_CEIL（向正无穷取整）</Tag>
              <Text style={{ marginLeft: 8 }}>{roundResults.ROUND_CEIL}</Text>
            </div>
            <div>
              <Tag color="purple">ROUND_FLOOR（向负无穷取整）</Tag>
              <Text style={{ marginLeft: 8 }}>{roundResults.ROUND_FLOOR}</Text>
            </div>
            <div>
              <Tag color="red">ROUND_HALF_UP（四舍五入）</Tag>
              <Text style={{ marginLeft: 8 }}>{roundResults.ROUND_HALF_UP}</Text>
            </div>
            <div>
              <Tag color="cyan">ROUND_HALF_DOWN（五舍六入）</Tag>
              <Text style={{ marginLeft: 8 }}>{roundResults.ROUND_HALF_DOWN}</Text>
            </div>
            <div>
              <Tag color="magenta">ROUND_HALF_EVEN（银行家舍入）</Tag>
              <Text style={{ marginLeft: 8 }}>{roundResults.ROUND_HALF_EVEN}</Text>
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

// ========== 示例 3: 价格计算 ==========
const PriceCalculationExample = () => {
  const [price, setPrice] = useState(19.99)
  const [quantity, setQuantity] = useState(3)
  const [discount, setDiscount] = useState(15)
  const [tax, setTax] = useState(7.5)

  const calculate = () => {
    const p = new Decimal(price)
    const q = new Decimal(quantity)
    const d = new Decimal(discount).div(100) // 折扣百分比转小数
    const t = new Decimal(tax).div(100) // 税率百分比转小数

    const subtotal = p.times(q)
    const discountAmount = subtotal.times(d)
    const afterDiscount = subtotal.minus(discountAmount)
    const taxAmount = afterDiscount.times(t)
    const total = afterDiscount.plus(taxAmount)

    return {
      subtotal: subtotal.toFixed(2),
      discount: discountAmount.toFixed(2),
      afterDiscount: afterDiscount.toFixed(2),
      tax: taxAmount.toFixed(2),
      total: total.toFixed(2),
    }
  }

  const result = calculate()

  return (
    <Card title="示例 3: 价格计算（商品总价、折扣、税费）" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="实际应用"
          description="在电商、财务系统中，价格计算必须精确。使用 Decimal.js 可以避免浮点数精度问题。"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <div>
          <Text strong>单价：</Text>
          <InputNumber
            value={price}
            onChange={(val) => setPrice(val || 0)}
            prefix="¥"
            step={0.01}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text strong>数量：</Text>
          <InputNumber
            value={quantity}
            onChange={(val) => setQuantity(val || 0)}
            min={1}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text strong>折扣：</Text>
          <InputNumber
            value={discount}
            onChange={(val) => setDiscount(val || 0)}
            suffix="%"
            min={0}
            max={100}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text strong>税率：</Text>
          <InputNumber
            value={tax}
            onChange={(val) => setTax(val || 0)}
            suffix="%"
            min={0}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>计算结果：</Text>
          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
            <div>
              <Text>小计：</Text>
              <Tag color="blue" style={{ fontSize: 16, marginLeft: 8 }}>
                ¥{result.subtotal}
              </Tag>
            </div>
            <div>
              <Text>折扣金额：</Text>
              <Tag color="green" style={{ fontSize: 16, marginLeft: 8 }}>
                -¥{result.discount}
              </Tag>
            </div>
            <div>
              <Text>折扣后：</Text>
              <Tag color="orange" style={{ fontSize: 16, marginLeft: 8 }}>
                ¥{result.afterDiscount}
              </Tag>
            </div>
            <div>
              <Text>税费：</Text>
              <Tag color="purple" style={{ fontSize: 16, marginLeft: 8 }}>
                +¥{result.tax}
              </Tag>
            </div>
            <div>
              <Text strong>总计：</Text>
              <Tag color="red" style={{ fontSize: 18, marginLeft: 8 }}>
                ¥{result.total}
              </Tag>
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

// ========== 示例 4: 百分比计算 ==========
const PercentageExample = () => {
  const [value, setValue] = useState(100)
  const [percentage, setPercentage] = useState(15.5)

  const calculate = () => {
    const v = new Decimal(value)
    const p = new Decimal(percentage)

    // 计算百分比值
    const percentageValue = v.times(p).div(100)

    // 计算百分比后的值
    const afterPercentage = v.plus(percentageValue)

    // 计算减少百分比后的值
    const minusPercentage = v.minus(percentageValue)

    return {
      percentageValue: percentageValue.toFixed(2),
      afterPercentage: afterPercentage.toFixed(2),
      minusPercentage: minusPercentage.toFixed(2),
    }
  }

  const result = calculate()

  return (
    <Card title="示例 4: 百分比计算" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>数值：</Text>
          <InputNumber
            value={value}
            onChange={(val) => setValue(val || 0)}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text strong>百分比：</Text>
          <InputNumber
            value={percentage}
            onChange={(val) => setPercentage(val || 0)}
            suffix="%"
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>计算结果：</Text>
          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
            <div>
              <Text>{percentage}% 的值：</Text>
              <Tag color="blue" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.percentageValue}
              </Tag>
            </div>
            <div>
              <Text>增加 {percentage}% 后：</Text>
              <Tag color="green" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.afterPercentage}
              </Tag>
            </div>
            <div>
              <Text>减少 {percentage}% 后：</Text>
              <Tag color="red" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.minusPercentage}
              </Tag>
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

// ========== 示例 5: 比较运算 ==========
const ComparisonExample = () => {
  const [a, setA] = useState(0.1)
  const [b, setB] = useState(0.2)

  const compare = () => {
    const decimalA = new Decimal(a)
    const decimalB = new Decimal(b)

    return {
      equals: decimalA.equals(decimalB),
      greaterThan: decimalA.greaterThan(decimalB),
      lessThan: decimalA.lessThan(decimalB),
      greaterThanOrEqualTo: decimalA.greaterThanOrEqualTo(decimalB),
      lessThanOrEqualTo: decimalA.lessThanOrEqualTo(decimalB),
      sum: decimalA.add(decimalB).toString(),
      nativeSum: (a + b).toString(),
    }
  }

  const result = compare()

  return (
    <Card title="示例 5: 比较运算" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>数值 A：</Text>
          <InputNumber
            value={a}
            onChange={(val) => setA(val || 0)}
            step={0.1}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text strong>数值 B：</Text>
          <InputNumber
            value={b}
            onChange={(val) => setB(val || 0)}
            step={0.1}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>比较结果：</Text>
          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
            <div>
              <Text>A === B：</Text>
              <Tag color={result.equals ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {String(result.equals)}
              </Tag>
            </div>
            <div>
              <Text>A &gt; B：</Text>
              <Tag color={result.greaterThan ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {String(result.greaterThan)}
              </Tag>
            </div>
            <div>
              <Text>A &lt; B：</Text>
              <Tag color={result.lessThan ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {String(result.lessThan)}
              </Tag>
            </div>
            <div>
              <Text>A &gt;= B：</Text>
              <Tag color={result.greaterThanOrEqualTo ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {String(result.greaterThanOrEqualTo)}
              </Tag>
            </div>
            <div>
              <Text>A &lt;= B：</Text>
              <Tag color={result.lessThanOrEqualTo ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                {String(result.lessThanOrEqualTo)}
              </Tag>
            </div>
          </Space>
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>A + B：</Text>
          <div style={{ marginTop: 8 }}>
            <div>
              <Text type="danger">原生计算：</Text>
              <Tag color="red" style={{ marginLeft: 8 }}>{result.nativeSum}</Tag>
            </div>
            <div>
              <Text type="success">Decimal.js：</Text>
              <Tag color="green" style={{ marginLeft: 8 }}>{result.sum}</Tag>
            </div>
          </div>
        </div>
      </Space>
    </Card>
  )
}

// ========== 示例 6: 高级运算 ==========
const AdvancedOperationExample = () => {
  const [base, setBase] = useState(2)
  const [exponent, setExponent] = useState(10)
  const [number, setNumber] = useState(100)

  const calculate = () => {
    const b = new Decimal(base)
    const e = new Decimal(exponent)
    const n = new Decimal(number)

    return {
      power: b.pow(e).toString(),
      sqrt: n.sqrt().toString(),
      abs: new Decimal(-n).abs().toString(),
      ceil: n.ceil().toString(),
      floor: n.floor().toString(),
      round: n.round().toString(),
    }
  }

  const result = calculate()

  return (
    <Card title="示例 6: 高级运算（幂运算、开方、取整等）" type="inner">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text strong>底数：</Text>
          <InputNumber
            value={base}
            onChange={(val) => setBase(val || 2)}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text strong>指数：</Text>
          <InputNumber
            value={exponent}
            onChange={(val) => setExponent(val || 10)}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <div>
          <Text strong>数值：</Text>
          <InputNumber
            value={number}
            onChange={(val) => setNumber(val || 100)}
            style={{ width: 200, marginLeft: 8 }}
          />
        </div>

        <Divider style={{ margin: '12px 0' }} />

        <div>
          <Text strong>计算结果：</Text>
          <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
            <div>
              <Text>{base} 的 {exponent} 次方：</Text>
              <Tag color="blue" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.power}
              </Tag>
            </div>
            <div>
              <Text>√{number}（开平方）：</Text>
              <Tag color="green" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.sqrt}
              </Tag>
            </div>
            <div>
              <Text>|-{number}|（绝对值）：</Text>
              <Tag color="orange" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.abs}
              </Tag>
            </div>
            <div>
              <Text>向上取整：</Text>
              <Tag color="purple" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.ceil}
              </Tag>
            </div>
            <div>
              <Text>向下取整：</Text>
              <Tag color="cyan" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.floor}
              </Tag>
            </div>
            <div>
              <Text>四舍五入：</Text>
              <Tag color="red" style={{ fontSize: 16, marginLeft: 8 }}>
                {result.round}
              </Tag>
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  )
}

// ========== 主组件 ==========
const DecimalExample = () => {
  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          Decimal.js 学习示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          Decimal.js 是一个任意精度的十进制运算库，可以解决 JavaScript 浮点数精度问题。
          适用于金融、电商、科学计算等需要精确计算的场景。
        </Paragraph>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <BasicOperationExample />
        <RoundingExample />
        <PriceCalculationExample />
        <PercentageExample />
        <ComparisonExample />
        <AdvancedOperationExample />

        {/* Decimal.js 总结 */}
        <Card title="Decimal.js 总结" type="inner">
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <div>
              <Text strong>主要特点：</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>解决 JavaScript 浮点数精度问题（如 0.1 + 0.2 !== 0.3）</Text>
              </li>
              <li>
                <Text>支持任意精度的十进制运算</Text>
              </li>
              <li>
                <Text>提供多种四舍五入方式</Text>
              </li>
              <li>
                <Text>支持基本运算（加减乘除）和高级运算（幂、开方、对数等）</Text>
              </li>
              <li>
                <Text>完全使用 TypeScript 编写，类型安全</Text>
              </li>
            </ul>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>常用 API：</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text strong>基本运算：</Text>
                <Text> add()、sub()、mul()、div()</Text>
              </li>
              <li>
                <Text strong>比较运算：</Text>
                <Text> equals()、greaterThan()、lessThan()</Text>
              </li>
              <li>
                <Text strong>格式化：</Text>
                <Text> toFixed()、toString()、toNumber()</Text>
              </li>
              <li>
                <Text strong>高级运算：</Text>
                <Text> pow()、sqrt()、abs()、ceil()、floor()、round()</Text>
              </li>
            </ul>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>适用场景：</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>金融系统（价格、利息、税费计算）</Text>
              </li>
              <li>
                <Text>电商系统（商品价格、折扣、优惠券计算）</Text>
              </li>
              <li>
                <Text>科学计算（需要高精度的数学运算）</Text>
              </li>
              <li>
                <Text>数据分析（百分比、统计计算）</Text>
              </li>
            </ul>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default DecimalExample
