import { useCallback, useEffect, useRef, useState } from 'react'

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

  const pick = (e) => {
    const r = mapRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
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

      <div className="audr-map" ref={mapRef} style={{ aspectRatio: RATIO }} onClick={pick} role="presentation">
        <img src="./audr/mapa.jpg" alt="Mapa do Audr" draggable="false" />
        {mark && (
          <span className="audr-pin" style={{ left: `${mark.x * 100}%`, top: `${mark.y * 100}%` }} aria-label="Marcação atual" />
        )}
        {pending && (
          <span className="audr-pin pending" style={{ left: `${pending.x * 100}%`, top: `${pending.y * 100}%` }} aria-label="Nova marcação" />
        )}
      </div>

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
