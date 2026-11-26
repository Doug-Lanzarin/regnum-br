import { useEffect, useRef, useState } from 'react'
import { BOSSES } from './bosses.js'

const REALM_COLOR = Object.fromEntries(BOSSES.map((b) => [b.realm, b.color]))
const REALMS = ['Alsius', 'Ignis', 'Syrtis']
const NEUTRAL = '#5b6577'
const REFRESH_MS = 60_000
const OFFICIAL_PAGE = 'https://www.championsofregnum.com/index.php?l=1&sec=3'
const mapUrl = (world, version) =>
  `https://www.championsofregnum.com/ranking/data/${world}/gen_map.jpg?v=${version}`

const timeFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

const secFmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

/**
 * Busca o status da warzone a cada minuto.
 * Fica no App (e não dentro do mapa) para continuar atualizando em qualquer aba.
 * Quando a página volta a ficar visível, atualiza na hora se passou mais de 1 minuto.
 */
export function useWarStatus(world) {
  const [state, setState] = useState({ world, data: null, error: false, loading: true, checkedAt: null })

  useEffect(() => {
    let alive = true
    let lastRun = 0
    let controller = null

    const load = async () => {
      lastRun = Date.now()
      controller?.abort()
      controller = new AbortController()
      try {
        const res = await fetch(`./api/wz?world=${world}&t=${Math.floor(lastRun / REFRESH_MS)}`, {
          cache: 'no-store',
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(String(res.status))
        const data = await res.json()
        if (alive) setState({ world, data, error: false, loading: false, checkedAt: Date.now() })
      } catch (err) {
        if (alive && err.name !== 'AbortError') {
          setState((s) => ({ ...s, error: true, loading: false, checkedAt: Date.now() }))
        }
      }
    }

    setState({ world, data: null, error: false, loading: true, checkedAt: null })
    load()
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') load()
    }, REFRESH_MS)
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastRun >= REFRESH_MS) load()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      alive = false
      controller?.abort()
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [world])

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

export default function WarMap({ world, status }) {
  const { data, error, loading, checkedAt } = status
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => setImgFailed(false), [world, data?.updated])

  // fortes que mudaram de dono na última atualização: pulsam por alguns segundos
  const prevOwners = useRef(null)
  const [changed, setChanged] = useState(() => new Set())
  useEffect(() => {
    if (!data?.realms) return
    const owners = new Map(data.realms.flatMap((x) => x.forts.map((f) => [f.name, f.owner])))
    if (prevOwners.current) {
      const diff = [...owners].filter(([n, o]) => prevOwners.current.get(n) && prevOwners.current.get(n) !== o).map(([n]) => n)
      if (diff.length) {
        setChanged(new Set(diff))
        const id = setTimeout(() => setChanged(new Set()), 8000)
        prevOwners.current = owners
        return () => clearTimeout(id)
      }
    }
    prevOwners.current = owners
  }, [data])

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
              ? `Status de ${timeFmt.format(new Date(data.updated))}`
              : loading
                ? 'Carregando…'
                : 'Dados do site oficial'}
            {checkedAt && (
              <>
                {' · '}
                <span className={`wz-live ${error ? 'off' : ''}`} />
                verificado às {secFmt.format(new Date(checkedAt))}
              </>
            )}
          </span>
        </div>
      </div>

      <div className="wz-map">
        {imgFailed ? (
          <div className="wz-map-fallback">Não foi possível carregar o mapa agora.</div>
        ) : (
          <img
            src={mapUrl(world, data?.updated ?? Math.floor((checkedAt ?? Date.now()) / REFRESH_MS))}
            alt="Mapa de guerra"
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
              <strong key={held[r]} className="wz-score-num">{held[r]}</strong>
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
                  <li key={f.name} className={`${f.captured ? 'captured' : ''} ${changed.has(f.name) ? 'changed' : ''}`}>
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

      {error && (
        <p className="wz-error">
          {data
            ? 'Não foi possível atualizar agora; mostrando o último status. Nova tentativa em 1 minuto.'
            : 'Não foi possível ler os dados do site oficial agora. Nova tentativa em 1 minuto.'}
        </p>
      )}

      <a className="wz-source" href={`${OFFICIAL_PAGE}&world=${world}`} target="_blank" rel="noreferrer">
        Fonte: championsofregnum.com ›
      </a>
    </section>
  )
}
