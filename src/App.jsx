import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BOSSES,
  RESPAWN_HOURS,
  RESPAWN_MS,
  formatDate,
  formatShort,
  getCycle,
  pad,
  splitDuration,
} from './bosses.js'

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

function statusOf(remaining) {
  if (remaining <= 0) return { key: 'live', label: 'Nascendo agora' }
  if (remaining <= 60 * 60 * 1000) return { key: 'soon', label: 'Iminente' }
  if (remaining <= 6 * 60 * 60 * 1000) return { key: 'near', label: 'Em breve' }
  return { key: 'wait', label: 'Aguardando' }
}

function ProgressRing({ progress, color, children }) {
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <div className="ring">
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="ring-track" cx="60" cy="60" r={r} />
        <circle
          className="ring-bar"
          cx="60"
          cy="60"
          r={r}
          stroke={color}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - progress)}
        />
      </svg>
      <div className="ring-content">{children}</div>
    </div>
  )
}

function Countdown({ ms }) {
  const { h, m, s } = splitDuration(ms)
  return (
    <div className="countdown" role="timer" aria-label={`${h} horas, ${m} minutos e ${s} segundos`}>
      {[
        [h, 'horas'],
        [m, 'min'],
        [s, 'seg'],
      ].map(([v, label], i) => (
        <div className="cd-group" key={label}>
          {i > 0 && <span className="cd-sep">:</span>}
          <div className="cd-unit">
            <span className="cd-value">{pad(v)}</span>
            <span className="cd-label">{label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function BossCard({ boss, lastSpawn, now, isNext }) {
  const cycle = getCycle(lastSpawn, now)
  const status = statusOf(cycle.remaining)

  return (
    <article
      className={`card status-${status.key} ${isNext ? 'is-next' : ''}`}
      style={{ '--accent': boss.color }}
    >
      <header className="card-head">
        <div>
          <span className="realm-tag">
            <span className="realm-dot" /> {boss.realm}
          </span>
          <h2 className="boss-name">{boss.name}</h2>
        </div>
        <span className={`badge badge-${status.key}`}>{status.label}</span>
      </header>

      <ProgressRing progress={cycle.progress} color={boss.color}>
        <span className="ring-pct">{Math.floor(cycle.progress * 100)}%</span>
        <span className="ring-caption">do ciclo</span>
      </ProgressRing>

      <Countdown ms={cycle.remaining} />

      <dl className="meta">
        <div>
          <dt>Próximo spawn</dt>
          <dd>{formatDate(cycle.next)}</dd>
        </div>
        <div>
          <dt>Último spawn</dt>
          <dd>{formatDate(cycle.prev)}</dd>
        </div>
      </dl>

    </article>
  )
}

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

  // Próximos spawns de todos os chefes (linha do tempo)
  const timeline = useMemo(() => {
    const items = []
    for (const { boss, cycle } of rows) {
      for (let i = 0; i < 3; i++) items.push({ boss, at: cycle.next + i * RESPAWN_MS })
    }
    return items.sort((a, b) => a.at - b.at).slice(0, 6)
  }, [rows])

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
      <div className="bg-glow" aria-hidden="true" />

      <header className="top">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M32 8l6 14 15 1-11.5 9.5L45 47 32 39l-13 8 3.5-14.5L11 23l15-1z"
              fill="currentColor"
            />
          </svg>
          <div>
            <h1>Regnum Boss Timer</h1>
            <p className="subtitle">Respawn a cada {RESPAWN_HOURS} horas</p>
          </div>
        </div>
        <div className="top-actions">
          {notifSupported && (
            <button
              type="button"
              className={`btn chip ${notify ? 'on' : ''}`}
              onClick={toggleNotify}
              aria-pressed={notify}
            >
              {notify ? '🔔 Alertas ligados' : '🔕 Ativar alertas'}
            </button>
          )}
        </div>
      </header>

      <section className="hero" style={{ '--accent': nextUp.boss.color }}>
        <span className="hero-kicker">Próximo chefe</span>
        <div className="hero-row">
          <div>
            <h2 className="hero-name">{nextUp.boss.name}</h2>
            <span className="hero-realm">
              {nextUp.boss.realm} · {formatDate(nextUp.cycle.next)}
            </span>
          </div>
          <div className="hero-time">{formatShort(nextUp.cycle.remaining)}</div>
        </div>
        <div className="hero-bar">
          <span style={{ width: `${nextUp.cycle.progress * 100}%` }} />
        </div>
      </section>

      <main className="grid">
        {rows.map(({ boss }, i) => (
          <BossCard
            key={boss.id}
            boss={boss}
            lastSpawn={spawns[boss.id]}
            now={now}
            isNext={i === 0}
          />
        ))}
      </main>

      <section className="timeline">
        <h3>Próximos spawns</h3>
        <ol>
          {timeline.map(({ boss, at }) => (
            <li key={`${boss.id}-${at}`} style={{ '--accent': boss.color }}>
              <span className="tl-dot" />
              <span className="tl-name">{boss.name}</span>
              <span className="tl-realm">{boss.realm}</span>
              <span className="tl-date">{formatDate(at)}</span>
              <span className="tl-in">em {formatShort(at - now)}</span>
            </li>
          ))}
        </ol>
      </section>

      <footer className="foot">
        <p>
          Horários exibidos no fuso do seu dispositivo (
          {Intl.DateTimeFormat().resolvedOptions().timeZone}).
        </p>
      </footer>
    </div>
  )
}
