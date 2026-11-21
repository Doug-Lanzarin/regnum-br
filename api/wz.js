// Função serverless da Vercel: lê a página oficial "War Status" do
// Champions of Regnum e devolve fortes, gemas e relíquias em JSON.
// O navegador não consegue ler essa página direto (o site não envia
// cabeçalho CORS), por isso a leitura acontece aqui no servidor.
// A imagem do mapa (gen_map.jpg) é carregada direto do site oficial.

const OFFICIAL_URL = 'https://www.championsofregnum.com/index.php?l=1&sec=3'
const WORLDS = ['ra', 'amun']
const REALMS = ['Alsius', 'Ignis', 'Syrtis']
const GEM_OWNER = { 0: null, 1: 'Ignis', 2: 'Alsius', 3: 'Syrtis' }

const realmName = (lower) => REALMS.find((r) => r.toLowerCase() === String(lower).toLowerCase()) ?? null

function realmBlocks(html) {
  const marker = '<div class="war-status-realm">'
  const starts = []
  for (let i = html.indexOf(marker); i !== -1; i = html.indexOf(marker, i + 1)) starts.push(i)
  return starts.map((start, i) => html.slice(start, starts[i + 1] ?? start + 8000))
}

function parseUpdated(html) {
  const m = html.match(/Latest update:\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s*\(GMT([+-]\d+)\)/)
  if (!m) return null
  const [, date, time, offset] = m
  const sign = offset.startsWith('-') ? '-' : '+'
  const hours = String(Math.abs(Number(offset))).padStart(2, '0')
  const ms = Date.parse(`${date}T${time}${sign}${hours}:00`)
  return Number.isNaN(ms) ? null : ms
}

export function parseWarStatus(html) {
  const realms = []
  for (const block of realmBlocks(html)) {
    const realm = realmName(block.match(/Realm of (\w+)</)?.[1])
    if (!realm) continue

    const gems = [...block.matchAll(/gem_(\d)\.png/g)].slice(0, 6).map((m) => GEM_OWNER[m[1]] ?? null)
    const relics = [...block.matchAll(/title="([^"]+?) relic located at ([^"]+)"/g)].map((m) => ({
      name: m[1],
      location: m[2],
    }))
    const owners = [...block.matchAll(/keep_(\w+)\.gif/g)].map((m) => realmName(m[1]))
    const forts = [...block.matchAll(/war-status-bulding-name">([^<]+)</g)].map((m, i) => {
      const full = m[1].trim()
      const num = Number(full.match(/\((\d+)\)\s*$/)?.[1]) || null
      const name = full.replace(/\s*\(\d+\)\s*$/, '')
      const owner = owners[i] ?? realm
      return {
        number: num,
        name,
        kind: name.includes('Castle') ? 'castle' : name.startsWith('Great Wall') ? 'wall' : 'fort',
        home: realm,
        owner,
        captured: owner !== realm,
      }
    })

    realms.push({ realm, gems, relics, forts })
  }
  return { realms, updated: parseUpdated(html) }
}

export default async function handler(req, res) {
  const send = (status, body, cache) => {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    if (cache) res.setHeader('Cache-Control', cache)
    res.end(JSON.stringify(body))
  }

  if (req.method && req.method !== 'GET') return send(405, { error: 'Método não suportado.' })

  const world = new URL(req.url, 'http://localhost').searchParams.get('world')
  const w = WORLDS.includes(world) ? world : 'ra'

  try {
    const upstream = await fetch(`${OFFICIAL_URL}&world=${w}`, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; RegnumBossTimer/1.0)' },
    })
    if (!upstream.ok) throw new Error(`site oficial respondeu ${upstream.status}`)
    const data = parseWarStatus(await upstream.text())
    if (data.realms.length === 0) throw new Error('nenhum reino encontrado na página')
    send(200, { world: w, ...data }, 'public, max-age=0, s-maxage=60, stale-while-revalidate=120')
  } catch (err) {
    console.error('wz:', err)
    send(502, { error: 'Site oficial indisponível no momento.' }, 'no-store')
  }
}
