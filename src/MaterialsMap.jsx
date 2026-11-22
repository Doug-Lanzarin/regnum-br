import { useState } from 'react'
import { WZ_MAP_RATIO, WZ_MATERIALS, WZ_ONLY_INSIDE } from './wzMaterials.js'

function MatIcon({ mat, size }) {
  if (mat.icon) return <img src={mat.icon} alt="" width={size} height={size} loading="lazy" />
  return (
    <span className="mm-icon-fallback" style={{ width: size, height: size }} aria-hidden="true">
      B
    </span>
  )
}

/** Mapa da zona de guerra: tocar num material destaca onde ele aparece */
export default function MaterialsMap() {
  const [selected, setSelected] = useState(null)
  const toggle = (id) => setSelected((cur) => (cur === id ? null : id))
  const current = WZ_MATERIALS.find((m) => m.id === selected)

  return (
    <section className="mm">
      <div className="mm-head">
        <div>
          <h2 className="crafting-title">Onde coletar na zona de guerra</h2>
          <p className="mm-hint">
            {current
              ? `${current.name}: ${current.spots.length} ${current.spots.length > 1 ? 'áreas' : 'área'} no mapa`
              : 'Toque num material para ver onde ele está'}
          </p>
        </div>
        {selected && (
          <button type="button" className="mm-clear" onClick={() => setSelected(null)}>
            Mostrar todos
          </button>
        )}
      </div>

      <div className="mm-chips" role="group" aria-label="Materiais">
        {WZ_MATERIALS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`mm-chip ${selected === m.id ? 'on' : ''} ${selected && selected !== m.id ? 'off' : ''}`}
            style={{ '--mat': m.color }}
            aria-pressed={selected === m.id}
            onClick={() => toggle(m.id)}
          >
            <MatIcon mat={m} size={26} />
            <span className="mm-chip-name">{m.name}</span>
            <span className="mm-chip-count">{m.spots.length}</span>
          </button>
        ))}
      </div>

      <div className="mm-map" style={{ aspectRatio: WZ_MAP_RATIO }}>
        <img className="mm-base" src="./wz-materiais/base.jpg" alt="Mapa da zona de guerra de Regnum" />
        {WZ_MATERIALS.map((m) => (
          <img
            key={m.id}
            className={`mm-layer ${!selected || selected === m.id ? 'show' : ''}`}
            src={m.overlay}
            alt=""
            style={{ left: `${m.bbox[0]}%`, top: `${m.bbox[1]}%`, width: `${m.bbox[2]}%`, height: `${m.bbox[3]}%` }}
          />
        ))}
        {WZ_MATERIALS.flatMap((m) =>
          m.spots.map(([x, y], i) => (
            <button
              key={`${m.id}-${i}`}
              type="button"
              className={`mm-pin ${selected === m.id ? 'active' : ''} ${selected && selected !== m.id ? 'hide' : ''}`}
              style={{ left: `${x}%`, top: `${y}%`, '--mat': m.color }}
              aria-label={m.name}
              title={`${m.name} (${m.game})`}
              onClick={() => toggle(m.id)}
            >
              <MatIcon mat={m} size={22} />
            </button>
          )),
        )}
      </div>

      <p className="mm-note">
        Só dentro dos reinos: {WZ_ONLY_INSIDE.join(', ')}. Mapa base: REDO.
      </p>
    </section>
  )
}
