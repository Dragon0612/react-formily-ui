/**
 * @formily/react 完整 API 学习示例
 * 展示 @formily/react 的所有主要 API 用法
 */

import { createForm } from '@formily/core'
import {
  FormProvider,
  FormConsumer,
  Field,
  useForm,
  useField,
  createSchemaField,
  connect,
  mapProps,
  mapReadPretty,
  observer,
  RecursionField,
  ObjectField,
  ArrayField,
  VoidField,
  ExpressionScope,
} from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  NumberPicker,
  FormGrid,
} from '@formily/antd-v5'
import { Card, Typography, Space, Button, Divider, Tag, Tabs, Alert } from 'antd'
import { useState } from 'react'

const { Title, Paragraph, Text } = Typography

// ========== 示例 1: FormProvider & FormConsumer ==========
const FormInfoDisplay = () => {
  return (
    <FormConsumer>
      {(form) => {
        const formState = form?.getFormState()
        return (
          <div>
            <Text strong>表单状态：</Text>
            <Tag color="blue">submitting: {String(formState?.submitting ?? false)}</Tag>
            <Tag color="green">valid: {String(formState?.valid ?? false)}</Tag>
            <Tag color="orange">modified: {String(formState?.modified ?? false)}</Tag>
          </div>
        )
      }}
    </FormConsumer>
  )
}

// ========== 示例 2: useForm Hook ==========
const UseFormExample = () => {
  const form = useForm()
  
  return (
    <div>
      <Text strong>useForm Hook：</Text>
      <Space>
        <Button
          size="small"
          onClick={() => {
            const field = form.query('username').take()
            ;(field as any)?.setValue('通过 useForm 设置的值')
          }}
        >
          设置 username
        </Button>
        <Button
          size="small"
          onClick={() => {
            console.log('表单值:', form.values)
          }}
        >
          打印表单值
        </Button>
      </Space>
    </div>
  )
}

// ========== 示例 3: useField Hook ==========
const UseFieldExample = () => {
  const form = useForm()
  const field = useField()
  
  // 如果 useField 返回 undefined，尝试通过 form.query 获取
  const fieldInstance = field || form.query('fieldWithHook').take()
  
  if (!fieldInstance) {
    return (
      <div>
        <Text type="warning">无法获取字段实例</Text>
      </div>
    )
  }
  
  return (
    <div>
      <Text strong>useField Hook：</Text>
      <Space>
        <Tag>字段名: {fieldInstance.path?.toString() || 'fieldWithHook'}</Tag>
        <Tag>字段值: {String((fieldInstance as any).value || '')}</Tag>
        <Tag>错误: {(fieldInstance as any).errors?.[0]?.message || '无'}</Tag>
        <Button
          size="small"
          onClick={() => {
            ;(fieldInstance as any).setValue('通过 useField 设置的值')
          }}
        >
          设置值
        </Button>
      </Space>
    </div>
  )
}

// ========== 示例 4: useFormState Hook (通过 useForm 获取) ==========
const UseFormStateExample = () => {
  const form = useForm()
  const formState = form.getFormState()
  
  return (
    <div>
      <Text strong>useFormState (通过 useForm().getFormState())：</Text>
      <Space>
        <Tag color={formState.submitting ? 'red' : 'blue'}>
          submitting: {String(formState.submitting)}
        </Tag>
        <Tag color={formState.valid ? 'green' : 'orange'}>
          valid: {String(formState.valid)}
        </Tag>
        <Tag>modified: {String(formState.modified)}</Tag>
      </Space>
    </div>
  )
}

// ========== 示例 5: useFieldState Hook (通过 useField 获取) ==========
const UseFieldStateExample = () => {
  const form = useForm()
  const field = useField()
  
  // 如果 useField 返回 undefined，尝试通过 form.query 获取
  const fieldInstance = field || form.query('fieldStateField').take()
  
  if (!fieldInstance) {
    return (
      <div>
        <Text type="warning">无法获取字段实例</Text>
      </div>
    )
  }
  
  const fieldState = (fieldInstance as any).getState ? (fieldInstance as any).getState() : fieldInstance
  
  return (
    <div>
      <Text strong>useFieldState (通过 useField() 获取)：</Text>
      <Space>
        <Tag>值: {String(fieldState?.value || '')}</Tag>
        <Tag color={fieldState?.errors?.length ? 'red' : 'green'}>
          错误: {fieldState?.errors?.[0]?.message || '无'}
        </Tag>
        <Tag>disabled: {String(fieldState?.disabled ?? false)}</Tag>
      </Space>
    </div>
  )
}

// ========== 示例 6: connect & mapProps ==========
const CustomInputComponent = (props: {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  prefix?: string
}) => {
  const { value, onChange, placeholder, prefix } = props
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {prefix && <span style={{ marginRight: 8 }}>{prefix}</span>}
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

// 使用 connect 和 mapProps 连接组件
const ConnectedInput = connect(
  CustomInputComponent,
  mapProps((props, field) => {
    return {
      ...props,
      prefix: field?.title || '输入:',
    }
  })
)

// ========== 示例 7: mapReadPretty - 阅读态 ==========
const ReadPrettyComponent = (props: { value?: string }) => {
  return (
    <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
      {props.value || '暂无值'}
    </div>
  )
}

const ReadPrettyInput = connect(
  CustomInputComponent,
  mapReadPretty(ReadPrettyComponent)
)

// ========== 示例 8: observer - 响应式包装 ==========
const ObserverComponent = observer((props: { count: number }) => {
  return (
    <div>
      <Text strong>Observer 组件（响应式）：</Text>
      <Tag color="purple">计数: {props.count}</Tag>
    </div>
  )
})

// ========== 示例 9: RecursionField - 递归字段 ==========
const RecursionFieldExample = () => {
  const schema = {
    type: 'string',
    title: '递归字段示例',
    'x-decorator': 'FormItem',
    'x-component': 'Input',
    'x-component-props': {
      placeholder: '这是一个递归字段',
    },
  }

  return <RecursionField schema={schema} name="recursionField" />
}

// ========== 示例 10: ObjectField - 对象字段 ==========
const ObjectFieldExample = () => {
  return (
    <ObjectField name="objectField">
      <Field
        name="name"
        title="姓名"
        decorator={[FormItem]}
        component={[Input]}
      />
      <Field
        name="age"
        title="年龄"
        decorator={[FormItem]}
        component={[NumberPicker]}
      />
    </ObjectField>
  )
}

// ========== 示例 11: ArrayField - 数组字段 ==========
const ArrayFieldExample = () => {
  return (
    <ArrayField name="arrayField">
      {(field) => (
        <div>
          <Text strong>数组字段（当前 {field.value?.length || 0} 项）：</Text>
          {(field.value as any[])?.map((_, index: number) => (
            <Field
              key={index}
              name={index}
              title={`项目 ${index + 1}`}
              decorator={[FormItem]}
              component={[Input]}
            />
          ))}
          <Button
            size="small"
            onClick={() => {
              field.push('')
            }}
            style={{ marginTop: 8 }}
          >
            添加项目
          </Button>
        </div>
      )}
    </ArrayField>
  )
}

// ========== 示例 12: VoidField - 空字段 ==========
const VoidFieldExample = () => {
  return (
    <VoidField name="voidField">
      <div style={{ padding: 16, background: '#f0f0f0', borderRadius: 4 }}>
        <Text strong>VoidField 示例：</Text>
        <Text>这是一个空字段，不存储数据，只用于布局或展示</Text>
      </div>
    </VoidField>
  )
}

// ========== 示例 13: ExpressionScope - 表达式作用域 ==========
const ExpressionScopeExample = () => {
  return (
    <ExpressionScope value={{ customVar: '自定义变量值' }}>
      <Field
        name="expressionField"
        title="表达式作用域字段"
        decorator={[FormItem]}
        component={[Input, { placeholder: '可以使用 $customVar 访问作用域变量' }]}
      />
    </ExpressionScope>
  )
}

// ========== 创建表单实例 ==========
const form1 = createForm({
  initialValues: {
    username: '',
    fieldWithHook: '',
    formStateField: '',
    fieldStateField: '',
    connectedField: '',
    readPrettyField: '这是阅读态字段',
    recursionField: '',
    objectField: {
      name: '',
      age: 18,
    },
    arrayField: ['项目1'],
    expressionField: '',
  },
})

// ========== SchemaField ==========
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    NumberPicker,
    FormGrid,
    ConnectedInput,
    ReadPrettyInput,
  },
})

const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: '用户名',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
}

// ========== 主组件 ==========
const ReactExample = () => {
  const [activeTab, setActiveTab] = useState('1')

  const tabItems = [
    {
      key: '1',
      label: 'Hooks API',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="1. useForm Hook" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <UseFormExample />
                <Field
                  name="username"
                  title="用户名"
                  decorator={[FormItem]}
                  component={[Input]}
                />
              </Form>
            </FormProvider>
          </Card>

          <Card title="2. useField Hook" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <Field
                  name="fieldWithHook"
                  title="带 Hook 的字段"
                  decorator={[FormItem]}
                  component={[Input]}
                />
                <UseFieldExample />
              </Form>
            </FormProvider>
          </Card>

          <Card title="3. useFormState (通过 useForm)" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <UseFormStateExample />
                <Field
                  name="formStateField"
                  title="表单状态字段"
                  decorator={[FormItem]}
                  component={[Input]}
                />
              </Form>
            </FormProvider>
          </Card>

          <Card title="4. useFieldState (通过 useField)" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <Field
                  name="fieldStateField"
                  title="字段状态字段"
                  decorator={[FormItem]}
                  component={[Input]}
                />
                <UseFieldStateExample />
              </Form>
            </FormProvider>
          </Card>
        </Space>
      ),
    },
    {
      key: '2',
      label: '组件 API',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="5. FormProvider & FormConsumer" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <FormInfoDisplay />
                <Field
                  name="username"
                  title="用户名"
                  decorator={[FormItem]}
                  component={[Input]}
                />
              </Form>
            </FormProvider>
          </Card>

          <Card title="6. Field 组件" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <Field
                  name="username"
                  title="Field 组件示例"
                  decorator={[FormItem]}
                  component={[Input, { placeholder: '使用 Field 组件创建的字段' }]}
                />
              </Form>
            </FormProvider>
          </Card>

          <Card title="7. SchemaField" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <SchemaField schema={schema} />
              </Form>
            </FormProvider>
          </Card>

          <Card title="8. RecursionField" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <RecursionFieldExample />
              </Form>
            </FormProvider>
          </Card>

          <Card title="9. ObjectField" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <ObjectFieldExample />
              </Form>
            </FormProvider>
          </Card>

          <Card title="10. ArrayField" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <ArrayFieldExample />
              </Form>
            </FormProvider>
          </Card>

          <Card title="11. VoidField" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <VoidFieldExample />
              </Form>
            </FormProvider>
          </Card>

          <Card title="12. ExpressionScope" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <ExpressionScopeExample />
              </Form>
            </FormProvider>
          </Card>
        </Space>
      ),
    },
    {
      key: '3',
      label: '组件连接 API',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Card title="13. connect & mapProps" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <Field
                  name="connectedField"
                  title="连接的自定义组件"
                  decorator={[FormItem]}
                  component={[ConnectedInput, { placeholder: '这是一个通过 connect 连接的自定义组件' }]}
                />
              </Form>
            </FormProvider>
          </Card>

          <Card title="14. mapReadPretty" type="inner">
            <FormProvider form={form1}>
              <Form form={form1} labelCol={6} wrapperCol={16}>
                <Field
                  name="readPrettyField"
                  title="阅读态字段"
                  decorator={[FormItem]}
                  component={[ReadPrettyInput]}
                />
              </Form>
            </FormProvider>
          </Card>

          <Card title="15. observer" type="inner">
            <ObserverComponent count={42} />
            <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
              observer 用于包装组件，使其能够响应 observable 的变化
            </Text>
          </Card>
        </Space>
      ),
    },
  ]

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          @formily/react 完整 API 学习示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          这个示例展示了 @formily/react 的所有主要 API，包括 Hooks、组件、连接器等。
        </Paragraph>
      </div>

      <Card>
        <Alert
          message="API 说明"
          description="本示例涵盖了 @formily/react 的主要 API，包括 Hooks、组件、连接器等。每个示例都展示了具体的用法。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        <Divider />

        <Card title="API 列表" type="inner" style={{ marginTop: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <div>
              <Text strong>Hooks API：</Text>
              <Tag>useForm</Tag>
              <Tag>useField</Tag>
              <Tag>useForm().getFormState()</Tag>
              <Tag>useField()</Tag>
            </div>
            <div>
              <Text strong>组件 API：</Text>
              <Tag>FormProvider</Tag>
              <Tag>FormConsumer</Tag>
              <Tag>Field</Tag>
              <Tag>SchemaField</Tag>
              <Tag>RecursionField</Tag>
              <Tag>ObjectField</Tag>
              <Tag>ArrayField</Tag>
              <Tag>VoidField</Tag>
              <Tag>ExpressionScope</Tag>
            </div>
            <div>
              <Text strong>连接器 API：</Text>
              <Tag>connect</Tag>
              <Tag>mapProps</Tag>
              <Tag>mapReadPretty</Tag>
              <Tag>observer</Tag>
            </div>
            <div>
              <Text strong>工具函数：</Text>
              <Tag>createSchemaField</Tag>
            </div>
          </Space>
        </Card>
      </Card>
    </div>
  )
}

export default ReactExample

