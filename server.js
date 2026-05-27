import express from 'express'
import multer from 'multer'
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

// Nginx serve os arquivos estáticos; Express só precisa do JSON
app.use(express.json({ limit: '10mb' }))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PHOTOS_DIR),
  filename:    (_req,  file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase()
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
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

app.post('/api/data', (req, res) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf-8')
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Erro ao salvar dados' })
  }
})

app.post('/api/upload', upload.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo recebido' })
  res.json({ src: `/fotos/${req.file.filename}` })
})

// Escuta apenas em loopback — Nginx é o único que acessa
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅  API rodando em http://127.0.0.1:${PORT}`)
})
