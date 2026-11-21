import { useEffect, useState } from 'react'
import { RESPAWN_MS } from './bosses.js'
import { XYMERALD_RESET_INTERVAL_MS, nextXymeraldReset } from './xymerald.js'

const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

/** Avisos antes de cada épico e de cada reset do Xymerald (em minutos) */
export const LEAD_MINUTES = [30, 15, 0]

/** Quests WM: todo dia às 23:45 no horário de Brasília (UTC-3, sem horário de verão) */
const BRASILIA_OFFSET = 3 * HOUR
const WM_HOUR = 23
const WM_MINUTE = 45

/** Um aviso dispara se a página o "vê" até 3 min depois do horário (abas em segundo plano atualizam mais devagar) */
const FIRE_WINDOW = 3 * MIN

const TITLE = 'Regnum Boss Timer'
const PREF_KEY = 'regnum-br:alerts-enabled'
const SENT_KEY = 'regnum-br:alerts-sent'

/** Próximas 23:45 de Brasília, e a anterior */
function wmTimes(now) {
  const brt = new Date(now - BRASILIA_OFFSET)
  const today = Date.UTC(brt.getUTCFullYear(), brt.getUTCMonth(), brt.getUTCDate(), WM_HOUR, WM_MINUTE) + BRASILIA_OFFSET
  return [today - DAY, today, today + DAY]
}

const leadText = (m) => (m === 0 ? '' : ` em ${m} minutos`)

/** Lista todos os avisos próximos do momento atual */
export function buildAlerts(now, bosses) {
  const alerts = []

  for (const { boss, cycle } of bosses) {
    for (const spawn of [cycle.prev, cycle.next, cycle.next + RESPAWN_MS]) {
      for (const lead of LEAD_MINUTES) {
        alerts.push({
          key: `boss:${boss.id}:${spawn}:${lead}`,
          at: spawn - lead * MIN,
          body:
            lead === 0
              ? `${boss.name} nasceu em ${boss.realm}!`
              : `${boss.name} nasce${leadText(lead)} (${boss.realm})`,
        })
      }
    }
  }

  const xyNext = nextXymeraldReset(now)
  for (const reset of [xyNext - XYMERALD_RESET_INTERVAL_MS, xyNext]) {
    for (const lead of LEAD_MINUTES) {
      alerts.push({
        key: `xymerald:${reset}:${lead}`,
        at: reset - lead * MIN,
        body: lead === 0 ? 'Xymerald resetou!' : `Xymerald reseta${leadText(lead)}`,
      })
    }
  }

  for (const at of wmTimes(now)) {
    alerts.push({ key: `wm:${at}`, at, body: 'Entregar as quests WMs' })
  }

  return alerts
}

/** Avisos já enviados (chave → horário), para não repetir ao recarregar a página */
function loadSent() {
  try {
    return JSON.parse(localStorage.getItem(SENT_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveSent(sent, now) {
  try {
    const keep = Object.fromEntries(Object.entries(sent).filter(([, at]) => at > now - 2 * DAY))
    localStorage.setItem(SENT_KEY, JSON.stringify(keep))
  } catch {
    /* ignora */
  }
}

export const notificationsSupported = () => typeof window !== 'undefined' && 'Notification' in window

/** Mostra a notificação pelo service worker (obrigatório no iPhone) ou direto pelo navegador */
export async function showAlert(body) {
  const options = { body, icon: './icon-192.png', badge: './icon-192.png', tag: body }
  try {
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null
    if (reg) return await reg.showNotification(TITLE, options)
  } catch {
    /* tenta do jeito simples abaixo */
  }
  try {
    new Notification(TITLE, options)
  } catch {
    /* sem suporte */
  }
}

function readPref() {
  try {
    return localStorage.getItem(PREF_KEY) === '1'
  } catch {
    return false
  }
}

export function useAlerts(now, bosses) {
  const [enabled, setEnabled] = useState(
    () => notificationsSupported() && Notification.permission === 'granted' && readPref(),
  )

  useEffect(() => {
    if (!enabled) return
    const sent = loadSent()
    let changed = false
    for (const a of buildAlerts(now, bosses)) {
      if (now >= a.at && now - a.at <= FIRE_WINDOW && !(a.key in sent)) {
        sent[a.key] = a.at
        changed = true
        showAlert(a.body)
      }
    }
    if (changed) saveSent(sent, now)
  }, [enabled, now, bosses])

  const toggle = async () => {
    if (!notificationsSupported()) return
    if (enabled) {
      setEnabled(false)
      try {
        localStorage.setItem(PREF_KEY, '0')
      } catch {
        /* ignora */
      }
      return
    }
    const perm = await Notification.requestPermission()
    const ok = perm === 'granted'
    setEnabled(ok)
    try {
      localStorage.setItem(PREF_KEY, ok ? '1' : '0')
    } catch {
      /* ignora */
    }
    if (ok) showAlert('Alertas ativados! Avisos 30 min, 15 min e na hora dos épicos e do Xymerald, e às 23:45 para entregar as quests WMs.')
  }

  return { enabled, toggle, permission: notificationsSupported() ? Notification.permission : 'unsupported' }
}
