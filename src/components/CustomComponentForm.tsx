/**
 * 自定义组件示例
 * 展示如何创建和集成自定义表单组件
 */

import { createForm } from '@formily/core'
import { createSchemaField, observer, connect, mapReadPretty } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Submit,
  Reset,
  FormGrid,
} from '@formily/antd-v5'
import { Typography, Alert, Rate, Slider, Tag, Upload, Button } from 'antd'
import { PlusOutlined, InboxOutlined } from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { useState } from 'react'

const { Title, Paragraph, Text } = Typography
const { Dragger } = Upload

// ==================== 1. 简单包装现有组件 ====================

// 直接连接 Ant Design 组件
const FormilyRate = connect(Rate)
const FormilySlider = connect(Slider)

// ==================== 2. 带属性映射的组件 ====================

// 标签选择器组件
const TagSelectComponent = observer((props: {
  value?: string[]
  onChange?: (value: string[]) => void
  options?: Array<{ label: string; value: string; color?: string }>
}) => {
  const { value = [], onChange, options = [] } = props
  
  const handleToggle = (tagValue: string) => {
    const newValue = value.includes(tagValue)
      ? value.filter(v => v !== tagValue)
      : [...value, tagValue]
    onChange?.(newValue)
  }
  
  return (
    <div>
      {options.map(option => (
        <Tag.CheckableTag
          key={option.value}
          checked={value.includes(option.value)}
          onChange={() => handleToggle(option.value)}
          style={{ marginBottom: 8 }}
        >
          {option.label}
        </Tag.CheckableTag>
      ))}
    </div>
  )
})

// 连接到 Formily，并支持阅读态
const TagSelectReadPretty = observer((props: {
  value?: string[]
  options?: Array<{ label: string; value: string; color?: string }>
}) => {
  const { value = [], options = [] } = props
  
  return (
    <div>
      {value.map(v => {
        const option = options.find(opt => opt.value === v)
        return (
          <Tag key={v} color={option?.color || 'blue'}>
            {option?.label || v}
          </Tag>
        )
      })}
    </div>
  )
})

const TagSelect = connect(
  TagSelectComponent,
  mapReadPretty(TagSelectReadPretty)
)

// ==================== 3. 复杂自定义组件 ====================

// 图片上传组件
const ImageUploaderComponent = observer((props: {
  value?: string[]
  onChange?: (value: string[]) => void
  maxCount?: number
}) => {
  const { value = [], onChange, maxCount = 5 } = props
  const [fileList, setFileList] = useState<UploadFile[]>(
    value.map((url, index) => ({
      uid: String(index),
      name: `image-${index}`,
      status: 'done',
      url,
    }))
  )
  
  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList)
    
    // 提取已上传成功的图片 URL
    const urls = newFileList
      .filter(file => file.status === 'done')
      .map(file => file.url || file.response?.url)
      .filter(Boolean) as string[]
    
    onChange?.(urls)
  }
  
  // 模拟上传
  const customRequest = async ({ onSuccess }: any) => {
    setTimeout(() => {
      // 模拟上传成功，返回图片 URL
      const fakeUrl = `https://picsum.photos/200/300?random=${Date.now()}`
      onSuccess?.({ url: fakeUrl })
    }, 1000)
  }
  
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  )
  
  return (
    <Upload
      listType="picture-card"
      fileList={fileList}
      onChange={handleChange}
      customRequest={customRequest}
      maxCount={maxCount}
    >
      {fileList.length >= maxCount ? null : uploadButton}
    </Upload>
  )
})

const ImageUploader = connect(ImageUploaderComponent)

// ==================== 4. 文件上传组件 ====================

const FileUploaderComponent = observer((props: {
  value?: Array<{ name: string; url: string }>
  onChange?: (value: Array<{ name: string; url: string }>) => void
  accept?: string
  maxCount?: number
}) => {
  const { value = [], onChange, accept, maxCount = 10 } = props
  const [fileList, setFileList] = useState<UploadFile[]>(
    value.map((file, index) => ({
      uid: String(index),
      name: file.name,
      status: 'done',
      url: file.url,
    }))
  )
  
  const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList)
    
    const files = newFileList
      .filter(file => file.status === 'done')
      .map(file => ({
        name: file.name,
        url: file.url || file.response?.url || '',
      }))
      .filter(file => file.url)
    
    onChange?.(files)
  }
  
  const customRequest = async (options: any) => {
    const { file, onSuccess } = options
    setTimeout(() => {
      onSuccess?.({ url: `https://example.com/files/${file.name}` })
    }, 1000)
  }
  
  return (
    <Dragger
      fileList={fileList}
      onChange={handleChange}
      customRequest={customRequest}
      maxCount={maxCount}
      accept={accept}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
      <p className="ant-upload-hint">
        支持单个或批量上传，最多 {maxCount} 个文件
      </p>
    </Dragger>
  )
})

const FileUploader = connect(FileUploaderComponent)

// ==================== 5. 富文本编辑器（简化版） ====================

const RichTextEditorComponent = observer((props: {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}) => {
  const { value = '', onChange, placeholder } = props
  const [content, setContent] = useState(value)
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setContent(newValue)
    onChange?.(newValue)
  }
  
  const insertText = (text: string) => {
    const newValue = content + text
    setContent(newValue)
    onChange?.(newValue)
  }
  
  return (
    <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
      <div style={{ borderBottom: '1px solid #d9d9d9', padding: 8, background: '#fafafa' }}>
        <Button size="small" onClick={() => insertText('**粗体**')} style={{ marginRight: 4 }}>
          粗体
        </Button>
        <Button size="small" onClick={() => insertText('*斜体*')} style={{ marginRight: 4 }}>
          斜体
        </Button>
        <Button size="small" onClick={() => insertText('# 标题\n')}>
          标题
        </Button>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: 150,
          border: 'none',
          padding: 12,
          resize: 'vertical',
          fontFamily: 'monospace',
        }}
      />
    </div>
  )
})

const RichTextEditor = connect(RichTextEditorComponent)

// ==================== 创建表单 ====================

const form = createForm({
  initialValues: {
    rating: 4,
    range: 50,
    skills: ['react', 'typescript'],
  }
})

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Rate: FormilyRate,
    Slider: FormilySlider,
    TagSelect,
    ImageUploader,
    FileUploader,
    RichTextEditor,
    FormGrid,
  },
})

const schema = {
  type: 'object',
  properties: {
    // 简单组件
    simpleComponents: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '简单包装组件',
        size: 'small',
        style: { marginBottom: 24 },
      },
      properties: {
        grid1: {
          type: 'void',
          'x-component': 'FormGrid',
          'x-component-props': { maxColumns: 2 },
          properties: {
            rating: {
              type: 'number',
              title: '评分',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                tooltip: '使用 Ant Design Rate 组件',
              },
              'x-component': 'Rate',
              'x-component-props': {
                allowHalf: true,
              },
            },
            range: {
              type: 'number',
              title: '范围选择',
              'x-decorator': 'FormItem',
              'x-decorator-props': {
                tooltip: '使用 Ant Design Slider 组件',
              },
              'x-component': 'Slider',
              'x-component-props': {
                marks: {
                  0: '0°C',
                  26: '26°C',
                  50: '50°C',
                  75: '75°C',
                  100: '100°C',
                },
              },
            },
          }
        }
      }
    },
    
    // 自定义标签选择
    tagSelection: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '自定义标签选择器',
        size: 'small',
        style: { marginBottom: 24 },
      },
      properties: {
        skills: {
          type: 'array',
          title: '技能标签',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            tooltip: '点击标签进行多选',
          },
          'x-component': 'TagSelect',
          'x-component-props': {
            options: [
              { label: 'React', value: 'react', color: 'blue' },
              { label: 'Vue', value: 'vue', color: 'green' },
              { label: 'Angular', value: 'angular', color: 'red' },
              { label: 'TypeScript', value: 'typescript', color: 'blue' },
              { label: 'JavaScript', value: 'javascript', color: 'orange' },
              { label: 'Node.js', value: 'nodejs', color: 'green' },
              { label: 'Python', value: 'python', color: 'cyan' },
              { label: 'Java', value: 'java', color: 'volcano' },
            ],
          },
        },
      }
    },
    
    // 图片上传
    imageUpload: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '图片上传组件',
        size: 'small',
        style: { marginBottom: 24 },
      },
      properties: {
        images: {
          type: 'array',
          title: '产品图片',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            tooltip: '最多上传5张图片',
          },
          'x-component': 'ImageUploader',
          'x-component-props': {
            maxCount: 5,
          },
        },
      }
    },
    
    // 文件上传
    fileUpload: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '文件上传组件',
        size: 'small',
        style: { marginBottom: 24 },
      },
      properties: {
        attachments: {
          type: 'array',
          title: '附件',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            tooltip: '支持拖拽上传',
          },
          'x-component': 'FileUploader',
          'x-component-props': {
            maxCount: 3,
            accept: '.pdf,.doc,.docx,.txt',
          },
        },
      }
    },
    
    // 富文本编辑器
    richText: {
      type: 'void',
      'x-component': 'Card',
      'x-component-props': {
        title: '富文本编辑器（简化版）',
        size: 'small',
      },
      properties: {
        content: {
          type: 'string',
          title: '文章内容',
          'x-decorator': 'FormItem',
          'x-decorator-props': {
            tooltip: '支持 Markdown 格式',
          },
          'x-component': 'RichTextEditor',
          'x-component-props': {
            placeholder: '请输入内容，支持 Markdown 语法...',
          },
        },
      }
    },
  }
}

const CustomComponentForm = () => {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('表单提交数据:', values)
    alert('✅ 表单提交成功！查看控制台获取数据')
  }
  
  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          自定义组件示例
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          展示如何在 Formily 中集成和使用自定义表单组件。
        </Paragraph>
      </div>
      
      <Alert
        message="组件说明"
        description={
          <div>
            <Text strong>包含以下自定义组件：</Text>
            <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
              <li><Text code>Rate & Slider</Text> - 简单包装 Ant Design 组件</li>
              <li><Text code>TagSelect</Text> - 自定义标签多选组件，支持阅读态</li>
              <li><Text code>ImageUploader</Text> - 图片上传组件，支持预览</li>
              <li><Text code>FileUploader</Text> - 文件拖拽上传组件</li>
              <li><Text code>RichTextEditor</Text> - 简化版富文本编辑器</li>
            </ul>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <Form form={form} labelCol={4} wrapperCol={18} onAutoSubmit={handleSubmit}>
        <SchemaField schema={schema} />
        <div className="form-actions">
          <Reset>重置</Reset>
          <Submit type="primary">提交</Submit>
        </div>
      </Form>
    </div>
  )
}

export default CustomComponentForm
