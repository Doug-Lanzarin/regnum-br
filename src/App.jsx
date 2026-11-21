import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BOSSES,
  RESPAWN_HOURS,
  RESPAWN_MS,
  formatDate,
  formatDuration,
  formatRelativePast,
  formatShort,
  getCycle,
} from './bosses.js'

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

function BossCard({ boss, lastSpawn, now, featured }) {
  const [iconFailed, setIconFailed] = useState(false)
  const cycle = getCycle(lastSpawn, now)
  const upcoming = [1, 2, 3].map((i) => cycle.next + i * RESPAWN_MS)

  return (
    <article className={`bc-card ${featured ? 'bc-featured' : ''}`} style={{ '--realm-color': boss.color }}>
      {featured && <span className="bc-featured-tag">Próximo a reaparecer</span>}

      <div className="bc-header">
        {iconFailed ? (
          <span className="bc-emblem" aria-hidden="true">
            {boss.realm[0]}
          </span>
        ) : (
          <img
            src={boss.icon}
            alt=""
            className="bc-emblem"
            loading="lazy"
            onError={() => setIconFailed(true)}
          />
        )}
        <div className="bc-header-text">
          <h2 className="bc-name">{boss.name}</h2>
          <span className="bc-realm">{boss.realm}</span>
        </div>
      </div>

      <div className="bc-countdown">
        <span className="bc-countdown-label">
          {cycle.remaining <= 0 ? 'Status' : 'Reaparece em'}
        </span>
        <span className="bc-countdown-value" role="timer">
          {cycle.remaining <= 0 ? 'Pode já ter reaparecido' : formatDuration(cycle.remaining)}
        </span>
      </div>

      <dl className="bc-meta">
        <div>
          <dt>Último spawn</dt>
          <dd>
            {formatDate(cycle.prev)}
            <span className="bc-relative"> ({formatRelativePast(now - cycle.prev)})</span>
          </dd>
        </div>
        <div>
          <dt>Próximo horário</dt>
          <dd>{formatDate(cycle.next)}</dd>
        </div>
      </dl>

      <details className="bc-upcoming">
        <summary>Ver mais horários</summary>
        <ul>
          {upcoming.map((at) => (
            <li key={at}>{formatDate(at)}</li>
          ))}
        </ul>
      </details>

      <p className="bc-description">Chefe de mundo do reino de {boss.realm}.</p>
    </article>
  )
}

const ALERT_MINUTES = 10

// Horários fixos do último respawn informado; os próximos são calculados de 61 em 61 horas
const SPAWNS = Object.fromEntries(BOSSES.map((b) => [b.id, Date.parse(b.lastSpawn)]))

export default function App() {
  const now = useNow()
  const spawns = SPAWNS
  const [notify, setNotify] = useState(
    () => typeof Notification !== 'undefined' && Notification.permission === 'granted',
  )
  const notified = useRef(new Set())

  const rows = useMemo(
    () =>
      BOSSES.map((b) => ({ boss: b, cycle: getCycle(spawns[b.id], now) })).sort(
        (a, b) => a.cycle.next - b.cycle.next,
      ),
    [spawns, now],
  )
  const nextUp = rows[0]

  // Título da aba mostra o próximo chefe
  useEffect(() => {
    document.title = `${formatShort(nextUp.cycle.remaining)} · ${nextUp.boss.name} | Regnum Boss Timer`
  }, [nextUp])

  // Notificações no navegador
  useEffect(() => {
    if (!notify || typeof Notification === 'undefined') return
    for (const { boss, cycle } of rows) {
      const mins = cycle.remaining / 60000
      const keys = [
        [`${boss.id}-${cycle.next}-pre`, mins <= ALERT_MINUTES && mins > ALERT_MINUTES - 1,
          `${boss.name} nasce em ${ALERT_MINUTES} minutos!`],
        [`${boss.id}-${cycle.next}-now`, cycle.remaining <= 1000, `${boss.name} nasceu em ${boss.realm}!`],
      ]
      for (const [key, cond, msg] of keys) {
        if (cond && !notified.current.has(key)) {
          notified.current.add(key)
          try {
            new Notification('Regnum Boss Timer', { body: msg, icon: './favicon.svg' })
          } catch {
            /* ignora */
          }
        }
      }
    }
  }, [rows, notify])

  const toggleNotify = async () => {
    if (typeof Notification === 'undefined') return
    if (notify) return setNotify(false)
    const perm = await Notification.requestPermission()
    setNotify(perm === 'granted')
  }

  const notifSupported = typeof Notification !== 'undefined'

  return (
    <div className="app">
      <header className="top">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <h1>Regnum Boss Timer</h1>
            <p className="subtitle">Ciclo de respawn de {RESPAWN_HOURS} horas</p>
          </div>
        </div>
        {notifSupported && (
          <button
            type="button"
            className={`chip ${notify ? 'on' : ''}`}
            onClick={toggleNotify}
            aria-pressed={notify}
          >
            <span className="chip-dot" />
            {notify ? 'Alertas ligados' : 'Ativar alertas'}
          </button>
        )}
      </header>


      <main className="grid">
        {rows.map(({ boss }, i) => (
          <BossCard
            key={boss.id}
            boss={boss}
            lastSpawn={spawns[boss.id]}
            now={now}
            featured={i === 0}
          />
        ))}
      </main>


      <footer className="foot">
        Horários no fuso do seu dispositivo · {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </footer>
    </div>
  )
}
