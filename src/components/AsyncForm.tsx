/**
 * 异步操作示例
 * 展示异步数据加载、异步校验、级联加载等场景
 */

import { createForm, onFormMount, onFieldValueChange, onFieldInit } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  Cascader,
  FormGrid,
  Submit,
  Reset,
} from '@formily/antd-v5'
import { Typography, Card, Alert, Spin } from 'antd'
import { useState } from 'react'

const { Title, Paragraph } = Typography

// 模拟 API 调用延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟检查用户名是否存在
const checkUsernameExists = async (username: string): Promise<boolean> => {
  await delay(1000)
  // 模拟已存在的用户名
  const existingUsers = ['admin', 'test', 'user', 'demo']
  return existingUsers.includes(username.toLowerCase())
}

// 模拟检查邮箱是否注册
const checkEmailRegistered = async (email: string): Promise<boolean> => {
  await delay(800)
  const registeredEmails = ['test@example.com', 'admin@example.com']
  return registeredEmails.includes(email.toLowerCase())
}

// 模拟获取城市列表
const fetchCities = async (provinceCode: string) => {
  await delay(500)
  
  const citiesMap: Record<string, Array<{ label: string; value: string; children?: Array<{ label: string; value: string }> }>> = {
    'zhejiang': [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '余杭区', value: 'yuhang' },
          { label: '滨江区', value: 'binjiang' },
        ]
      },
      {
        label: '宁波市',
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '江北区', value: 'jiangbei' },
        ]
      },
    ],
    'jiangsu': [
      {
        label: '南京市',
        value: 'nanjing',
        children: [
          { label: '玄武区', value: 'xuanwu' },
          { label: '鼓楼区', value: 'gulou' },
        ]
      },
      {
        label: '苏州市',
        value: 'suzhou',
        children: [
          { label: '姑苏区', value: 'gusu' },
          { label: '吴中区', value: 'wuzhong' },
        ]
      },
    ],
    'guangdong': [
      {
        label: '广州市',
        value: 'guangzhou',
        children: [
          { label: '天河区', value: 'tianhe' },
          { label: '越秀区', value: 'yuexiu' },
        ]
      },
      {
        label: '深圳市',
        value: 'shenzhen',
        children: [
          { label: '南山区', value: 'nanshan' },
          { label: '福田区', value: 'futian' },
        ]
      },
    ],
  }
  
  return citiesMap[provinceCode] || []
}

// 模拟获取职位列表
const fetchPositions = async (departmentId: string) => {
  await delay(600)
  
  const positionsMap: Record<string, Array<{ label: string; value: string }>> = {
    'tech': [
      { label: '前端工程师', value: 'frontend' },
      { label: '后端工程师', value: 'backend' },
      { label: '全栈工程师', value: 'fullstack' },
      { label: '测试工程师', value: 'qa' },
      { label: '运维工程师', value: 'devops' },
    ],
    'product': [
      { label: '产品经理', value: 'pm' },
      { label: 'UI设计师', value: 'ui' },
      { label: 'UX设计师', value: 'ux' },
    ],
    'sales': [
      { label: '销售代表', value: 'sales_rep' },
      { label: '销售经理', value: 'sales_manager' },
      { label: '客户经理', value: 'account_manager' },
    ],
  }
  
  return positionsMap[departmentId] || []
}

const AsyncForm = () => {
  const [loading, setLoading] = useState(true)
  
  const form = createForm({
    validateFirst: true,
    effects() {
      // 表单挂载时加载初始数据
      onFormMount(async () => {
        setLoading(true)
        try {
          // 模拟加载省份列表
          await delay(800)
          const provinceField = form.query('province').take()
          provinceField?.setDataSource([
            { label: '浙江省', value: 'zhejiang' },
            { label: '江苏省', value: 'jiangsu' },
            { label: '广东省', value: 'guangdong' },
          ])
          
          // 加载部门列表
          const departmentField = form.query('department').take()
          departmentField?.setDataSource([
            { label: '技术部', value: 'tech' },
            { label: '产品部', value: 'product' },
            { label: '销售部', value: 'sales' },
          ])
        } finally {
          setLoading(false)
        }
      })
      
      // 省份变化时加载城市
      onFieldValueChange('province', async (field) => {
        const cityField = form.query('city').take()
        
        if (!field.value) {
          cityField?.setDataSource([])
          cityField?.setValue(null)
          return
        }
        
        cityField?.setLoading(true)
        try {
          const cities = await fetchCities(field.value as string)
          cityField?.setDataSource(cities)
          cityField?.setValue(null) // 清空已选城市
        } finally {
          cityField?.setLoading(false)
        }
      })
      
      // 部门变化时加载职位
      onFieldValueChange('department', async (field) => {
        const positionField = form.query('position').take()
        
        if (!field.value) {
          positionField?.setDataSource([])
          positionField?.setValue(null)
          return
        }
        
        positionField?.setLoading(true)
        try {
          const positions = await fetchPositions(field.value as string)
          positionField?.setDataSource(positions)
          positionField?.setValue(null) // 清空已选职位
        } finally {
          positionField?.setLoading(false)
        }
      })
      
      // 级联地址初始化
      onFieldInit('cascaderAddress', async (field) => {
        field.setLoading(true)
        try {
          await delay(500)
          const options = [
            {
              value: 'zhejiang',
              label: '浙江省',
              isLeaf: false,
            },
            {
              value: 'jiangsu',
              label: '江苏省',
              isLeaf: false,
            },
          ]
          field.setDataSource(options)
        } finally {
          field.setLoading(false)
        }
      })
    }
  })
  
  const SchemaField = createSchemaField({
    components: {
      FormItem,
      Input,
      Select,
      Cascader,
      FormGrid,
    },
  })
  
  const schema = {
    type: 'object',
    properties: {
      // 异步校验
      asyncValidation: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: '异步校验',
          size: 'small',
          style: { marginBottom: 24 },
        },
        properties: {
          grid1: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': { maxColumns: 2 },
            properties: {
              username: {
                type: 'string',
                title: '用户名',
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '输入 admin、test、user、demo 会提示已存在',
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入用户名（支持异步校验）',
                },
                'x-validator': [
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                  {
                    validator: async (value: string) => {
                      if (!value || value.length < 3) return ''
                      
                      const exists = await checkUsernameExists(value)
                      if (exists) {
                        return '该用户名已被占用，请换一个'
                      }
                      return ''
                    }
                  }
                ]
              },
              email: {
                type: 'string',
                title: '邮箱',
                required: true,
                'x-decorator': 'FormItem',
                'x-decorator-props': {
                  tooltip: '输入 test@example.com 或 admin@example.com 会提示已注册',
                },
                'x-component': 'Input',
                'x-component-props': {
                  placeholder: '请输入邮箱（支持异步校验）',
                },
                'x-validator': [
                  { required: true, message: '请输入邮箱' },
                  { format: 'email', message: '邮箱格式不正确' },
                  {
                    validator: async (value: string) => {
                      if (!value || !/@/.test(value)) return ''
                      
                      const registered = await checkEmailRegistered(value)
                      if (registered) {
                        return '该邮箱已被注册'
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
      
      // 级联加载
      cascadeLoading: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: '级联数据加载',
          size: 'small',
          style: { marginBottom: 24 },
        },
        properties: {
          grid2: {
            type: 'void',
            'x-component': 'FormGrid',
            'x-component-props': { maxColumns: 2 },
            properties: {
              province: {
                type: 'string',
                title: '省份',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择省份',
                  allowClear: true,
                },
              },
              city: {
                type: 'string',
                title: '城市',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请先选择省份',
                  allowClear: true,
                },
              },
              department: {
                type: 'string',
                title: '部门',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请选择部门',
                  allowClear: true,
                },
              },
              position: {
                type: 'string',
                title: '职位',
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  placeholder: '请先选择部门',
                  allowClear: true,
                },
              },
            }
          }
        }
      },
      
      // Cascader 级联选择
      cascaderDemo: {
        type: 'void',
        'x-component': 'Card',
        'x-component-props': {
          title: 'Cascader 级联选择',
          size: 'small',
        },
        properties: {
          cascaderAddress: {
            type: 'array',
            title: '所在地区',
            'x-decorator': 'FormItem',
            'x-decorator-props': {
              tooltip: '使用 Cascader 组件的级联地址选择',
            },
            'x-component': 'Cascader',
            'x-component-props': {
              placeholder: '请选择省/市/区',
              changeOnSelect: true,
              loadData: async (selectedOptions: Array<{ value: string; label: string }>) => {
                const targetOption = selectedOptions[selectedOptions.length - 1]
                targetOption.loading = true
                
                try {
                  await delay(500)
                  const cities = await fetchCities(targetOption.value)
                  targetOption.children = cities.map(city => ({
                    ...city,
                    isLeaf: false,
                  }))
                } finally {
                  targetOption.loading = false
                }
              },
              style: { width: '100%' },
            },
          }
        }
      }
    }
  }
  
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('表单提交数据:', values)
    alert('✅ 表单提交成功！查看控制台获取数据')
  }
  
  if (loading) {
    return (
      <div className="form-container fade-in" style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" tip="加载表单数据中..." />
      </div>
    )
  }
  
  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          异步操作示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          展示异步数据加载、异步校验、级联加载等场景的实现方法。
        </Paragraph>
      </div>
      
      <Alert
        message="功能说明"
        description={
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>异步校验：用户名和邮箱会实时检查是否已存在（模拟 API 调用）</li>
            <li>级联加载：选择省份后自动加载对应城市，选择部门后自动加载职位</li>
            <li>表单挂载时会异步加载初始数据源</li>
          </ul>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <Form form={form} labelCol={6} wrapperCol={16} onAutoSubmit={handleSubmit}>
        <SchemaField schema={schema} />
        <div className="form-actions">
          <Reset>重置</Reset>
          <Submit type="primary">提交</Submit>
        </div>
      </Form>
    </div>
  )
}

export default AsyncForm


