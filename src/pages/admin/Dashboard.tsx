import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout, Typography, Button, Tabs, Table, Space, Modal, Form,
  Input, App as AntApp, Popconfirm, Card, Tag, Divider, Row, Col,
} from 'antd'
import {
  LogoutOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined,
  DeleteOutlined, EditOutlined, PictureOutlined, TagsOutlined,
  PhoneOutlined, QuestionCircleOutlined,
} from '@ant-design/icons'
import { useSiteData, type Photo, type NearbyItem, type FaqItem } from '../../context/SiteContext'

const { Header, Content } = Layout
const { Title, Text } = Typography

/* ── Auth guard ─────────────────────────────── */
function useAdminAuth() {
  const navigate = useNavigate()
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== '1') {
      navigate('/walkyshow', { replace: true })
    }
  }, [navigate])
}

/* ── Photo list manager ─────────────────────── */
function PhotoManager({
  title,
  photos,
  onChange,
}: {
  title: string
  photos: Photo[]
  onChange: (photos: Photo[]) => void
}) {
  const { message } = AntApp.useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm<Photo>()

  function move(index: number, dir: -1 | 1) {
    const next = [...photos]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function openAdd() {
    setEditIndex(null)
    form.resetFields()
    setModalOpen(true)
  }

  function openEdit(index: number) {
    setEditIndex(index)
    form.setFieldsValue(photos[index])
    setModalOpen(true)
  }

  function handleSave(values: Photo) {
    const next = [...photos]
    if (editIndex !== null) {
      next[editIndex] = values
    } else {
      next.push(values)
    }
    onChange(next)
    message.success(editIndex !== null ? 'Foto atualizada.' : 'Foto adicionada.')
    setModalOpen(false)
  }

  function handleDelete(index: number) {
    onChange(photos.filter((_, i) => i !== index))
    message.success('Foto removida.')
  }

  const columns = [
    {
      title: 'Prévia',
      key: 'preview',
      width: 80,
      render: (_: unknown, record: Photo) => (
        <img
          src={record.src}
          alt={record.alt}
          style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, background: '#eee' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
        />
      ),
    },
    { title: 'URL / Caminho', dataIndex: 'src', key: 'src', ellipsis: true },
    { title: 'Alt', dataIndex: 'alt', key: 'alt', ellipsis: true },
    { title: 'Legenda', dataIndex: 'label', key: 'label' },
    {
      title: 'Ações',
      key: 'actions',
      width: 180,
      render: (_: unknown, _record: Photo, index: number) => (
        <Space>
          <Button size="small" icon={<ArrowUpOutlined />}   onClick={() => move(index, -1)} disabled={index === 0} />
          <Button size="small" icon={<ArrowDownOutlined />} onClick={() => move(index,  1)} disabled={index === photos.length - 1} />
          <Button size="small" icon={<EditOutlined />}      onClick={() => openEdit(index)} />
          <Popconfirm title="Remover esta foto?" onConfirm={() => handleDelete(index)} okText="Sim" cancelText="Não">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title={title}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Adicionar Foto</Button>}
      style={{ marginBottom: 24 }}
    >
      <Table
        dataSource={photos}
        columns={columns}
        rowKey="src"
        pagination={false}
        size="small"
      />

      <Modal
        title={editIndex !== null ? 'Editar Foto' : 'Adicionar Foto'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Form.Item name="src" label="URL ou caminho da foto" rules={[{ required: true, message: 'Informe o caminho da foto' }]}>
            <Input placeholder="Ex: /fotos/sala.jpg ou https://..." />
          </Form.Item>
          <Form.Item name="alt" label="Texto alternativo (acessibilidade)" rules={[{ required: true, message: 'Informe o texto alternativo' }]}>
            <Input placeholder="Ex: Sala de estar – vista 1" />
          </Form.Item>
          <Form.Item name="label" label="Legenda exibida na galeria" rules={[{ required: true, message: 'Informe a legenda' }]}>
            <Input placeholder="Ex: Sala de Estar" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">Salvar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

/* ── Features manager ───────────────────────── */
function FeaturesManager() {
  const { data, updateFeatures } = useSiteData()
  const { message } = AntApp.useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm<{ text: string }>()

  function move(index: number, dir: -1 | 1) {
    const next = [...data.features]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    updateFeatures(next)
  }

  function openAdd() {
    setEditIndex(null)
    form.resetFields()
    setModalOpen(true)
  }

  function openEdit(index: number) {
    setEditIndex(index)
    form.setFieldsValue({ text: data.features[index] })
    setModalOpen(true)
  }

  function handleSave({ text }: { text: string }) {
    const next = [...data.features]
    if (editIndex !== null) {
      next[editIndex] = text
    } else {
      next.push(text)
    }
    updateFeatures(next)
    message.success(editIndex !== null ? 'Característica atualizada.' : 'Característica adicionada.')
    setModalOpen(false)
  }

  function handleDelete(index: number) {
    updateFeatures(data.features.filter((_, i) => i !== index))
    message.success('Característica removida.')
  }

  const columns = [
    { title: 'Característica', dataIndex: 'text', key: 'text' },
    {
      title: 'Ações',
      key: 'actions',
      width: 180,
      render: (_: unknown, _record: unknown, index: number) => (
        <Space>
          <Button size="small" icon={<ArrowUpOutlined />}   onClick={() => move(index, -1)} disabled={index === 0} />
          <Button size="small" icon={<ArrowDownOutlined />} onClick={() => move(index,  1)} disabled={index === data.features.length - 1} />
          <Button size="small" icon={<EditOutlined />}      onClick={() => openEdit(index)} />
          <Popconfirm title="Remover esta característica?" onConfirm={() => handleDelete(index)} okText="Sim" cancelText="Não">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="Características do Imóvel"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Adicionar</Button>}
        style={{ marginBottom: 24 }}
      >
        <Table
          dataSource={data.features.map((text, i) => ({ text, key: i }))}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Card>

      <Modal
        title={editIndex !== null ? 'Editar Característica' : 'Adicionar Característica'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Form.Item name="text" label="Descrição" rules={[{ required: true, message: 'Informe a descrição' }]}>
            <Input placeholder="Ex: 2 quartos" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">Salvar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

/* ── Nearby manager ─────────────────────────── */
function NearbyManager() {
  const { data, updateNearbyItems } = useSiteData()
  const { message } = AntApp.useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm<NearbyItem>()

  function move(index: number, dir: -1 | 1) {
    const next = [...data.nearbyItems]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    updateNearbyItems(next)
  }

  function openAdd() {
    setEditIndex(null)
    form.resetFields()
    setModalOpen(true)
  }

  function openEdit(index: number) {
    setEditIndex(index)
    form.setFieldsValue(data.nearbyItems[index])
    setModalOpen(true)
  }

  function handleSave(values: NearbyItem) {
    const next = [...data.nearbyItems]
    if (editIndex !== null) {
      next[editIndex] = values
    } else {
      next.push(values)
    }
    updateNearbyItems(next)
    message.success(editIndex !== null ? 'Item atualizado.' : 'Item adicionado.')
    setModalOpen(false)
  }

  function handleDelete(index: number) {
    updateNearbyItems(data.nearbyItems.filter((_, i) => i !== index))
    message.success('Item removido.')
  }

  const columns = [
    { title: 'Ícone', dataIndex: 'icon', key: 'icon', width: 60,
      render: (icon: string) => <span style={{ fontSize: 20 }}>{icon}</span> },
    { title: 'Local / Serviço', dataIndex: 'label', key: 'label' },
    {
      title: 'Ações',
      key: 'actions',
      width: 180,
      render: (_: unknown, _record: unknown, index: number) => (
        <Space>
          <Button size="small" icon={<ArrowUpOutlined />}   onClick={() => move(index, -1)} disabled={index === 0} />
          <Button size="small" icon={<ArrowDownOutlined />} onClick={() => move(index,  1)} disabled={index === data.nearbyItems.length - 1} />
          <Button size="small" icon={<EditOutlined />}      onClick={() => openEdit(index)} />
          <Popconfirm title="Remover este item?" onConfirm={() => handleDelete(index)} okText="Sim" cancelText="Não">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="Serviços / Pontos Próximos"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Adicionar</Button>}
      >
        <Table
          dataSource={data.nearbyItems.map((item, i) => ({ ...item, key: i }))}
          columns={columns}
          pagination={false}
          size="small"
        />
      </Card>

      <Modal
        title={editIndex !== null ? 'Editar Item' : 'Adicionar Item'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Form.Item name="icon" label="Emoji / Ícone" rules={[{ required: true, message: 'Informe o emoji' }]}>
            <Input placeholder="Ex: 🏬" maxLength={4} />
          </Form.Item>
          <Form.Item name="label" label="Nome do local / serviço" rules={[{ required: true, message: 'Informe o nome' }]}>
            <Input placeholder="Ex: Shopping Estação" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">Salvar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

/* ── FAQ manager ────────────────────────────── */
function FaqManager() {
  const { data, updateFaqItems } = useSiteData()
  const { message } = AntApp.useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form] = Form.useForm<{ label: string; answer: string }>()

  function move(index: number, dir: -1 | 1) {
    const next = [...data.faqItems]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    updateFaqItems(next)
  }

  function openAdd() {
    setEditIndex(null)
    form.resetFields()
    setModalOpen(true)
  }

  function openEdit(index: number) {
    setEditIndex(index)
    form.setFieldsValue({
      label:  data.faqItems[index].label,
      answer: data.faqItems[index].answer,
    })
    setModalOpen(true)
  }

  function handleSave(values: { label: string; answer: string }) {
    const next = [...data.faqItems]
    if (editIndex !== null) {
      next[editIndex] = { ...next[editIndex], ...values }
    } else {
      next.push({ key: String(Date.now()), ...values })
    }
    updateFaqItems(next)
    message.success(editIndex !== null ? 'Pergunta atualizada.' : 'Pergunta adicionada.')
    setModalOpen(false)
  }

  function handleDelete(index: number) {
    updateFaqItems(data.faqItems.filter((_, i) => i !== index))
    message.success('Pergunta removida.')
  }

  const columns = [
    {
      title: '#',
      key: 'num',
      width: 44,
      render: (_: unknown, _r: unknown, i: number) => (
        <span style={{ color: '#999', fontSize: 12 }}>{i + 1}</span>
      ),
    },
    {
      title: 'Pergunta',
      dataIndex: 'label',
      key: 'label',
      ellipsis: true,
    },
    {
      title: 'Resposta',
      dataIndex: 'answer',
      key: 'answer',
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: '#666', fontSize: 13 }}>{text}</span>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      width: 180,
      render: (_: unknown, _record: FaqItem, index: number) => (
        <Space>
          <Button size="small" icon={<ArrowUpOutlined />}   onClick={() => move(index, -1)} disabled={index === 0} />
          <Button size="small" icon={<ArrowDownOutlined />} onClick={() => move(index,  1)} disabled={index === data.faqItems.length - 1} />
          <Button size="small" icon={<EditOutlined />}      onClick={() => openEdit(index)} />
          <Popconfirm title="Remover esta pergunta?" onConfirm={() => handleDelete(index)} okText="Sim" cancelText="Não">
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card
        title="Perguntas Frequentes (FAQ)"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Adicionar Pergunta</Button>}
      >
        <Table
          dataSource={data.faqItems.map((item, i) => ({ ...item, _index: i }))}
          columns={columns}
          rowKey="key"
          pagination={false}
          size="small"
        />
      </Card>

      <Modal
        title={editIndex !== null ? 'Editar Pergunta' : 'Nova Pergunta'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
        width={560}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} style={{ marginTop: 16 }}>
          <Form.Item
            name="label"
            label="Pergunta"
            rules={[{ required: true, message: 'Informe a pergunta' }]}
          >
            <Input placeholder="Ex: Qual o valor do aluguel?" />
          </Form.Item>
          <Form.Item
            name="answer"
            label="Resposta"
            rules={[{ required: true, message: 'Informe a resposta' }]}
          >
            <Input.TextArea rows={4} placeholder="Digite a resposta completa..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="primary" htmlType="submit">Salvar</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

/* ── Contact manager ────────────────────────── */
function ContactManager() {
  const { data, updateContact } = useSiteData()
  const { message } = AntApp.useApp()
  const [form] = Form.useForm<{ phone: string; whatsapp: string }>()

  useEffect(() => {
    form.setFieldsValue({ phone: data.contactPhone, whatsapp: data.contactWhatsApp })
  }, [data.contactPhone, data.contactWhatsApp, form])

  function handleSave(values: { phone: string; whatsapp: string }) {
    updateContact(values.phone, values.whatsapp)
    message.success('Contato atualizado com sucesso.')
  }

  return (
    <Card title="Números de Contato" style={{ maxWidth: 520 }}>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          name="phone"
          label="Telefone (com DDD, sem espaços)"
          rules={[{ required: true, message: 'Informe o telefone' }]}
          extra="Usado no botão Ligar Agora. Ex: 5541988888888"
        >
          <Input prefix={<PhoneOutlined />} placeholder="5541988888888" size="large" />
        </Form.Item>
        <Form.Item
          name="whatsapp"
          label="WhatsApp (com DDD, sem espaços)"
          rules={[{ required: true, message: 'Informe o WhatsApp' }]}
          extra="Usado no botão WhatsApp e no botão flutuante. Ex: 5541988888888"
        >
          <Input prefix={<span style={{ color: '#25D366', fontWeight: 700 }}>WA</span>} placeholder="5541988888888" size="large" />
        </Form.Item>

        <Divider />

        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>Prévia dos links gerados:</Text>
          <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Tag color="blue">tel:+{form.getFieldValue('phone') || data.contactPhone}</Tag>
            <Tag color="green">https://wa.me/{form.getFieldValue('whatsapp') || data.contactWhatsApp}</Tag>
          </div>
        </div>

        <Button type="primary" htmlType="submit" size="large">
          Salvar Contato
        </Button>
      </Form>
    </Card>
  )
}

/* ── Main dashboard ─────────────────────────── */
export default function AdminDashboard() {
  useAdminAuth()
  const navigate = useNavigate()
  const { data, updateApartmentPhotos, updateBuildingPhotos } = useSiteData()

  function logout() {
    sessionStorage.removeItem('admin_auth')
    navigate('/walkyshow')
  }

  const tabItems = [
    {
      key: 'fotos',
      label: <span><PictureOutlined /> Fotos</span>,
      children: (
        <>
          <PhotoManager
            title="Fotos do Apartamento"
            photos={data.apartmentPhotos}
            onChange={updateApartmentPhotos}
          />
          <PhotoManager
            title="Fotos do Edifício"
            photos={data.buildingPhotos}
            onChange={updateBuildingPhotos}
          />
        </>
      ),
    },
    {
      key: 'categorias',
      label: <span><TagsOutlined /> Categorias</span>,
      children: (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}><FeaturesManager /></Col>
          <Col xs={24} lg={12}><NearbyManager /></Col>
        </Row>
      ),
    },
    {
      key: 'faq',
      label: <span><QuestionCircleOutlined /> FAQ</span>,
      children: <FaqManager />,
    },
    {
      key: 'contato',
      label: <span><PhoneOutlined /> Contato</span>,
      children: <ContactManager />,
    },
  ]

  return (
    <AntApp>
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Header style={{
          background: '#fff',
          borderBottom: '1px solid #e8e8e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', background: '#1677ff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>A</span>
            </div>
            <div>
              <Title level={5} style={{ margin: 0, lineHeight: 1.2 }}>Painel Admin</Title>
              <Text type="secondary" style={{ fontSize: 12 }}>Apto 96 · Dolores Duran</Text>
            </div>
          </div>
          <Space>
            <Button href="/" target="_blank" size="small">Ver site</Button>
            <Button icon={<LogoutOutlined />} onClick={logout} size="small">Sair</Button>
          </Space>
        </Header>

        <Content style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
          <Tabs items={tabItems} size="large" />
        </Content>
      </Layout>
    </AntApp>
  )
}
