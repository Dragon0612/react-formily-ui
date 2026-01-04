import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  NumberPicker,
  DatePicker,
  ArrayTable,
  ArrayCards,
  ArrayItems,
  FormGrid,
  Space,
  Submit,
  Reset,
} from '@formily/antd-v5'
import { Typography, Card, Tabs, message } from 'antd'

const { Title, Paragraph } = Typography

// 创建表单实例
const form = createForm({
  validateFirst: true,
  initialValues: {
    products: [
      { name: 'MacBook Pro', category: 'electronics', price: 14999, quantity: 2 },
      { name: 'iPhone 15', category: 'electronics', price: 7999, quantity: 5 },
    ],
    contacts: [
      { name: '张三', phone: '13800138000', relation: 'friend' },
    ],
    skills: ['React', 'TypeScript'],
  },
})

// 创建 SchemaField 组件
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    NumberPicker,
    DatePicker,
    ArrayTable,
    ArrayCards,
    ArrayItems,
    FormGrid,
    Space,
  },
})

// ArrayTable 表格表单 Schema
const tableSchema = {
  type: 'object',
  properties: {
    products: {
      type: 'array',
      title: '商品列表',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayTable',
      'x-component-props': {
        pagination: { pageSize: 5 },
        scroll: { x: '100%' },
      },
      items: {
        type: 'object',
        properties: {
          column1: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { width: 60, title: '序号', align: 'center' },
            properties: {
              index: {
                type: 'void',
                'x-component': 'ArrayTable.Index',
              },
            },
          },
          column2: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: '商品名称', width: 200 },
            properties: {
              name: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入商品名称',
                },
                'x-validator': [{ required: true, message: '商品名称必填' }],
              },
            },
          },
          column3: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: '分类', width: 150 },
            properties: {
              category: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择',
                },
                enum: [
                  { label: '电子产品', value: 'electronics' },
                  { label: '服装', value: 'clothing' },
                  { label: '食品', value: 'food' },
                  { label: '家居', value: 'home' },
                ],
              },
            },
          },
          column4: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: '单价', width: 150 },
            properties: {
              price: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '请输入单价',
                  min: 0,
                  precision: 2,
                  style: { width: '100%' },
                },
              },
            },
          },
          column5: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: '数量', width: 120 },
            properties: {
              quantity: {
                type: 'number',
                'x-decorator': 'FormItem',
                'x-component': 'NumberPicker',
                'x-component-props': {
                  placeholder: '数量',
                  min: 1,
                  style: { width: '100%' },
                },
              },
            },
          },
          column6: {
            type: 'void',
            'x-component': 'ArrayTable.Column',
            'x-component-props': { title: '操作', width: 120, fixed: 'right' },
            properties: {
              operation: {
                type: 'void',
                'x-component': 'Space',
                properties: {
                  moveUp: {
                    type: 'void',
                    'x-component': 'ArrayTable.MoveUp',
                  },
                  moveDown: {
                    type: 'void',
                    'x-component': 'ArrayTable.MoveDown',
                  },
                  remove: {
                    type: 'void',
                    'x-component': 'ArrayTable.Remove',
                  },
                },
              },
            },
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加商品',
          'x-component': 'ArrayTable.Addition',
        },
      },
    },
  },
}

// ArrayCards 卡片表单 Schema
const cardsSchema = {
  type: 'object',
  properties: {
    contacts: {
      type: 'array',
      title: '联系人',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayCards',
      'x-component-props': {
        title: '联系人信息',
      },
      items: {
        type: 'object',
        properties: {
          index: {
            type: 'void',
            'x-component': 'ArrayCards.Index',
          },
          grid: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': {
              maxColumns: 3,
              minColumns: 1,
            },
            properties: {
              name: {
                type: 'string',
                title: '姓名',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入姓名',
                },
              },
              phone: {
                type: 'string',
                title: '电话',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入电话',
                },
                'x-validator': [
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效手机号' },
                ],
              },
              relation: {
                type: 'string',
                title: '关系',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择关系',
                },
                enum: [
                  { label: '家人', value: 'family' },
                  { label: '朋友', value: 'friend' },
                  { label: '同事', value: 'colleague' },
                  { label: '其他', value: 'other' },
                ],
              },
            },
          },
          remove: {
            type: 'void',
            'x-component': 'ArrayCards.Remove',
          },
          moveUp: {
            type: 'void',
            'x-component': 'ArrayCards.MoveUp',
          },
          moveDown: {
            type: 'void',
            'x-component': 'ArrayCards.MoveDown',
          },
        },
      },
      properties: {
        addition: {
          type: 'void',
          title: '添加联系人',
          'x-component': 'ArrayCards.Addition',
        },
      },
    },
  },
}

// ArrayItems 简单列表 Schema
const itemsSchema = {
  type: 'object',
  properties: {
    skills: {
      type: 'array',
      title: '技能标签',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'void',
        'x-component': 'Space',
        properties: {
          sort: {
            type: 'void',
            'x-component': 'ArrayItems.SortHandle',
          },
          input: {
            type: 'string',
            'x-decorator': 'FormItem',
            'x-component': 'Input',
            'x-component-props': {
              placeholder: '请输入技能',
              style: { width: 200 },
            },
          },
          remove: {
            type: 'void',
            'x-component': 'ArrayItems.Remove',
          },
        },
      },
      properties: {
        add: {
          type: 'void',
          title: '添加技能',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
}

const ArrayForm = () => {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('数组表单提交数据:', values)
    message.success('表单提交成功！')
  }

  const tabItems = [
    {
      key: 'table',
      label: '表格模式 (ArrayTable)',
      children: (
        <Card>
          <Form form={form} labelCol={4} wrapperCol={20} onAutoSubmit={handleSubmit}>
            <SchemaField schema={tableSchema} />
            <div className="form-actions">
              <Reset>重置</Reset>
              <Submit type="primary">提交</Submit>
            </div>
          </Form>
        </Card>
      ),
    },
    {
      key: 'cards',
      label: '卡片模式 (ArrayCards)',
      children: (
        <Card>
          <Form form={form} labelCol={6} wrapperCol={16} onAutoSubmit={handleSubmit}>
            <SchemaField schema={cardsSchema} />
            <div className="form-actions">
              <Reset>重置</Reset>
              <Submit type="primary">提交</Submit>
            </div>
          </Form>
        </Card>
      ),
    },
    {
      key: 'items',
      label: '列表模式 (ArrayItems)',
      children: (
        <Card>
          <Form form={form} labelCol={4} wrapperCol={20} onAutoSubmit={handleSubmit}>
            <SchemaField schema={itemsSchema} />
            <div className="form-actions">
              <Reset>重置</Reset>
              <Submit type="primary">提交</Submit>
            </div>
          </Form>
        </Card>
      ),
    },
  ]

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          数组表单
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          展示 Formily 数组字段的多种展示形式，包括表格模式、卡片模式和列表模式，支持动态增删改查。
        </Paragraph>
      </div>

      <Tabs defaultActiveKey="table" items={tabItems} />
    </div>
  )
}

export default ArrayForm

