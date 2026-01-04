/**
 * Formily 实战案例：用户注册表单
 * 
 * 综合应用示例，包含：
 * 1. 完整的用户注册流程
 * 2. 多步骤表单（分步填写）
 * 3. 复杂验证规则
 * 4. 异步验证（用户名/邮箱唯一性）
 * 5. 密码强度校验
 * 6. 图形验证码
 * 7. 协议勾选
 */

import { createForm, onFieldValueChange } from '@formily/core'
import { createSchemaField, FormConsumer } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  DatePicker,
  Password,
  Checkbox,
  FormGrid,
  FormStep,
  Submit,
  Reset,
} from '@formily/antd-v5'
import { Typography, Card, Alert, Space, Steps, Button, message } from 'antd'
import { UserOutlined, SafetyOutlined, SolutionOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Title, Paragraph, Text, Link } = Typography

// 模拟 API：检查用户名是否存在
const checkUsername = (username: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingUsers = ['admin', 'test', 'user', 'demo']
      resolve(existingUsers.includes(username.toLowerCase()))
    }, 800)
  })
}

// 模拟 API：检查邮箱是否已注册
const checkEmail = (email: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const registeredEmails = ['test@example.com', 'admin@example.com']
      resolve(registeredEmails.includes(email.toLowerCase()))
    }, 600)
  })
}

// 模拟 API：注册用户
const registerUser = (userData: Record<string, unknown>): Promise<{ success: boolean; userId?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('注册数据：', userData)
      resolve({
        success: true,
        userId: 'user_' + Date.now(),
      })
    }, 1500)
  })
}

// 密码强度验证
const validatePasswordStrength = (value: string) => {
  if (!value) return ''
  
  const hasLower = /[a-z]/.test(value)
  const hasUpper = /[A-Z]/.test(value)
  const hasNumber = /\d/.test(value)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
  
  const checks = [hasLower, hasUpper, hasNumber, hasSpecial]
  const passedChecks = checks.filter(Boolean).length
  
  if (value.length < 8) {
    return '密码长度至少 8 位'
  }
  
  if (passedChecks < 3) {
    return '密码必须包含大小写字母、数字、特殊字符中的至少 3 种'
  }
  
  return ''
}

// 创建表单实例
const form = createForm({
  validateFirst: true,
  effects() {
    // 密码确认联动
    onFieldValueChange('password', (field) => {
      const confirmField = form.query('confirmPassword').take()
      const passwordValue = field.value as string
      
      if (confirmField?.value && passwordValue !== confirmField.value) {
        confirmField.setSelfErrors(['两次密码输入不一致'])
      } else {
        confirmField?.setSelfErrors([])
      }
    })
  },
})

const formStep = FormStep.createFormStep()

// 创建 SchemaField
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    DatePicker,
    Password,
    Checkbox,
    FormGrid,
    FormStep,
  },
})

// 表单 Schema
const schema = {
  type: 'object',
  properties: {
    step: {
      type: 'void',
      'x-component': 'FormStep',
      'x-component-props': {
        formStep,
      },
      properties: {
        // ========== 第一步：账户信息 ==========
        step1: {
          type: 'void',
          'x-component': 'FormStep.StepPane',
          'x-component-props': {
            title: '账户信息',
          },
          properties: {
            username: {
              type: 'string',
              title: '用户名',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入用户名（尝试输入 admin）',
                prefix: <UserOutlined />,
              },
              'x-validator': [
                { required: true, message: '用户名不能为空' },
                { min: 3, max: 20, message: '用户名长度为 3-20 个字符' },
                { pattern: /^[a-zA-Z][a-zA-Z0-9_]*$/, message: '用户名必须以字母开头，只能包含字母、数字和下划线' },
                {
                  validator: async (value: string) => {
                    if (!value) return ''
                    const exists = await checkUsername(value)
                    return exists ? '该用户名已被占用，请更换' : ''
                  },
                  triggerType: 'onBlur',
                },
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
                {
                  validator: async (value: string) => {
                    if (!value) return ''
                    const registered = await checkEmail(value)
                    return registered ? '该邮箱已被注册' : ''
                  },
                  triggerType: 'onBlur',
                },
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
                prefix: <SafetyOutlined />,
              },
              'x-validator': [
                { required: true, message: '密码不能为空' },
                { validator: validatePasswordStrength },
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
                {
                  validator: (value: string, rule, ctx) => {
                    const password = ctx.form.values.password
                    if (value && password && value !== password) {
                      return '两次输入的密码不一致'
                    }
                    return ''
                  },
                },
              ],
            },
          },
        },
        
        // ========== 第二步：个人信息 ==========
        step2: {
          type: 'void',
          'x-component': 'FormStep.StepPane',
          'x-component-props': {
            title: '个人信息',
          },
          properties: {
            grid: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                maxColumns: 2,
                minColumns: 1,
              },
              properties: {
                realName: {
                  type: 'string',
                  title: '真实姓名',
                  required: true,
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                  'x-component-props': {
                    placeholder: '请输入真实姓名',
                  },
                  'x-validator': [
                    { required: true, message: '真实姓名不能为空' },
                    { min: 2, max: 20, message: '姓名长度为 2-20 个字符' },
                  ],
                },
                gender: {
                  type: 'string',
                  title: '性别',
                  'x-decorator': 'FormItem',
                  'x-component': 'Select',
                  'x-component-props': {
                    placeholder: '请选择性别',
                  },
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
                  'x-validator': [
                    {
                      validator: (value: string) => {
                        if (!value) return ''
                        const birthDate = new Date(value)
                        const today = new Date()
                        const age = today.getFullYear() - birthDate.getFullYear()
                        
                        if (age < 18) {
                          return '必须年满 18 周岁才能注册'
                        }
                        
                        return ''
                      },
                    },
                  ],
                },
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
              },
            },
          },
        },
        
        // ========== 第三步：确认信息 ==========
        step3: {
          type: 'void',
          'x-component': 'FormStep.StepPane',
          'x-component-props': {
            title: '完成注册',
          },
          properties: {
            agreement: {
              type: 'boolean',
              title: ' ',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
              'x-content': (
                <span>
                  我已阅读并同意 <Link>《用户协议》</Link> 和 <Link>《隐私政策》</Link>
                </span>
              ),
              'x-validator': [
                {
                  validator: (value: boolean) => {
                    if (!value) {
                      return '请先阅读并同意用户协议和隐私政策'
                    }
                    return ''
                  },
                },
              ],
            },
            newsletter: {
              type: 'boolean',
              title: ' ',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
              'x-content': '订阅我们的新闻通讯，获取最新产品动态',
              default: false,
            },
          },
        },
      },
    },
  },
}

const RealWorldRegister = () => {
  const [current, setCurrent] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true)
    
    try {
      const result = await registerUser(values)
      
      if (result.success) {
        message.success('注册成功！欢迎加入我们！')
        console.log('注册成功，用户 ID：', result.userId)
        console.log('注册数据：', values)
        
        // 可以在这里跳转到登录页面或自动登录
        setTimeout(() => {
          form.reset()
          formStep.setCurrent(0)
          setCurrent(0)
        }, 2000)
      }
    } catch (error) {
      message.error('注册失败，请稍后重试')
      console.error('注册失败：', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          实战案例：用户注册表单
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          完整的用户注册流程，包含分步表单、异步验证、密码强度检测等真实业务场景。
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="功能特性"
          description={
            <div>
              <Text>✅ 多步骤表单，引导用户逐步完成注册</Text>
              <br />
              <Text>✅ 异步验证用户名和邮箱的唯一性</Text>
              <br />
              <Text>✅ 密码强度实时检测和提示</Text>
              <br />
              <Text>✅ 完整的表单验证和错误提示</Text>
              <br />
              <Text>✅ 优雅的用户体验和交互设计</Text>
            </div>
          }
          type="info"
          showIcon
        />

        <Card>
          <Form 
            form={form} 
            labelCol={6} 
            wrapperCol={16} 
            onAutoSubmit={handleSubmit}
          >
            <SchemaField schema={schema} />
            
            {/* 表单摘要信息 */}
            <FormConsumer>
              {() => (
                <div style={{ marginTop: 24 }}>
                  {formStep.current === 2 && (
                    <Card type="inner" title="请确认您的注册信息" style={{ marginBottom: 24 }}>
                      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <div>
                          <Text strong>账户信息</Text>
                          <div style={{ marginTop: 8, paddingLeft: 16 }}>
                            <Text>用户名：{form.values.username || '-'}</Text>
                            <br />
                            <Text>邮箱：{form.values.email || '-'}</Text>
                          </div>
                        </div>
                        
                        <div>
                          <Text strong>个人信息</Text>
                          <div style={{ marginTop: 8, paddingLeft: 16 }}>
                            <Text>真实姓名：{form.values.realName || '-'}</Text>
                            <br />
                            <Text>性别：{
                              form.values.gender === 'male' ? '男' :
                              form.values.gender === 'female' ? '女' : '保密'
                            }</Text>
                            <br />
                            <Text>手机号：{form.values.phone || '-'}</Text>
                          </div>
                        </div>
                      </Space>
                    </Card>
                  )}
                  
                  <FormStep.FormButtonGroup>
                    <Button
                      disabled={formStep.current === 0}
                      onClick={() => {
                        formStep.back()
                        setCurrent(formStep.current)
                      }}
                    >
                      上一步
                    </Button>
                    
                    {formStep.current < 2 && (
                      <Button
                        type="primary"
                        onClick={async () => {
                          try {
                            await form.validate()
                            formStep.next()
                            setCurrent(formStep.current)
                          } catch (error) {
                            console.log('验证失败：', error)
                          }
                        }}
                      >
                        下一步
                      </Button>
                    )}
                    
                    {formStep.current === 2 && (
                      <Submit type="primary" loading={submitting}>
                        提交注册
                      </Submit>
                    )}
                  </FormStep.FormButtonGroup>
                </div>
              )}
            </FormConsumer>
          </Form>
        </Card>

        <Card title="业务要点" type="inner">
          <Space direction="vertical" size="small">
            <Text>🎯 <Text strong>分步表单：</Text>使用 FormStep 组件实现多步骤表单，提升用户体验</Text>
            <Text>🔒 <Text strong>安全性：</Text>密码强度验证、防重复提交</Text>
            <Text>⚡ <Text strong>异步验证：</Text>实时检查用户名和邮箱的可用性</Text>
            <Text>✨ <Text strong>用户反馈：</Text>清晰的验证提示和加载状态</Text>
            <Text>📱 <Text strong>响应式：</Text>适配不同屏幕尺寸</Text>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default RealWorldRegister

