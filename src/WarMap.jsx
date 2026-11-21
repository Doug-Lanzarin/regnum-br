import { useCallback, useEffect, useState } from 'react'
import { BOSSES } from './bosses.js'

const REALM_COLOR = Object.fromEntries(BOSSES.map((b) => [b.realm, b.color]))
const REALMS = ['Alsius', 'Ignis', 'Syrtis']
const NEUTRAL = '#5b6577'
const REFRESH_MS = 60_000
const WORLDS = [
  { id: 'ra', label: 'Ra' },
  { id: 'amun', label: 'Amun' },
]
const OFFICIAL_PAGE = 'https://www.championsofregnum.com/index.php?l=1&sec=3'
const mapUrl = (world, version) =>
  `https://www.championsofregnum.com/ranking/data/${world}/gen_map.jpg?v=${version}`

const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

function useWarStatus(world) {
  const [state, setState] = useState({ data: null, error: false, loading: true })

  const load = useCallback(async () => {
    try {
      const res = await fetch(`./api/wz?world=${world}`)
      if (!res.ok) throw new Error(String(res.status))
      const data = await res.json()
      setState({ data, error: false, loading: false })
    } catch {
      setState((s) => ({ ...s, error: true, loading: false }))
    }
  }, [world])

  useEffect(() => {
    setState({ data: null, error: false, loading: true })
    load()
    const id = setInterval(load, REFRESH_MS)
    return () => clearInterval(id)
  }, [load])

  return state
}

function GemDot({ owner }) {
  return (
    <span
      className="wz-gem"
      style={{ '--gem-color': owner ? REALM_COLOR[owner] : NEUTRAL }}
      title={owner ? `Gema com ${owner}` : 'Gema livre'}
    />
  )
}

export default function WarMap() {
  const [world, setWorld] = useState('ra')
  const [tick, setTick] = useState(() => Math.floor(Date.now() / REFRESH_MS))
  const [imgFailed, setImgFailed] = useState(false)
  const { data, error, loading } = useWarStatus(world)

  // Atualiza a imagem do mapa a cada minuto
  useEffect(() => {
    const id = setInterval(() => setTick(Math.floor(Date.now() / REFRESH_MS)), REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => setImgFailed(false), [world])

  const realms = data?.realms ?? []
  const held = Object.fromEntries(
    REALMS.map((r) => [
      r,
      realms.reduce((n, x) => n + x.forts.filter((f) => f.owner === r).length, 0),
    ]),
  )
  const totalForts = realms.reduce((n, x) => n + x.forts.length, 0)

  return (
    <section className="panel wz">
      <div className="wz-head">
        <div>
          <h3 className="wz-title">Mapa de guerra</h3>
          <span className="wz-updated">
            {data?.updated
              ? `Atualizado às ${timeFmt.format(new Date(data.updated))}`
              : loading
                ? 'Carregando…'
                : 'Dados do site oficial'}
          </span>
        </div>
        <div className="wz-worlds" role="group" aria-label="Servidor">
          {WORLDS.map((w) => (
            <button
              key={w.id}
              type="button"
              className={world === w.id ? 'on' : ''}
              aria-pressed={world === w.id}
              onClick={() => setWorld(w.id)}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="wz-map">
        {imgFailed ? (
          <div className="wz-map-fallback">Não foi possível carregar o mapa agora.</div>
        ) : (
          <img
            src={mapUrl(world, data?.updated ?? tick)}
            alt={`Mapa de guerra do servidor ${world === 'ra' ? 'Ra' : 'Amun'}`}
            width="500"
            height="500"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>

      {totalForts > 0 && (
        <div className="wz-score" aria-label="Fortes por reino">
          {REALMS.map((r) => (
            <div key={r} style={{ '--realm-color': REALM_COLOR[r] }}>
              <strong>{held[r]}</strong>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}

      {realms.length > 0 && (
        <div className="wz-realms">
          {realms.map(({ realm, gems, relics, forts }) => (
            <div key={realm} className="wz-realm" style={{ '--realm-color': REALM_COLOR[realm] }}>
              <div className="wz-realm-head">
                <span className="wz-realm-name">{realm}</span>
                <span className="wz-gems" aria-label="Gemas">
                  {gems.map((g, i) => (
                    <GemDot key={i} owner={g} />
                  ))}
                </span>
              </div>
              <ul className="wz-forts">
                {forts.map((f) => (
                  <li key={f.name} className={f.captured ? 'captured' : ''}>
                    <span className="wz-fort-num">{f.number}</span>
                    <span className="wz-fort-name">{f.name}</span>
                    <span className="wz-owner" style={{ '--owner-color': REALM_COLOR[f.owner] }}>
                      {f.owner}
                    </span>
                  </li>
                ))}
              </ul>
              <span className="wz-relics">
                Relíquias no reino: {relics.length ? relics.map((r) => r.name).join(', ') : 'nenhuma'}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && !data && (
        <p className="wz-error">
          Não foi possível ler os dados do site oficial agora. Tentando de novo a cada minuto.
        </p>
      )}

      <a className="wz-source" href={`${OFFICIAL_PAGE}&world=${world}`} target="_blank" rel="noreferrer">
        Fonte: championsofregnum.com ›
      </a>
    </section>
  )
}
