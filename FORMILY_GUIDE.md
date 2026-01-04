# Formily 学习指南

## 📚 目录

1. [核心概念](#核心概念)
2. [基础用法](#基础用法)
3. [表单验证](#表单验证)
4. [字段联动](#字段联动)
5. [异步操作](#异步操作)
6. [自定义组件](#自定义组件)
7. [常见业务场景](#常见业务场景)
8. [最佳实践](#最佳实践)

---

## 核心概念

### 1. Form（表单模型）

Form 是 Formily 的核心，管理整个表单的状态。

```typescript
import { createForm } from '@formily/core'

const form = createForm({
  // 初始值
  initialValues: {
    username: 'admin',
    age: 25
  },
  
  // 副作用逻辑（联动、校验等）
  effects() {
    // 监听字段变化、执行联动逻辑
  },
  
  // 校验配置
  validateFirst: true, // 遇到第一个错误就停止
})
```

### 2. Field（字段模型）

每个表单项都是一个 Field，包含值、校验状态、显示状态等。

**字段状态：**
- `value`: 字段值
- `errors`: 错误信息
- `warnings`: 警告信息
- `loading`: 加载状态
- `disabled`: 禁用状态
- `readOnly`: 只读状态
- `visible`: 可见性

**字段模式（Pattern）：**
- `editable`: 可编辑（默认）
- `disabled`: 禁用
- `readOnly`: 只读
- `readPretty`: 阅读态（美化展示）

### 3. Schema（表单协议）

Schema 是 JSON 格式的表单配置协议，描述表单结构。

```typescript
const schema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      title: '用户名',
      required: true,
      'x-decorator': 'FormItem',     // 包装器组件
      'x-component': 'Input',        // UI 组件
      'x-component-props': {         // 组件属性
        placeholder: '请输入用户名'
      }
    }
  }
}
```

**Schema 关键字：**
- `type`: 数据类型（string, number, boolean, object, array）
- `title`: 标题
- `required`: 是否必填
- `default`: 默认值
- `enum`: 枚举值
- `x-decorator`: 装饰器组件（通常是 FormItem）
- `x-component`: UI 组件
- `x-component-props`: 组件属性
- `x-validator`: 校验规则
- `x-reactions`: 联动规则

---

## 基础用法

### 1. 创建简单表单

```typescript
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Form, FormItem, Input, Submit } from '@formily/antd-v5'

const form = createForm()

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
  }
})

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: '姓名',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    }
  }
}

function MyForm() {
  return (
    <Form form={form} onSubmit={console.log}>
      <SchemaField schema={schema} />
      <Submit>提交</Submit>
    </Form>
  )
}
```

### 2. 表单布局

```typescript
// 水平布局
<Form form={form} labelCol={6} wrapperCol={16}>

// 垂直布局
<Form form={form} layout="vertical">

// 内联布局
<Form form={form} layout="inline">

// 使用 FormGrid 网格布局
const schema = {
  type: 'void',
  'x-component': 'FormGrid',
  'x-component-props': {
    maxColumns: 3,  // 最多3列
    minColumns: 1,  // 最少1列（响应式）
  },
  properties: {
    field1: { /* ... */ },
    field2: { /* ... */ },
  }
}
```

---

## 表单验证

### 1. 内置校验规则

```typescript
const schema = {
  properties: {
    username: {
      'x-validator': [
        { required: true, message: '用户名必填' },
        { min: 3, message: '至少3个字符' },
        { max: 20, message: '最多20个字符' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '只能包含字母数字下划线' },
      ]
    },
    email: {
      'x-validator': [
        { required: true },
        { format: 'email', message: '邮箱格式不正确' },  // 内置格式校验
      ]
    },
    url: {
      'x-validator': [
        { format: 'url' }  // 内置 URL 校验
      ]
    }
  }
}
```

**内置格式：**
- `email`: 邮箱
- `url`: URL
- `phone`: 手机号
- `idcard`: 身份证
- `zip`: 邮政编码
- `number`: 数字
- `integer`: 整数

### 2. 自定义校验函数

```typescript
{
  'x-validator': [
    {
      validator(value, rule) {
        if (!value) return ''
        if (value.length < 6) {
          return '密码至少6位'
        }
        if (!/\d/.test(value)) {
          return '密码必须包含数字'
        }
        if (!/[a-zA-Z]/.test(value)) {
          return '密码必须包含字母'
        }
        return ''  // 返回空字符串表示通过
      }
    }
  ]
}
```

### 3. 异步校验

```typescript
{
  'x-validator': [
    {
      async validator(value) {
        if (!value) return ''
        
        // 模拟异步检查用户名是否存在
        const response = await fetch(`/api/check-username?name=${value}`)
        const { exists } = await response.json()
        
        if (exists) {
          return '用户名已存在'
        }
        return ''
      }
    }
  ]
}
```

---

## 字段联动

### 1. 使用 Effects（推荐）

```typescript
import { createForm, onFieldValueChange } from '@formily/core'

const form = createForm({
  effects() {
    // 监听某个字段值变化
    onFieldValueChange('country', (field) => {
      const cityField = form.query('city').take()
      
      // 根据国家切换城市选项
      if (field.value === 'china') {
        cityField.setDataSource([
          { label: '北京', value: 'beijing' },
          { label: '上海', value: 'shanghai' },
        ])
      } else if (field.value === 'usa') {
        cityField.setDataSource([
          { label: 'New York', value: 'ny' },
          { label: 'Los Angeles', value: 'la' },
        ])
      }
    })
  }
})
```

### 2. 使用 x-reactions（Schema 方式）

```typescript
const schema = {
  properties: {
    type: {
      type: 'string',
      enum: [
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'company' }
      ]
    },
    companyName: {
      type: 'string',
      title: '公司名称',
      'x-reactions': {
        dependencies: ['type'],  // 依赖的字段
        fulfill: {
          state: {
            // 当 type === 'company' 时显示
            visible: '{{$deps[0] === "company"}}',
          }
        }
      }
    }
  }
}
```

### 3. 常见联动场景

**显示/隐藏：**
```typescript
'x-reactions': {
  dependencies: ['showAdvanced'],
  fulfill: {
    state: {
      visible: '{{$deps[0]}}',  // 根据复选框控制显示
    }
  }
}
```

**启用/禁用：**
```typescript
'x-reactions': {
  dependencies: ['agreed'],
  fulfill: {
    state: {
      disabled: '{{!$deps[0]}}',  // 必须同意协议才能提交
    }
  }
}
```

**动态必填：**
```typescript
'x-reactions': {
  dependencies: ['userType'],
  fulfill: {
    state: {
      required: '{{$deps[0] === "company"}}',  // 企业用户必填
    }
  }
}
```

---

## 异步操作

### 1. 异步数据源

```typescript
import { createForm, onFormMount } from '@formily/core'

const form = createForm({
  effects() {
    onFormMount(async () => {
      // 表单挂载后加载数据
      const categoryField = form.query('category').take()
      
      categoryField.setLoading(true)
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        categoryField.setDataSource(data)
      } finally {
        categoryField.setLoading(false)
      }
    })
  }
})
```

### 2. 级联异步加载

```typescript
const form = createForm({
  effects() {
    onFieldValueChange('province', async (field) => {
      const cityField = form.query('city').take()
      
      if (!field.value) {
        cityField.setDataSource([])
        return
      }
      
      cityField.setLoading(true)
      try {
        const res = await fetch(`/api/cities?province=${field.value}`)
        const cities = await res.json()
        cityField.setDataSource(cities)
        cityField.setValue(null)  // 清空已选城市
      } finally {
        cityField.setLoading(false)
      }
    })
  }
})
```

---

## 自定义组件

### 1. 包装现有组件

```typescript
import { connect, mapProps } from '@formily/react'
import { Rate } from 'antd'

// 简单包装
const FormilyRate = connect(Rate)

// 带属性映射
const FormilyRate = connect(
  Rate,
  mapProps({
    value: 'value',
    readOnly: 'disabled',
  })
)

// 使用
const SchemaField = createSchemaField({
  components: {
    FormItem,
    Rate: FormilyRate,
  }
})
```

### 2. 自定义复合组件

```typescript
import { observer } from '@formily/react'

// 自定义图片上传组件
const ImageUploader = observer((props) => {
  const { value, onChange } = props
  
  const handleUpload = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    const { url } = await res.json()
    onChange(url)
  }
  
  return (
    <div>
      {value && <img src={value} alt="preview" />}
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
    </div>
  )
})

// 连接到 Formily
const FormilyImageUploader = connect(ImageUploader)
```

---

## 常见业务场景

### 1. 搜索表单

```typescript
const searchSchema = {
  type: 'object',
  properties: {
    grid: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': { maxColumns: 4 },
      properties: {
        keyword: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '关键词搜索',
            allowClear: true,
          }
        },
        dateRange: {
          type: 'array',
          'x-decorator': 'FormItem',
          'x-component': 'DatePicker.RangePicker',
        },
        status: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          enum: [
            { label: '全部', value: '' },
            { label: '进行中', value: 'active' },
            { label: '已完成', value: 'completed' },
          ]
        }
      }
    },
    actions: {
      type: 'void',
      'x-component': 'Space',
      properties: {
        submit: {
          type: 'void',
          'x-component': 'Submit',
          'x-component-props': { children: '搜索' }
        },
        reset: {
          type: 'void',
          'x-component': 'Reset',
          'x-component-props': { children: '重置' }
        }
      }
    }
  }
}
```

### 2. 动态表单（根据配置生成）

```typescript
// 后端返回的配置
const formConfig = [
  { name: 'name', label: '姓名', type: 'input', required: true },
  { name: 'age', label: '年龄', type: 'number', min: 0, max: 150 },
  { name: 'gender', label: '性别', type: 'select', options: ['男', '女'] }
]

// 转换为 Schema
const schema = {
  type: 'object',
  properties: formConfig.reduce((acc, field) => {
    acc[field.name] = {
      type: field.type === 'number' ? 'number' : 'string',
      title: field.label,
      required: field.required,
      'x-decorator': 'FormItem',
      'x-component': field.type === 'select' ? 'Select' : 
                     field.type === 'number' ? 'NumberPicker' : 'Input',
      enum: field.options?.map(opt => ({ label: opt, value: opt })),
      'x-validator': [
        field.required && { required: true },
        field.min && { min: field.min },
        field.max && { max: field.max },
      ].filter(Boolean)
    }
    return acc
  }, {})
}
```

---

## 最佳实践

### 1. 表单拆分

大表单建议拆分为多个小组件：

```typescript
// UserInfoForm.tsx
export const userInfoSchema = { /* ... */ }

// CompanyInfoForm.tsx
export const companyInfoSchema = { /* ... */ }

// MainForm.tsx
const schema = {
  type: 'object',
  properties: {
    userInfo: userInfoSchema,
    companyInfo: companyInfoSchema,
  }
}
```

### 2. 复用校验规则

```typescript
// validators.ts
export const validators = {
  phone: {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入有效的手机号'
  },
  idcard: {
    pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
    message: '请输入有效的身份证号'
  }
}

// 使用
{
  'x-validator': [validators.phone]
}
```

### 3. 统一错误处理

```typescript
const form = createForm({
  onError(errors) {
    // 统一处理表单错误
    console.error('表单校验失败', errors)
    message.error('请检查表单填写')
  }
})
```

### 4. 表单状态持久化

```typescript
import { createForm, onFormValuesChange } from '@formily/core'

const form = createForm({
  effects() {
    onFormValuesChange(() => {
      // 保存到 localStorage
      localStorage.setItem('formDraft', JSON.stringify(form.values))
    })
  }
})

// 恢复草稿
const draft = localStorage.getItem('formDraft')
if (draft) {
  form.setValues(JSON.parse(draft))
}
```

---

## 调试技巧

### 1. 查看表单状态

```typescript
console.log('表单值:', form.values)
console.log('表单错误:', form.errors)
console.log('表单状态:', form.getState())

// 查看某个字段
const field = form.query('username').take()
console.log('字段值:', field.value)
console.log('字段状态:', field.getState())
```

### 2. 手动操作字段

```typescript
const field = form.query('username').take()

field.setValue('new value')         // 设置值
field.setLoading(true)              // 设置加载状态
field.setErrors(['错误信息'])       // 设置错误
field.setPattern('disabled')        // 设置模式
field.setDataSource([...])          // 设置数据源
```

### 3. 表单重置

```typescript
form.reset()                        // 重置为初始值
form.reset({ username: 'admin' })   // 重置为指定值
form.clearErrors()                  // 清除错误
```

---

## 参考资源

- [Formily 官方文档](https://formilyjs.org/)
- [Formily GitHub](https://github.com/alibaba/formily)
- [Ant Design Form](https://ant.design/components/form-cn/)

## 项目中的示例

本项目包含以下示例，可以直接查看源码学习：

1. **BasicForm.tsx** - 基础表单使用
2. **AdvancedForm.tsx** - 表单联动、折叠面板
3. **ArrayForm.tsx** - 数组字段的三种模式
4. **ValidationForm.tsx** - 各种校验场景
5. **AsyncForm.tsx** - 异步数据加载
6. **CustomComponentForm.tsx** - 自定义组件
7. **RealWorldForm.tsx** - 真实业务场景


