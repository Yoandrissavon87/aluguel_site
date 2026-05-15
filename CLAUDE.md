# CLAUDE.md — Site de Apartamentos para Locação

> Guia completo de desenvolvimento e design para o projeto de vitrine de imóveis para locação.
> Stack: **Refine · React · Ant Design · TypeScript** | Idioma: **Português do Brasil**

---

## 1. Visão Geral do Projeto

Site de **vitrine de apartamentos para locação** com painel administrativo integrado.
O produto possui dois contextos principais:

| Contexto | Público | Objetivo |
|---|---|---|
| **Vitrine pública** | Inquilinos em potencial | Descobrir, filtrar e contatar sobre imóveis |
| **Painel admin** | Corretores / proprietários | Gerenciar imóveis, leads e agendamentos |

---

## 2. Stack Tecnológica

```
Frontend Framework : React 18+ com TypeScript (strict mode)
Meta-framework      : Refine v4+ (data provider, autenticação, roteamento)
UI Library          : Ant Design v5+ (design system principal)
Roteamento          : React Router v6 (via @refinedev/react-router-v6)
Estado global       : Zustand (UI state) + React Query (server state via Refine)
Estilização extra   : Ant Design tokens + CSS Modules (.module.css)
Formulários         : Ant Design Form + Refine useForm
Mapas               : React Leaflet (localização dos imóveis)
Galeria de imagens  : Yet Another React Lightbox
Ícones              : Ant Design Icons + Lucide React
Lint / Format       : ESLint + Prettier + Husky
Testes              : Vitest + React Testing Library
Build               : Vite
```

---

## 3. Estrutura de Pastas

```
src/
├── assets/                   # Imagens, fontes e ícones estáticos
├── components/               # Componentes reutilizáveis
│   ├── common/               # Botões, badges, tags genéricos
│   ├── imovel/               # Card, galeria, mapa, detalhes do imóvel
│   └── layout/               # Header, Footer, Sidebar, PageContainer
├── config/                   # Constantes, variáveis de ambiente, tema AntD
│   └── theme.ts              # Tokens do Ant Design personalizados
├── hooks/                    # Custom hooks (useImoveis, useFavoritos, etc.)
├── interfaces/               # Tipos e interfaces TypeScript
│   └── index.ts
├── pages/
│   ├── public/               # Vitrine pública (sem autenticação)
│   │   ├── Home/
│   │   ├── Listagem/
│   │   ├── Detalhe/
│   │   └── Contato/
│   └── admin/                # Painel administrativo (Refine resources)
│       ├── imoveis/          # list, create, edit, show
│       ├── leads/
│       └── agendamentos/
├── providers/                # Data providers, auth provider Refine
│   ├── dataProvider.ts
│   └── authProvider.ts
├── services/                 # Chamadas de API (Axios/Fetch)
├── store/                    # Zustand stores
├── utils/                    # Formatadores, validadores, helpers
└── App.tsx
```

---

## 4. Convenções de Código

### 4.1 TypeScript

```typescript
// ✅ CORRETO — use interface para contratos de objeto
interface Imovel {
  id: string;
  titulo: string;
  descricao: string;
  valorAluguel: number;          // sempre em centavos (integer)
  areaM2: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  endereco: Endereco;
  fotos: Foto[];
  status: StatusImovel;
  destaque: boolean;
  criadoEm: string;              // ISO 8601
  atualizadoEm: string;
}

type StatusImovel = "disponivel" | "alugado" | "manutencao" | "reservado";

interface Endereco {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;                // sigla: "PR", "SP"…
  cep: string;
  latitude?: number;
  longitude?: number;
}
```

- **Strict mode** habilitado (`"strict": true` no `tsconfig.json`).
- Prefira `interface` para shapes de objetos; `type` para unions e utilitários.
- Nomeie interfaces sem prefixo `I` (ex.: `Imovel`, não `IImovel`).
- Todos os arquivos `.tsx` devem exportar o componente como **default export**.

### 4.2 Nomenclatura

| Artefato | Convenção | Exemplo |
|---|---|---|
| Componente | PascalCase | `CardImovel.tsx` |
| Hook | camelCase com `use` | `useImoveis.ts` |
| Serviço | camelCase + `Service` | `imovelService.ts` |
| Store | camelCase + `Store` | `favoritosStore.ts` |
| Constante | SCREAMING_SNAKE_CASE | `ITEMS_POR_PAGINA` |
| CSS Module | camelCase | `styles.cardWrapper` |

### 4.3 Idioma

- Todo texto visível ao usuário em **Português do Brasil**.
- Nomes de variáveis, funções e arquivos em **inglês** (convenção técnica).
- Comentários de código em **português** para melhor leitura pelo time.
- Mensagens de erro, validação e sucesso em português.

```tsx
// ✅ mensagens em português
message.success("Imóvel salvo com sucesso!");
message.error("Erro ao carregar os imóveis. Tente novamente.");

// ✅ labels dos formulários em português
<Form.Item label="Valor do Aluguel" name="valorAluguel" rules={[{ required: true, message: "Informe o valor do aluguel" }]}>
```

---

## 5. Design System & Tema

### 5.1 Tokens do Ant Design (`src/config/theme.ts`)

```typescript
import type { ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  token: {
    // Paleta principal — tom sofisticado de imobiliária premium
    colorPrimary: "#1C3F6E",          // azul marinho profundo
    colorSuccess: "#2E7D32",
    colorWarning: "#F57C00",
    colorError: "#C62828",
    colorInfo: "#0277BD",

    // Tipografia
    fontFamily: "'Sora', 'Segoe UI', sans-serif",
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeHeading1: 36,
    fontSizeHeading2: 28,
    fontSizeHeading3: 22,

    // Espaçamento e bordas
    borderRadius: 8,
    borderRadiusLG: 12,
    controlHeight: 40,
    padding: 16,
    paddingLG: 24,

    // Sombras
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    boxShadowSecondary: "0 4px 24px rgba(0,0,0,0.12)",
  },
  components: {
    Card: { borderRadius: 12 },
    Button: { borderRadius: 8, fontWeight: 600 },
    Input: { borderRadius: 8 },
    Select: { borderRadius: 8 },
    Tag: { borderRadius: 6 },
  },
};
```

### 5.2 Paleta de Cores Semânticas

```
Primária     #1C3F6E   → CTA, links, ações principais
Secundária   #E8F0FB   → fundos de seção, hover suave
Destaque     #F4A623   → badge "Destaque", preço em evidência
Neutro 1     #FFFFFF   → fundo de cards
Neutro 2     #F5F7FA   → fundo de página
Neutro 3     #E0E4EB   → bordas, divisores
Texto escuro #1A1F2C   → títulos
Texto médio  #4A5568   → descrições
Texto suave  #8A94A6   → placeholders, metadados
```

### 5.3 Tipografia

```css
/* Fonte de display para títulos de destaque */
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@400;500&display=swap');

h1, h2, h3 { font-family: 'Sora', sans-serif; }
body, p, label { font-family: 'Inter', sans-serif; }
```

---

## 6. Componentes Principais

### 6.1 `CardImovel`

```tsx
// src/components/imovel/CardImovel.tsx
interface CardImovelProps {
  imovel: Imovel;
  onFavoritar?: (id: string) => void;
  favorito?: boolean;
}

// Layout do card:
// ┌──────────────────────────────┐
// │  [foto principal]            │
// │  [badge status] [badge dest] │
// ├──────────────────────────────┤
// │  Título do Imóvel            │
// │  📍 Bairro, Cidade           │
// ├──────────────────────────────┤
// │  🛏 2  🚿 1  🚗 1  📐 65m²  │
// ├──────────────────────────────┤
// │  R$ 1.800/mês    [Ver mais]  │
// └──────────────────────────────┘
```

### 6.2 `FiltroImoveis`

Campos obrigatórios no filtro lateral/topo:
- Tipo (Apartamento, Studio, Cobertura, Kitnet)
- Faixa de valor (Slider do AntD)
- Número mínimo de quartos
- Bairro / Cidade
- Vagas de garagem
- Aceita pets (Switch)
- Mobiliado (Switch)

### 6.3 `GaleriaFotos`

- Thumbnail strip horizontal (máx. 5 visíveis + contador)
- Lightbox fullscreen com navegação por teclado
- Lazy loading em todas as imagens
- Fallback com ícone de imóvel quando sem foto

### 6.4 `MapaImovel`

- React Leaflet com marcador personalizado (ícone da cor primária)
- Popup com nome e valor do imóvel
- Zoom controls em português
- Polígono opcional para destacar o bairro

---

## 7. Páginas Públicas

### 7.1 Home (`/`)

**Seções:**
1. **Hero** — Buscador rápido centralizado com campo de cidade/bairro + botão "Buscar"
2. **Destaques** — Carrossel horizontal com `CardImovel` dos imóveis marcados como destaque
3. **Por que alugar conosco** — 3 cards de diferenciais (ícone + título + texto)
4. **Categorias** — Grid de tipos de imóvel com foto de fundo e quantidade disponível
5. **Últimos adicionados** — Grid de 6 cards
6. **CTA de contato** — Faixa com botão "Fale com um corretor"

### 7.2 Listagem (`/imoveis`)

- **Layout:** filtro lateral fixo (desktop) / drawer (mobile) + grid de cards 3 colunas
- **Ordenação:** Menor preço, Maior preço, Mais recente, Destaque
- **Paginação:** Ant Design `Pagination` com `pageSize` 12
- **Estado vazio:** ilustração + texto "Nenhum imóvel encontrado para os filtros selecionados"
- **Loading:** `Skeleton` do Ant Design

### 7.3 Detalhe do Imóvel (`/imoveis/:id`)

**Layout em duas colunas (desktop):**

Coluna esquerda (60%):
- Galeria de fotos
- Título + endereço
- Badges (status, destaque, mobiliado, pets)
- Descrição completa
- Lista de características (quartos, banheiros, área, vagas, andar, condomínio)
- Mapa de localização

Coluna direita (40%) — sticky:
- Valor do aluguel em destaque
- Valor do condomínio (se houver)
- Botão primário "Agendar Visita"
- Botão secundário "Entrar em Contato"
- Card do corretor responsável

### 7.4 Contato (`/contato`)

- Formulário: Nome, E-mail, Telefone (com máscara), Mensagem, Interesse (select)
- Mapa com endereço do escritório
- Horário de atendimento
- Links de redes sociais

---

## 8. Painel Administrativo (Refine)

### 8.1 Resources Refine

```typescript
// src/App.tsx
const resources = [
  {
    name: "imoveis",
    list: "/admin/imoveis",
    create: "/admin/imoveis/criar",
    edit: "/admin/imoveis/:id/editar",
    show: "/admin/imoveis/:id",
    meta: {
      label: "Imóveis",
      icon: <HomeOutlined />,
    },
  },
  {
    name: "leads",
    list: "/admin/leads",
    show: "/admin/leads/:id",
    meta: {
      label: "Leads",
      icon: <UserOutlined />,
    },
  },
  {
    name: "agendamentos",
    list: "/admin/agendamentos",
    edit: "/admin/agendamentos/:id",
    meta: {
      label: "Agendamentos",
      icon: <CalendarOutlined />,
    },
  },
];
```

### 8.2 Formulário de Imóvel (Create/Edit)

Organizado em `Tabs` do Ant Design:

| Aba | Campos |
|---|---|
| **Informações Gerais** | Título, Tipo, Status, Destaque, Descrição |
| **Localização** | CEP (com auto-fill), Logradouro, Número, Complemento, Bairro, Cidade, Estado |
| **Características** | Quartos, Banheiros, Suítes, Vagas, Área total, Área útil, Andar, Mobiliado, Aceita pets |
| **Valores** | Aluguel, Condomínio, IPTU, Depósito |
| **Fotos** | Upload múltiplo (Dragger), reordenação drag-and-drop, foto principal |

### 8.3 Dashboard Admin

Cards de métricas no topo:
- Total de imóveis ativos
- Visitas agendadas (mês)
- Leads recebidos (mês)
- Taxa de ocupação (%)

Gráficos:
- Linha: visitas ao site por dia (últimos 30 dias)
- Barra: imóveis por tipo
- Lista: últimos 5 leads recebidos

---

## 9. Formatação e Utilitários

```typescript
// src/utils/formatadores.ts

/** Formata valor em centavos para R$ 1.800,00 */
export const formatarMoeda = (centavos: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(centavos / 100);

/** Formata área: 6500 → "65 m²" */
export const formatarArea = (m2: number): string =>
  `${m2.toLocaleString("pt-BR")} m²`;

/** Formata CEP: "80000000" → "80000-000" */
export const formatarCep = (cep: string): string =>
  cep.replace(/(\d{5})(\d{3})/, "$1-$2");

/** Formata telefone: "41999990000" → "(41) 99999-0000" */
export const formatarTelefone = (tel: string): string =>
  tel.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");

/** Status legível em português */
export const labelStatus: Record<StatusImovel, string> = {
  disponivel: "Disponível",
  alugado: "Alugado",
  manutencao: "Em Manutenção",
  reservado: "Reservado",
};

/** Cor do badge por status */
export const corStatus: Record<StatusImovel, string> = {
  disponivel: "success",
  alugado: "error",
  manutencao: "warning",
  reservado: "processing",
};
```

---

## 10. Acessibilidade (a11y)

- Todas as imagens devem ter `alt` descritivo em português.
- Usar `aria-label` em ícones sem texto visível.
- Contraste de cores mínimo WCAG AA (4.5:1 para texto normal).
- Navegação completa por teclado (foco visível em todos os elementos interativos).
- `<html lang="pt-BR">` no `index.html`.
- Botões de ação têm texto descritivo (não apenas ícone).
- Formulários com `label` associado ao campo (`htmlFor` / `id`).

---

## 11. Responsividade

Breakpoints do Ant Design utilizados:

| Breakpoint | Largura | Layout |
|---|---|---|
| `xs` | < 576px | 1 coluna, menu hamburguer, filtros em drawer |
| `sm` | ≥ 576px | 1 coluna |
| `md` | ≥ 768px | 2 colunas |
| `lg` | ≥ 992px | 3 colunas, filtro lateral |
| `xl` | ≥ 1200px | 3 colunas, sidebar expandida |

```tsx
// Exemplo de grid responsivo com Ant Design
<Row gutter={[16, 16]}>
  {imoveis.map((imovel) => (
    <Col key={imovel.id} xs={24} sm={12} lg={8} xl={8}>
      <CardImovel imovel={imovel} />
    </Col>
  ))}
</Row>
```

---

## 12. SEO e Meta Tags

Cada página pública deve definir:

```tsx
// Usar react-helmet-async
<Helmet>
  <title>{imovel.titulo} — {imovel.endereco.bairro} | SeuSite Imóveis</title>
  <meta name="description" content={`${imovel.quartos} quartos, ${imovel.areaM2}m² em ${imovel.endereco.bairro}. Aluguel R$${formatarMoeda(imovel.valorAluguel)}/mês.`} />
  <meta property="og:image" content={imovel.fotos[0]?.url} />
</Helmet>
```

---

## 13. Mensagens e Notificações

Sempre usar o sistema de notificações do Refine via `useNotification` ou diretamente `App.useApp()` do Ant Design:

```typescript
// ✅ padrão de mensagens
const { message } = App.useApp();

// Sucesso
message.success("Imóvel cadastrado com sucesso!");
// Erro
message.error("Não foi possível salvar. Verifique os campos e tente novamente.");
// Aviso
message.warning("Preencha todos os campos obrigatórios antes de continuar.");
// Info
message.info("Suas alterações foram salvas automaticamente.");
```

---

## 14. Variáveis de Ambiente

```bash
# .env.example
VITE_API_URL=https://api.seusite.com.br/v1
VITE_MAPS_API_KEY=sua_chave_google_maps
VITE_STORAGE_URL=https://storage.seusite.com.br
VITE_SITE_NAME=SeuSite Imóveis
VITE_WHATSAPP_NUMBER=5541999990000
```

---

## 15. Checklist de Qualidade

Antes de cada PR/deploy, verificar:

- [ ] Todos os textos visíveis em Português do Brasil
- [ ] Sem `console.log` no código de produção
- [ ] Imagens com `alt` descritivo
- [ ] Formulários com validação em português
- [ ] Componentes novos com tipos TypeScript completos
- [ ] Responsividade testada em 375px, 768px e 1280px
- [ ] Loading states implementados (Skeleton / Spin)
- [ ] Estado vazio implementado (Empty do Ant Design)
- [ ] Tratamento de erro na chamada de API
- [ ] Tema aplicado via tokens (sem cores hardcoded)

---

*Gerado para o projeto de vitrine de apartamentos para locação.*
*Stack: Refine · React · Ant Design · TypeScript | PT-BR*