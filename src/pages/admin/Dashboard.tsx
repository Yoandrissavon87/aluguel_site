import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layout, Typography, Button, Tabs, Table, Space, Modal, Form,
  Input, InputNumber, App as AntApp, Popconfirm, Card, Tag, Divider, Row, Col,
  Upload, Switch, Segmented,
} from 'antd'
import {
  LogoutOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined,
  DeleteOutlined, EditOutlined, PictureOutlined, TagsOutlined,
  PhoneOutlined, QuestionCircleOutlined, DollarOutlined, FontSizeOutlined,
  UploadOutlined, WifiOutlined,
} from '@ant-design/icons'
import { useSiteData, type Photo, type NearbyItem, type FaqItem, type Pricing, type SiteTexts } from '../../context/SiteContext'

const { Header, Content } = Layout
const { Title, Text } = Typography

/* ── Auth guard ─────────────────────────────── */
const INACTIVITY_MS = 5 * 60 * 1000 // 5 minutes

function isExpired() {
  const ts = sessionStorage.getItem('admin_auth')
  return !ts || Date.now() - Number(ts) > INACTIVITY_MS
}

function useAdminAuth() {
  const navigate = useNavigate()
  const redirecting = useRef(false)

  useEffect(() => {
    function expire() {
      if (redirecting.current) return
      redirecting.current = true
      sessionStorage.removeItem('admin_auth')
      navigate('/walkyshow?expired=1', { replace: true })
    }

    // Guard on mount (handles page reload after idle)
    if (isExpired()) { expire(); return }

    // Refresh timestamp on any user activity
    function touch() {
      sessionStorage.setItem('admin_auth', String(Date.now()))
    }

    // Also check when tab becomes visible again (user switched tabs)
    function onVisible() {
      if (document.visibilityState === 'visible' && isExpired()) expire()
    }

    const EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'] as const
    EVENTS.forEach(e => window.addEventListener(e, touch, { passive: true }))
    document.addEventListener('visibilitychange', onVisible)

    // Periodic check every 15 seconds
    const timer = setInterval(() => { if (isExpired()) expire() }, 15_000)

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, touch))
      document.removeEventListener('visibilitychange', onVisible)
      clearInterval(timer)
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
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')
  const [previewSrc, setPreviewSrc] = useState<string>('')

  function move(index: number, dir: -1 | 1) {
    const next = [...photos]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function openAdd() {
    setEditIndex(null)
    setUploadMode('file')
    setPreviewSrc('')
    form.resetFields()
    setModalOpen(true)
  }

  function openEdit(index: number) {
    setEditIndex(index)
    const photo = photos[index]
    const isDataUrl = photo.src.startsWith('data:')
    setUploadMode(isDataUrl ? 'file' : 'url')
    setPreviewSrc(isDataUrl ? photo.src : '')
    form.setFieldsValue(photo)
    setModalOpen(true)
  }

  function switchMode(mode: 'file' | 'url') {
    setUploadMode(mode)
    setPreviewSrc('')
    form.setFieldValue('src', '')
  }

  function handleSave(values: Photo) {
    if (!values.src?.trim()) {
      message.error(uploadMode === 'file' ? 'Selecione uma imagem.' : 'Informe a URL da imagem.')
      return
    }
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
    {
      title: 'Origem',
      dataIndex: 'src',
      key: 'src',
      ellipsis: true,
      render: (src: string) =>
        src.startsWith('data:')
          ? <Tag color="blue">Arquivo</Tag>
          : <span style={{ fontSize: 12, color: '#888' }}>{src}</span>,
    },
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

          <Form.Item label="Origem da foto" style={{ marginBottom: 16 }}>
            <Segmented
              block
              options={[
                { label: <><UploadOutlined /> Arquivo</>, value: 'file' },
                { label: 'URL / Caminho', value: 'url' },
              ]}
              value={uploadMode}
              onChange={(v) => switchMode(v as 'file' | 'url')}
            />
          </Form.Item>

          {uploadMode === 'file' && (
            <Form.Item label="Imagem" style={{ marginBottom: 16 }}>
              <Upload.Dragger
                accept="image/*"
                multiple={false}
                showUploadList={false}
                beforeUpload={(file) => {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const base64 = e.target?.result as string
                    form.setFieldValue('src', base64)
                    setPreviewSrc(base64)
                  }
                  reader.readAsDataURL(file)
                  return false
                }}
              >
                {previewSrc ? (
                  <div style={{ padding: 8 }}>
                    <img
                      src={previewSrc}
                      alt="prévia"
                      style={{ maxHeight: 140, maxWidth: '100%', borderRadius: 6, objectFit: 'contain' }}
                    />
                    <p style={{ marginTop: 8, color: '#888', fontSize: 12 }}>Clique ou arraste para substituir</p>
                  </div>
                ) : (
                  <>
                    <p className="ant-upload-drag-icon"><PictureOutlined style={{ fontSize: 32, color: '#aaa' }} /></p>
                    <p className="ant-upload-text">Clique ou arraste uma imagem aqui</p>
                    <p className="ant-upload-hint">PNG · JPG · WEBP · GIF</p>
                  </>
                )}
              </Upload.Dragger>
            </Form.Item>
          )}

          {/* Sempre montado para que o form leia o valor em onFinish;
              oculto no modo arquivo (preenchido via FileReader) */}
          <Form.Item
            name="src"
            label="URL ou caminho da foto"
            hidden={uploadMode === 'file'}
            style={{ marginBottom: 16 }}
          >
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

/* ── Pricing manager ────────────────────────── */
function PricingManager() {
  const { data, updatePricing } = useSiteData()
  const { message } = AntApp.useApp()
  const [form] = Form.useForm<Pricing>()

  useEffect(() => {
    form.setFieldsValue(data.pricing)
  }, [data.pricing, form])

  function handleSave(values: Pricing) {
    updatePricing(values)
    message.success('Preços atualizados com sucesso.')
  }

  return (
    <Card title="Preços" style={{ maxWidth: 560 }}>
      <Form form={form} layout="vertical" onFinish={handleSave} onValuesChange={() => form.validateFields()}>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="rentWithGarage"
              label="Aluguel com garagem (R$)"
              rules={[{ required: true, message: 'Informe o valor' }]}
            >
              <InputNumber
                prefix="R$"
                min={0}
                step={50}
                style={{ width: '100%' }}
                size="large"
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(v) => Number((v ?? '').replace(/\./g, '')) as unknown as 0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="rentWithoutGarage"
              label="Aluguel sem garagem (R$)"
              rules={[{ required: true, message: 'Informe o valor' }]}
            >
              <InputNumber
                prefix="R$"
                min={0}
                step={50}
                style={{ width: '100%' }}
                size="large"
                formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={(v) => Number((v ?? '').replace(/\./g, '')) as unknown as 0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="condominio"
          label="Condomínio (R$)"
          rules={[{ required: true, message: 'Informe o valor' }]}
          extra="Exibido separadamente do aluguel no site"
        >
          <InputNumber
            prefix="R$"
            min={0}
            step={50}
            style={{ width: '100%' }}
            size="large"
            formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
            parser={(v) => Number((v ?? '').replace(/\./g, '')) as unknown as 0}
          />
        </Form.Item>

        <Form.Item
          name="internetIncluido"
          label={<><WifiOutlined /> Internet inclusa no condomínio</>}
          valuePropName="checked"
          extra="Quando ativado, exibe 'Internet inclusa' junto ao valor do condomínio no site"
        >
          <Switch checkedChildren="Sim" unCheckedChildren="Não" />
        </Form.Item>

        <Divider />

        <div style={{ marginBottom: 20 }}>
          <Text type="secondary" style={{ fontSize: 13 }}>Prévia dos totais:</Text>
          <div style={{ marginTop: 10, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Tag color="blue" style={{ fontSize: 13, padding: '4px 10px' }}>
              Com garagem: R$ {(
                (form.getFieldValue('rentWithGarage') ?? data.pricing.rentWithGarage) +
                (form.getFieldValue('condominio')     ?? data.pricing.condominio)
              ).toLocaleString('pt-BR')}/mês
            </Tag>
            <Tag color="purple" style={{ fontSize: 13, padding: '4px 10px' }}>
              Sem garagem: R$ {(
                (form.getFieldValue('rentWithoutGarage') ?? data.pricing.rentWithoutGarage) +
                (form.getFieldValue('condominio')         ?? data.pricing.condominio)
              ).toLocaleString('pt-BR')}/mês
            </Tag>
          </div>
        </div>

        <Button type="primary" htmlType="submit" size="large" icon={<DollarOutlined />}>
          Salvar Preços
        </Button>
      </Form>
    </Card>
  )
}

/* ── Texts manager ──────────────────────────── */
function TextsManager() {
  const { data, updateTexts } = useSiteData()
  const { message } = AntApp.useApp()
  const [form] = Form.useForm<SiteTexts>()

  useEffect(() => {
    form.setFieldsValue(data.texts)
  }, [data.texts, form])

  function handleSave(values: SiteTexts) {
    updateTexts(values)
    message.success('Textos atualizados com sucesso.')
  }

  const field = (name: keyof SiteTexts, label: string, extra?: string, textarea?: boolean) => (
    <Form.Item name={name} label={label} extra={extra}
      rules={[{ required: true, message: `Informe ${label.toLowerCase()}` }]}
    >
      {textarea
        ? <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        : <Input />}
    </Form.Item>
  )

  return (
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <Row gutter={24}>

        {/* ── Identidade ── */}
        <Col xs={24} lg={12}>
          <Card title="Identidade" size="small" style={{ marginBottom: 20 }}>
            {field('brandName',     'Nome do apartamento', 'Ex: APTO 96')}
            {field('brandBuilding', 'Nome do edifício',    'Ex: Dolores Duran')}
          </Card>
        </Col>

        {/* ── Especificações ── */}
        <Col xs={24} lg={12}>
          <Card title="Especificações (barra de stats)" size="small" style={{ marginBottom: 20 }}>
            <Row gutter={12}>
              <Col span={12}>{field('statsQuartos',  'Quartos')}</Col>
              <Col span={12}>{field('statsGaragem',  'Garagem')}</Col>
              <Col span={12}>{field('statsArea',     'Área')}</Col>
              <Col span={12}>{field('statsAndar',    'Andar')}</Col>
              <Col span={12}>{field('statsImovel',   'Imóvel')}</Col>
              <Col span={12}>{field('statsPortaria', 'Portaria')}</Col>
            </Row>
          </Card>
        </Col>

        {/* ── Hero ── */}
        <Col xs={24} lg={12}>
          <Card title="Seção Hero" size="small" style={{ marginBottom: 20 }}>
            {field('heroBadge',   'Badge de status',   'Ex: Disponível para locação')}
            {field('heroTitle',   'Título principal',  'Use Enter para quebrar linha', true)}
            {field('heroAddress', 'Endereço no hero')}
            {field('heroDocs',    'Nota de documentos')}
          </Card>
        </Col>

        {/* ── Sobre ── */}
        <Col xs={24} lg={12}>
          <Card title="Seção Sobre" size="small" style={{ marginBottom: 20 }}>
            {field('aboutHeadline', 'Título "Sobre"', 'Use Enter para quebrar linha', true)}
            {field('aboutBody1',    'Parágrafo 1', undefined, true)}
            {field('aboutBody2',    'Parágrafo 2', undefined, true)}
          </Card>
        </Col>

        {/* ── Localização ── */}
        <Col xs={24} lg={12}>
          <Card title="Seção Localização" size="small" style={{ marginBottom: 20 }}>
            {field('locationStreet',   'Rua e número')}
            {field('locationBuilding', 'Edifício e andar')}
            {field('locationCity',     'Cidade, estado e CEP')}
          </Card>
        </Col>

        {/* ── CTA e Rodapé ── */}
        <Col xs={24} lg={12}>
          <Card title="CTA e Rodapé" size="small" style={{ marginBottom: 20 }}>
            {field('ctaTitle',   'Título do CTA')}
            {field('ctaSub',     'Subtítulo do CTA')}
            {field('footerText', 'Texto do rodapé')}
          </Card>
        </Col>

      </Row>

      <Button type="primary" htmlType="submit" size="large" icon={<FontSizeOutlined />}>
        Salvar Textos
      </Button>
    </Form>
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
    navigate('/walkyshow', { replace: true })
  }

  const tabItems = [
    {
      key: 'textos',
      label: <span><FontSizeOutlined /> Textos</span>,
      children: <TextsManager />,
    },
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
      key: 'precos',
      label: <span><DollarOutlined /> Preços</span>,
      children: <PricingManager />,
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
