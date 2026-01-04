/**
 * 表单验证示例
 * 展示 Formily 各种校验规则的使用方法
 */

import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Password,
  NumberPicker,
  DatePicker,
  Select,
  FormGrid,
  Submit,
  Reset,
} from '@formily/antd-v5'
import { Typography, Card, Alert } from 'antd'

const { Title, Paragraph } = Typography

const form = createForm({
  validateFirst: true,
})

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Password,
    NumberPicker,
    DatePicker,
    Select,
    FormGrid,
  },
})

// 自定义密码强度校验
const passwordStrengthValidator = (value: string) => {
  if (!value) return ''
  
  let strength = 0
  if (value.length >= 8) strength++
  if (/[a-z]/.test(value)) strength++
  if (/[A-Z]/.test(value)) strength++
  if (/\d/.test(value)) strength++
  if (/[^a-zA-Z0-9]/.test(value)) strength++
  
  if (strength < 3) {
    return '密码强度太弱，建议包含大小写字母、数字和特殊字符'
  }
  return ''
}

// 自定义身份证校验
const idcardValidator = (value: string) => {
  if (!value) return ''
  
  const pattern = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
  if (!pattern.test(value)) {
    return '请输入有效的18位身份证号码'
  }
  
  // 简单的校验码验证（实际应用中需要完整算法）
  return ''
}

const schema = {
  type: 'object',
  properties: {
    // 基础校验
    basicValidation: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '基础校验',
        size: 'small',
        style: { marginBottom: 24 },
      },
      properties: {
        grid1: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': { maxColumns: 2 },
          properties: {
            required: {
              type: 'string',
              title: '必填项',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '此项必填',
              },
              'x-validator': [
                { required: true, message: '这是必填项，不能为空' }
              ]
            },
            minLength: {
              type: 'string',
              title: '最小长度',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '至少5个字符',
              },
              'x-validator': [
                { min: 5, message: '至少输入5个字符' }
              ]
            },
            maxLength: {
              type: 'string',
              title: '最大长度',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '最多10个字符',
                maxLength: 10,
                showCount: true,
              },
              'x-validator': [
                { max: 10, message: '最多输入10个字符' }
              ]
            },
            pattern: {
              type: 'string',
              title: '正则匹配',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '只能输入字母和数字',
              },
              'x-validator': [
                {
                  pattern: /^[a-zA-Z0-9]+$/,
                  message: '只能包含字母和数字'
                }
              ]
            },
          }
        }
      }
    },

    // 格式校验
    formatValidation: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '格式校验',
        size: 'small',
        style: { marginBottom: 24 },
      },
      properties: {
        grid2: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': { maxColumns: 2 },
          properties: {
            email: {
              type: 'string',
              title: '邮箱',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: 'example@email.com',
              },
              'x-validator': [
                { required: true, message: '请输入邮箱' },
                { format: 'email', message: '邮箱格式不正确' }
              ]
            },
            phone: {
              type: 'string',
              title: '手机号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入11位手机号',
                maxLength: 11,
              },
              'x-validator': [
                { required: true, message: '请输入手机号' },
                {
                  pattern: /^1[3-9]\d{9}$/,
                  message: '请输入有效的手机号码'
                }
              ]
            },
            url: {
              type: 'string',
              title: '网址',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: 'https://example.com',
              },
              'x-validator': [
                { format: 'url', message: '请输入有效的URL地址' }
              ]
            },
            idcard: {
              type: 'string',
              title: '身份证号',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入18位身份证号',
                maxLength: 18,
              },
              'x-validator': [
                { validator: idcardValidator }
              ]
            },
          }
        }
      }
    },

    // 数字校验
    numberValidation: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '数字校验',
        size: 'small',
        style: { marginBottom: 24 },
      },
      properties: {
        grid3: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': { maxColumns: 2 },
          properties: {
            age: {
              type: 'number',
              title: '年龄',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
              'x-component-props': {
                placeholder: '18-60岁',
                style: { width: '100%' },
              },
              'x-validator': [
                { required: true, message: '请输入年龄' },
                { minimum: 18, message: '年龄不能小于18岁' },
                { maximum: 60, message: '年龄不能大于60岁' }
              ]
            },
            salary: {
              type: 'number',
              title: '月薪',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
              'x-component-props': {
                placeholder: '请输入月薪',
                formatter: (value: number) => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                parser: (value: string) => value.replace(/¥\s?|(,*)/g, ''),
                style: { width: '100%' },
              },
              'x-validator': [
                {
                  validator: (value: number) => {
                    if (!value) return ''
                    if (value < 3000) {
                      return '月薪不能低于3000元'
                    }
                    if (value > 100000) {
                      return '月薪超出合理范围'
                    }
                    return ''
                  }
                }
              ]
            },
            score: {
              type: 'number',
              title: '考试分数',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
              'x-component-props': {
                placeholder: '0-100分',
                min: 0,
                max: 100,
                style: { width: '100%' },
              },
              'x-validator': [
                { required: true, message: '请输入分数' },
                {
                  validator: (value: number) => {
                    if (value < 0 || value > 100) {
                      return '分数必须在0-100之间'
                    }
                    return ''
                  }
                }
              ]
            },
            discount: {
              type: 'number',
              title: '折扣',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
              'x-component-props': {
                placeholder: '0.1-1.0',
                min: 0.1,
                max: 1,
                step: 0.1,
                precision: 1,
                style: { width: '100%' },
              },
            },
          }
        }
      }
    },

    // 密码校验
    passwordValidation: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '密码校验',
        size: 'small',
        style: { marginBottom: 24 },
      },
      properties: {
        grid4: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': { maxColumns: 2 },
          properties: {
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
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6位' },
                { validator: passwordStrengthValidator }
              ]
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
                {
                  validator: (value: string) => {
                    const password = form.values.password
                    if (value && value !== password) {
                      return '两次密码输入不一致'
                    }
                    return ''
                  }
                }
              ]
            },
          }
        }
      }
    },

    // 日期校验
    dateValidation: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '日期校验',
        size: 'small',
      },
      properties: {
        grid5: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': { maxColumns: 2 },
          properties: {
            birthday: {
              type: 'string',
              title: '出生日期',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                placeholder: '请选择出生日期',
                style: { width: '100%' },
              },
              'x-validator': [
                {
                  validator: (value: string) => {
                    if (!value) return ''
                    const birthDate = new Date(value)
                    const today = new Date()
                    const age = today.getFullYear() - birthDate.getFullYear()
                    
                    if (age < 18) {
                      return '必须年满18岁'
                    }
                    if (age > 100) {
                      return '年龄超出合理范围'
                    }
                    return ''
                  }
                }
              ]
            },
            appointmentDate: {
              type: 'string',
              title: '预约日期',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                placeholder: '请选择预约日期',
                showTime: true,
                style: { width: '100%' },
              },
              'x-validator': [
                { required: true, message: '请选择预约日期' },
                {
                  validator: (value: string) => {
                    if (!value) return ''
                    const appointmentDate = new Date(value)
                    const now = new Date()
                    
                    if (appointmentDate < now) {
                      return '预约时间不能早于当前时间'
                    }
                    
                    // 不能超过30天
                    const maxDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                    if (appointmentDate > maxDate) {
                      return '预约时间不能超过30天'
                    }
                    
                    return ''
                  }
                }
              ]
            },
          }
        }
      }
    },
  }
}

const ValidationForm = () => {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('表单提交数据:', values)
    alert('✅ 所有校验通过！查看控制台获取提交数据')
  }

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          表单验证示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          展示 Formily 各种校验规则，包括必填、长度、格式、数字范围、自定义校验等。
        </Paragraph>
      </div>

      <Alert
        message="提示"
        description="每个字段都有相应的校验规则，尝试输入不同的值来触发校验错误。所有字段校验通过后才能提交。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form form={form} labelCol={7} wrapperCol={15} onAutoSubmit={handleSubmit}>
        <SchemaField schema={schema} />
        <div className="form-actions">
          <Reset>重置</Reset>
          <Submit type="primary">提交</Submit>
        </div>
      </Form>
    </div>
  )
}

export default ValidationForm
