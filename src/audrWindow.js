// Janela do Audr: de sexta 12:00 até domingo 16:00, horário de Brasília (UTC-3, sem horário de verão).
// Usado tanto no site quanto na função do servidor (api/audr.js).

const HOUR = 3600 * 1000
const DAY = 24 * HOUR
const BRT = -3 * HOUR

/** Início (sexta 12:00 BRT) e fim (domingo 16:00 BRT) da janela da semana de `now`, em ms UTC */
function windowOf(now) {
  const local = new Date(now + BRT) // relógio de Brasília expresso em UTC
  const dow = local.getUTCDay() // 0 = domingo ... 5 = sexta
  const midnight = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - BRT
  const daysSinceFriday = (dow + 2) % 7 // sexta = 0, sábado = 1, domingo = 2, segunda = 3 ...
  const friday = midnight - daysSinceFriday * DAY
  return { start: friday + 12 * HOUR, end: friday + 2 * DAY + 16 * HOUR }
}

/** Situação da janela: { open, start, end, nextStart } */
export function audrWindow(now = Date.now()) {
  const w = windowOf(now)
  const open = now >= w.start && now < w.end
  const nextStart = now < w.start ? w.start : w.start + 7 * DAY
  return { open, start: w.start, end: w.end, nextStart }
}
