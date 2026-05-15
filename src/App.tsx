import {
  ConfigProvider,
  App as AntApp,
  Typography,
  Row,
  Col,
  Image,
  Button,
  Space,
  Tag,
  Divider,
  Collapse,
} from 'antd'
import {
  EnvironmentOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  HomeOutlined,
  StarFilled,
} from '@ant-design/icons'
import type { ThemeConfig } from 'antd'
import './index.css'

const { Text, Paragraph } = Typography

const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#B8935A',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    borderRadius: 8,
    borderRadiusLG: 12,
    controlHeight: 42,
  },
  components: {
    Button: { borderRadius: 4, fontWeight: 500 },
    Collapse: { borderRadius: 8 },
  },
}

const APARTMENT_PHOTOS = [
  { src: '/fotos/sala-vista-1.jpg',       alt: 'Sala de estar – vista 1',                   label: 'Sala de Estar' },
  { src: '/fotos/sala-vista-2.jpg',       alt: 'Sala de estar – vista 2',                   label: 'Sala de Estar' },
  { src: '/fotos/vista-janela-sala.jpg',  alt: 'Vista panorâmica da janela da sala',         label: 'Vista da Janela' },
  { src: '/fotos/quarto-vista-1.jpg',     alt: 'Quarto principal',                           label: 'Quarto Principal' },
  { src: '/fotos/quarto-solteiro-1.jpg',  alt: 'Segundo quarto – vista 1',                  label: 'Segundo Quarto' },
  { src: '/fotos/quarto-solteiro-2.jpg',  alt: 'Segundo quarto – vista 2',                  label: 'Segundo Quarto' },
  { src: '/fotos/cozinha.jpg',            alt: 'Cozinha integrada com área de serviço',      label: 'Cozinha' },
  { src: '/fotos/banheiro.jpg',           alt: 'Banheiro',                                   label: 'Banheiro' },
]

const BUILDING_PHOTOS = [
  { src: '/fotos/recepcao.jpg',               alt: 'Recepção do Edifício Dolores Duran',             label: 'Recepção' },
  { src: '/fotos/dois-elevadores.jpg',        alt: 'Dois elevadores para melhor atendimento',        label: '2 Elevadores' },
  { src: '/fotos/quintadinha.jpg',            alt: 'Segurança – quintadinha 24 horas',               label: 'Segurança 24h' },
  { src: '/fotos/armario-correspondencias.jpg', alt: 'Armário inteligente para correspondências',    label: 'Armário Inteligente' },
]

const FEATURES = [
  '2 quartos',
  'Totalmente mobiliado',
  'Sala de TV + sala de jantar integradas',
  'Portaria remota',
  'Cozinha integrada com área de serviço',
  'Ótima iluminação natural',
  '11º andar',
  'Aceita pets de pequeno porte',
]

const NEARBY = [
  { icon: '🛒', label: 'Mercados' },
  { icon: '💊', label: 'Farmácias' },
  { icon: '🍎', label: 'Frutarias' },
  { icon: '🏋', label: 'Academias' },
  { icon: '🍽', label: 'Restaurantes' },
  { icon: '🌳', label: 'Praças' },
  { icon: '🚌', label: 'Transporte público' },
  { icon: '🛍', label: 'Lojas em geral' },
  { icon: '🏬', label: 'Shopping Estação' },
]

const FAQ_ITEMS = [
  {
    key: '1',
    label: 'Qual o valor do aluguel e o que está incluso?',
    children: 'O valor do aluguel é de R$ 2.800,00 mensais, já incluso o valor da taxa de condomínio.',
  },
  {
    key: '2',
    label: 'Qual o prazo mínimo do contrato de locação?',
    children: 'O prazo mínimo da locação é de 12 (doze) meses.',
  },
  {
    key: '3',
    label: 'É necessário algum tipo de garantia locatícia?',
    children: 'Sim. Será exigida caução no valor equivalente a 1 (um) mês e meio de aluguel.',
  },
  {
    key: '4',
    label: 'O apartamento aceita animais domésticos?',
    children: 'Sim. São permitidos animais de pequeno porte, desde que não causem irregularidades, danos ao imóvel ou descumprimento das regras do condomínio.',
  },
  {
    key: '5',
    label: 'Como funciona o reajuste do aluguel?',
    children: 'O reajuste do aluguel será realizado anualmente, com base no índice IPCA, conforme previsto em contrato.',
  },
  {
    key: '6',
    label: 'Quem é responsável pelo pagamento do IPTU?',
    children: 'O pagamento do IPTU é de responsabilidade do inquilino. Contudo, o IPTU do ano vigente já está quitado.',
  },
  {
    key: '7',
    label: 'Como funciona a multa em caso de saída antes do término do contrato?',
    children: 'Em caso de desocupação antes do término do contrato, será aplicada multa proporcional ao período restante da locação.',
  },
  {
    key: '8',
    label: 'É permitido fazer alterações ou reformas no imóvel?',
    children: 'Somente mediante autorização prévia do proprietário.',
  },
  {
    key: '9',
    label: 'Quais documentos são necessários para aprovação da locação?',
    children: 'Os documentos necessários são: RG, CPF e Comprovante de renda.',
  },
]

export default function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <div className="site-wrapper">

          {/* ── HEADER ───────────────────────────── */}
          <header className="site-header">
            <div className="container">
              <div className="header-brand">
                <HomeOutlined style={{ color: '#B8935A', fontSize: 18 }} aria-hidden="true" />
                <span>Dolores Duran · Centro, Curitiba</span>
              </div>
              <Button
                type="primary"
                icon={<PhoneOutlined />}
                href="tel:+5541988888888"
              >
                Entrar em Contato
              </Button>
            </div>
          </header>

          {/* ── HERO ─────────────────────────────── */}
          <section className="hero-section" aria-label="Apartamento para locação">
            <div className="hero-bg" aria-hidden="true" />
            <div className="hero-content">
              <Tag className="hero-badge">Locação Residencial · Centro · Curitiba/PR</Tag>
              <h1 className="hero-title">
                Apartamento Mobiliado<br />no Coração de Curitiba
              </h1>
              <p className="hero-subtitle">
                Edifício Dolores Duran · 11º andar ·{' '}
                <strong>Rua André de Barros, 626</strong>
              </p>
              <div className="price-row">
                <span className="price-eyebrow">Aluguel mensal</span>
                <span className="price-amount">R$ 2.800</span>
                <span className="price-period">/mês</span>
              </div>
              <p className="price-note">condomínio já incluso</p>
              <Space size={12} wrap style={{ justifyContent: 'center' }}>
                <Button type="primary" size="large" href="#contato">
                  Agendar Visita
                </Button>
                <Button size="large" className="btn-ghost" href="#galeria">
                  Ver Fotos
                </Button>
              </Space>
            </div>
          </section>

          {/* ── STATS BAR ────────────────────────── */}
          <div className="stats-bar" role="list" aria-label="Características principais">
            {[
              { icon: '🛏', value: '2',        label: 'Quartos'    },
              { icon: '📐', value: '35 m²',    label: 'Área'       },
              { icon: '🏢', value: '11º',      label: 'Andar'      },
              { icon: '🛋', value: 'Mobiliado',label: 'Imóvel'     },
              { icon: '🔒', value: 'Remota',   label: 'Portaria'   },
            ].map((s) => (
              <div key={s.label} className="stat-item" role="listitem">
                <span className="stat-icon" aria-hidden="true">{s.icon}</span>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* ── MAIN CONTENT ─────────────────────── */}
          <main className="main-content">

            {/* GALERIA DO APARTAMENTO */}
            <section className="section" id="galeria" aria-label="Galeria de fotos do apartamento">
              <p className="section-label">Fotos do Apartamento</p>
              <Image.PreviewGroup>
                <Row gutter={[10, 10]}>
                  {APARTMENT_PHOTOS.map((photo) => (
                    <Col key={photo.src} xs={12} sm={8} md={6}>
                      <div className="photo-cell">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          preview={{ mask: photo.label }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </section>

            <Divider />

            {/* SOBRE O IMÓVEL */}
            <section className="section" id="sobre" aria-label="Sobre o imóvel">
              <p className="section-label">Sobre o Imóvel</p>
              <Row gutter={[40, 24]} align="middle">
                <Col xs={24} md={14}>
                  <Paragraph className="body-text">
                    Apartamento totalmente mobiliado para locação no Centro de Curitiba, com{' '}
                    <strong>35 m²</strong> bem distribuídos no <strong>11º andar</strong> do
                    Edifício Dolores Duran. O imóvel conta com 2 quartos, sala de TV integrada
                    com sala de jantar, cozinha integrada com área de serviço, portaria remota
                    e ótima iluminação natural.
                  </Paragraph>
                  <Paragraph className="body-text">
                    Ideal para quem busca <strong>conforto, praticidade e mobilidade</strong> no
                    centro da cidade. Próximo ao Shopping Estação, com fácil acesso a transporte
                    público e toda a infraestrutura do Centro de Curitiba.
                  </Paragraph>
                </Col>
                <Col xs={24} md={10}>
                  <div style={{
                    background: 'var(--white)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}>
                    {[
                      { label: 'Aluguel', value: 'R$ 2.800/mês (cond. incluso)' },
                      { label: 'Contrato mínimo', value: '12 meses' },
                      { label: 'Caução', value: '1,5 mês de aluguel' },
                      { label: 'Reajuste', value: 'Anual pelo IPCA' },
                      { label: 'IPTU', value: 'Por conta do inquilino' },
                    ].map((row) => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <Text style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{row.label}</Text>
                        <Text strong style={{ fontSize: 14, textAlign: 'right' }}>{row.value}</Text>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </section>

            <Divider />

            {/* CARACTERÍSTICAS */}
            <section className="section" id="caracteristicas" aria-label="Características do imóvel">
              <p className="section-label">Características</p>
              <Row gutter={[10, 10]}>
                {FEATURES.map((f) => (
                  <Col key={f} xs={24} sm={12} lg={8}>
                    <div className="feature-chip">
                      <span className="feature-dot" aria-hidden="true" />
                      <span>{f}</span>
                    </div>
                  </Col>
                ))}
              </Row>
            </section>

            <Divider />

            {/* INFRAESTRUTURA DO EDIFÍCIO */}
            <section className="section" id="edificio" aria-label="Infraestrutura do edifício">
              <p className="section-label">Infraestrutura do Edifício</p>
              <Image.PreviewGroup>
                <Row gutter={[10, 10]}>
                  {BUILDING_PHOTOS.map((photo) => (
                    <Col key={photo.src} xs={12} sm={6}>
                      <div className="photo-cell photo-cell--sm">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          preview={{ mask: photo.label }}
                        />
                      </div>
                      <Text className="photo-caption">{photo.label}</Text>
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </section>

            <Divider />

            {/* LOCALIZAÇÃO */}
            <section className="section" id="localizacao" aria-label="Localização do imóvel">
              <p className="section-label">Localização</p>
              <div className="address-block">
                <div className="address-main-line">
                  <EnvironmentOutlined style={{ color: '#B8935A', fontSize: 16, marginRight: 10 }} aria-hidden="true" />
                  Rua André de Barros, nº 626 – Apto 96
                </div>
                <div className="address-sub-line">Edifício Dolores Duran · 11º andar</div>
                <div className="address-sub-line">Bairro Centro · Curitiba – PR · CEP 80010-080</div>
                <div style={{ marginTop: 14 }}>
                  <Tag color="gold">Centro de Curitiba</Tag>
                </div>
              </div>

              <p className="nearby-heading">
                Próximo ao Shopping Estação — tudo a pé:
              </p>
              <div className="nearby-grid">
                {NEARBY.map((item) => (
                  <span key={item.label} className="nearby-chip">
                    <span aria-hidden="true">{item.icon}</span>{' '}{item.label}
                  </span>
                ))}
              </div>
            </section>

            <Divider />

            {/* PERGUNTAS FREQUENTES */}
            <section className="section" id="faq" aria-label="Perguntas frequentes">
              <p className="section-label">Perguntas Frequentes</p>
              <Collapse
                items={FAQ_ITEMS}
                ghost={false}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                }}
              />
            </section>

            <Divider />

            {/* CTA CONTATO */}
            <section className="cta-block" id="contato" aria-label="Entre em contato">
              <StarFilled style={{ color: '#B8935A', fontSize: 26, display: 'block', marginBottom: 16 }} aria-hidden="true" />
              <h2 className="cta-title">Interessado no Imóvel?</h2>
              <p className="cta-sub">
                Entre em contato para agendar uma visita ou tirar suas dúvidas.<br />
                Documentos necessários: RG, CPF e Comprovante de renda.
              </p>
              <Space size={14} wrap style={{ justifyContent: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<PhoneOutlined />}
                  href="tel:+5541988888888"
                >
                  Ligar Agora
                </Button>
                <Button
                  size="large"
                  icon={<WhatsAppOutlined />}
                  href="https://wa.me/5541988888888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                >
                  WhatsApp
                </Button>
              </Space>
            </section>

          </main>

          {/* ── FOOTER ───────────────────────────── */}
          <footer className="site-footer">
            <Text>© 2025 · Apto 96 · Edifício Dolores Duran · Rua André de Barros, 626 · Centro, Curitiba/PR</Text>
          </footer>

        </div>
      </AntApp>
    </ConfigProvider>
  )
}
