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
import { formatBrasilia, nextXymeraldReset } from './xymerald.js'

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

const INFO_SECTIONS = [
  {
    id: 'armaduras',
    label: 'Armaduras',
    icon: <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6z" />,
  },
  {
    id: 'joias',
    label: 'Joias',
    icon: (
      <>
        <path d="M7.5 4h9L20 9l-8 11L4 9z" />
        <path d="M4 9h16M9.5 9 12 20l2.5-11M7.5 4 9.5 9l2.5-5 2.5 5 2-5" />
      </>
    ),
  },
  {
    id: 'crafting',
    label: 'Crafting',
    icon: (
      <>
        <path d="m13.5 5.5 5 5-2 2-5-5z" />
        <path d="M12.5 6.5 9 3 6 6l3.5 3.5M14 11l-9 9-2-2 9-9" />
      </>
    ),
  },
]

/** Lê o endereço: #inicio, #epicos, #info ou #info/<seção> */
const parseHash = () => {
  const [id, sub] = window.location.hash.replace('#', '').split('/')
  const tab = TABS.some((t) => t.id === id) ? id : 'inicio'
  const section = INFO_SECTIONS.some((x) => x.id === sub) ? sub : INFO_SECTIONS[0].id
  return { tab, section }
}

/** Aba e sub-aba guardadas na URL: o botão voltar funciona e dá para compartilhar o link */
function useHashTab() {
  const [route, setRoute] = useState(parseHash)
  useEffect(() => {
    const onHash = () => {
      const next = parseHash()
      setRoute((prev) => {
        if (next.tab !== prev.tab) window.scrollTo({ top: 0 })
        return next
      })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const goTo = (id) => {
    if (id === route.tab) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.hash = id
  }
  const goToSection = (section) => {
    window.location.hash = `info/${section}`
  }
  return [route.tab, goTo, route.section, goToSection]
}

function InfoView({ section, onSection }) {
  const current = INFO_SECTIONS.find((x) => x.id === section)
  return (
    <>
      <nav className="subnav" aria-label="Seções de informações">
        {INFO_SECTIONS.map((x) => (
          <button
            key={x.id}
            type="button"
            className={`subnav-item ${x.id === section ? 'active' : ''}`}
            aria-current={x.id === section ? 'page' : undefined}
            onClick={() => onSection(x.id)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {x.icon}
            </svg>
            {x.label}
          </button>
        ))}
      </nav>

      <section key={current.id} className="info-section">
        <div className="info-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {current.icon}
          </svg>
          <strong>{current.label}</strong>
          <span>Em breve</span>
        </div>
      </section>
    </>
  )
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

function XymeraldCard({ now }) {
  const resetAt = nextXymeraldReset(now)
  return (
    <section className="xy-card">
      <div className="xy-header">
        <img src="./xymerald.png" alt="" className="xy-icon" width="44" height="44" />
        <div className="xy-header-text">
          <span className="xy-name">Xymerald</span>
          <span className="xy-sub">Xymerald ore</span>
        </div>
      </div>
      <div className="xy-countdown">
        <span className="xy-label">Reseta em</span>
        <span className="xy-value" role="timer">
          {formatDuration(resetAt - now)}
        </span>
        <span className="xy-at">
          {formatBrasilia(resetAt)}
          <span className="xy-tz-long"> (horário de Brasília)</span>
          <span className="xy-tz-short"> · Brasília</span>
        </span>
      </div>
    </section>
  )
}

function HomeView({ rows, now, onOpenEpics, war }) {
  const [first, ...others] = rows
  return (
    <>
      <section className="home-next" style={{ '--realm-color': first.boss.color }}>
        <img src={first.boss.icon} alt="" className="home-portrait" />
        <div className="home-next-text">
          <span className="home-kicker">
            Próximo<span className="kicker-long"> a reaparecer</span>
          </span>
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

      <XymeraldCard now={now} />

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
  const [tab, goTo, infoSection, goToInfoSection] = useHashTab()
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

        {tab === 'info' && <InfoView section={infoSection} onSection={goToInfoSection} />}
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
