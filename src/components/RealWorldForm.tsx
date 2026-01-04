/**
 * 真实业务场景示例 - 电商订单提交表单
 * 综合运用 Formily 的各种特性
 */

import { createForm, onFieldValueChange, onFieldReact } from '@formily/core'
import { createSchemaField } from '@formily/react'
import {
  Form,
  FormItem,
  Input,
  Select,
  NumberPicker,
  Radio,
  Checkbox,
  DatePicker,
  ArrayTable,
  FormGrid,
  FormLayout,
  FormTab,
  Submit,
  Reset,
  Space,
} from '@formily/antd-v5'
import { Typography, Card, Alert, Tag, Divider, Statistic, Row, Col, message } from 'antd'
import { ShoppingCartOutlined, UserOutlined, EnvironmentOutlined, CreditCardOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography

const form = createForm({
  validateFirst: true,
  initialValues: {
    products: [
      {
        name: 'iPhone 15 Pro',
        category: 'electronics',
        price: 7999,
        quantity: 1,
        discount: 0.95,
      }
    ],
    shippingMethod: 'express',
    paymentMethod: 'alipay',
  },
  effects() {
    // 计算商品小计
    onFieldReact('products.*.subtotal', (field) => {
      const index = field.address.segments[1] as number
      const product = form.values.products?.[index]
      
      if (product) {
        const price = product.price || 0
        const quantity = product.quantity || 1
        const discount = product.discount || 1
        field.value = price * quantity * discount
      }
    })
    
    // 计算订单总价
    onFieldReact('summary.totalAmount', (field) => {
      const products = form.values.products || []
      const productTotal = products.reduce((sum: number, item: any) => {
        const price = item.price || 0
        const quantity = item.quantity || 1
        const discount = item.discount || 1
        return sum + (price * quantity * discount)
      }, 0)
      
      field.value = productTotal
    })
    
    // 计算运费
    onFieldReact('summary.shippingFee', (field) => {
      const method = form.values.shippingMethod
      const totalAmount = form.values.summary?.totalAmount || 0
      
      if (totalAmount >= 99) {
        field.value = 0 // 满99包邮
      } else if (method === 'express') {
        field.value = 15
      } else if (method === 'standard') {
        field.value = 8
      } else {
        field.value = 0
      }
    })
    
    // 计算最终支付金额
    onFieldReact('summary.finalAmount', (field) => {
      const totalAmount = form.values.summary?.totalAmount || 0
      const shippingFee = form.values.summary?.shippingFee || 0
      const couponDiscount = form.values.couponDiscount || 0
      
      field.value = Math.max(0, totalAmount + shippingFee - couponDiscount)
    })
    
    // 配送方式变化时重新计算
    onFieldValueChange('shippingMethod', () => {
      form.query('summary.shippingFee').take()?.onInput(null)
    })
    
    // 使用发票时显示发票信息
    onFieldValueChange('needInvoice', (field) => {
      const invoiceInfoField = form.query('invoiceInfo').take()
      if (field.value) {
        invoiceInfoField?.setPattern('editable')
      } else {
        invoiceInfoField?.setPattern('disabled')
      }
    })
    
    // 同上地址功能
    onFieldValueChange('sameAsShipping', (field) => {
      if (field.value) {
        const shippingAddress = form.values.shippingAddress || {}
        form.setValues({
          billingAddress: {
            ...shippingAddress
          }
        })
      }
    })
  }
})

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Input,
    Select,
    NumberPicker,
    Radio,
    Checkbox,
    DatePicker,
    ArrayTable,
    FormGrid,
    FormLayout,
    FormTab,
    Space,
  },
})

const schema = {
  type: 'object',
  properties: {
    tabs: {
      type: 'void',
      'x-component': 'FormTab',
      properties: {
        // Tab 1: 商品信息
        tab1: {
          type: 'void',
          'x-component': 'FormTab.TabPane',
          'x-component-props': {
            tab: '商品信息',
            icon: <ShoppingCartOutlined />,
          },
          properties: {
            products: {
              type: 'array',
              title: '购物清单',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'ArrayTable',
              'x-component-props': {
                pagination: false,
              },
              'x-validator': [
                {
                  validator: (value: any[]) => {
                    if (!value || value.length === 0) {
                      return '至少添加一个商品'
                    }
                    return ''
                  }
                }
              ],
              items: {
                type: 'object',
                properties: {
                  column1: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': { width: 60, title: '序号', align: 'center' },
                    properties: {
                      index: {
                        type: 'void',
                        'x-component': 'ArrayTable.Index',
                      },
                    },
                  },
                  column2: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': { title: '商品名称', width: 200 },
                    properties: {
                      name: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Input',
                        'x-component-props': {
                          placeholder: '商品名称',
                        },
                        'x-validator': [{ required: true, message: '必填' }],
                      },
                    },
                  },
                  column3: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': { title: '分类', width: 120 },
                    properties: {
                      category: {
                        type: 'string',
                        'x-decorator': 'FormItem',
                        'x-component': 'Select',
                        enum: [
                          { label: '电子产品', value: 'electronics' },
                          { label: '服装', value: 'clothing' },
                          { label: '图书', value: 'books' },
                          { label: '食品', value: 'food' },
                        ],
                      },
                    },
                  },
                  column4: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': { title: '单价', width: 120 },
                    properties: {
                      price: {
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        'x-component-props': {
                          min: 0,
                          precision: 2,
                          style: { width: '100%' },
                        },
                      },
                    },
                  },
                  column5: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': { title: '数量', width: 100 },
                    properties: {
                      quantity: {
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        'x-component-props': {
                          min: 1,
                          style: { width: '100%' },
                        },
                      },
                    },
                  },
                  column6: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': { title: '折扣', width: 100 },
                    properties: {
                      discount: {
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        'x-component-props': {
                          min: 0.1,
                          max: 1,
                          step: 0.05,
                          precision: 2,
                          style: { width: '100%' },
                        },
                        default: 1,
                      },
                    },
                  },
                  column7: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': { title: '小计', width: 120 },
                    properties: {
                      subtotal: {
                        type: 'number',
                        'x-decorator': 'FormItem',
                        'x-component': 'NumberPicker',
                        'x-component-props': {
                          readOnly: true,
                          precision: 2,
                          style: { width: '100%' },
                        },
                      },
                    },
                  },
                  column8: {
                    type: 'void',
                    'x-component': 'ArrayTable.Column',
                    'x-component-props': { title: '操作', width: 100 },
                    properties: {
                      operation: {
                        type: 'void',
                        'x-component': 'Space',
                        properties: {
                          remove: {
                            type: 'void',
                            'x-component': 'ArrayTable.Remove',
                          },
                        },
                      },
                    },
                  },
                },
              },
              properties: {
                add: {
                  type: 'void',
                  title: '添加商品',
                  'x-component': 'ArrayTable.Addition',
                },
              },
            },
          }
        },
        
        // Tab 2: 收货信息
        tab2: {
          type: 'void',
          'x-component': 'FormTab.TabPane',
          'x-component-props': {
            tab: '收货信息',
            icon: <EnvironmentOutlined />,
          },
          properties: {
            shippingAddress: {
              type: 'object',
              properties: {
                grid: {
                  type: 'void',
                  'x-component': 'FormGrid',
                  'x-component-props': { maxColumns: 2 },
                  properties: {
                    receiverName: {
                      type: 'string',
                      title: '收货人',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: '请输入收货人姓名',
                      },
                    },
                    receiverPhone: {
                      type: 'string',
                      title: '联系电话',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: '请输入手机号',
                      },
                      'x-validator': [
                        { required: true },
                        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效手机号' }
                      ],
                    },
                    province: {
                      type: 'string',
                      title: '省份',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-component-props': {
                        placeholder: '请选择省份',
                      },
                      enum: [
                        { label: '浙江省', value: 'zhejiang' },
                        { label: '江苏省', value: 'jiangsu' },
                        { label: '广东省', value: 'guangdong' },
                      ],
                    },
                    city: {
                      type: 'string',
                      title: '城市',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      'x-component-props': {
                        placeholder: '请选择城市',
                      },
                      enum: [
                        { label: '杭州市', value: 'hangzhou' },
                        { label: '宁波市', value: 'ningbo' },
                        { label: '温州市', value: 'wenzhou' },
                      ],
                    },
                    address: {
                      type: 'string',
                      title: '详细地址',
                      required: true,
                      'x-decorator': 'FormItem',
                      'x-decorator-props': {
                        gridSpan: 2,
                      },
                      'x-component': 'Input.TextArea',
                      'x-component-props': {
                        placeholder: '请输入详细地址',
                        rows: 2,
                      },
                    },
                  }
                }
              }
            },
            
            shippingMethod: {
              type: 'string',
              title: '配送方式',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              enum: [
                { label: '快递配送（¥15）', value: 'express' },
                { label: '标准配送（¥8）', value: 'standard' },
                { label: '上门自提（免费）', value: 'pickup' },
              ],
            },
            
            deliveryTime: {
              type: 'string',
              title: '期望送达时间',
              'x-decorator': 'FormItem',
              'x-component': 'DatePicker',
              'x-component-props': {
                showTime: true,
                placeholder: '请选择送达时间',
                style: { width: '100%' },
              },
            },
            
            remark: {
              type: 'string',
              title: '配送备注',
              'x-decorator': 'FormItem',
              'x-component': 'Input.TextArea',
              'x-component-props': {
                placeholder: '请输入配送备注信息',
                rows: 3,
                maxLength: 200,
                showCount: true,
              },
            },
          }
        },
        
        // Tab 3: 支付方式
        tab3: {
          type: 'void',
          'x-component': 'FormTab.TabPane',
          'x-component-props': {
            tab: '支付方式',
            icon: <CreditCardOutlined />,
          },
          properties: {
            paymentMethod: {
              type: 'string',
              title: '支付方式',
              required: true,
              'x-decorator': 'FormItem',
              'x-component': 'Radio.Group',
              enum: [
                { label: '支付宝', value: 'alipay' },
                { label: '微信支付', value: 'wechat' },
                { label: '银行卡', value: 'bankcard' },
                { label: '货到付款', value: 'cod' },
              ],
            },
            
            couponCode: {
              type: 'string',
              title: '优惠券码',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
              'x-component-props': {
                placeholder: '请输入优惠券码（可选）',
              },
            },
            
            couponDiscount: {
              type: 'number',
              title: '优惠金额',
              'x-decorator': 'FormItem',
              'x-component': 'NumberPicker',
              'x-component-props': {
                placeholder: '优惠金额',
                min: 0,
                precision: 2,
                style: { width: '100%' },
              },
              default: 0,
            },
            
            needInvoice: {
              type: 'boolean',
              title: '需要发票',
              'x-decorator': 'FormItem',
              'x-component': 'Checkbox',
              'x-component-props': {
                children: '我需要开具发票',
              },
              default: false,
            },
            
            invoiceInfo: {
              type: 'object',
              'x-pattern': 'disabled',
              properties: {
                grid: {
                  type: 'void',
                  'x-component': 'FormGrid',
                  'x-component-props': { maxColumns: 2 },
                  properties: {
                    type: {
                      type: 'string',
                      title: '发票类型',
                      'x-decorator': 'FormItem',
                      'x-component': 'Select',
                      enum: [
                        { label: '个人', value: 'personal' },
                        { label: '企业', value: 'company' },
                      ],
                    },
                    title: {
                      type: 'string',
                      title: '发票抬头',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: '个人/公司名称',
                      },
                    },
                    taxNumber: {
                      type: 'string',
                      title: '税号',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: '纳税人识别号',
                      },
                    },
                    email: {
                      type: 'string',
                      title: '接收邮箱',
                      'x-decorator': 'FormItem',
                      'x-component': 'Input',
                      'x-component-props': {
                        placeholder: '用于接收电子发票',
                      },
                    },
                  }
                }
              }
            },
          }
        },
      }
    },
    
    // 订单汇总（隐藏字段，用于计算）
    summary: {
      type: 'object',
      'x-display': 'hidden',
      properties: {
        totalAmount: {
          type: 'number',
          default: 0,
        },
        shippingFee: {
          type: 'number',
          default: 0,
        },
        finalAmount: {
          type: 'number',
          default: 0,
        },
      }
    },
  }
}

const RealWorldForm = () => {
  const handleSubmit = (values: Record<string, unknown>) => {
    console.log('订单提交数据:', values)
    message.success('订单提交成功！')
    
    // 模拟跳转到支付页面
    setTimeout(() => {
      message.info('正在跳转到支付页面...')
    }, 1000)
  }
  
  // 监听表单值变化，实时显示订单汇总
  const summary = form.getValuesIn('summary') || {}
  const totalAmount = summary.totalAmount || 0
  const shippingFee = summary.shippingFee || 0
  const couponDiscount = form.getValuesIn('couponDiscount') || 0
  const finalAmount = summary.finalAmount || 0
  
  return (
    <div className="form-container fade-in">
      <div className="form-title">
        <Title level={4} style={{ margin: 0 }}>
          真实业务场景 - 电商订单提交
        </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
          综合运用 Formily 各种特性的完整业务表单示例。
        </Paragraph>
      </div>
      
      <Alert
        message="业务场景说明"
        description="这是一个完整的电商订单提交表单，包含商品清单、收货信息、支付方式等功能，演示了表单联动、自动计算、条件显示等特性。"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      {/* 订单汇总卡片 */}
      <Card 
        size="small" 
        style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title={<span style={{ color: '#fff' }}>商品总额</span>}
              value={totalAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#fff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={<span style={{ color: '#fff' }}>运费</span>}
              value={shippingFee}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#fff' }}
              suffix={totalAmount >= 99 ? <Tag color="success">已包邮</Tag> : null}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={<span style={{ color: '#fff' }}>优惠</span>}
              value={couponDiscount}
              precision={2}
              prefix="-¥"
              valueStyle={{ color: '#ffd700' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title={<span style={{ color: '#fff' }}>应付金额</span>}
              value={finalAmount}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#ffd700', fontSize: 28, fontWeight: 'bold' }}
            />
          </Col>
        </Row>
      </Card>
      
      <Card>
        <Form form={form} labelCol={5} wrapperCol={16} onAutoSubmit={handleSubmit}>
          <SchemaField schema={schema} />
          <Divider />
          <div className="form-actions">
            <Reset>重置</Reset>
            <Submit type="primary" size="large">
              提交订单
            </Submit>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default RealWorldForm


