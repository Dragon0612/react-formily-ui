/**
 * Formily 异步联动示例
 * 
 * 本示例展示：
 * 1. 异步数据加载（省市区三级联动）
 * 2. 字段值联动（根据选择动态改变其他字段）
 * 3. 字段状态联动（显示/隐藏、启用/禁用）
 * 4. 异步选项更新
 * 5. Loading 状态处理
 */

import { createForm, onFieldValueChange, onFieldInit } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  NumberPicker,
  Radio,
  FormGrid,
  Submit,
  Reset,
} from '@formily/antd-v5'
import { Typography, Card, Alert, Space } from 'antd'
import { useState } from 'react'

const { Title, Paragraph, Text } = Typography

// 模拟异步 API 调用
const mockAPI = {
  // 获取省份列表
  getProvinces: (): Promise<Array<{ label: string; value: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { label: '浙江省', value: 'zhejiang' },
          { label: '江苏省', value: 'jiangsu' },
          { label: '广东省', value: 'guangdong' },
          { label: '四川省', value: 'sichuan' },
        ])
      }, 500)
    })
  },

  // 根据省份获取城市
  getCities: (province: string): Promise<Array<{ label: string; value: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cityMap: Record<string, Array<{ label: string; value: string }>> = {
          zhejiang: [
            { label: '杭州市', value: 'hangzhou' },
            { label: '宁波市', value: 'ningbo' },
            { label: '温州市', value: 'wenzhou' },
          ],
          jiangsu: [
            { label: '南京市', value: 'nanjing' },
            { label: '苏州市', value: 'suzhou' },
            { label: '无锡市', value: 'wuxi' },
          ],
          guangdong: [
            { label: '广州市', value: 'guangzhou' },
            { label: '深圳市', value: 'shenzhen' },
            { label: '东莞市', value: 'dongguan' },
          ],
          sichuan: [
            { label: '成都市', value: 'chengdu' },
            { label: '绵阳市', value: 'mianyang' },
            { label: '南充市', value: 'nanchong' },
          ],
        }
        resolve(cityMap[province] || [])
      }, 500)
    })
  },

  // 根据城市获取区县
  getDistricts: (city: string): Promise<Array<{ label: string; value: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const districtMap: Record<string, Array<{ label: string; value: string }>> = {
          hangzhou: [
            { label: '西湖区', value: 'xihu' },
            { label: '滨江区', value: 'binjiang' },
            { label: '余杭区', value: 'yuhang' },
          ],
          guangzhou: [
            { label: '天河区', value: 'tianhe' },
            { label: '越秀区', value: 'yuexiu' },
            { label: '海珠区', value: 'haizhu' },
          ],
          // 其他城市简化处理
        }
        resolve(districtMap[city] || [{ label: '暂无数据', value: '' }])
      }, 500)
    })
  },

  // 根据行业获取职位
  getPositions: (industry: string): Promise<Array<{ label: string; value: string }>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const positionMap: Record<string, Array<{ label: string; value: string }>> = {
          it: [
            { label: '前端工程师', value: 'frontend' },
            { label: '后端工程师', value: 'backend' },
            { label: '全栈工程师', value: 'fullstack' },
            { label: '移动端工程师', value: 'mobile' },
            { label: '测试工程师', value: 'tester' },
          ],
          finance: [
            { label: '会计', value: 'accountant' },
            { label: '财务分析师', value: 'analyst' },
            { label: '审计师', value: 'auditor' },
          ],
          education: [
            { label: '教师', value: 'teacher' },
            { label: '培训师', value: 'trainer' },
            { label: '教研员', value: 'researcher' },
          ],
          medical: [
            { label: '医生', value: 'doctor' },
            { label: '护士', value: 'nurse' },
            { label: '药剂师', value: 'pharmacist' },
          ],
        }
        resolve(positionMap[industry] || [])
      }, 600)
    })
  },

  // 根据职位获取薪资范围
  getSalaryRange: (position: string): Promise<{ min: number; max: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const salaryMap: Record<string, { min: number; max: number }> = {
          frontend: { min: 8, max: 40 },
          backend: { min: 10, max: 50 },
          fullstack: { min: 15, max: 60 },
          mobile: { min: 10, max: 45 },
          tester: { min: 6, max: 30 },
          accountant: { min: 5, max: 20 },
          analyst: { min: 8, max: 35 },
          doctor: { min: 10, max: 100 },
          teacher: { min: 4, max: 15 },
        }
        resolve(salaryMap[position] || { min: 3, max: 50 })
      }, 400)
    })
  },
}

// 创建表单实例，配置联动逻辑
const form = createForm({
  effects() {
    // 1. 省份变化时，清空并重新加载城市选项
    onFieldValueChange('province', async (field) => {
      const cityField = form.query('city').take()
      const districtField = form.query('district').take()
      
      if (!cityField || !districtField) return
      
      // 清空城市和区县的值
      cityField.setValue(undefined)
      districtField.setValue(undefined)
      
      // 清空区县的选项
      districtField.setDataSource([])
      
      if (field.value) {
        // 设置城市字段为加载状态
        cityField.setLoading(true)
        
        try {
          // 异步获取城市列表
          const cities = await mockAPI.getCities(field.value as string)
          cityField.setDataSource(cities)
        } finally {
          cityField.setLoading(false)
        }
      } else {
        // 如果省份为空，清空城市选项
        cityField.setDataSource([])
      }
    })

    // 2. 城市变化时，重新加载区县选项
    onFieldValueChange('city', async (field) => {
      const districtField = form.query('district').take()
      
      if (!districtField) return
      
      // 清空区县的值
      districtField.setValue(undefined)
      
      if (field.value) {
        districtField.setLoading(true)
        
        try {
          const districts = await mockAPI.getDistricts(field.value as string)
          districtField.setDataSource(districts)
        } finally {
          districtField.setLoading(false)
        }
      } else {
        districtField.setDataSource([])
      }
    })

    // 3. 用户类型变化时，控制字段显示/隐藏
    onFieldValueChange('userType', (field) => {
      const studentFields = form.query('studentInfo').take()
      const workerFields = form.query('workerInfo').take()
      
      if (field.value === 'student') {
        studentFields?.setPattern('visible')
        workerFields?.setPattern('hidden')
      } else if (field.value === 'worker') {
        studentFields?.setPattern('hidden')
        workerFields?.setPattern('visible')
      } else {
        studentFields?.setPattern('hidden')
        workerFields?.setPattern('hidden')
      }
    })

    // 4. 行业变化时，动态加载职位选项
    onFieldValueChange('industry', async (field) => {
      const positionField = form.query('position').take()
      const salaryField = form.query('expectedSalary').take()
      
      if (!positionField) return
      
      positionField.setValue(undefined)
      salaryField?.setValue(undefined)
      
      if (field.value) {
        positionField.setLoading(true)
        
        try {
          const positions = await mockAPI.getPositions(field.value as string)
          positionField.setDataSource(positions)
        } finally {
          positionField.setLoading(false)
        }
      } else {
        positionField.setDataSource([])
      }
    })

    // 5. 职位变化时，更新薪资范围提示
    onFieldValueChange('position', async (field) => {
      const salaryField = form.query('expectedSalary').take()
      
      if (!salaryField || !field.value) return
      
      try {
        const range = await mockAPI.getSalaryRange(field.value as string)
        // 更新字段描述
        salaryField.setComponentProps({
          ...salaryField.componentProps,
          placeholder: `该职位薪资范围：${range.min}-${range.max}K`,
          min: range.min,
          max: range.max,
        })
      } catch (error) {
        console.error('获取薪资范围失败', error)
      }
    })

    // 6. 初始化时加载省份列表
    onFieldInit('province', async (field) => {
      field.setLoading(true)
      
      try {
        const provinces = await mockAPI.getProvinces()
        field.setDataSource(provinces)
      } finally {
        field.setLoading(false)
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
    NumberPicker,
    Radio,
    FormGrid,
  },
})

// 表单 Schema 定义
const schema = {
  type: 'object',
  properties: {
    // ========== 地区三级联动 ==========
    addressSection: {
      type: 'void',
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 3,
        minColumns: 1,
      },
      properties: {
        province: {
          type: 'string',
          title: '省份',
          required: true,
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
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请先选择省份',
            allowClear: true,
          },
        },
        district: {
          type: 'string',
          title: '区县',
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请先选择城市',
            allowClear: true,
          },
        },
      },
    },

    // ========== 条件显示 ==========
    userType: {
      type: 'string',
      title: '用户类型',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: '学生', value: 'student' },
        { label: '在职', value: 'worker' },
      ],
      default: 'student',
    },

    // 学生信息（条件显示）
    studentInfo: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        asterisk: true,
        feedbackLayout: 'none',
      },
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 2,
        minColumns: 1,
      },
      properties: {
        school: {
          type: 'string',
          title: '学校名称',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入学校名称',
          },
        },
        major: {
          type: 'string',
          title: '专业',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Input',
          'x-component-props': {
            placeholder: '请输入专业',
          },
        },
      },
    },

    // 在职信息（条件显示）
    workerInfo: {
      type: 'void',
      'x-decorator': 'FormItem',
      'x-decorator-props': {
        asterisk: true,
        feedbackLayout: 'none',
      },
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: 2,
        minColumns: 1,
      },
      'x-pattern': 'hidden', // 默认隐藏
      properties: {
        industry: {
          type: 'string',
          title: '所属行业',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请选择行业',
            allowClear: true,
          },
          enum: [
            { label: 'IT互联网', value: 'it' },
            { label: '金融', value: 'finance' },
            { label: '教育', value: 'education' },
            { label: '医疗', value: 'medical' },
          ],
        },
        position: {
          type: 'string',
          title: '职位',
          required: true,
          'x-decorator': 'FormItem',
          'x-component': 'Select',
          'x-component-props': {
            placeholder: '请先选择行业',
            allowClear: true,
          },
        },
        expectedSalary: {
          type: 'number',
          title: '期望薪资(K)',
          'x-decorator': 'FormItem',
          'x-component': 'NumberPicker',
          'x-component-props': {
            placeholder: '请输入期望薪资',
            style: { width: '100%' },
          },
        },
      },
    },
  },
}

const AsyncLinkageForm = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: Record<string, unknown>) => {
    setLoading(true)
    
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    console.log('异步联动表单提交数据:', values)
    alert('表单提交成功！\n\n查看控制台获取完整数据')
    
    setLoading(false)
  }

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          异步联动示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          演示字段之间的异步联动、动态数据加载、条件显示等高级特性。
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="联动功能说明"
          description={
            <div>
              <Text>1. <Text strong>省市区三级联动：</Text>选择省份后自动加载对应城市，选择城市后加载区县</Text>
              <br />
              <Text>2. <Text strong>条件显示：</Text>根据用户类型显示不同的表单字段</Text>
              <br />
              <Text>3. <Text strong>动态选项：</Text>根据所选行业动态加载对应的职位列表</Text>
              <br />
              <Text>4. <Text strong>智能提示：</Text>选择职位后自动显示该职位的薪资范围</Text>
            </div>
          }
          type="info"
          showIcon
        />

        <Card>
          <Form form={form} labelCol={4} wrapperCol={20} onAutoSubmit={handleSubmit}>
            <SchemaField schema={schema} />
            
            <div className="form-actions">
              <Reset>重置</Reset>
              <Submit type="primary" loading={loading}>
                提交
              </Submit>
            </div>
          </Form>
        </Card>

        <Card title="关键技术点" type="inner">
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, overflow: 'auto' }}>
{`// 1. 字段值联动 - onFieldValueChange
onFieldValueChange('province', async (field) => {
  const cityField = form.query('city').take()
  cityField.setValue(undefined) // 清空值
  
  if (field.value) {
    cityField.setLoading(true) // 设置加载状态
    const cities = await fetchCities(field.value)
    cityField.setDataSource(cities) // 更新选项
    cityField.setLoading(false)
  }
})

// 2. 字段初始化 - onFieldInit
onFieldInit('province', async (field) => {
  field.setLoading(true)
  const provinces = await fetchProvinces()
  field.setDataSource(provinces)
  field.setLoading(false)
})

// 3. 条件显示/隐藏
onFieldValueChange('userType', (field) => {
  const targetField = form.query('studentInfo').take()
  
  if (field.value === 'student') {
    targetField?.setPattern('visible')
  } else {
    targetField?.setPattern('hidden')
  }
})

// 4. 动态更新组件属性
field.setComponentProps({
  placeholder: '动态提示文本',
  disabled: true,
  min: 10,
  max: 100,
})

// 5. 字段状态控制
field.setLoading(true)      // 加载状态
field.setDisabled(true)     // 禁用
field.setVisible(false)     // 隐藏
field.setPattern('disabled') // 模式：editable/disabled/readPretty/hidden`}
          </pre>
        </Card>
      </Space>
    </div>
  )
}

export default AsyncLinkageForm

