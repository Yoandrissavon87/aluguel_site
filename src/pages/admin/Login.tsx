import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, App as AntApp } from 'antd'
import { LockOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string

export default function AdminLogin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { message } = AntApp.useApp()

  function handleSubmit({ password }: { password: string }) {
    setLoading(true)
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', '1')
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
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            Entrar
          </Button>
        </Form>
      </Card>
    </div>
  )
}
