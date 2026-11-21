// Mesma regra do Regnum Warlords (toolCountersEngine.ts):
// o Xymerald reseta a cada 23 horas, a partir de um reset confirmado.
// Como 23h não divide o dia, o horário do reset "anda" a cada ciclo — é esperado.
const HOUR_MS = 60 * 60 * 1000

export const XYMERALD_RESET_INTERVAL_MS = 23 * HOUR_MS

// Reset confirmado: 28/10/2026 às 15:00 no horário de Brasília (UTC-3)
const XYMERALD_RESET_ANCHOR_MS = Date.UTC(2026, 9, 28, 18, 0, 0)

/** Menor instante de reset estritamente depois de `now` */
export function nextReset(anchorMs, intervalMs, now) {
  const cyclesPassed = Math.floor((now - anchorMs) / intervalMs)
  return anchorMs + (cyclesPassed + 1) * intervalMs
}

export function nextXymeraldReset(now) {
  return nextReset(XYMERALD_RESET_ANCHOR_MS, XYMERALD_RESET_INTERVAL_MS, now)
}

// O horário é sempre mostrado em Brasília, igual ao Warlords
const brasiliaFmt = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
})

export function formatBrasilia(ms) {
  const text = brasiliaFmt.format(new Date(ms)).replace('.', '')
  return text.charAt(0).toUpperCase() + text.slice(1)
}
