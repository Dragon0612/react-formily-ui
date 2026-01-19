import { useState } from 'react'
import { Layout, Menu, Typography, theme } from 'antd'
import {
  FormOutlined,
  TableOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  ApiOutlined,
  BulbOutlined,
  ShoppingCartOutlined,
  BookOutlined,
  ThunderboltOutlined,
  CodeOutlined,
  CalculatorOutlined,
} from '@ant-design/icons'
import CoreExample from './components/CoreExample'
import ReactiveExample from './components/ReactiveExample'
import ReactExample from './components/ReactExample'
import ReactHooksExample from './components/ReactHooksExample'
import CustomHooksExample from './components/CustomHooksExample'
import DecimalExample from './components/DecimalExample'
import CustomAdapterExample from './components/CustomAdapterExample'
import BasicForm from './components/BasicForm'
import AdvancedForm from './components/AdvancedForm'
import ArrayForm from './components/ArrayForm'
import ValidationForm from './components/ValidationForm'
import AsyncForm from './components/AsyncForm'
import CustomComponentForm from './components/CustomComponentForm'
import RealWorldForm from './components/RealWorldForm'

const { Header, Content, Sider } = Layout
const { Title } = Typography

type PageKey = 
  | 'core'
  | 'reactive'
  | 'react'
  | 'hooks'
  | 'customHooks'
  | 'decimal'
  | 'customAdapter'
  | 'basic' 
  | 'advanced' 
  | 'array' 
  | 'validation'
  | 'async'
  | 'customComponent'
  | 'realworld'

const pageComponents: Record<PageKey, React.ReactNode> = {
  core: <CoreExample />,
  reactive: <ReactiveExample />,
  react: <ReactExample />,
  hooks: <ReactHooksExample />,
  customHooks: <CustomHooksExample />,
  decimal: <DecimalExample />,
  customAdapter: <CustomAdapterExample />,
  basic: <BasicForm />,
  advanced: <AdvancedForm />,
  array: <ArrayForm />,
  validation: <ValidationForm />,
  async: <AsyncForm />,
  customComponent: <CustomComponentForm />,
  realworld: <RealWorldForm />,
}

const menuItems = [
  {
    key: 'learn',
    icon: <BookOutlined />,
    label: '学习示例',
    children: [
      {
        key: 'core',
        icon: <BookOutlined />,
        label: 'Core 学习示例',
      },
      {
        key: 'reactive',
        icon: <ThunderboltOutlined />,
        label: 'Reactive 学习示例',
      },
      {
        key: 'react',
        icon: <CodeOutlined />,
        label: 'React 学习示例',
      },
      {
        key: 'hooks',
        icon: <CodeOutlined />,
        label: 'React Hooks 示例',
      },
      {
        key: 'customHooks',
        icon: <CodeOutlined />,
        label: '自定义 Hooks 示例',
      },
      {
        key: 'decimal',
        icon: <CalculatorOutlined />,
        label: 'Decimal.js 示例',
      },
      {
        key: 'customAdapter',
        icon: <CodeOutlined />,
        label: '自定义适配器示例',
      },
    ],
  },
  {
    key: 'forms',
    icon: <FormOutlined />,
    label: '表单示例',
    children: [
      {
        key: 'basic',
        icon: <FormOutlined />,
        label: '基础表单',
      },
      {
        key: 'advanced',
        icon: <SettingOutlined />,
        label: '高级表单',
      },
      {
        key: 'array',
        icon: <TableOutlined />,
        label: '数组表单',
      },
      {
        key: 'validation',
        icon: <SafetyCertificateOutlined />,
        label: '表单验证',
      },
      {
        key: 'async',
        icon: <ApiOutlined />,
        label: '异步操作',
      },
      {
        key: 'customComponent',
        icon: <BulbOutlined />,
        label: '自定义组件',
      },
    ],
  },
  {
    key: 'biz',
    icon: <ShoppingCartOutlined />,
    label: '业务示例',
    children: [
      {
        key: 'realworld',
        icon: <ShoppingCartOutlined />,
        label: '电商订单',
      },
    ],
  },
]

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('core')
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0 24px',
        }}
      >
        <Title
          level={3}
          style={{
            margin: 0,
            color: '#fff',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}
        >
          🎨 React Formily UI
        </Title>
      </Header>
      <Layout>
        <Sider
          width={220}
          style={{
            background: colorBgContainer,
            borderRight: '1px solid #f0f0f0',
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[currentPage]}
            style={{ height: '100%', borderRight: 0, paddingTop: 16 }}
            items={menuItems}
            onClick={({ key }) => setCurrentPage(key as PageKey)}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            }}
          >
            {pageComponents[currentPage]}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default App

