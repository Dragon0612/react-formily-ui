import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Radio,
  NumberPicker,
  Switch,
  FormGrid,
  Submit,
  Reset,
} from '@formily/antd-v5'
import { Typography, Card, message } from 'antd'

const { Title, Paragraph } = Typography

// 创建表单实例
const form = createForm({
  validateFirst: true,
})

// 创建 SchemaField 组件
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    DatePicker,
    Checkbox,
    Radio,
    NumberPicker,
    Switch,
    FormGrid,
  },
})

// 表单 Schema 定义
const schema = {
  type: 'object',
  properties: {
    basicInfo: {
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
            { min: 2, message: '用户名至少2个字符' },
            { max: 20, message: '用户名最多20个字符' },
          ],
        },
        email: {
          type: 'string',
          title: '邮箱',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入邮箱地址',
          },
          'x-validator': [
            { required: true, message: '邮箱不能为空' },
            { format: 'email', message: '请输入有效的邮箱地址' },
          ],
        },
        age: {
          type: 'number',
          title: '年龄',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-component-props': {
            placeholder: '请输入年龄',
            min: 1,
            max: 120,
            style: { width: '100%' },
          },
        },
        gender: {
          type: 'string',
          title: '性别',
          'x-decorator': 'FormItem',
          'x-component': 'Radio.Group',
          enum: [
            { label: '男', value: 'male' },
            { label: '女', value: 'female' },
            { label: '保密', value: 'secret' },
          ],
          default: 'secret',
        },
        birthday: {
          type: 'string',
          title: '出生日期',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker',
          'x-component-props': {
            placeholder: '请选择出生日期',
            style: { width: '100%' },
          },
        },
        city: {
          type: 'string',
          title: '城市',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择城市',
            allowClear: true,
          },
          enum: [
            { label: '北京', value: 'beijing' },
            { label: '上海', value: 'shanghai' },
            { label: '广州', value: 'guangzhou' },
            { label: '深圳', value: 'shenzhen' },
            { label: '杭州', value: 'hangzhou' },
          ],
        },
      },
    },
    bio: {
      type: 'string',
      title: '个人简介',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        placeholder: '请输入个人简介',
        rows: 4,
        maxLength: 500,
        showCount: true,
      },
    },
    subscribe: {
      type: 'boolean',
      title: '订阅通知',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        checkedChildren: '开启',
        unCheckedChildren: '关闭',
      },
      default: true,
    },
    agreement: {
      type: 'boolean',
      title: ' ',
      'x-decorator': 'FormItem',
      'x-component': 'Checkbox',
      'x-component-props': {
        children: '我已阅读并同意用户协议',
      },
      'x-validator': [
        {
          validator: (value: boolean) => {
            if (!value) {
              return '请先同意用户协议'
            }
            return ''
          },
        },
      ],
    },
  },
}

const BasicForm = () => {
  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('表单提交数据:', values)
    message.success('表单提交成功！')
  }

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          基础表单
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          展示 Formily 基础组件的使用方法，包括输入框、选择器、日期选择器等常用表单控件。
        </Paragraph>
      </div>

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

export default BasicForm

