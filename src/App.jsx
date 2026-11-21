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
import WarMap, { useWarStatus } from './WarMap.jsx'

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

const TABS = [
  {
    id: 'inicio',
    label: 'Início',
    icon: (
      <path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" />
    ),
  },
  {
    id: 'epicos',
    label: 'Épicos',
    icon: (
      <>
        <path d="M14.5 4H20v5.5L10 19.5 4.5 14z" />
        <path d="m7 17-3 3M5.5 12.5l6 6" />
      </>
    ),
  },
  {
    id: 'info',
    label: 'Informações',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 11v5.5M12 7.6v.01" />
      </>
    ),
  },
]

const tabFromHash = () => {
  const id = window.location.hash.replace('#', '')
  return TABS.some((t) => t.id === id) ? id : 'inicio'
}

/** Aba atual guardada na URL (#inicio, #epicos, #info): o botão voltar funciona e dá para compartilhar o link */
function useHashTab() {
  const [tab, setTab] = useState(tabFromHash)
  useEffect(() => {
    const onHash = () => {
      setTab(tabFromHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const goTo = (id) => {
    if (id === tab) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.hash = id
  }
  return [tab, goTo]
}

function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tab ${active === t.id ? 'active' : ''}`}
          aria-current={active === t.id ? 'page' : undefined}
          aria-label={t.label}
          onClick={() => onChange(t.id)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {t.icon}
          </svg>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

function ViewTitle({ title, subtitle }) {
  return (
    <div className="view-title">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

function HomeView({ rows, now, onOpenEpics, war }) {
  const [first, ...others] = rows
  return (
    <>
      <ViewTitle title="Início" subtitle="Épicos e mapa de guerra de Regnum" />

      <section className="home-next" style={{ '--realm-color': first.boss.color }}>
        <img src={first.boss.icon} alt="" className="home-portrait" />
        <div className="home-next-text">
          <span className="home-kicker">Próximo a reaparecer</span>
          <h3>{first.boss.name}</h3>
          <span className="home-realm">{first.boss.realm}</span>
        </div>
        <div className="home-next-time">
          <span className="home-countdown">
            {first.cycle.remaining <= 0 ? 'Agora' : formatDuration(first.cycle.remaining)}
          </span>
          <span className="home-when">{formatDate(first.cycle.next)}</span>
        </div>
      </section>

      <WarMap {...war} />

      <section className="panel">
        <h3 className="panel-title">Na sequência</h3>
        <ul className="home-list">
          {others.map(({ boss, cycle }) => (
            <li key={boss.id} style={{ '--realm-color': boss.color }}>
              <img src={boss.icon} alt="" className="home-thumb" loading="lazy" />
              <div className="home-list-text">
                <strong>{boss.name}</strong>
                <span>{formatDate(cycle.next)}</span>
              </div>
              <span className="home-list-time">{formatDuration(cycle.remaining)}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="panel-link" onClick={onOpenEpics}>
          Ver todos os épicos ›
        </button>
      </section>
    </>
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
  const [tab, goTo] = useHashTab()
  const [world, setWorld] = useState('ra')
  const warStatus = useWarStatus(world)

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


      <main key={tab} className="view">
        {tab === 'inicio' && <HomeView
            rows={rows}
            now={now}
            onOpenEpics={() => goTo('epicos')}
            war={{ world, onWorldChange: setWorld, status: warStatus }}
          />}

        {tab === 'epicos' && (
          <>
            <ViewTitle title="Épicos" subtitle="Ordenados pelo próximo a reaparecer" />
            <div className="grid">
              {rows.map(({ boss }, i) => (
                <BossCard
                  key={boss.id}
                  boss={boss}
                  lastSpawn={spawns[boss.id]}
                  now={now}
                  featured={i === 0}
                />
              ))}
            </div>
          </>
        )}

      </main>

      {tab !== 'info' && (
        <footer className="foot">
          Horários no fuso do seu dispositivo · {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </footer>
      )}

      <TabBar active={tab} onChange={goTo} />
    </div>
  )
}
