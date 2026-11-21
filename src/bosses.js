// Tempo de respawn de cada chefe: 61 horas
export const RESPAWN_HOURS = 61
export const RESPAWN_MS = RESPAWN_HOURS * 60 * 60 * 1000

// Horários informados no fuso de Brasília (UTC-03:00)
export const BOSSES = [
  {
    id: 'evendim',
    name: 'Evendim',
    realm: 'Syrtis',
    color: '#5cc492',
    lastSpawn: '2026-11-20T17:58:00-03:00',
  },
  {
    id: 'thorkul',
    name: 'Thorkul',
    realm: 'Alsius',
    color: '#6ea6f2',
    lastSpawn: '2026-11-20T04:00:00-03:00',
  },
  {
    id: 'daenrha',
    name: 'Daen Rha',
    realm: 'Ignis',
    color: '#ee7a66',
    lastSpawn: '2026-11-18T15:12:00-03:00',
  },
]

/**
 * Calcula o ciclo atual de um chefe.
 * Se já se passaram vários ciclos desde o último registro,
 * projeta os spawns seguintes de 61 em 61 horas.
 */
export function getCycle(lastSpawnMs, now) {
  const elapsed = now - lastSpawnMs
  const cycles = elapsed > 0 ? Math.floor(elapsed / RESPAWN_MS) : 0
  const prev = lastSpawnMs + cycles * RESPAWN_MS
  const next = elapsed < 0 ? lastSpawnMs : prev + RESPAWN_MS
  const remaining = Math.max(0, next - now)
  const progress = elapsed < 0 ? 0 : Math.min(1, (now - prev) / RESPAWN_MS)
  return { prev, next, remaining, progress, projected: cycles > 0 }
}

export function splitDuration(ms) {
  const total = Math.floor(ms / 1000)
  return {
    h: Math.floor(total / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  }
}

export const pad = (n) => String(n).padStart(2, '0')

export function formatShort(ms) {
  const { h, m, s } = splitDuration(ms)
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(ms) {
  return dateFmt.format(new Date(ms)).replace('.', '')
}
