import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BOSSES,
  RESPAWN_HOURS,
  RESPAWN_MS,
  formatDate,
  formatDuration,
  formatRelativePast,
  getCycle,
} from './bosses.js'
import WarMap, { useWarStatus } from './WarMap.jsx'
import MaterialsMap from './MaterialsMap.jsx'
import { WARMASTER_REALMS } from './joias.js'
import { CHAMPION_ARMORS, CHAMPION_WEAPONS } from './champion.js'
import { MAGNANITA_ARMORS } from './magnanita.js'
import { EPIC_WEAPONS } from './epicWeapons.js'
import { EPIC_JEWELS } from './epicJewels.js'
import { HALLOWEEN_JEWELS } from './halloweenJewels.js'
import { MOMO_JEWELS } from './momoJewels.js'
import { AQUANTIS_JEWELS } from './aquantisJewels.js'
import { ALGAROS_JEWELS } from './algarosJewels.js'
import { BOSS_WEAPONS } from './bossWeapons.js'
import { CRAFTING_GROUPS, formatCraftTime, formatGameTime } from './crafting.js'
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
    id: 'crafting',
    label: 'Crafting',
    icon: (
      <>
        <path d="m13.5 5.5 5 5-2 2-5-5z" />
        <path d="M12.5 6.5 9 3 6 6l3.5 3.5M14 11l-9 9-2-2 9-9" />
      </>
    ),
  },
  {
    id: 'items',
    label: 'Items',
    icon: (
      <>
        <path d="M9 7.5h6c3.2 2.4 5 5.6 5 8.6 0 2.6-2.1 4.4-4.8 4.4H8.8C6.1 20.5 4 18.7 4 16.1c0-3 1.8-6.2 5-8.6z" />
        <path d="M9 7.5 7.5 3.8c1.5.6 3 .9 4.5.9s3-.3 4.5-.9L15 7.5M9.5 13.5h5" />
      </>
    ),
  },
]

/** Armas dos épicos: uma sub-aba por chefe (conteúdo em breve) */
const epicGroups = (data) =>
  ['daenrha', 'evendim', 'thorkul'].map((id) => {
    const b = BOSSES.find((x) => x.id === id)
    return { id, label: b.name, color: b.color, items: data[id] ?? null }
  })
const EPIC_WEAPON_GROUPS = epicGroups(EPIC_WEAPONS)
const EPIC_JEWEL_GROUPS = epicGroups(EPIC_JEWELS)

/** Seções da aba Items (navegação em lista) */
const ITEM_SECTIONS = [
  {
    id: 'joias',
    label: 'Jóias',
    desc: 'Anéis e amuletos',
    topics: [
      { id: 'algaros', label: 'Algaros (Gold)', items: ALGAROS_JEWELS, color: '#f5d04a' },
      { id: 'warmaster', label: 'Warmaster', groups: WARMASTER_REALMS },
      { id: 'epicos', label: 'Épicos', groups: EPIC_JEWEL_GROUPS },
      { id: 'halloween', label: 'Halloween', items: HALLOWEEN_JEWELS },
      { id: 'momo', label: 'Momo', items: MOMO_JEWELS, color: '#d6b06a' },
      { id: 'aquantis', label: 'Aquantis', items: AQUANTIS_JEWELS, color: '#6ec9e6' },
    ],
    icon: (
      <>
        <path d="M7.5 4h9L20 9l-8 11L4 9z" />
        <path d="M4 9h16M9.5 9 12 20l2.5-11" />
      </>
    ),
  },
  {
    id: 'armaduras',
    label: 'Armaduras',
    desc: 'Conjuntos e peças',
    topics: [
      { id: 'champion', label: 'Champion', groups: CHAMPION_ARMORS },
      { id: 'magnanita', label: 'Magnanita', groups: MAGNANITA_ARMORS },
    ],
    icon: <path d="M12 3.5 5 6v5.5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6z" />,
  },
  {
    id: 'armas',
    label: 'Armas',
    desc: 'Espadas, arcos, cajados e mais',
    topics: [
      { id: 'champion', label: 'Champion', groups: CHAMPION_WEAPONS },
      { id: 'epicos', label: 'Épicos', groups: EPIC_WEAPON_GROUPS },
      { id: 'chefes', label: 'Chefes', groups: BOSS_WEAPONS },
    ],
    icon: (
      <>
        <path d="M14.5 4H20v5.5L10 19.5 4.5 14z" />
        <path d="m7 17-3 3M5.5 12.5l6 6" />
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
    topics: [
      { id: 'warmaster', label: 'Warmaster' },
      { id: 'gold', label: 'Gold' },
      { id: 'eventos', label: 'Eventos' },
      { id: 'epicos', label: 'Épicos' },
    ],
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
  const [rawId, sub, sub2, sub3] = window.location.hash.replace('#', '').split('/')
  const id = rawId === 'info' ? 'crafting' : rawId // links antigos da aba Informações
  const tab = TABS.some((t) => t.id === id) ? id : 'inicio'
  const info = INFO_SECTIONS.find((x) => x.id === sub) ?? INFO_SECTIONS[0]
  const topicObj = info.topics ? (info.topics.find((t) => t.id === sub2) ?? info.topics[0]) : null
  const group = topicObj?.groups ? (topicObj.groups.find((g) => g.id === sub3) ?? topicObj.groups[0]).id : null
  const itemObj = tab === 'items' ? ITEM_SECTIONS.find((x) => x.id === sub) : null
  const itemTopic = itemObj?.topics ? (itemObj.topics.find((t) => t.id === sub2) ?? itemObj.topics[0]) : null
  const itemGroup = itemTopic?.groups
    ? (itemTopic.groups.find((g) => g.id === sub3) ?? itemTopic.groups.find((g) => g.items) ?? itemTopic.groups[0])
    : null
  return {
    tab,
    section: info.id,
    topic: topicObj?.id ?? null,
    group,
    itemSection: itemObj?.id ?? null,
    itemTopic: itemTopic?.id ?? null,
    itemGroup: itemGroup?.id ?? null,
  }
}

/** Aba e sub-aba guardadas na URL: o botão voltar funciona e dá para compartilhar o link */
function useHashTab() {
  const [route, setRoute] = useState(parseHash)
  useEffect(() => {
    const onHash = () => {
      const next = parseHash()
      setRoute((prev) => {
        if (next.tab !== prev.tab || next.itemSection !== prev.itemSection) window.scrollTo({ top: 0 })
        return next
      })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const goTo = (id) => {
    if (id === 'items' && route.tab === 'items' && route.itemSection) window.location.hash = 'items'
    else if (id === route.tab) window.scrollTo({ top: 0, behavior: 'smooth' })
    else window.location.hash = id
  }
  const goToSection = (section, topic, group) => {
    window.location.hash = ['info', section, topic, group].filter(Boolean).join('/')
  }
  return [route.tab, goTo, route, goToSection]
}

const RES_TYPES = ['Cortante', 'Perfurante', 'Esmagador', 'Fogo', 'Gelo', 'Eletricidade']
const RES_ICONS = ['cortante', 'perfurante', 'esmagamento', 'fogo', 'gelo', 'eletrico']

/** 300000 → "3 dias 11:20:00" */
function formatLongTime(sec) {
  const d = Math.floor(sec / 86400)
  const p = (n) => String(n).padStart(2, '0')
  const hms = `${p(Math.floor((sec % 86400) / 3600))}:${p(Math.floor((sec % 3600) / 60))}:${p(sec % 60)}`
  return d ? `${d} ${d > 1 ? 'dias' : 'dia'} ${hms}` : hms
}

/** Detalhes de crafting (êxito, tempo, nível, materiais) */
function CraftDetails({ craft }) {
  return (
    <dl className="gear-craft">
      {craft.chance != null && <div>
        <dt>Êxito</dt>
        <dd>{craft.chance}%</dd>
      </div>}
      {craft.time != null && <div>
        <dt>Tempo para craftar</dt>
        <dd>{formatLongTime(craft.time)}</dd>
      </div>}
      {craft.level != null && <div>
        <dt>Nível craft</dt>
        <dd>{craft.level}</dd>
      </div>}
      <div className="gear-craft-mats">
        <dt>Materiais necessários</dt>
        <dd>
          {craft.materials.map((m) => (
            <span key={m.name}>
              <img src={m.icon} alt="" width="18" height="18" />
              <b>{m.qty}×</b> {m.name}
            </span>
          ))}
        </dd>
      </div>
    </dl>
  )
}

/** Card de armadura/arma no estilo do tooltip do jogo */
function GearCard({ item }) {
  return (
    <article className="jewel gear">
      <header className="jewel-head">
        <ItemIcon src={item.icon} name={item.name} className="jewel-icon" size={40} />
        <h3 className={item.rarity === 'Mágico' ? 'gear-magic-name' : item.rarity === 'Superior' ? undefined : item.rarity ? 'gear-epic-name' : undefined}>{item.name}</h3>
      </header>
      <dl className="jewel-body">
        {item.armor && (
          <div className="jewel-damage">
            <dt>Armadura:</dt>
            <dd>{item.armor}</dd>
          </div>
        )}
        {item.damage && (
          <div className="jewel-damage">
            <dt>Dano (+{item.damage.bonus}):</dt>
            <dd className="gear-dmg">
              {(item.damage.parts ?? [[item.damage.icon, item.damage.value]]).map(([type, value]) => (
                <span key={type + value}>
                  <img src={`./joias/dano/${type}.png`} alt={type} width="12" height="15" />
                  {value}
                </span>
              ))}
            </dd>
          </div>
        )}
        {typeof item.resist === 'string' && (
          <div>
            <dt>Resistências:</dt>
            <dd>{item.resist}</dd>
          </div>
        )}
        {Array.isArray(item.resist) && (
          <div className="gear-res" aria-label="Resistências">
            {item.resist.map((r, i) => (
              <span key={i} className={`gear-res-item res-${r.toLowerCase()}`} title={`${RES_TYPES[i]}: ${r}`}>
                <img src={`./joias/dano/${RES_ICONS[i]}.png`} alt={RES_TYPES[i]} width="12" height="15" />
                {r}
              </span>
            ))}
          </div>
        )}
        <div>
          <dt>Categoria:</dt>
          <dd>{item.category}</dd>
        </div>
        {item.speed && (
          <div>
            <dt>Velocidade de ataque:</dt>
            <dd>{item.speed}</dd>
          </div>
        )}
        {item.range && (
          <div>
            <dt>Alcance:</dt>
            <dd>{item.range}</dd>
          </div>
        )}
        {item.durability != null && (
          <div>
            <dt>Durabilidade:</dt>
            <dd>{item.durability}</dd>
          </div>
        )}
        <div>
          <dt>Peso:</dt>
          <dd>{item.weight}</dd>
        </div>
        {item.itemLevel != null && (
          <div>
            <dt>Nível do item:</dt>
            <dd>{item.itemLevel}</dd>
          </div>
        )}
        <div className="jewel-level">Requer {item.requires}</div>
      </dl>
      {item.lore && <p className="jewel-lore">{item.lore}</p>}
      {item.stats.length > 0 && (
        <ul className="jewel-stats">
          {item.stats.map((st) => (
            <li key={st.text} className={st.tone === 'bad' ? 'bad' : ''}>
              {st.text}
            </li>
          ))}
        </ul>
      )}
      {(item.socket || item.upgrades != null) && <p className="gear-slots">
        {item.socket
          ? '1 encaixe vazio'
          : item.upgrades
            ? `${item.upgrades} níveis de melhoria`
            : 'Sem níveis de melhoria'}
      </p>}
      {item.rarity && item.rarity !== 'Superior' && <p className={`gear-rarity ${item.rarity === 'Mágico' ? 'magic' : ''}`}>{item.rarity}</p>}
      {(item.paintable || item.bound) && (
        <p className="gear-flags">
          {item.paintable && <span>Pintável nos canais A, B</span>}
          {item.bound && <span className="gear-bound">Vinculado à conta</span>}
        </p>
      )}
      {item.craft && <CraftDetails craft={item.craft} />}
      {(item.costs ?? (item.cost != null ? [{ coin: item.coin ?? './champion/moeda.png', value: item.cost }] : [])).length > 0 && (
        <footer className="gear-cost">
          <span>Custo</span>
          <span className="gear-cost-values">
            {(item.costs ?? [{ coin: item.coin ?? './champion/moeda.png', value: item.cost }]).map((c) => (
              <strong key={c.coin}>
                <img src={c.coin} alt="" width="16" height="17" />
                {c.value.toLocaleString('pt-BR')}
              </strong>
            ))}
          </span>
        </footer>
      )}
    </article>
  )
}

function JewelCard({ item }) {
  const [open, setOpen] = useState(false)
  const canCraft = Boolean(item.craft)
  return (
    <article className={`jewel ${canCraft ? 'jewel-craftable' : ''} ${open ? 'open' : ''}`}>
      <header
        className="jewel-head"
        {...(canCraft && {
          role: 'button',
          tabIndex: 0,
          'aria-expanded': open,
          onClick: () => setOpen((v) => !v),
          onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen((v) => !v)
            }
          },
        })}
      >
        <img src={item.icon} alt="" className="jewel-icon" width="40" height="40" loading="lazy" />
        <h3 className={item.epic ? 'gear-epic-name' : undefined}>{item.name}</h3>
      </header>
      <dl className="jewel-body">
        {item.damage && (
          <div className="jewel-damage">
            <dt>Dano:</dt>
            <dd>
              <img src={item.damage.icon} alt={item.damage.type} width="12" height="15" />
              {item.damage.value}
            </dd>
          </div>
        )}
        <div>
          <dt>Categoria:</dt>
          <dd>{item.category}</dd>
        </div>
        <div>
          <dt>Peso:</dt>
          <dd>{item.weight}</dd>
        </div>
        {item.itemLevel != null && (
          <div>
            <dt>Nível do item:</dt>
            <dd>{item.itemLevel}</dd>
          </div>
        )}
        <div className="jewel-level">Requer Nível {item.level}</div>
      </dl>
      {item.lore && <p className="jewel-lore">{item.lore}</p>}
      <ul className="jewel-stats">
        {item.stats.map((st) => (
          <li key={st.text} className={st.tone === 'bad' ? 'bad' : ''}>
            {st.text}
          </li>
        ))}
      </ul>
      {item.price && (
        <footer className="gear-cost">
          <span>Preço</span>
          <strong className="gold-price">{item.price} gold</strong>
        </footer>
      )}
      {item.epic && <p className="gear-rarity">Épico</p>}
      {canCraft && (
        <button type="button" className="jewel-craft-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? 'Ocultar crafting' : 'Ver crafting'}
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}
      {canCraft && open && (
        <div className="jewel-craft">
          <CraftDetails craft={item.craft} />
          <footer className="gear-cost">
            <span>Custo</span>
            <span className="gear-cost-values">
              {item.craft.costs.map((c) => (
                <strong key={c.coin}>
                  <img src={c.coin} alt="" width="16" height="17" />
                  {c.value.toLocaleString('pt-BR')}
                </strong>
              ))}
            </span>
          </footer>
        </div>
      )}
    </article>
  )
}

/** Ícone do item; sem imagem, mostra a inicial num quadrado no estilo do jogo */
function ItemIcon({ src, name, className, size }) {
  if (src) return <img src={src} alt="" className={className} width={size} height={size} loading="lazy" />
  return (
    <span className={`${className} item-icon-fallback`} aria-hidden="true">
      {name.charAt(0)}
    </span>
  )
}

function RecipeItem({ recipe, open, onToggle }) {
  const panelId = `recipe-${recipe.id}`
  const icon = recipe.icon ?? recipe.materials[0]?.icon
  return (
    <li className={`recipe ${open ? 'open' : ''}`}>
      <button
        type="button"
        className="recipe-head"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <ItemIcon src={icon} name={recipe.name} className="recipe-icon" size={36} />
        <span className="recipe-name">{recipe.name}</span>
        {recipe.level && <span className="recipe-level">Nv. {recipe.level}</span>}
        <svg className="recipe-chevron" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <div id={panelId} className="recipe-panel" hidden={!open}>
        <dl className="recipe-stats">
          <div>
            <dt>Probabilidade de êxito</dt>
            <dd>
              <span className="recipe-chance">{recipe.chance}%</span>
              <span className="recipe-bar" aria-hidden="true">
                <span style={{ width: `${recipe.chance}%` }} />
              </span>
            </dd>
          </div>
          <div>
            <dt>Tempo para craftar</dt>
            <dd>
              <span className="recipe-time">{formatCraftTime(recipe.time)}</span>
              <span className="recipe-time-game">{formatGameTime(recipe.time)}</span>
            </dd>
          </div>
        </dl>
        <div className="recipe-materials">
          <span className="recipe-label">Materiais necessários</span>
          <ul>
            {recipe.materials.map((m) => (
              <li key={m.name}>
                <ItemIcon src={m.icon} name={m.name} className="recipe-mat-icon" size={28} />
                <span className="recipe-qty">{m.qty}×</span>
                <span>{m.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  )
}

const navChevron = (
  <svg className="nav-chevron" viewBox="0 0 24 24" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
)

/** Agrupa itens pelo campo `section` (ex.: Novas / Antigas), mantendo a ordem */
function groupBySection(items) {
  if (!items.some((x) => x.section)) return [[null, items]]
  const map = new Map()
  for (const it of items) {
    const k = it.section ?? 'Outros'
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(it)
  }
  return [...map.entries()]
}

/** Abas internas de uma seção de Items (ex.: Jóias → Warmaster → Alsius/Ignis/Syrtis) */
function ItemTopics({ section, topic, group }) {
  const navRef = useRef(null)
  const t = section.topics.find((x) => x.id === topic) ?? section.topics[0]
  // no celular as abas podem passar da largura: rola até a aba ativa
  useEffect(() => {
    const nav = navRef.current
    const active = nav?.querySelector('.topicnav-item.active')
    if (nav && active) nav.scrollTo({ left: active.offsetLeft - nav.clientWidth / 2 + active.offsetWidth / 2 })
  }, [t.id])
  const g = t.items
    ? { id: t.id, items: t.items, color: t.color ?? '#c08bff' }
    : (t.groups?.find((x) => x.id === group) ?? t.groups?.find((x) => x.items) ?? t.groups?.[0])
  const href = (...parts) => '#' + ['items', section.id, ...parts].join('/')
  return (
    <>
      <nav ref={navRef} className="topicnav" aria-label={`Tópicos de ${section.label}`}>
        {section.topics.map((x) => (
          <a
            key={x.id}
            href={href(x.id)}
            className={`topicnav-item ${x.id === t.id ? 'active' : ''}`}
            aria-current={x.id === t.id ? 'page' : undefined}
          >
            {x.label}
          </a>
        ))}
      </nav>

      {t.groups && (
        <nav className="groupnav" aria-label={`${t.label} por ${section.id === 'joias' ? 'reino' : 'classe'}`}>
          {t.groups.map((x) => (
            <a
              key={x.id}
              href={href(t.id, x.id)}
              className={`groupnav-item ${x.id === g.id ? 'active' : ''}`}
              style={{ '--group-color': x.color }}
              aria-current={x.id === g.id ? 'page' : undefined}
            >
              <span className="groupnav-dot" />
              {x.label}
            </a>
          ))}
        </nav>
      )}

      {g?.items ? (
        <section key={g.id} className="info-section" style={{ '--group-color': g.color }}>
          {g.set && (
            <div className="set-bonus">
              <span className="set-bonus-title">{g.setTitle ?? 'Bônus com o conjunto Champion completo'}</span>
              <ul>
                {g.set.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}
          {groupBySection(g.items).map(([label, list]) => (
            <div key={label ?? 'all'} className="item-subsection">
              {label && <h2 className="item-subsection-title">{label}</h2>}
              <div className="jewel-grid">
                {list.map((item) =>
                  section.id === 'joias' && !item.gear ? (
                    <JewelCard key={item.id} item={item} />
                  ) : (
                    <GearCard key={item.id} item={item} />
                  ),
                )}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <div key={g?.id} className="info-empty info-section">
          <strong>{g ? `${t.label} · ${g.label}` : t.label}</strong>
          <span>Em breve</span>
        </div>
      )}
    </>
  )
}

/** Aba Items: lista de seções; ao tocar, abre a seção com um "voltar" */
function ItemsView({ section, topic, group }) {
  const current = ITEM_SECTIONS.find((x) => x.id === section)

  if (!current) {
    return (
      <nav className="nav-list" aria-label="Items">
        {ITEM_SECTIONS.map((x) => (
          <a key={x.id} className="nav-row" href={`#items/${x.id}`}>
            <span className="nav-row-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {x.icon}
              </svg>
            </span>
            <span className="nav-row-text">
              <strong>{x.label}</strong>
              <span>{x.desc}</span>
            </span>
            {navChevron}
          </a>
        ))}
      </nav>
    )
  }

  return (
    <section className="item-page">
      <a className="nav-back" href="#items">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m15 6-6 6 6 6" />
        </svg>
        Items
      </a>
      <h1 className="item-page-title">{current.label}</h1>

      {current.topics ? (
        <ItemTopics section={current} topic={topic} group={group} />
      ) : (
        <div className="info-empty">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {current.icon}
          </svg>
          <strong>{current.label}</strong>
          <span>Em breve</span>
        </div>
      )}
    </section>
  )
}

function CraftingView() {
  const [openIds, setOpenIds] = useState(() => new Set())
  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <div className="crafting">
      <MaterialsMap />
      {CRAFTING_GROUPS.map((group) => (
        <section key={group.id} className="crafting-group">
          <h2 className="crafting-title">{group.label}</h2>
          <ul className="recipe-list">
            {group.recipes.map((r) => (
              <RecipeItem key={r.id} recipe={r} open={openIds.has(r.id)} onToggle={() => toggle(r.id)} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

// Armaduras e Joias estão fora da navegação por enquanto; InfoView fica pronta para quando voltarem.
function InfoView({ section, topic, group, onSection }) {
  const current = INFO_SECTIONS.find((x) => x.id === section)
  const currentTopic = current.topics?.find((t) => t.id === topic)
  const currentGroup = currentTopic?.groups?.find((g) => g.id === group)
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

      {current.topics && (
        <nav className="topicnav" aria-label={`Tópicos de ${current.label}`}>
          {current.topics.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`topicnav-item ${t.id === topic ? 'active' : ''}`}
              aria-current={t.id === topic ? 'page' : undefined}
              onClick={() => onSection(current.id, t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      )}

      {currentTopic?.groups && (
        <nav className="groupnav" aria-label={`${currentTopic.label} por castelo`}>
          {currentTopic.groups.map((g) => (
            <button
              key={g.id}
              type="button"
              className={`groupnav-item ${g.id === group ? 'active' : ''}`}
              style={{ '--group-color': g.color }}
              aria-current={g.id === group ? 'page' : undefined}
              onClick={() => onSection(current.id, currentTopic.id, g.id)}
            >
              <span className="groupnav-dot" />
              {g.label}
            </button>
          ))}
        </nav>
      )}

      <section key={`${current.id}-${topic}-${group}`} className="info-section">
        {currentGroup ? (
          <div className="jewel-grid" style={{ '--group-color': currentGroup.color }}>
            {currentGroup.items.map((item) => (
              <JewelCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="info-empty">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {current.icon}
            </svg>
            <strong>{currentTopic ? `${current.label} · ${currentTopic.label}` : current.label}</strong>
            <span>Em breve</span>
          </div>
        )}
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

// Servidor usado no mapa de guerra
const WAR_WORLD = 'ra'

// Horários fixos do último respawn informado; os próximos são calculados de 61 em 61 horas
const SPAWNS = Object.fromEntries(BOSSES.map((b) => [b.id, Date.parse(b.lastSpawn)]))

export default function App() {
  const now = useNow()
  const spawns = SPAWNS
  const [tab, goTo, route] = useHashTab()
  const warStatus = useWarStatus(WAR_WORLD)

  const rows = useMemo(
    () =>
      BOSSES.map((b) => ({ boss: b, cycle: getCycle(spawns[b.id], now) })).sort(
        (a, b) => a.cycle.next - b.cycle.next,
      ),
    [spawns, now],
  )

  return (
    <div className="app">
      <main key={tab} className="view">
        {tab === 'inicio' && <HomeView
            rows={rows}
            now={now}
            onOpenEpics={() => goTo('epicos')}
            war={{ world: WAR_WORLD, status: warStatus }}
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

        {tab === 'crafting' && <CraftingView />}

        {tab === 'items' && <ItemsView section={route.itemSection} topic={route.itemTopic} group={route.itemGroup} />}
      </main>

      {(tab === 'inicio' || tab === 'epicos') && (
        <footer className="foot">
          Horários no fuso do seu dispositivo · {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </footer>
      )}

      <TabBar active={tab} onChange={goTo} />
    </div>
  )
}
