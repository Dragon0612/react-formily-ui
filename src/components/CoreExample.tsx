import { createForm, onFieldValueChange, onFormInit, onFormSubmit, onFormValuesChange, Field } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Form, FormItem, Input, NumberPicker, Submit, Reset } from '@formily/antd-v5'
import { Card, Typography, Space, Divider, Tag, Button } from 'antd'
import { useEffect, useState } from 'react'

const { Title, Paragraph, Text } = Typography

// 创建表单实例 - 这是 @formily/core 的核心
const form = createForm({
  // 表单初始化值
  initialValues: {
    name: '',
    age: 18,
  },
  // 表单验证模式
  validateFirst: true,
  // 表单生命周期钩子
  effects() {
    // 表单初始化时执行
    onFormInit(() => {
      console.log('表单已初始化')
    })

    // 监听 name 字段值变化
    onFieldValueChange('name', (field) => {
      console.log('name 字段值变化:', field.value)
      // 可以在这里做联动逻辑
      if (field.value === 'admin') {
        const ageField = form.query('age').take() as Field | undefined
        if (ageField) {
          ageField.setValue(25)
          ageField.setPattern('disabled')
        }
      } else {
        const ageField = form.query('age').take() as Field | undefined
        if (ageField) {
          ageField.setPattern('editable')
        }
      }
    })

    // 监听 age 字段值变化
    onFieldValueChange('age', (field) => {
      console.log('age 字段值变化:', field.value)
    })

    // 表单提交时执行
    onFormSubmit(() => {
      console.log('表单提交')
    })

    // 监听表单值变化
    onFormValuesChange(() => {
      console.log('表单值变化:', form.values)
    })
  },
})

// 创建 SchemaField 组件
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    NumberPicker,
  },
})

// 表单 Schema 定义
const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        placeholder: '请输入姓名（输入 admin 试试联动效果）',
      },
      'x-validator': [
        { required: true, message: '姓名不能为空' },
        { min: 2, message: '姓名至少2个字符' },
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
  },
}

const CoreExample = () => {
  const [fieldStates, setFieldStates] = useState<Record<string, unknown>>({})
  const [formState, setFormState] = useState({
    submitting: false,
    validating: false,
    modified: false,
    valid: false,
  })

  // 获取字段状态
  const updateFieldStates = () => {
    const nameField = form.query('name').take() as Field | undefined
    const ageField = form.query('age').take() as Field | undefined
    setFieldStates({
      name: {
        value: nameField?.value,
        errors: nameField?.errors,
        warnings: nameField?.warnings,
        validating: nameField?.validating,
        disabled: nameField?.disabled,
        readOnly: nameField?.readOnly,
      },
      age: {
        value: ageField?.value,
        errors: ageField?.errors,
        warnings: ageField?.warnings,
        validating: ageField?.validating,
        disabled: ageField?.disabled,
        readOnly: ageField?.readOnly,
      },
    })
  }

  // 更新表单状态
  const updateFormState = () => {
    const state = form.getFormState()
    setFormState({
      submitting: state.submitting ?? false,
      validating: state.validating ?? false,
      modified: state.modified ?? false,
      valid: state.valid ?? false,
    })
  }

  // 初始化状态
  useEffect(() => {
    updateFieldStates()
    updateFormState()
    
    // 使用定时器定期更新状态（简单方式）
    const timer = setInterval(() => {
      updateFieldStates()
      updateFormState()
    }, 500)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (values: Record<string, unknown>) => {
    console.log('表单提交数据:', values)
    // 可以通过 form 实例获取值
    const formValues = form.values
    console.log('通过 form.values 获取:', formValues)
    
    // 验证表单
    const errors = await form.validate()
    if (errors.length === 0) {
      console.log('表单验证通过')
    } else {
      console.log('表单验证失败:', errors)
    }
  }

  // 演示 @formily/core API
  const demoAPI = () => {
    return (
      <div style={{ marginTop: 16 }}>
        <Title level={5}>@formily/core 核心 API 演示</Title>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <Text strong>1. 获取表单值：</Text>
            <Tag color="blue">form.values</Tag>
            <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 8 }}>
              {JSON.stringify(form.values, null, 2)}
            </pre>
          </div>

          <div>
            <Text strong>2. 获取字段值：</Text>
            <Tag color="blue">form.query('name').value()</Tag>
            <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 8 }}>
              name: {String(form.query('name').value() || '')}
            </pre>
          </div>

          <div>
            <Text strong>3. 设置字段值：</Text>
            <Tag color="green">field.setValue('新值')</Tag>
            <Space style={{ marginTop: 8 }}>
              <Button
                size="small"
                onClick={() => {
                  const nameField = form.query('name').take() as Field | undefined
                  nameField?.setValue('张三')
                  updateFieldStates()
                }}
              >
                设置 name 为 "张三"
              </Button>
              <Button
                size="small"
                onClick={() => {
                  const ageField = form.query('age').take() as Field | undefined
                  ageField?.setValue(25)
                  updateFieldStates()
                }}
              >
                设置 age 为 25
              </Button>
            </Space>
          </div>

          <div>
            <Text strong>4. 字段状态：</Text>
            <Tag color="purple">form.query('name').take()</Tag>
            <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 8 }}>
              {JSON.stringify(fieldStates, null, 2)}
            </pre>
          </div>

          <div>
            <Text strong>5. 表单状态：</Text>
            <Tag color="orange">form.getFormState()</Tag>
            <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 8 }}>
              {JSON.stringify(formState, null, 2)}
            </pre>
          </div>

          <div>
            <Text strong>6. 重置表单：</Text>
            <Tag color="red">form.reset()</Tag>
            <div style={{ marginTop: 8 }}>
              <Button
                size="small"
                onClick={() => {
                  form.reset()
                  updateFieldStates()
                  updateFormState()
                }}
              >
                重置表单
              </Button>
            </div>
          </div>
        </Space>
      </div>
    )
  }

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          @formily/core 核心学习示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          这个示例展示了 @formily/core 的核心 API 和概念，包括表单实例创建、字段操作、状态管理等。
        </Paragraph>
      </div>

      <Card>
        <Form form={form} labelCol={6} wrapperCol={16} onAutoSubmit={handleSubmit}>
          <SchemaField schema={schema} />
          <div className="form-actions" style={{ marginTop: 16 }}>
            <Reset>重置</Reset>
            <Submit type="primary">提交</Submit>
          </div>
        </Form>

        <Divider />

        {demoAPI()}
      </Card>
    </div>
  )
}

export default CoreExample
