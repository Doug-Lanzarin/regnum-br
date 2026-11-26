import { useEffect, useState } from 'react'
import { audrWindow } from './audrWindow.js'

const when = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

function countdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const d = Math.floor(s / 86400)
  const h = Math.floor((s % 86400) / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (d) return `${d}d ${h}h ${m}m`
  if (h) return `${h}h ${m}m`
  return `${m}m ${sec}s`
}

/** Página mostrada em /audr quando o Audr está fechado */
export default function AudrOff() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const w = audrWindow(now)

  // abriu enquanto a página estava aberta: vai direto para o mapa
  useEffect(() => {
    if (w.open) window.location.replace('/#audr')
  }, [w.open])

  return (
    <main className="audr-off">
      <div className="audr-off-card">
        <img src="./audr/audr-npc.png" alt="Audr, Regnum Coins Merchant" className="audr-off-npc" width="212" height="309" />
        <span className="audr-off-badge">
          <span className="audr-off-dot" /> Offline
        </span>
        <h1>O Audr está off</h1>
        <p>
          O mapa do Audr fica disponível de <b>sexta às 12:00</b> até <b>domingo às 16:00</b> (horário de Brasília).
        </p>
        <div className="audr-off-next">
          <span>Abre em</span>
          <strong>{countdown(w.nextStart - now)}</strong>
          <small>{when.format(new Date(w.nextStart))}</small>
        </div>
        <a className="audr-btn audr-off-home" href="/">
          Ir para o início
        </a>
      </div>
    </main>
  )
}
