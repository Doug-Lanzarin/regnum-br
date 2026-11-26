import { useCallback, useEffect, useRef, useState } from 'react'

const MIN_ZOOM = 1
const MAX_ZOOM = 6
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

/** Zoom e arraste do mapa (roda do mouse, pinça no celular, botões) */
function usePanZoom(ref) {
  const [view, setView] = useState({ s: 1, x: 0, y: 0 })
  const pointers = useRef(new Map())
  const gesture = useRef(null)

  const fit = useCallback((s, x, y) => {
    const el = ref.current
    if (!el) return { s, x, y }
    const w = el.clientWidth
    const h = el.clientHeight
    s = clamp(s, MIN_ZOOM, MAX_ZOOM)
    return { s, x: clamp(x, w - w * s, 0), y: clamp(y, h - h * s, 0) }
  }, [ref])

  /** zoom mantendo o ponto (cx, cy) do container parado */
  const zoomAt = useCallback((factor, cx, cy) => {
    setView((v) => {
      const s = clamp(v.s * factor, MIN_ZOOM, MAX_ZOOM)
      const k = s / v.s
      return fit(s, cx - (cx - v.x) * k, cy - (cy - v.y) * k)
    })
  }, [fit])

  const local = (e) => {
    const r = ref.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onWheel = (e) => {
      e.preventDefault()
      const p = local(e)
      zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, p.x, p.y)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [ref, zoomAt])

  const handlers = {
    onPointerDown: (e) => {
      ref.current.setPointerCapture?.(e.pointerId)
      pointers.current.set(e.pointerId, local(e))
      const pts = [...pointers.current.values()]
      gesture.current = { moved: 0, start: pts.map((p) => ({ ...p })), view: null, last: pts[0] }
      setView((v) => {
        gesture.current.view = v
        return v
      })
    },
    onPointerMove: (e) => {
      if (!pointers.current.has(e.pointerId) || !gesture.current) return
      const prev = pointers.current.get(e.pointerId)
      const p = local(e)
      pointers.current.set(e.pointerId, p)
      const g = gesture.current
      g.moved += Math.hypot(p.x - prev.x, p.y - prev.y)
      const pts = [...pointers.current.values()]
      if (pts.length >= 2 && g.start.length >= 2) {
        const [a, b] = pts
        const [a0, b0] = g.start
        const d0 = Math.hypot(b0.x - a0.x, b0.y - a0.y) || 1
        const d = Math.hypot(b.x - a.x, b.y - a.y)
        const c0 = { x: (a0.x + b0.x) / 2, y: (a0.y + b0.y) / 2 }
        const c = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
        const v = g.view
        const s = clamp(v.s * (d / d0), MIN_ZOOM, MAX_ZOOM)
        const k = s / v.s
        setView(fit(s, c.x - (c0.x - v.x) * k, c.y - (c0.y - v.y) * k))
      } else if (pts.length === 1) {
        setView((v) => fit(v.s, v.x + (p.x - prev.x), v.y + (p.y - prev.y)))
      }
    },
    onPointerUp: (e) => {
      pointers.current.delete(e.pointerId)
      if (pointers.current.size > 0 && gesture.current) {
        const pts = [...pointers.current.values()]
        gesture.current.start = pts.map((q) => ({ ...q }))
        setView((v) => {
          gesture.current.view = v
          return v
        })
      }
    },
  }
  handlers.onPointerCancel = handlers.onPointerUp

  const zoomBy = (factor) => {
    const el = ref.current
    zoomAt(factor, el.clientWidth / 2, el.clientHeight / 2)
  }
  const reset = () => setView({ s: 1, x: 0, y: 0 })
  /** true se o último toque foi um clique (quase sem arrastar e com 1 dedo) */
  const wasTap = () => (gesture.current?.moved ?? 0) < 8 && (gesture.current?.start.length ?? 1) === 1

  return { view, handlers, zoomBy, reset, wasTap }
}

const POLL_MS = 5000
const RATIO = 1278 / 1425
const time = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
const when = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

/** Mapa do Audr: uma única marcação compartilhada; quem confirma substitui a anterior */
export default function Audr() {
  const [state, setState] = useState({ loading: true, mark: null, error: null, persistent: true, end: null })
  const [pending, setPending] = useState(null)
  const [saving, setSaving] = useState(false)
  const mapRef = useRef(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('./api/audr', { cache: 'no-store' })
      const data = await res.json()
      setState((s) => ({ ...s, loading: false, mark: data.mark, persistent: data.persistent, end: data.end, error: null }))
    } catch {
      setState((s) => ({ ...s, loading: false, error: 'Sem conexão com o servidor. Tentando de novo…' }))
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(() => document.visibilityState === 'visible' && load(), POLL_MS)
    const onVis = () => document.visibilityState === 'visible' && load()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [load])

  const pz = usePanZoom(mapRef)
  const { view } = pz

  const pick = (e) => {
    if (!pz.wasTap()) return
    const r = mapRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left - view.x) / (r.width * view.s)
    const y = (e.clientY - r.top - view.y) / (r.height * view.s)
    if (x >= 0 && x <= 1 && y >= 0 && y <= 1) setPending({ x, y })
  }

  const confirm = async () => {
    if (!pending) return
    setSaving(true)
    try {
      const res = await fetch('./api/audr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pending),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Não foi possível salvar.')
      setState((s) => ({ ...s, mark: data.mark, error: null }))
      setPending(null)
    } catch (err) {
      setState((s) => ({ ...s, error: err.message }))
    } finally {
      setSaving(false)
    }
  }

  const { mark } = state

  return (
    <section className="audr">
      <div className="audr-head">
        <div>
          <h1 className="audr-title">Audr</h1>
          <p className="audr-sub">
            {state.loading
              ? 'Carregando…'
              : mark
                ? `Marcado às ${time.format(new Date(mark.at))}`
                : 'Nenhuma marcação ainda. Toque no mapa para marcar.'}
          </p>
        </div>
        {state.end && <span className="audr-until">Aberto até {when.format(new Date(state.end))}</span>}
      </div>

      <div
        className="audr-map"
        ref={mapRef}
        style={{ aspectRatio: RATIO }}
        onClick={pick}
        {...pz.handlers}
        role="presentation"
      >
        <div
          className="audr-layer"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.s})`, '--inv': 1 / view.s }}
        >
          <img src="./audr/mapa.jpg" alt="Mapa do Audr" draggable="false" />
          {mark && (
            <span className="audr-pin" style={{ left: `${mark.x * 100}%`, top: `${mark.y * 100}%` }} aria-label="Marcação atual" />
          )}
          {pending && (
            <span className="audr-pin pending" style={{ left: `${pending.x * 100}%`, top: `${pending.y * 100}%` }} aria-label="Nova marcação" />
          )}
        </div>

        <div className="audr-zoom" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          <button type="button" aria-label="Aproximar" onClick={() => pz.zoomBy(1.5)} disabled={view.s >= MAX_ZOOM}>
            +
          </button>
          <button type="button" aria-label="Afastar" onClick={() => pz.zoomBy(1 / 1.5)} disabled={view.s <= MIN_ZOOM}>
            −
          </button>
          {view.s > 1 && (
            <button type="button" aria-label="Ver mapa inteiro" className="reset" onClick={pz.reset}>
              ⤢
            </button>
          )}
        </div>
      </div>
      <p className="audr-hint">
        Use dois dedos ou a roda do mouse para dar zoom e arraste para mover. Toque para marcar.
      </p>

      {pending && (
        <div className="audr-confirm" role="dialog" aria-label="Confirmar marcação">
          <span>{mark ? 'Substituir a marcação atual por esta posição?' : 'Marcar esta posição para todos?'}</span>
          <div className="audr-actions">
            <button type="button" className="audr-btn ghost" onClick={() => setPending(null)} disabled={saving}>
              Cancelar
            </button>
            <button type="button" className="audr-btn" onClick={confirm} disabled={saving}>
              {saving ? 'Salvando…' : 'Confirmar'}
            </button>
          </div>
        </div>
      )}

      {state.error && <p className="audr-error">{state.error}</p>}
      {!state.persistent && !state.loading && (
        <p className="audr-error">
          Banco de dados não configurado: a marcação ainda não é compartilhada entre os usuários.
        </p>
      )}
      <p className="audr-note">Só existe uma marcação: quem confirma uma nova substitui a anterior. Mapa: REDO.</p>
    </section>
  )
}
