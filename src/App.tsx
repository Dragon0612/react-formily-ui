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
} from '@ant-design/icons'
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
  | 'basic' 
  | 'advanced' 
  | 'array' 
  | 'validation'
  | 'async'
  | 'customComponent'
  | 'realworld'

const pageComponents: Record<PageKey, React.ReactNode> = {
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
    type: 'divider' as const,
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
  {
    type: 'divider' as const,
  },
  {
    key: 'realworld',
    icon: <ShoppingCartOutlined />,
    label: '电商订单',
  },
]

function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>('basic')
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

