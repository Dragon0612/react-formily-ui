/**
 * Formily 动态表单示例
 * 
 * 本示例展示：
 * 1. 根据 JSON Schema 动态生成表单
 * 2. 动态添加/删除表单字段
 * 3. 条件渲染（根据某个字段值决定其他字段是否显示）
 * 4. 表单项的动态禁用/启用
 * 5. 通过配置生成不同类型的表单
 */

import { useState } from 'react'
import { createForm } from '@formily/core'
import { createSchemaField, ISchema } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  NumberPicker,
  DatePicker,
  Radio,
  Checkbox,
  Switch,
  FormGrid,
  Submit,
  Reset,
  Password,
} from '@formily/antd-v5'
import { Typography, Card, Alert, Space, Button, Tabs } from 'antd'

const { Title, Paragraph, Text } = Typography

// 创建 SchemaField 组件
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    NumberPicker,
    DatePicker,
    Radio,
    Checkbox,
    Switch,
    FormGrid,
    Password,
  },
})

// 预定义的表单模板
const formTemplates = {
  // 用户注册表单
  register: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        title: '用户名',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': { placeholder: '请输入用户名' },
      },
      email: {
        type: 'string',
        title: '邮箱',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
        'x-component-props': { placeholder: '请输入邮箱' },
      },
      password: {
        type: 'string',
        title: '密码',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Password',
      },
      agreement: {
        type: 'boolean',
        title: ' ',
        'x-decorator': 'FormItem',
        'x-component': 'Checkbox',
        'x-content': '我已阅读并同意用户协议',
      },
    },
  } as ISchema,

  // 联系人表单
  contact: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: '姓名',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      phone: {
        type: 'string',
        title: '电话',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      address: {
        type: 'string',
        title: '地址',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea',
      },
    },
  } as ISchema,

  // 商品信息表单
  product: {
    type: 'object',
    properties: {
      productName: {
        type: 'string',
        title: '商品名称',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
      category: {
        type: 'string',
        title: '分类',
        'x-decorator': 'FormItem',
        'x-component': 'Select',
        enum: [
          { label: '电子产品', value: 'electronics' },
          { label: '服装', value: 'clothing' },
          { label: '食品', value: 'food' },
        ],
      },
      price: {
        type: 'number',
        title: '价格',
        required: true,
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-component-props': { min: 0, precision: 2, style: { width: '100%' } },
      },
      stock: {
        type: 'number',
        title: '库存',
        'x-decorator': 'FormItem',
        'x-component': 'NumberPicker',
        'x-component-props': { min: 0, style: { width: '100%' } },
      },
    },
  } as ISchema,
}

// 条件渲染的表单 Schema
const conditionalSchema: ISchema = {
  type: 'object',
  properties: {
    accountType: {
      type: 'string',
      title: '账户类型',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: '个人账户', value: 'personal' },
        { label: '企业账户', value: 'company' },
      ],
      default: 'personal',
    },
    // 个人账户字段
    personalName: {
      type: 'string',
      title: '真实姓名',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '请输入真实姓名' },
      // 条件渲染：只有当 accountType 为 personal 时才显示
      'x-reactions': {
        dependencies: ['accountType'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "personal"}}',
          },
        },
      },
    },
    personalIdCard: {
      type: 'string',
      title: '身份证号',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '请输入身份证号', maxLength: 18 },
      'x-reactions': {
        dependencies: ['accountType'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "personal"}}',
          },
        },
      },
    },
    // 企业账户字段
    companyName: {
      type: 'string',
      title: '企业名称',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '请输入企业名称' },
      'x-reactions': {
        dependencies: ['accountType'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "company"}}',
          },
        },
      },
    },
    companyLicense: {
      type: 'string',
      title: '营业执照号',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '请输入营业执照号' },
      'x-reactions': {
        dependencies: ['accountType'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "company"}}',
          },
        },
      },
    },
    companyAddress: {
      type: 'string',
      title: '企业地址',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': { placeholder: '请输入企业地址', rows: 2 },
      'x-reactions': {
        dependencies: ['accountType'],
        fulfill: {
          state: {
            visible: '{{$deps[0] === "company"}}',
          },
        },
      },
    },
    // 公共字段
    email: {
      type: 'string',
      title: '邮箱',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '请输入邮箱' },
    },
    phone: {
      type: 'string',
      title: '手机号',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': { placeholder: '请输入手机号', maxLength: 11 },
    },
  },
}

// 动态禁用示例 Schema
const dynamicDisableSchema: ISchema = {
  type: 'object',
  properties: {
    enableEdit: {
      type: 'boolean',
      title: ' ',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        checkedChildren: '可编辑',
        unCheckedChildren: '不可编辑',
      },
      default: false,
    },
    grid: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': { maxColumns: 2, minColumns: 1 },
      properties: {
        name: {
          type: 'string',
          title: '姓名',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': { placeholder: '请输入姓名' },
          // 根据 enableEdit 的值动态控制是否禁用
          'x-reactions': {
            dependencies: ['enableEdit'],
            fulfill: {
              state: {
                disabled: '{{!$deps[0]}}',
              },
            },
          },
        },
        age: {
          type: 'number',
          title: '年龄',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-component-props': { style: { width: '100%' } },
          'x-reactions': {
            dependencies: ['enableEdit'],
            fulfill: {
              state: {
                disabled: '{{!$deps[0]}}',
              },
            },
          },
        },
        email: {
          type: 'string',
          title: '邮箱',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': { placeholder: '请输入邮箱' },
          'x-reactions': {
            dependencies: ['enableEdit'],
            fulfill: {
              state: {
                disabled: '{{!$deps[0]}}',
              },
            },
          },
        },
        phone: {
          type: 'string',
          title: '手机号',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': { placeholder: '请输入手机号' },
          'x-reactions': {
            dependencies: ['enableEdit'],
            fulfill: {
              state: {
                disabled: '{{!$deps[0]}}',
              },
            },
          },
        },
      },
    },
  },
}

const DynamicForm = () => {
  const [form1] = useState(() => createForm())
  const [form2] = useState(() => createForm())
  const [form3] = useState(() => createForm())
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof formTemplates>('register')

  const handleSubmit = (values: Record<string, unknown>, formName: string) => {
    console.log(`${formName} 提交数据:`, values)
    alert(`${formName} 提交成功！\n\n查看控制台获取完整数据`)
  }

  const tabItems = [
    {
      key: 'template',
      label: '模板切换',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="动态模板"
            description="根据选择的模板动态生成不同的表单。这在需要根据用户选择或配置动态生成表单时非常有用。"
            type="info"
            showIcon
          />
          
          <Space>
            <Text>选择表单模板：</Text>
            <Button
              type={selectedTemplate === 'register' ? 'primary' : 'default'}
              onClick={() => {
                setSelectedTemplate('register')
                form1.reset()
              }}
            >
              注册表单
            </Button>
            <Button
              type={selectedTemplate === 'contact' ? 'primary' : 'default'}
              onClick={() => {
                setSelectedTemplate('contact')
                form1.reset()
              }}
            >
              联系人表单
            </Button>
            <Button
              type={selectedTemplate === 'product' ? 'primary' : 'default'}
              onClick={() => {
                setSelectedTemplate('product')
                form1.reset()
              }}
            >
              商品表单
            </Button>
          </Space>

          <Card title={`当前模板：${selectedTemplate}`}>
            <Form
              form={form1}
              labelCol={4}
              wrapperCol={20}
              onAutoSubmit={(values) => handleSubmit(values, '模板表单')}
            >
              <SchemaField schema={formTemplates[selectedTemplate]} />
              <div className="form-actions">
                <Reset>重置</Reset>
                <Submit type="primary">提交</Submit>
              </div>
            </Form>
          </Card>
        </Space>
      ),
    },
    {
      key: 'conditional',
      label: '条件渲染',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="条件渲染（x-reactions）"
            description="根据某个字段的值决定其他字段是否显示。选择不同的账户类型，会显示不同的表单字段。"
            type="info"
            showIcon
          />

          <Card>
            <Form
              form={form2}
              labelCol={4}
              wrapperCol={20}
              onAutoSubmit={(values) => handleSubmit(values, '条件渲染表单')}
            >
              <SchemaField schema={conditionalSchema} />
              <div className="form-actions">
                <Reset>重置</Reset>
                <Submit type="primary">提交</Submit>
              </div>
            </Form>
          </Card>
        </Space>
      ),
    },
    {
      key: 'disable',
      label: '动态禁用',
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="动态禁用/启用"
            description="通过开关控制表单字段是否可编辑。这在查看/编辑模式切换时非常有用。"
            type="info"
            showIcon
          />

          <Card>
            <Form
              form={form3}
              labelCol={4}
              wrapperCol={20}
              onAutoSubmit={(values) => handleSubmit(values, '动态禁用表单')}
            >
              <SchemaField schema={dynamicDisableSchema} />
              <div className="form-actions">
                <Reset>重置</Reset>
                <Submit type="primary">提交</Submit>
              </div>
            </Form>
          </Card>
        </Space>
      ),
    },
  ]

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          动态表单示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          演示如何根据配置动态生成表单、条件渲染、动态控制字段状态等功能。
        </Paragraph>
      </div>

      <Tabs defaultActiveKey="template" items={tabItems} />

      <Card title="核心技术点" type="inner" style={{ marginTop: 24 }}>
        <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
{`// 1. x-reactions 条件渲染（基于依赖字段的值）
{
  'x-reactions': {
    dependencies: ['accountType'], // 依赖的字段
    fulfill: {
      state: {
        // 当 accountType 为 'personal' 时显示
        visible: '{{$deps[0] === "personal"}}',
      },
    },
  },
}

// 2. 动态禁用（基于开关状态）
{
  'x-reactions': {
    dependencies: ['enableEdit'],
    fulfill: {
      state: {
        disabled: '{{!$deps[0]}}', // enableEdit 为 false 时禁用
      },
    },
  },
}

// 3. 复杂联动（JS 表达式）
{
  'x-reactions': {
    dependencies: ['field1', 'field2'],
    fulfill: {
      state: {
        // 支持复杂的 JS 表达式
        visible: '{{$deps[0] === "value1" && $deps[1] > 10}}',
        disabled: '{{!$deps[0]}}',
        value: '{{$deps[0] + $deps[1]}}', // 动态计算值
      },
    },
  },
}

// 4. 动态表单生成（根据 JSON Schema）
const schema = {
  type: 'object',
  properties: {
    // 从配置或 API 动态生成字段
    ...dynamicFields
  }
}

// 5. 多表单实例管理
const [form1] = useState(() => createForm())
const [form2] = useState(() => createForm())

// 6. 表单重置
form.reset() // 重置为初始值

// 7. 表单赋值
form.setValues({ field1: 'value1', field2: 'value2' })

// 8. 获取表单值
const values = form.values`}
        </pre>
      </Card>
    </div>
  )
}

export default DynamicForm

