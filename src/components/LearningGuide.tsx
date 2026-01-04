/**
 * Formily 学习指南
 * 
 * 完整的 Formily 学习路线和知识图谱
 */

import { Typography, Card, Space, Collapse, Timeline, Tag, Alert, Divider, Table } from 'antd'
import { 
  BookOutlined, 
  CodeOutlined, 
  RocketOutlined, 
  BulbOutlined,
  CheckCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons'

const { Title, Paragraph, Text, Link } = Typography

const LearningGuide = () => {
  const learningPath = [
    {
      label: '第一阶段：基础入门',
      color: 'green',
      children: (
        <Space direction="vertical">
          <Text>• 理解 Formily 的核心概念：Form、Field、Schema</Text>
          <Text>• 学习基础组件的使用</Text>
          <Text>• 掌握简单的表单验证</Text>
          <Text>📚 参考示例：基础表单</Text>
        </Space>
      ),
    },
    {
      label: '第二阶段：进阶技能',
      color: 'blue',
      children: (
        <Space direction="vertical">
          <Text>• 掌握表单验证的各种方式</Text>
          <Text>• 学习字段联动和异步数据加载</Text>
          <Text>• 理解表单状态管理</Text>
          <Text>📚 参考示例：表单验证、异步联动、高级表单</Text>
        </Space>
      ),
    },
    {
      label: '第三阶段：高级特性',
      color: 'orange',
      children: (
        <Space direction="vertical">
          <Text>• 动态表单和条件渲染</Text>
          <Text>• 自定义组件开发</Text>
          <Text>• 数组字段的复杂应用</Text>
          <Text>📚 参考示例：动态表单、自定义组件、数组表单</Text>
        </Space>
      ),
    },
    {
      label: '第四阶段：实战应用',
      color: 'red',
      children: (
        <Space direction="vertical">
          <Text>• 完整业务场景的表单设计</Text>
          <Text>• 性能优化和最佳实践</Text>
          <Text>• 与后端 API 的集成</Text>
          <Text>📚 参考示例：注册表单、搜索表单</Text>
        </Space>
      ),
    },
  ]

  const coreConceptsData = [
    {
      key: '1',
      concept: 'Form',
      description: '表单实例，管理表单的所有状态和行为',
      usage: 'createForm()',
      example: 'const form = createForm({ validateFirst: true })',
    },
    {
      key: '2',
      concept: 'Field',
      description: '字段模型，表示表单中的每一个输入项',
      usage: 'form.createField()',
      example: 'const field = form.createField({ name: "username" })',
    },
    {
      key: '3',
      concept: 'Schema',
      description: 'JSON Schema，用于描述表单结构',
      usage: 'SchemaField',
      example: '{ type: "string", title: "用户名", required: true }',
    },
    {
      key: '4',
      concept: 'Effects',
      description: '副作用，用于实现字段间的联动逻辑',
      usage: 'form.effects()',
      example: 'onFieldValueChange("field1", (field) => { ... })',
    },
    {
      key: '5',
      concept: 'Reactions',
      description: '响应器，用于声明式的字段联动',
      usage: 'x-reactions',
      example: '{ dependencies: ["field1"], fulfill: { state: { visible: "..." } } }',
    },
  ]

  const componentsData = [
    {
      key: '1',
      category: '基础组件',
      components: 'Input, Select, DatePicker, Checkbox, Radio, Switch',
      usage: '简单数据输入',
    },
    {
      key: '2',
      category: '高级组件',
      components: 'Cascader, TreeSelect, Upload, Transfer',
      usage: '复杂数据选择',
    },
    {
      key: '3',
      category: '数组组件',
      components: 'ArrayTable, ArrayCards, ArrayItems',
      usage: '动态数组数据',
    },
    {
      key: '4',
      category: '布局组件',
      components: 'FormGrid, FormLayout, FormCollapse, FormTab',
      usage: '表单布局控制',
    },
    {
      key: '5',
      category: '操作组件',
      components: 'Submit, Reset, FormButtonGroup',
      usage: '表单操作按钮',
    },
  ]

  const bestPractices = [
    {
      title: '📋 表单设计原则',
      items: [
        '尽量使用 Schema 描述表单，提高可维护性',
        '合理组织字段结构，使用 FormGrid 布局',
        '为每个字段提供清晰的 title 和 placeholder',
        '复杂表单考虑使用分步表单（FormStep）',
      ],
    },
    {
      title: '✅ 验证最佳实践',
      items: [
        '必填字段使用 required，而不是自定义验证器',
        '异步验证使用 triggerType: "onBlur"，减少请求',
        '跨字段验证通过 ctx.form.values 访问其他字段',
        '复杂验证逻辑封装成独立的验证函数',
      ],
    },
    {
      title: '🔗 联动优化',
      items: [
        '简单联动优先使用 x-reactions（声明式）',
        '复杂联动使用 effects（命令式）',
        '避免循环依赖，合理设计字段间的依赖关系',
        '联动时注意清空依赖字段的值',
      ],
    },
    {
      title: '⚡ 性能优化',
      items: [
        '大表单使用虚拟滚动或分页',
        '合理使用 validateFirst，避免不必要的验证',
        '异步操作添加 Loading 状态',
        '使用 FormConsumer 仅监听必要的表单状态',
      ],
    },
  ]

  const collapseItems = [
    {
      key: '1',
      label: (
        <Space>
          <BookOutlined />
          <Text strong>核心概念详解</Text>
        </Space>
      ),
      children: (
        <Table
          dataSource={coreConceptsData}
          columns={[
            { title: '概念', dataIndex: 'concept', key: 'concept', width: 120 },
            { title: '说明', dataIndex: 'description', key: 'description' },
            { title: '使用方式', dataIndex: 'usage', key: 'usage', width: 150 },
            { title: '示例', dataIndex: 'example', key: 'example', render: (text) => <code>{text}</code> },
          ]}
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: '2',
      label: (
        <Space>
          <CodeOutlined />
          <Text strong>组件分类</Text>
        </Space>
      ),
      children: (
        <Table
          dataSource={componentsData}
          columns={[
            { title: '分类', dataIndex: 'category', key: 'category', width: 120 },
            { title: '组件列表', dataIndex: 'components', key: 'components' },
            { title: '适用场景', dataIndex: 'usage', key: 'usage', width: 150 },
          ]}
          pagination={false}
          size="small"
        />
      ),
    },
    {
      key: '3',
      label: (
        <Space>
          <RocketOutlined />
          <Text strong>最佳实践</Text>
        </Space>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {bestPractices.map((practice, index) => (
            <div key={index}>
              <Text strong style={{ fontSize: 16 }}>{practice.title}</Text>
              <div style={{ marginTop: 12, paddingLeft: 16 }}>
                {practice.items.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: 8 }}>
                    <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                    <Text>{item}</Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Space>
      ),
    },
    {
      key: '4',
      label: (
        <Space>
          <BulbOutlined />
          <Text strong>常见问题</Text>
        </Space>
      ),
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>Q: 如何重置表单？</Text>
            <div style={{ marginTop: 8, paddingLeft: 16 }}>
              <Text>A: 使用 <code>form.reset()</code> 方法，或使用 <code>&lt;Reset&gt;</code> 组件</Text>
            </div>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <div>
            <Text strong>Q: 如何获取表单值？</Text>
            <div style={{ marginTop: 8, paddingLeft: 16 }}>
              <Text>A: 使用 <code>form.values</code> 获取所有值，或 <code>form.getValuesIn("field")</code> 获取单个字段值</Text>
            </div>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <div>
            <Text strong>Q: 如何动态修改字段属性？</Text>
            <div style={{ marginTop: 8, paddingLeft: 16 }}>
              <Text>A: 通过 <code>field.setComponentProps()</code>, <code>field.setPattern()</code> 等方法</Text>
            </div>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <div>
            <Text strong>Q: x-reactions 和 effects 有什么区别？</Text>
            <div style={{ marginTop: 8, paddingLeft: 16 }}>
              <Text>A: x-reactions 是声明式的，写在 Schema 中；effects 是命令式的，写在 createForm 中。简单联动用 x-reactions，复杂逻辑用 effects。</Text>
            </div>
          </div>

          <Divider style={{ margin: '8px 0' }} />

          <div>
            <Text strong>Q: 如何接入自定义组件？</Text>
            <div style={{ marginTop: 8, paddingLeft: 16 }}>
              <Text>A: 使用 <code>connect</code> 和 <code>mapProps</code> 将组件连接到 Formily，参考"自定义组件示例"</Text>
            </div>
          </div>
        </Space>
      ),
    },
  ]

  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          Formily 学习指南
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          从入门到精通的完整学习路线，帮助你快速掌握 Formily。
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message="欢迎学习 Formily！"
          description="Formily 是阿里巴巴开源的表单解决方案，提供了高性能、易扩展、功能强大的表单系统。本指南将帮助你系统地学习 Formily。"
          type="success"
          showIcon
        />

        {/* 学习路线 */}
        <Card title={<Space><RocketOutlined /> 学习路线</Space>}>
          <Timeline items={learningPath} />
        </Card>

        {/* 知识体系 */}
        <Card title={<Space><BookOutlined /> 知识体系</Space>}>
          <Collapse items={collapseItems} defaultActiveKey={['1']} />
        </Card>

        {/* 示例导航 */}
        <Card title={<Space><CodeOutlined /> 示例导航</Space>}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">入门级</Tag>
              <Paragraph style={{ marginTop: 8, paddingLeft: 16 }}>
                <Text>• <Text strong>基础表单：</Text>学习基本组件的使用</Text>
                <br />
                <Text>• <Text strong>数组表单：</Text>掌握数组字段的三种展示方式</Text>
              </Paragraph>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <div>
              <Tag color="green">进阶级</Tag>
              <Paragraph style={{ marginTop: 8, paddingLeft: 16 }}>
                <Text>• <Text strong>表单验证：</Text>深入理解验证机制</Text>
                <br />
                <Text>• <Text strong>高级表单：</Text>学习复杂表单的构建</Text>
                <br />
                <Text>• <Text strong>异步联动：</Text>掌握异步数据加载和联动</Text>
              </Paragraph>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <div>
              <Tag color="orange">高级</Tag>
              <Paragraph style={{ marginTop: 8, paddingLeft: 16 }}>
                <Text>• <Text strong>动态表单：</Text>根据配置动态生成表单</Text>
                <br />
                <Text>• <Text strong>自定义组件：</Text>创建和接入自定义组件</Text>
              </Paragraph>
            </div>

            <Divider style={{ margin: '8px 0' }} />

            <div>
              <Tag color="red">实战</Tag>
              <Paragraph style={{ marginTop: 8, paddingLeft: 16 }}>
                <Text>• <Text strong>注册表单：</Text>完整的用户注册流程</Text>
                <br />
                <Text>• <Text strong>搜索表单：</Text>企业级搜索表单实践</Text>
              </Paragraph>
            </div>
          </Space>
        </Card>

        {/* 官方资源 */}
        <Card title={<Space><LinkOutlined /> 官方资源</Space>}>
          <Space direction="vertical" size="small">
            <Link href="https://formilyjs.org/" target="_blank">
              📖 Formily 官方文档
            </Link>
            <Link href="https://github.com/alibaba/formily" target="_blank">
              💻 GitHub 仓库
            </Link>
            <Link href="https://formilyjs.org/zh-CN/guide" target="_blank">
              🚀 快速开始
            </Link>
            <Link href="https://formilyjs.org/zh-CN/api" target="_blank">
              📚 API 文档
            </Link>
          </Space>
        </Card>

        {/* 学习建议 */}
        <Card title="💡 学习建议" type="inner">
          <Space direction="vertical" size="small">
            <Text>1. 按照学习路线循序渐进，不要跳跃式学习</Text>
            <Text>2. 每个示例都要亲自运行和修改，理解其中的原理</Text>
            <Text>3. 遇到问题先查看官方文档，再尝试解决</Text>
            <Text>4. 多看源码，理解 Formily 的设计思想</Text>
            <Text>5. 在实际项目中应用，积累经验</Text>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default LearningGuide

