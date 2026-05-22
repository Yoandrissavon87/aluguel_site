import { createContext, useContext, useState, type ReactNode } from 'react'

export interface Photo {
  src: string
  alt: string
  label: string
}

export interface NearbyItem {
  icon: string
  label: string
}

export interface FaqItem {
  key: string
  label: string
  answer: string
}

export interface SiteData {
  features: string[]
  apartmentPhotos: Photo[]
  buildingPhotos: Photo[]
  nearbyItems: NearbyItem[]
  faqItems: FaqItem[]
  contactPhone: string
  contactWhatsApp: string
}

interface SiteContextValue {
  data: SiteData
  updateFeatures: (features: string[]) => void
  updateApartmentPhotos: (photos: Photo[]) => void
  updateBuildingPhotos: (photos: Photo[]) => void
  updateNearbyItems: (items: NearbyItem[]) => void
  updateFaqItems: (items: FaqItem[]) => void
  updateContact: (phone: string, whatsapp: string) => void
}

const DEFAULT_DATA: SiteData = {
  features: [
    '2 quartos',
    '1 vaga de garagem',
    'Totalmente mobiliado',
    'Sala de TV + jantar integradas',
    'Cozinha integrada c/ área de serviço',
    'Portaria remota',
    'Ótima iluminação natural',
    '11º andar com boa vista',
    'Aceita pets de pequeno porte',
  ],
  apartmentPhotos: [
    { src: '/fotos/sala-vista-1.jpg',      alt: 'Sala de estar – vista 1',               label: 'Sala de Estar'    },
    { src: '/fotos/sala-vista-2.jpg',      alt: 'Sala de estar – vista 2',               label: 'Sala de Estar'    },
    { src: '/fotos/vista-janela-sala.jpg', alt: 'Vista panorâmica da janela',             label: 'Vista da Janela'  },
    { src: '/fotos/quarto-vista-1.jpg',    alt: 'Quarto principal',                       label: 'Quarto Principal' },
    { src: '/fotos/quarto-solteiro-1.jpg', alt: 'Segundo quarto – vista 1',              label: 'Segundo Quarto'   },
    { src: '/fotos/quarto-solteiro-2.jpg', alt: 'Segundo quarto – vista 2',              label: 'Segundo Quarto'   },
    { src: '/fotos/cozinha.jpg',           alt: 'Cozinha integrada com área de serviço',  label: 'Cozinha'          },
    { src: '/fotos/banheiro.jpg',          alt: 'Banheiro',                                label: 'Banheiro'         },
  ],
  buildingPhotos: [
    { src: '/fotos/recepcao.jpg',                 alt: 'Recepção',            label: 'Recepção'           },
    { src: '/fotos/dois-elevadores.jpg',          alt: 'Dois elevadores',     label: '2 Elevadores'       },
    { src: '/fotos/quintadinha.jpg',              alt: 'Segurança 24h',       label: 'Segurança 24h'      },
    { src: '/fotos/armario-correspondencias.jpg', alt: 'Armário inteligente', label: 'Armário Inteligente'},
  ],
  nearbyItems: [
    { icon: '🏬', label: 'Shopping Estação'   },
    { icon: '🛒', label: 'Mercados'           },
    { icon: '💊', label: 'Farmácias'          },
    { icon: '🍽', label: 'Restaurantes'       },
    { icon: '🏋', label: 'Academias'          },
    { icon: '🌳', label: 'Praças'             },
    { icon: '🚌', label: 'Transporte Público' },
    { icon: '🛍', label: 'Lojas'              },
    { icon: '🍎', label: 'Frutarias'          },
  ],
  faqItems: [
    { key: '1', label: '01 · Qual o valor do aluguel e o que está incluso?',
      answer: 'R$ 2.800,00/mês, já inclusa a taxa de condomínio. O IPTU do ano vigente está quitado.' },
    { key: '2', label: '02 · Qual o prazo mínimo do contrato?',
      answer: '12 (doze) meses.' },
    { key: '3', label: '03 · Que garantia é exigida?',
      answer: 'Caução equivalente a 1 mês e meio de aluguel (R$ 4.200,00).' },
    { key: '4', label: '04 · O apartamento aceita animais domésticos?',
      answer: 'Sim. Aceita pets de pequeno porte, desde que respeitem as normas do condomínio.' },
    { key: '5', label: '05 · Como funciona o reajuste?',
      answer: 'Reajuste anual pelo IPCA, conforme previsto em contrato.' },
    { key: '6', label: '06 · Quem paga o IPTU?',
      answer: 'O inquilino. O IPTU do ano corrente já está quitado pelo proprietário.' },
    { key: '7', label: '07 · Há multa por saída antes do prazo?',
      answer: 'Sim. Multa proporcional ao período restante do contrato.' },
    { key: '8', label: '08 · Posso fazer reformas no apartamento?',
      answer: 'Somente com autorização prévia e por escrito do proprietário.' },
    { key: '9', label: '09 · Quais documentos são necessários para alugar?',
      answer: 'RG, CPF e comprovante de renda.' },
  ],
  contactPhone: '5541988888888',
  contactWhatsApp: '5541988888888',
}

const STORAGE_KEY = 'aluguel_site_data'

function loadData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...DEFAULT_DATA, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return DEFAULT_DATA
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadData)

  function save(next: SiteData) {
    setData(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  return (
    <SiteContext.Provider value={{
      data,
      updateFeatures:        (features)        => save({ ...data, features }),
      updateApartmentPhotos: (apartmentPhotos) => save({ ...data, apartmentPhotos }),
      updateBuildingPhotos:  (buildingPhotos)  => save({ ...data, buildingPhotos }),
      updateNearbyItems:     (nearbyItems)     => save({ ...data, nearbyItems }),
      updateFaqItems:        (faqItems)        => save({ ...data, faqItems }),
      updateContact:         (phone, whatsapp) => save({ ...data, contactPhone: phone, contactWhatsApp: whatsapp }),
    }}>
      {children}
    </SiteContext.Provider>
  )
}

export function useSiteData() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSiteData must be used within SiteProvider')
  return ctx
}
