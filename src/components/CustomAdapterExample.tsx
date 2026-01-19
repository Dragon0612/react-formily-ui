/**
 * 自定义适配器学习示例
 * 展示如何将普通组件适配到 Formily
 */

import { createForm } from '@formily/core'
import { FormProvider, Field, connect, mapProps, mapReadPretty } from '@formily/react'
import type { GeneralField } from '@formily/core'
import { Form, FormItem } from '@formily/antd-v5'
import { Card, Typography, Space, Input, Divider, Alert, InputNumber } from 'antd'

const { Title, Paragraph, Text } = Typography

// ========== 示例 1: 适配简单的受控组件 ==========

// 一个简单的自定义输入框组件
const SimpleInput = (props: {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}) => {
  const { value, onChange, placeholder, disabled } = props
  return (
    <input
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        padding: '4px 11px',
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        width: '100%',
        fontSize: '14px',
      }}
    />
  )
}

// 使用 connect 适配组件（最简单的方式）
const FormilySimpleInput = connect(SimpleInput)

// ========== 示例 2: 适配带属性映射的组件 ==========

// 一个带前缀的输入框组件
const PrefixInput = (props: {
  value?: string
  onChange?: (value: string) => void
  prefix?: string
  placeholder?: string
}) => {
  const { value, onChange, prefix, placeholder } = props
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {prefix && <span style={{ marginRight: 8, color: '#666' }}>{prefix}</span>}
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

// 使用 mapProps 映射属性
const FormilyPrefixInput = connect(
  PrefixInput,
  mapProps((props: any, field?: GeneralField) => {
    return {
      ...props,
      // 使用字段的 title 作为 prefix
      prefix: field?.title || '输入:',
    }
  })
)

// ========== 示例 3: 适配非标准接口的组件 ==========

// 一个非标准接口的组件（使用 text 而不是 value）
const NonStandardInput = (props: {
  text?: string
  onTextChange?: (text: string) => void
  label?: string
}) => {
  const { text, onTextChange, label } = props
  return (
    <div>
      {label && <div style={{ marginBottom: 4, fontSize: 12 }}>{label}</div>}
      <Input
        value={text}
        onChange={(e) => onTextChange?.(e.target.value)}
      />
    </div>
  )
}

// 使用 mapProps 将 value/onChange 映射为 text/onTextChange
const FormilyNonStandardInput = connect(
  NonStandardInput,
  mapProps((props: any, field?: GeneralField) => {
    return {
      text: props.value,  // value -> text
      onTextChange: props.onChange,  // onChange -> onTextChange
      label: field?.title,
    }
  })
)

// ========== 示例 4: 适配带验证状态的组件 ==========

// 一个带错误提示的输入框
const ValidatedInput = (props: {
  value?: string
  onChange?: (value: string) => void
  error?: string
  placeholder?: string
}) => {
  const { value, onChange, error, placeholder } = props
  return (
    <div>
      <Input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        status={error ? 'error' : undefined}
      />
      {error && (
        <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>
          {error}
        </div>
      )}
    </div>
  )
}

// 映射错误信息
const FormilyValidatedInput = connect(
  ValidatedInput,
  mapProps((props: any, field?: GeneralField) => {
    const fieldErrors = (field as any)?.errors
    return {
      ...props,
      error: fieldErrors?.[0]?.message,
    }
  })
)

// ========== 示例 5: 适配带阅读态的组件 ==========

// 一个带阅读态的组件
const ReadPrettyComponent = (props: { value?: string; label?: string }) => {
  const { value, label } = props
  return (
    <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: 4 }}>
      {label && <span style={{ marginRight: 8, color: '#666' }}>{label}:</span>}
      <span>{value || '（空）'}</span>
    </div>
  )
}

// 使用 mapReadPretty 添加阅读态支持
const FormilyReadPrettyInput = connect(
  PrefixInput,
  mapProps((props: any, field?: GeneralField) => ({
    ...props,
    prefix: field?.title || '输入:',
  })),
  mapReadPretty(ReadPrettyComponent)
)

// ========== 示例 6: 适配复杂组件（带多个值的组件）==========

// 一个范围选择器组件
const RangeInput = (props: {
  value?: { min?: number; max?: number }
  onChange?: (value: { min?: number; max?: number }) => void
  label?: string
}) => {
  const { value = {}, onChange, label } = props
  return (
    <div>
      {label && <div style={{ marginBottom: 8 }}>{label}</div>}
      <Space>
        <InputNumber
          value={value.min}
          onChange={(min) => onChange?.({ ...value, min: min ?? undefined })}
          placeholder="最小值"
          style={{ width: 120 }}
        />
        <span>~</span>
        <InputNumber
          value={value.max}
          onChange={(max) => onChange?.({ ...value, max: max ?? undefined })}
          placeholder="最大值"
          style={{ width: 120 }}
        />
      </Space>
    </div>
  )
}

// 适配范围选择器
const FormilyRangeInput = connect(
  RangeInput,
  mapProps((props: any, field?: GeneralField) => ({
    ...props,
    label: field?.title,
  }))
)

// ========== 示例 7: 适配带副作用的组件 ==========

// 一个带自动格式化的输入框（自动添加前缀）
const AutoFormatInput = (props: {
  value?: string
  onChange?: (value: string) => void
  prefix?: string
  placeholder?: string
}) => {
  const { value, onChange, prefix, placeholder } = props

  const handleChange = (newValue: string) => {
    // 自动添加前缀
    if (prefix && newValue && !newValue.startsWith(prefix)) {
      onChange?.(prefix + newValue)
    } else {
      onChange?.(newValue)
    }
  }

  return (
    <Input
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      prefix={prefix ? <span>{prefix}</span> : undefined}
    />
  )
}

const FormilyAutoFormatInput = connect(
  AutoFormatInput,
  mapProps((props: any) => ({
    ...props,
    prefix: 'https://',
  }))
)

// ========== 创建表单实例 ==========
const form = createForm({
  initialValues: {
    simpleInput: '',
    prefixInput: '',
    nonStandardInput: '',
    validatedInput: '',
    readPrettyInput: '这是阅读态的值',
    rangeInput: { min: 0, max: 100 },
    autoFormatInput: '',
  },
})

// ========== 主组件 ==========
const CustomAdapterExample = () => {
  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          自定义适配器学习示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          学习如何使用 connect、mapProps、mapReadPretty 等 API 将普通组件适配到 Formily。
          这是理解 Formily 工作原理的重要部分。
        </Paragraph>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Alert
          message="核心概念"
          description={
            <div>
              <p><strong>connect：</strong>将普通组件连接到 Formily，使其能够接收 value 和 onChange</p>
              <p><strong>mapProps：</strong>映射属性，可以将 Formily 的字段属性映射到组件的 props</p>
              <p><strong>mapReadPretty：</strong>添加阅读态支持，当字段为只读时显示不同的 UI</p>
            </div>
          }
          type="info"
          showIcon
        />

        <FormProvider form={form}>
          <Form form={form} labelCol={6} wrapperCol={16}>
            {/* 示例 1: 简单适配 */}
            <Card title="示例 1: 适配简单的受控组件" type="inner">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="最简单的适配方式"
                  description="使用 connect() 直接包装组件，组件只需要支持 value 和 onChange 即可。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Field
                  name="simpleInput"
                  title="简单输入框"
                  decorator={[FormItem]}
                  component={[FormilySimpleInput, { placeholder: '这是一个自定义的简单输入框' }]}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 提示：这个组件是原生的 input 元素，通过 connect 适配后可以在 Formily 中使用
                </Text>
              </Space>
            </Card>

            {/* 示例 2: 属性映射 */}
            <Card title="示例 2: 适配带属性映射的组件" type="inner">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="使用 mapProps 映射属性"
                  description="可以将字段的 title 等属性映射到组件的 props，实现自动配置。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Field
                  name="prefixInput"
                  title="用户名"
                  decorator={[FormItem]}
                  component={[FormilyPrefixInput, { placeholder: '输入用户名' }]}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 提示：prefix 自动从字段的 title 获取，无需手动传递
                </Text>
              </Space>
            </Card>

            {/* 示例 3: 非标准接口 */}
            <Card title="示例 3: 适配非标准接口的组件" type="inner">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="处理非标准接口"
                  description="如果组件使用的不是 value/onChange，可以使用 mapProps 进行映射。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Field
                  name="nonStandardInput"
                  title="非标准接口输入框"
                  decorator={[FormItem]}
                  component={[FormilyNonStandardInput, { placeholder: '组件使用 text/onTextChange' }]}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 提示：组件内部使用 text/onTextChange，通过 mapProps 映射为 value/onChange
                </Text>
              </Space>
            </Card>

            {/* 示例 4: 验证状态 */}
            <Card title="示例 4: 适配带验证状态的组件" type="inner">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="集成验证状态"
                  description="可以将字段的错误信息映射到组件，实现自定义的错误显示。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Field
                  name="validatedInput"
                  title="带验证的输入框"
                  decorator={[FormItem]}
                  component={[FormilyValidatedInput, { placeholder: '输入至少3个字符' }]}
                  validator={(value) => {
                    if (!value) return '请输入值'
                    if (value.length < 3) return '至少需要3个字符'
                    return ''
                  }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 提示：输入少于3个字符会显示错误信息
                </Text>
              </Space>
            </Card>

            {/* 示例 5: 阅读态 */}
            <Card title="示例 5: 适配带阅读态的组件" type="inner">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="阅读态支持"
                  description="使用 mapReadPretty 可以在字段为只读时显示不同的 UI。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Field
                  name="readPrettyInput"
                  title="阅读态输入框"
                  decorator={[FormItem]}
                  component={[FormilyReadPrettyInput]}
                  readOnly
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 提示：字段设置为 readOnly 时，会自动使用阅读态组件显示
                </Text>
              </Space>
            </Card>

            {/* 示例 6: 复杂组件 */}
            <Card title="示例 6: 适配复杂组件（范围选择器）" type="inner">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="复杂数据结构"
                  description="可以适配处理对象、数组等复杂数据结构的组件。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Field
                  name="rangeInput"
                  title="数值范围"
                  decorator={[FormItem]}
                  component={[FormilyRangeInput]}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 提示：这个组件处理的是对象类型的数据 {`{ min, max }`}
                </Text>
              </Space>
            </Card>

            {/* 示例 7: 带副作用的组件 */}
            <Card title="示例 7: 适配带副作用的组件（自动格式化）" type="inner">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Alert
                  message="自动格式化"
                  description="可以在适配器中添加自动格式化逻辑，如自动添加前缀、格式化等。"
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Field
                  name="autoFormatInput"
                  title="URL 输入框"
                  decorator={[FormItem]}
                  component={[FormilyAutoFormatInput, { placeholder: '输入域名，会自动添加 https://' }]}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  💡 提示：输入时会自动添加 https:// 前缀
                </Text>
              </Space>
            </Card>
          </Form>
        </FormProvider>

        {/* 适配器总结 */}
        <Card title="适配器 API 总结" type="inner">
          <Space direction="vertical" style={{ width: '100%' }} size="small">
            <div>
              <Text strong>1. connect(Component, ...enhancers)</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>将普通组件连接到 Formily</Text>
              </li>
              <li>
                <Text>组件需要支持 value 和 onChange（或通过 mapProps 映射）</Text>
              </li>
              <li>
                <Text>可以传入多个 enhancer（如 mapProps、mapReadPretty）</Text>
              </li>
            </ul>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>2. mapProps((props, field) =&gt; newProps)</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>映射属性，可以将字段属性映射到组件 props</Text>
              </li>
              <li>
                <Text>可以访问 field 对象，获取字段的 title、errors、disabled 等</Text>
              </li>
              <li>
                <Text>可以处理非标准接口（如 text/onTextChange）</Text>
              </li>
            </ul>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>3. mapReadPretty(ReadPrettyComponent)</Text>
            </div>
            <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>添加阅读态支持</Text>
              </li>
              <li>
                <Text>当字段为 readOnly 或 readPretty 时，使用阅读态组件</Text>
              </li>
              <li>
                <Text>阅读态组件只需要接收 value 和 label 等展示属性</Text>
              </li>
            </ul>

            <Divider style={{ margin: '12px 0' }} />

            <div>
              <Text strong>适配步骤：</Text>
            </div>
            <ol style={{ margin: '8px 0', paddingLeft: 20 }}>
              <li>
                <Text>确定组件的接口（props 结构）</Text>
              </li>
              <li>
                <Text>如果接口标准（value/onChange），直接使用 connect</Text>
              </li>
              <li>
                <Text>如果接口非标准，使用 mapProps 进行映射</Text>
              </li>
              <li>
                <Text>如果需要阅读态，使用 mapReadPretty</Text>
              </li>
              <li>
                <Text>在 SchemaField 中注册组件，或在 Field 中直接使用</Text>
              </li>
            </ol>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default CustomAdapterExample
