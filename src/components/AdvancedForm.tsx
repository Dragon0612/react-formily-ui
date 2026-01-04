import { createForm, onFieldValueChange, Field } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  DatePicker,
  Cascader,
  TreeSelect,
  NumberPicker,
  Password,
  FormGrid,
  FormLayout,
  FormCollapse,
  Submit,
  Reset,
} from '@formily/antd-v5'
import { Typography, Card, message, Alert } from 'antd'

const { Title, Paragraph } = Typography

// 城市级联数据
const cityOptions = [
  {
    value: 'zhejiang',
    label: '浙江省',
    children: [
      {
        value: 'hangzhou',
        label: '杭州市',
        children: [
          { value: 'xihu', label: '西湖区' },
          { value: 'yuhang', label: '余杭区' },
          { value: 'binjiang', label: '滨江区' },
        ],
      },
      {
        value: 'ningbo',
        label: '宁波市',
        children: [
          { value: 'haishu', label: '海曙区' },
          { value: 'jiangbei', label: '江北区' },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏省',
    children: [
      {
        value: 'nanjing',
        label: '南京市',
        children: [
          { value: 'xuanwu', label: '玄武区' },
          { value: 'gulou', label: '鼓楼区' },
        ],
      },
      {
        value: 'suzhou',
        label: '苏州市',
        children: [
          { value: 'gusu', label: '姑苏区' },
          { value: 'wuzhong', label: '吴中区' },
        ],
      },
    ],
  },
]

// 组织架构树形数据
const departmentData = [
  {
    value: 'company',
    title: '总公司',
    children: [
      {
        value: 'tech',
        title: '技术部',
        children: [
          { value: 'frontend', title: '前端组' },
          { value: 'backend', title: '后端组' },
          { value: 'devops', title: '运维组' },
        ],
      },
      {
        value: 'product',
        title: '产品部',
        children: [
          { value: 'pm', title: '产品经理组' },
          { value: 'design', title: '设计组' },
        ],
      },
      {
        value: 'hr',
        title: '人力资源部',
      },
      {
        value: 'finance',
        title: '财务部',
      },
    ],
  },
]

// 创建表单实例，包含联动逻辑
const form = createForm({
  validateFirst: true,
  effects() {
    // 用户类型联动
    onFieldValueChange('userType', (field) => {
      const companyField = form.query('companyInfo').take()
      const personalField = form.query('personalInfo').take()
      const value = field.value as string
      
      if (value === 'company') {
        companyField?.setPattern('editable')
        personalField?.setPattern('disabled')
      } else if (value === 'personal') {
        companyField?.setPattern('disabled')
        personalField?.setPattern('editable')
      } else {
        companyField?.setPattern('editable')
        personalField?.setPattern('editable')
      }
    })

    // 密码确认联动
    onFieldValueChange('password', (field) => {
      const confirmField = form.query('confirmPassword').take() as Field | undefined
      const passwordValue = field.value as string
      if (confirmField?.value && passwordValue !== confirmField.value) {
        confirmField.setSelfErrors(['两次密码输入不一致'])
      } else {
        confirmField?.setSelfErrors([])
      }
    })
  },
})

// 创建 SchemaField 组件
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    DatePicker,
    Cascader,
    TreeSelect,
    NumberPicker,
    Password,
    FormGrid,
    FormLayout,
    FormCollapse,
  },
})

// 表单 Schema 定义
const schema = {
  type: 'object',
  properties: {
    collapse: {
      type: 'void',
      'x-component': 'FormCollapse',
      'x-component-props': {
        defaultActiveKey: ['account', 'contact'],
      },
      properties: {
        account: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '账户信息',
          },
          properties: {
            accountGrid: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                maxColumns: 2,
                minColumns: 1,
              },
              properties: {
                username: {
                  type: 'string',
                  title: '用户名',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入用户名',
                  },
                  'x-validator': [
                    { required: true, message: '用户名不能为空' },
                    { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母、数字和下划线' },
                  ],
                },
                userType: {
                  type: 'string',
                  title: '用户类型',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择用户类型',
                  },
                  enum: [
                    { label: '个人用户', value: 'personal' },
                    { label: '企业用户', value: 'company' },
                  ],
                },
                password: {
                  type: 'string',
                  title: '密码',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Password',
                  'x-component-props': {
                    placeholder: '请输入密码',
                    checkStrength: true,
                  },
                  'x-validator': [
                    { required: true, message: '密码不能为空' },
                    { min: 6, message: '密码至少6位' },
                  ],
                },
                confirmPassword: {
                  type: 'string',
                  title: '确认密码',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Password',
                  'x-component-props': {
                    placeholder: '请再次输入密码',
                  },
                  'x-validator': [
                    { required: true, message: '请确认密码' },
                  ],
                },
              },
            },
          },
        },
        contact: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '联系信息',
          },
          properties: {
            contactGrid: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                maxColumns: 2,
                minColumns: 1,
              },
              properties: {
                phone: {
                  type: 'string',
                  title: '手机号',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入手机号',
                    maxLength: 11,
                  },
                  'x-validator': [
                    { required: true, message: '手机号不能为空' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
                  ],
                },
                email: {
                  type: 'string',
                  title: '邮箱',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入邮箱',
                  },
                  'x-validator': [
                    { format: 'email', message: '请输入有效的邮箱地址' },
                  ],
                },
                region: {
                  type: 'array',
                  title: '所在地区',
                  'x-decorator': 'FormItem',
                  'x-component': 'Cascader',
                  'x-component-props': {
                    placeholder: '请选择地区',
                    options: cityOptions,
                    style: { width: '100%' },
                  },
                },
                address: {
                  type: 'string',
                  title: '详细地址',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input.TextArea',
                  'x-component-props': {
                    placeholder: '请输入详细地址',
                    rows: 2,
                  },
                },
              },
            },
          },
        },
        organization: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          'x-component-props': {
            header: '组织信息',
          },
          properties: {
            orgGrid: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                maxColumns: 2,
                minColumns: 1,
              },
              properties: {
                department: {
                  type: 'string',
                  title: '所属部门',
                  'x-decorator': 'FormItem',
                  'x-component': 'TreeSelect',
                  'x-component-props': {
                    placeholder: '请选择部门',
                    treeData: departmentData,
                    treeDefaultExpandAll: true,
                    style: { width: '100%' },
                  },
                },
                position: {
                  type: 'string',
                  title: '职位',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择职位',
                  },
                  enum: [
                    { label: '初级工程师', value: 'junior' },
                    { label: '中级工程师', value: 'middle' },
                    { label: '高级工程师', value: 'senior' },
                    { label: '技术专家', value: 'expert' },
                    { label: '架构师', value: 'architect' },
                    { label: '技术经理', value: 'manager' },
                  ],
                },
                entryDate: {
                  type: 'string',
                  title: '入职日期',
                  'x-decorator': 'FormItem',
                  'x-component': 'DatePicker',
                  'x-component-props': {
                    placeholder: '请选择入职日期',
                    style: { width: '100%' },
                  },
                },
                salary: {
                  type: 'number',
                  title: '月薪',
                  'x-decorator': 'FormItem',
                  'x-component': 'NumberPicker',
                  'x-component-props': {
                    placeholder: '请输入月薪',
                    min: 0,
                    formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                    parser: (value: string) => value.replace(/¥\s?|(,*)/g, ''),
                    style: { width: '100%' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
}

const AdvancedForm = () => {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('高级表单提交数据:', values)
    message.success('表单提交成功！')
  }

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          高级表单
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          展示 Formily 高级特性，包括表单联动、折叠面板、级联选择、树形选择等复杂场景。
        </Paragraph>
      </div>

      <Alert
        message="表单联动说明"
        description="选择不同的用户类型后，相关表单区域会自动切换启用/禁用状态。密码和确认密码也会自动校验一致性。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card>
        <Form form={form} labelCol={6} wrapperCol={16} onAutoSubmit={handleSubmit}>
          <SchemaField schema={schema} />
          <div className="form-actions">
            <Reset>重置</Reset>
            <Submit type="primary">提交</Submit>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default AdvancedForm

