import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

const DATA_DIR   = path.join(__dirname, 'data')
const DATA_FILE  = path.join(DATA_DIR, 'site-data.json')
const PHOTOS_DIR = path.join(__dirname, 'public', 'fotos')

fs.mkdirSync(DATA_DIR,   { recursive: true })
fs.mkdirSync(PHOTOS_DIR, { recursive: true })

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Fotos dinâmicas (uploads) — servidas antes do dist/ para não conflitar
app.use('/fotos', express.static(PHOTOS_DIR))

// Em produção, servir o build do React
app.use(express.static(path.join(__dirname, 'dist')))

// Upload: salva em public/fotos/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PHOTOS_DIR),
  filename:    (_req,  file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase()
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, name)
  },
})
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Apenas imagens são permitidas'))
  },
})

// ── API ───────────────────────────────────────────────────────────

// Retorna os dados salvos (null se ainda não existir)
app.get('/api/data', (_req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')))
    } else {
      res.json(null)
    }
  } catch {
    res.status(500).json({ error: 'Erro ao ler dados' })
  }
})

// Salva todos os dados do site
app.post('/api/data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf-8')
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Erro ao salvar dados' })
  }
})

// Upload de foto → salva em public/fotos/ e retorna o caminho
app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo recebido' })
  res.json({ src: `/fotos/${req.file.filename}` })
})

// Fallback SPA (produção)
app.get('*', (_req, res) => {
  const index = path.join(__dirname, 'dist', 'index.html')
  if (fs.existsSync(index)) {
    res.sendFile(index)
  } else {
    res.status(404).send('Build não encontrado. Execute: npm run build')
  }
})

app.listen(PORT, () => {
  console.log(`✅  Servidor rodando em http://localhost:${PORT}`)
})
