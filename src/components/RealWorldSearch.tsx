/**
 * Formily 实战案例：高级搜索表单
 * 
 * 综合应用示例，包含：
 * 1. 搜索表单的最佳实践
 * 2. 展开/收起功能
 * 3. 快速重置和搜索
 * 4. 搜索结果展示
 * 5. 表单状态持久化
 */

import { createForm } from '@formily/core'
import { createSchemaField, FormConsumer } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  DatePicker,
  NumberPicker,
  FormGrid,
  FormCollapse,
  Submit,
  Reset,
} from '@formily/antd-v5'
import { Typography, Card, Alert, Space, Table, Tag, Button, Divider } from 'antd'
import { SearchOutlined, ReloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { ColumnsType } from 'antd/es/table'

const { Title, Paragraph, Text } = Typography

// 模拟搜索结果数据类型
interface SearchResult {
  key: string
  orderNo: string
  productName: string
  customer: string
  status: string
  amount: number
  createTime: string
}

// 模拟 API：搜索订单
const searchOrders = (params: Record<string, unknown>): Promise<SearchResult[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('搜索参数：', params)
      
      // 模拟搜索结果
      const mockData: SearchResult[] = [
        {
          key: '1',
          orderNo: 'ORD20240101001',
          productName: 'MacBook Pro 14"',
          customer: '张三',
          status: 'completed',
          amount: 14999,
          createTime: '2024-01-01 10:30:00',
        },
        {
          key: '2',
          orderNo: 'ORD20240101002',
          productName: 'iPhone 15 Pro',
          customer: '李四',
          status: 'pending',
          amount: 7999,
          createTime: '2024-01-01 11:20:00',
        },
        {
          key: '3',
          orderNo: 'ORD20240102001',
          productName: 'AirPods Pro',
          customer: '王五',
          status: 'completed',
          amount: 1999,
          createTime: '2024-01-02 09:15:00',
        },
        {
          key: '4',
          orderNo: 'ORD20240102002',
          productName: 'iPad Air',
          customer: '赵六',
          status: 'cancelled',
          amount: 4999,
          createTime: '2024-01-02 14:45:00',
        },
        {
          key: '5',
          orderNo: 'ORD20240103001',
          productName: 'Apple Watch',
          customer: '孙七',
          status: 'shipping',
          amount: 2999,
          createTime: '2024-01-03 16:20:00',
        },
      ]
      
      resolve(mockData)
    }, 800)
  })
}

// 创建表单实例
const form = createForm({
  // 从 localStorage 恢复表单状态
  initialValues: (() => {
    try {
      const saved = localStorage.getItem('searchFormState')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })(),
})

// 创建 SchemaField
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    DatePicker,
    NumberPicker,
    FormGrid,
    FormCollapse,
  },
})

// 表单 Schema
const schema = {
  type: 'object',
  properties: {
    // 基础搜索条件（常用，默认显示）
    basicSearch: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 3,
        minColumns: 1,
      },
      properties: {
        orderNo: {
          type: 'string',
          title: '订单号',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入订单号',
            allowClear: true,
          },
        },
        productName: {
          type: 'string',
          title: '商品名称',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入商品名称',
            allowClear: true,
          },
        },
        status: {
          type: 'string',
          title: '订单状态',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择订单状态',
            allowClear: true,
          },
          enum: [
            { label: '待支付', value: 'pending' },
            { label: '已完成', value: 'completed' },
            { label: '配送中', value: 'shipping' },
            { label: '已取消', value: 'cancelled' },
            { label: '已退款', value: 'refunded' },
          ],
        },
      },
    },
    
    // 高级搜索条件（可展开/收起）
    advancedSearch: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 3,
        minColumns: 1,
      },
      properties: {
        customer: {
          type: 'string',
          title: '客户姓名',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入客户姓名',
            allowClear: true,
          },
        },
        minAmount: {
          type: 'number',
          title: '最小金额',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-component-props': {
            placeholder: '最小金额',
            min: 0,
            precision: 2,
            style: { width: '100%' },
          },
        },
        maxAmount: {
          type: 'number',
          title: '最大金额',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-component-props': {
            placeholder: '最大金额',
            min: 0,
            precision: 2,
            style: { width: '100%' },
          },
        },
        startDate: {
          type: 'string',
          title: '开始日期',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: '请选择开始日期',
            style: { width: '100%' },
          },
        },
        endDate: {
          type: 'string',
          title: '结束日期',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: '请选择结束日期',
            style: { width: '100%' },
          },
        },
        paymentMethod: {
          type: 'string',
          title: '支付方式',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择支付方式',
            allowClear: true,
          },
          enum: [
            { label: '微信支付', value: 'wechat' },
            { label: '支付宝', value: 'alipay' },
            { label: '银行卡', value: 'bank' },
            { label: '现金', value: 'cash' },
          ],
        },
      },
    },
  },
}

// 表格列定义
const columns: ColumnsType<SearchResult> = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    width: 150,
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    key: 'productName',
  },
  {
    title: '客户',
    dataIndex: 'customer',
    key: 'customer',
    width: 100,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (status: string) => {
      const statusMap = {
        pending: { color: 'orange', text: '待支付' },
        completed: { color: 'green', text: '已完成' },
        shipping: { color: 'blue', text: '配送中' },
        cancelled: { color: 'red', text: '已取消' },
        refunded: { color: 'purple', text: '已退款' },
      }
      const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status }
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
    },
  },
  {
    title: '金额',
    dataIndex: 'amount',
    key: 'amount',
    width: 120,
    render: (amount: number) => `¥${amount.toFixed(2)}`,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
]

const RealWorldSearch = () => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<SearchResult[]>([])
  const [expanded, setExpanded] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (values: Record<string, unknown>) => {
    setLoading(true)
    
    try {
      // 保存搜索条件到 localStorage
      localStorage.setItem('searchFormState', JSON.stringify(values))
      
      // 执行搜索
      const results = await searchOrders(values)
      setDataSource(results)
      setSearched(true)
    } catch (error) {
      console.error('搜索失败：', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    form.reset()
    setDataSource([])
    setSearched(false)
    localStorage.removeItem('searchFormState')
  }

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          实战案例：高级搜索表单
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          企业级搜索表单的最佳实践，包含展开/收起、快速搜索、状态持久化等功能。
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="功能特性"
          description={
            <div>
              <Text>🔍 支持基础搜索和高级搜索两种模式</Text>
              <br />
              <Text>📦 展开/收起高级搜索条件，优化页面空间</Text>
              <br />
              <Text>💾 搜索条件自动保存，刷新页面不丢失</Text>
              <br />
              <Text>⚡ 快速重置和搜索，提升操作效率</Text>
              <br />
              <Text>📊 搜索结果以表格形式展示</Text>
            </div>
          }
          type="info"
          showIcon
        />

        <Card>
          <Form form={form} labelCol={6} wrapperCol={18} onAutoSubmit={handleSearch}>
            <SchemaField schema={schema} />
            
            {/* 展开/收起高级搜索 */}
            <div style={{ marginBottom: 24 }}>
              <Button
                type="link"
                onClick={() => {
                  setExpanded(!expanded)
                  // 显示/隐藏高级搜索字段
                  const advancedFields = form.query('advancedSearch.*').take()
                  advancedFields?.forEach((field: { setPattern: (arg0: string) => void }) => {
                    field.setPattern(expanded ? 'editable' : 'hidden')
                  })
                }}
                icon={expanded ? <UpOutlined /> : <DownOutlined />}
              >
                {expanded ? '收起' : '展开'}高级搜索
              </Button>
            </div>

            {/* 操作按钮 */}
            <FormConsumer>
              {() => (
                <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                  <Submit 
                    type="primary" 
                    icon={<SearchOutlined />}
                    loading={loading}
                  >
                    搜索
                  </Submit>
                  <Button 
                    onClick={handleReset}
                    icon={<ReloadOutlined />}
                  >
                    重置
                  </Button>
                  <Text type="secondary" style={{ marginLeft: 16 }}>
                    {Object.keys(form.values).filter(key => form.values[key]).length > 0 && 
                      `已设置 ${Object.keys(form.values).filter(key => form.values[key]).length} 个搜索条件`
                    }
                  </Text>
                </div>
              )}
            </FormConsumer>
          </Form>
        </Card>

        {/* 搜索结果 */}
        {searched && (
          <Card 
            title={
              <Space>
                <Text strong>搜索结果</Text>
                <Tag color="blue">{dataSource.length} 条记录</Tag>
              </Space>
            }
          >
            <Table
              columns={columns}
              dataSource={dataSource}
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
              scroll={{ x: 1000 }}
            />
          </Card>
        )}

        <Card title="搜索表单最佳实践" type="inner">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>1. 布局设计</Text>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                <Text>• 常用条件置于顶部，默认显示</Text>
                <br />
                <Text>• 不常用条件可折叠，按需展开</Text>
                <br />
                <Text>• 使用栅格布局，保持整齐美观</Text>
              </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>2. 交互优化</Text>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                <Text>• 支持回车键快速搜索</Text>
                <br />
                <Text>• 提供明确的重置按钮</Text>
                <br />
                <Text>• 显示当前激活的搜索条件数量</Text>
              </div>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>3. 性能优化</Text>
              <div style={{ paddingLeft: 16, marginTop: 8 }}>
                <Text>• 搜索条件持久化，避免重复输入</Text>
                <br />
                <Text>• 使用 Loading 状态，提升用户体验</Text>
                <br />
                <Text>• 合理设置防抖，减少不必要的请求</Text>
              </div>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default RealWorldSearch

