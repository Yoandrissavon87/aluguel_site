import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, App as AntApp, Alert } from 'antd'
import { LockOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string

export default function AdminLogin() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const { message } = AntApp.useApp()

  const expired = params.get('expired') === '1'

  useEffect(() => {
    if (expired) message.warning('Sessão expirada por inatividade. Faça login novamente.')
  }, [expired, message])

  function handleSubmit({ password }: { password: string }) {
    setLoading(true)
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', String(Date.now()))
        navigate('/walkyshow/dashboard')
      } else {
        message.error('Senha incorreta. Tente novamente.')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f0f2f5',
    }}>
      <Card
        style={{ width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}
        styles={{ body: { padding: '2.5rem 2rem' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: '#1677ff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            <LockOutlined style={{ color: '#fff', fontSize: 22 }} />
          </div>
          <Title level={4} style={{ margin: 0 }}>Painel Administrativo</Title>
          <Text type="secondary" style={{ fontSize: 13 }}>Apto 96 · Dolores Duran</Text>
        </div>

        {expired && (
          <Alert
            message="Sessão expirada por inatividade"
            type="warning"
            showIcon
            style={{ marginBottom: 20 }}
          />
        )}

        <Form layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            name="password"
            label="Senha"
            rules={[{ required: true, message: 'Informe a senha' }]}
          >
            <Input.Password
              placeholder="Digite a senha de acesso"
              size="large"
              autoFocus
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" size="large" block loading={loading}>
            Entrar
          </Button>
        </Form>
      </Card>
    </div>
  )
}
