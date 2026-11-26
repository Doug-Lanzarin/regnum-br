// Janela do Audr no horário de Brasília (UTC-3, sem horário de verão).
// Normal: de sexta 12:00 até domingo 16:00.
// TESTE: abrindo na quinta 08:00 — para voltar ao normal, troque OPEN_AT por FRIDAY_NOON.
// Usado tanto no site quanto na função do servidor (api/audr.js).

const HOUR = 3600 * 1000
const DAY = 24 * HOUR
const BRT = -3 * HOUR

// tempos contados a partir de quinta 00:00 (Brasília)
const THURSDAY_8AM = 8 * HOUR
const FRIDAY_NOON = DAY + 12 * HOUR // eslint-disable-line no-unused-vars
const OPEN_AT = THURSDAY_8AM
const CLOSE_AT = 3 * DAY + 16 * HOUR // domingo 16:00

/** Início e fim da janela da semana de `now`, em ms UTC */
function windowOf(now) {
  const local = new Date(now + BRT) // relógio de Brasília expresso em UTC
  const dow = local.getUTCDay() // 0 = domingo ... 4 = quinta
  const midnight = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - BRT
  const daysSinceThursday = (dow + 3) % 7 // quinta = 0, sexta = 1, ..., quarta = 6
  const thursday = midnight - daysSinceThursday * DAY
  return { start: thursday + OPEN_AT, end: thursday + CLOSE_AT }
}

/** Situação da janela: { open, start, end, nextStart } */
export function audrWindow(now = Date.now()) {
  const w = windowOf(now)
  const open = now >= w.start && now < w.end
  const nextStart = now < w.start ? w.start : w.start + 7 * DAY
  return { open, start: w.start, end: w.end, nextStart }
}
