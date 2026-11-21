import { useEffect, useState } from 'react'
import { BOSSES } from './bosses.js'
import { FORT_ICON_PATHS, FORT_MAP_POSITIONS, WZ_MAP_IMAGE, WZ_MAP_SIZE, fortLabel } from './wzMap.js'

const REALM_COLOR = Object.fromEntries(BOSSES.map((b) => [b.realm, b.color]))
const REALMS = ['Alsius', 'Ignis', 'Syrtis']
const NEUTRAL = '#5b6577'
const REFRESH_MS = 60_000
const OFFICIAL_PAGE = 'https://www.championsofregnum.com/index.php?l=1&sec=3'
const ICON_SIZE = 32
const iconKind = (kind) => (kind === 'fort' ? 'keep' : kind)

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
  const [selected, setSelected] = useState(null)

  const realms = data?.realms ?? []
  const held = Object.fromEntries(
    REALMS.map((r) => [
      r,
      realms.reduce((n, x) => n + x.forts.filter((f) => f.owner === r).length, 0),
    ]),
  )
  const totalForts = realms.reduce((n, x) => n + x.forts.length, 0)
  const forts = realms.flatMap((x) => x.forts)
  const selectedFort = forts.find((f) => f.number === selected)
  const toggleFort = (n) => setSelected((cur) => (cur === n ? null : n))

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
        <svg
          viewBox={`0 0 ${WZ_MAP_SIZE} ${WZ_MAP_SIZE}`}
          role="img"
          aria-label="Mapa da Zona de Guerra"
        >
          <image href={WZ_MAP_IMAGE} width={WZ_MAP_SIZE} height={WZ_MAP_SIZE} preserveAspectRatio="xMidYMid slice" />
          {forts.map((fort) => {
            const pos = FORT_MAP_POSITIONS[fort.number - 1]
            if (!pos) return null
            const label = fortLabel(fort.name)
            return (
              <g
                key={fort.number}
                className={`wz-fort ${fort.captured ? 'captured' : ''} ${selected === fort.number ? 'selected' : ''}`}
                role="button"
                tabIndex={0}
                aria-label={`${label}: ${fort.owner}${fort.captured ? `, invadido (dono original ${fort.home})` : ''}`}
                onClick={() => toggleFort(fort.number)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggleFort(fort.number)
                  }
                }}
              >
                <title>
                  {label} — {fort.owner}
                  {fort.captured ? ` (invadido, dono original: ${fort.home})` : ''}
                </title>
                <rect
                  x={Math.min(pos.x, pos.labelX) - 4}
                  y={Math.min(pos.y, pos.labelY - 14) - 4}
                  width={Math.max(pos.x + ICON_SIZE, pos.labelX + 30) - Math.min(pos.x, pos.labelX) + 8}
                  height={Math.max(pos.y + ICON_SIZE, pos.labelY) - Math.min(pos.y, pos.labelY - 14) + 8}
                  className="wz-hit"
                />
                {fort.captured && (
                  <circle
                    cx={pos.x + ICON_SIZE / 2}
                    cy={pos.y + ICON_SIZE / 2}
                    r={ICON_SIZE / 2 + 4}
                    className="wz-capture-ring"
                  />
                )}
                <svg x={pos.x} y={pos.y} width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 512 512">
                  <path d={FORT_ICON_PATHS[iconKind(fort.kind)]} fill={REALM_COLOR[fort.owner]} className="wz-fort-icon" />
                </svg>
                <text x={pos.labelX} y={pos.labelY} className="wz-fort-label">
                  ({fort.number})
                </text>
              </g>
            )
          })}
        </svg>
        {loading && !data && <div className="wz-map-loading">Carregando fortes…</div>}
      </div>

      {selectedFort && (
        <div className="wz-selected" style={{ '--realm-color': REALM_COLOR[selectedFort.owner] }}>
          <span className="wz-fort-num">{selectedFort.number}</span>
          <strong>{fortLabel(selectedFort.name)}</strong>
          <span className="wz-owner" style={{ '--owner-color': REALM_COLOR[selectedFort.owner] }}>
            {selectedFort.owner}
          </span>
          {selectedFort.captured && (
            <span className="wz-selected-note">invadido · dono original {selectedFort.home}</span>
          )}
        </div>
      )}

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
                  <li
                    key={f.name}
                    className={`${f.captured ? 'captured' : ''} ${selected === f.number ? 'selected' : ''}`}
                    onClick={() => toggleFort(f.number)}
                  >
                    <span className="wz-fort-num">{f.number}</span>
                    <span className="wz-fort-name">{fortLabel(f.name)}</span>
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
