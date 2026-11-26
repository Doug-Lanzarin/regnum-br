// Função serverless da Vercel: guarda UMA marcação no mapa do Audr, compartilhada por todos.
// Só aceita marcações de sexta 12:00 até domingo 16:00 (horário de Brasília);
// a marcação expira sozinha no domingo às 16:00.
// Banco: Upstash Redis (instalado pela Vercel em Storage → Marketplace).
// Sem as variáveis do Upstash (ex.: rodando local), usa memória só para teste.

import { audrWindow } from '../src/audrWindow.js'

const KEY = 'audr:mark'
// A integração da Vercel cria as variáveis com o prefixo escolhido (KV_, STORAGE_, ...):
// procura qualquer par *_REST_API_URL / *_REST_API_TOKEN, além dos nomes padrão do Upstash.
function findEnv(suffix, fallback) {
  if (process.env[fallback]) return process.env[fallback]
  const key = Object.keys(process.env).find((k) => k.endsWith(suffix) && !k.includes('READ_ONLY'))
  return key ? process.env[key] : undefined
}
const REDIS_URL = findEnv('_REST_API_URL', 'UPSTASH_REDIS_REST_URL')
const REDIS_TOKEN = findEnv('_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN')

let memory = null // { value, expiresAt }
const memLimits = new Map()

async function redis(command) {
  const res = await fetch(REDIS_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`Upstash respondeu ${res.status}`)
  return (await res.json()).result
}

const store = {
  persistent: Boolean(REDIS_URL && REDIS_TOKEN),
  async get() {
    if (this.persistent) return redis(['GET', KEY])
    return memory && memory.expiresAt > Date.now() ? memory.value : null
  },
  async set(value, expiresAt) {
    if (this.persistent) return redis(['SET', KEY, value, 'PXAT', String(expiresAt)])
    memory = { value, expiresAt }
  },
  /** true se este IP pode marcar agora (1 marcação a cada 5 s) */
  async allow(ip) {
    if (this.persistent) return (await redis(['SET', `audr:rl:${ip}`, '1', 'NX', 'EX', '5'])) === 'OK'
    const last = memLimits.get(ip) ?? 0
    if (Date.now() - last < 5000) return false
    memLimits.set(ip, Date.now())
    return true
  },
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}')
  let raw = ''
  for await (const chunk of req) raw += chunk
  return JSON.parse(raw || '{}')
}

export default async function handler(req, res) {
  const send = (status, body) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.end(JSON.stringify(body))
  }

  // AUDR_FAKE_NOW: só para testes locais (simula um horário dentro da janela)
  const now = process.env.AUDR_FAKE_NOW ? Date.parse(process.env.AUDR_FAKE_NOW) : Date.now()
  const win = audrWindow(now)
  const base = { open: win.open, end: win.end, nextStart: win.nextStart, persistent: store.persistent }

  try {
    if (req.method === 'GET' || !req.method) {
      let mark = null
      if (win.open) {
        const raw = await store.get()
        mark = raw ? JSON.parse(raw) : null
        if (mark && mark.at < win.start) mark = null // sobra de outra semana
      }
      return send(200, { ...base, mark })
    }

    if (req.method === 'POST') {
      if (!win.open) return send(403, { ...base, error: 'O mapa do Audr só abre de sexta 12:00 até domingo 16:00.' })
      const body = await readBody(req)
      const x = Number(body.x)
      const y = Number(body.y)
      if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 1 || y < 0 || y > 1) {
        return send(400, { ...base, error: 'Posição inválida.' })
      }
      const ip = String(req.headers?.['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'anon').split(',')[0].trim()
      if (!(await store.allow(ip))) return send(429, { ...base, error: 'Aguarde alguns segundos para marcar de novo.' })
      const mark = { x: Math.round(x * 10000) / 10000, y: Math.round(y * 10000) / 10000, at: now }
      await store.set(JSON.stringify(mark), win.end)
      return send(200, { ...base, mark })
    }

    res.setHeader('Allow', 'GET, POST')
    return send(405, { error: 'Método não suportado.' })
  } catch (err) {
    console.error('audr:', err)
    return send(502, { ...base, error: 'Não foi possível acessar o banco agora.' })
  }
}
