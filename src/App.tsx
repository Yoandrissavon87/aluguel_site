import {
  ConfigProvider,
  App as AntApp,
  Image,
  Button,
  Collapse,
  theme as antdUtils,
} from 'antd'
import {
  PhoneOutlined,
  WhatsAppOutlined,
  CheckOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { BedDouble, Car, Ruler, Building2, Home, Lock } from 'lucide-react'
import type { ThemeConfig } from 'antd'
import './index.css'

const themeConfig: ThemeConfig = {
  algorithm: antdUtils.darkAlgorithm,
  token: {
    colorPrimary:  '#00DDB8',
    colorBgBase:   '#0B0B0E',
    fontFamily:    "'Inter', system-ui, sans-serif",
    borderRadius:  10,
    controlHeight: 46,
  },
  components: {
    Button: { borderRadius: 8, fontWeight: 600 },
  },
}

const APARTMENT_PHOTOS = [
  { src: '/fotos/sala-vista-1.jpg',      alt: 'Sala de estar – vista 1',              label: 'Sala de Estar'    },
  { src: '/fotos/sala-vista-2.jpg',      alt: 'Sala de estar – vista 2',              label: 'Sala de Estar'    },
  { src: '/fotos/vista-janela-sala.jpg', alt: 'Vista panorâmica da janela',            label: 'Vista da Janela'  },
  { src: '/fotos/quarto-vista-1.jpg',    alt: 'Quarto principal',                      label: 'Quarto Principal' },
  { src: '/fotos/quarto-solteiro-1.jpg', alt: 'Segundo quarto – vista 1',             label: 'Segundo Quarto'   },
  { src: '/fotos/quarto-solteiro-2.jpg', alt: 'Segundo quarto – vista 2',             label: 'Segundo Quarto'   },
  { src: '/fotos/cozinha.jpg',           alt: 'Cozinha integrada com área de serviço', label: 'Cozinha'          },
  { src: '/fotos/banheiro.jpg',          alt: 'Banheiro',                               label: 'Banheiro'         },
]

const BUILDING_AMENITIES = [
  { src: '/fotos/recepcao.jpg',                 alt: 'Recepção',           label: 'Recepção'          },
  { src: '/fotos/dois-elevadores.jpg',          alt: 'Dois elevadores',    label: '2 Elevadores'      },
  { src: '/fotos/quintadinha.jpg',              alt: 'Segurança 24h',      label: 'Segurança 24h'     },
  { src: '/fotos/armario-correspondencias.jpg', alt: 'Armário inteligente',label: 'Armário Inteligente' },
]

const FEATURES = [
  '2 quartos',
  '1 vaga de garagem',
  'Totalmente mobiliado',
  'Sala de TV + jantar integradas',
  'Cozinha integrada c/ área de serviço',
  'Portaria remota',
  'Ótima iluminação natural',
  '11º andar com boa vista',
  'Aceita pets de pequeno porte',
]

const NEARBY = [
  { icon: '🏬', label: 'Shopping Estação'    },
  { icon: '🛒', label: 'Mercados'            },
  { icon: '💊', label: 'Farmácias'           },
  { icon: '🍽', label: 'Restaurantes'        },
  { icon: '🏋', label: 'Academias'           },
  { icon: '🌳', label: 'Praças'              },
  { icon: '🚌', label: 'Transporte Público'  },
  { icon: '🛍', label: 'Lojas'               },
  { icon: '🍎', label: 'Frutarias'           },
]

const FAQ_ITEMS = [
  { key: '1', label: '01 · Qual o valor do aluguel e o que está incluso?',
    children: 'R$ 2.800,00/mês, já inclusa a taxa de condomínio. O IPTU do ano vigente está quitado.' },
  { key: '2', label: '02 · Qual o prazo mínimo do contrato?',
    children: '12 (doze) meses.' },
  { key: '3', label: '03 · Que garantia é exigida?',
    children: 'Caução equivalente a 1 mês e meio de aluguel (R$ 4.200,00).' },
  { key: '4', label: '04 · O apartamento aceita animais domésticos?',
    children: 'Sim. Aceita pets de pequeno porte, desde que respeitem as normas do condomínio.' },
  { key: '5', label: '05 · Como funciona o reajuste?',
    children: 'Reajuste anual pelo IPCA, conforme previsto em contrato.' },
  { key: '6', label: '06 · Quem paga o IPTU?',
    children: 'O inquilino. O IPTU do ano corrente já está quitado pelo proprietário.' },
  { key: '7', label: '07 · Há multa por saída antes do prazo?',
    children: 'Sim. Multa proporcional ao período restante do contrato.' },
  { key: '8', label: '08 · Posso fazer reformas no apartamento?',
    children: 'Somente com autorização prévia e por escrito do proprietário.' },
  { key: '9', label: '09 · Quais documentos são necessários para alugar?',
    children: 'RG, CPF e comprovante de renda.' },
]

const STATS = [
  { icon: <BedDouble  size={22} />, value: '02',        label: 'Quartos'  },
  { icon: <Car        size={22} />, value: '01',        label: 'Garagem'  },
  { icon: <Ruler      size={22} />, value: '35 m²',     label: 'Área'     },
  { icon: <Building2  size={22} />, value: '11º',       label: 'Andar'    },
  { icon: <Home       size={22} />, value: 'Mobiliado', label: 'Imóvel'   },
  { icon: <Lock       size={22} />, value: 'Remota',    label: 'Portaria' },
]

const CONTRACT_ROWS: [string, string][] = [
  ['Aluguel',         'R$ 2.800/mês'],
  ['Condomínio',      'Incluso'],
  ['Contrato mínimo', '12 meses'],
  ['Caução',          '1,5 mês'],
  ['Reajuste',        'IPCA anual'],
  ['IPTU',            'Por conta do inquilino'],
]

export default function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <AntApp>

        {/* ── HEADER ──────────────────────────────── */}
        <header className="hdr">
          <div className="hdr-inner">
            <div className="hdr-brand">
              <span className="brand-dot" aria-hidden="true" />
              <span className="brand-name">APTO 96</span>
              <span className="brand-sep" aria-hidden="true">·</span>
              <span className="brand-sub">Dolores Duran</span>
            </div>
            <nav className="hdr-nav" aria-label="Navegação principal">
              <a className="nav-lnk" href="#galeria">Galeria</a>
              <a className="nav-lnk" href="#caracteristicas">Características</a>
              <a className="nav-lnk" href="#localizacao">Localização</a>
              <a className="nav-lnk" href="#faq">FAQ</a>
            </nav>
            <Button type="primary" href="#contato">
              Agendar Visita →
            </Button>
          </div>
        </header>

        {/* ── HERO ────────────────────────────────── */}
        <section className="hero" aria-label="Apartamento disponível para locação">
          {/* Left: photo */}
          <div className="hero-photo">
            <img src="/fotos/sala-vista-1.jpg" alt="Sala de estar – Edifício Dolores Duran" />
            <div className="hero-photo-tint" aria-hidden="true" />
          </div>

          {/* Right: info panel */}
          <div className="hero-panel">
            <div className="hero-glow" aria-hidden="true" />
            <div className="hero-content">
              <span className="badge-disponivel" role="status">
                <span className="badge-pulse" aria-hidden="true" />
                Disponível para locação
              </span>

              <h1 className="hero-h1">
                Apartamento<br />Mobiliado<br />no Centro<br />de Curitiba
              </h1>

              <address className="hero-addr">
                <EnvironmentOutlined aria-hidden="true" />
                <span>Rua André de Barros, 626 · 11º andar · Centro</span>
              </address>

              <div className="hero-price">
                <span className="hp-eyebrow">Aluguel mensal</span>
                <div className="hp-value-row">
                  <span className="hp-amount">R$ 2.800</span>
                  <span className="hp-period">/mês</span>
                </div>
                <span className="hp-note">condomínio incluso · 1 vaga de garagem</span>
              </div>

              <div className="hero-btns">
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<PhoneOutlined />}
                  href="tel:+5541988888888"
                >
                  Agendar Visita
                </Button>
                <Button
                  size="large"
                  block
                  icon={<WhatsAppOutlined />}
                  href="https://wa.me/5541988888888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa"
                >
                  WhatsApp
                </Button>
              </div>
              <p className="hero-docs">Docs exigidos: RG · CPF · Comprovante de renda</p>
            </div>
          </div>
        </section>

        {/* ── KEY SPECS ───────────────────────────── */}
        <div className="keyspecs" role="list" aria-label="Resumo das características">
          {STATS.map((s) => (
            <div key={s.label} className="ks-item" role="listitem">
              <span className="ks-icon" aria-hidden="true">{s.icon}</span>
              <span className="ks-val">{s.value}</span>
              <span className="ks-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── GALLERY ─────────────────────────────── */}
        <section className="sect" id="galeria" aria-label="Galeria de fotos">
          <div className="container">
            <span className="eyebrow">Galeria</span>
            <h2 className="sect-h2">Conheça o Apartamento</h2>
          </div>
          <Image.PreviewGroup>
            <div className="gallery">
              {APARTMENT_PHOTOS.map((p) => (
                <div key={p.src} className="g-item">
                  <Image
                    src={p.src}
                    alt={p.alt}
                    preview={{ mask: p.label }}
                    wrapperStyle={{ width: '100%', height: '100%', display: 'block' }}
                  />
                  <span className="g-lbl" aria-hidden="true">{p.label}</span>
                </div>
              ))}
            </div>
          </Image.PreviewGroup>
        </section>

        {/* ── ABOUT ───────────────────────────────── */}
        <section className="sect sect--alt" id="sobre" aria-label="Sobre o imóvel">
          <div className="container about-grid">
            <div className="about-left">
              <span className="eyebrow">Sobre</span>
              <h2 className="about-h2">
                35 m² bem<br />distribuídos no<br />coração da cidade.
              </h2>
            </div>
            <div className="about-right">
              <p className="body-text">
                Apartamento <strong>totalmente mobiliado</strong> no 11º andar do Edifício
                Dolores Duran, Centro de Curitiba. O imóvel oferece 2 quartos, sala de TV
                integrada com sala de jantar, cozinha integrada à área de serviço, portaria
                remota e <strong>1 vaga de garagem</strong> — tudo com excelente iluminação
                natural.
              </p>
              <p className="body-text">
                Próximo ao Shopping Estação, com acesso imediato a transporte público,
                restaurantes, academias e toda a infraestrutura do centro. Aceita pets de
                pequeno porte.
              </p>
              <div className="contract-table">
                {CONTRACT_ROWS.map(([label, value]) => (
                  <div key={label} className="ct-row">
                    <span className="ct-label">{label}</span>
                    <span className="ct-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────── */}
        <section className="sect" id="caracteristicas" aria-label="Características do imóvel">
          <div className="container">
            <span className="eyebrow">Características</span>
            <h2 className="sect-h2">O que está incluído</h2>
            <div className="feat-grid">
              {FEATURES.map((f) => (
                <div key={f} className="feat-item">
                  <CheckOutlined className="feat-check" aria-hidden="true" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BUILDING ────────────────────────────── */}
        <section className="sect sect--alt" id="edificio" aria-label="Infraestrutura do edifício">
          <div className="container">
            <span className="eyebrow">Edifício</span>
            <h2 className="sect-h2">Infraestrutura Dolores Duran</h2>
            <Image.PreviewGroup>
              <div className="bld-grid">
                {BUILDING_AMENITIES.map((a) => (
                  <div key={a.src} className="bld-item">
                    <div className="bld-photo">
                      <Image
                        src={a.src}
                        alt={a.alt}
                        preview={{ mask: 'Ver foto' }}
                        wrapperStyle={{ width: '100%', height: '100%', display: 'block' }}
                      />
                      <div className="bld-overlay" aria-hidden="true">
                        <span className="bld-lbl">{a.label}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        </section>

        {/* ── LOCATION ────────────────────────────── */}
        <section className="sect" id="localizacao" aria-label="Localização">
          <div className="container">
            <span className="eyebrow">Localização</span>
            <h2 className="sect-h2">Centro de Curitiba</h2>
            <div className="loc-card">
              <div className="loc-addr">
                <EnvironmentOutlined className="loc-ico" aria-hidden="true" />
                <div>
                  <p className="loc-street">Rua André de Barros, nº 626 — Apto 96</p>
                  <p className="loc-detail">Edifício Dolores Duran · 11º andar</p>
                  <p className="loc-detail">Centro · Curitiba – PR · CEP 80010-080</p>
                </div>
              </div>
              <div className="loc-divider" aria-hidden="true" />
              <div className="loc-nearby">
                <p className="loc-nearby-ttl">A poucos passos:</p>
                <div className="nearby-wrap">
                  {NEARBY.map((n) => (
                    <span key={n.label} className="nearby-tag">
                      <span aria-hidden="true">{n.icon}</span> {n.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────── */}
        <section className="sect sect--alt" id="faq" aria-label="Perguntas frequentes">
          <div className="container">
            <span className="eyebrow">FAQ</span>
            <h2 className="sect-h2">Perguntas Frequentes</h2>
            <Collapse
              items={FAQ_ITEMS}
              bordered={false}
              className="faq-collapse"
            />
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────── */}
        <section className="cta-sect" id="contato" aria-label="Entre em contato">
          <div className="container cta-inner">
            <div className="cta-text">
              <h2 className="cta-h2">Pronto para conhecer?</h2>
              <p className="cta-sub">Agende uma visita ou fale com a gente agora.</p>
            </div>
            <div className="cta-btns">
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
                className="btn-wa"
              >
                WhatsApp
              </Button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────── */}
        <footer className="ftr">
          <p>© 2025 · Apto 96 · Edifício Dolores Duran · Rua André de Barros, 626 · Centro, Curitiba/PR</p>
        </footer>

        {/* ── FAB WHATSAPP ─────────────────────────── */}
        <a
          className="fab-wa"
          href="https://wa.me/5541988888888"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fale pelo WhatsApp"
        >
          <WhatsAppOutlined aria-hidden="true" />
        </a>

      </AntApp>
    </ConfigProvider>
  )
}
