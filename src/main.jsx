import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import AudrOff from './AudrOff.jsx'
import { audrWindow } from './audrWindow.js'
import './styles.css'

// Link direto /audr: aberto → vai para a aba do mapa; fechado → página "Audr está off"
const isAudrPath = window.location.pathname.replace(/\/+$/, '') === '/audr'
let Root = App
if (isAudrPath) {
  if (audrWindow().open) window.history.replaceState(null, '', '/#audr')
  else Root = AudrOff
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)

// Os alertas foram removidos: desliga o service worker que eles usavam em quem já tinha instalado
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {})
}

// Efeito de "ondinha" ao tocar em botões e itens clicáveis
const RIPPLE_SEL = 'button, .nav-row, .groupnav-item, .mm-chip'
const RIPPLE_SKIP = '.mm-pin, .audr-zoom button, .topicnav-item'
document.addEventListener('pointerdown', (e) => {
  const el = e.target.closest(RIPPLE_SEL)
  if (!el || el.closest(RIPPLE_SKIP) || el.disabled) return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const r = el.getBoundingClientRect()
  const size = Math.max(r.width, r.height) * 2
  const dot = document.createElement('span')
  dot.className = 'ripple'
  dot.style.width = dot.style.height = `${size}px`
  dot.style.left = `${e.clientX - r.left - size / 2}px`
  dot.style.top = `${e.clientY - r.top - size / 2}px`
  el.classList.add('ripple-host')
  el.appendChild(dot)
  dot.addEventListener('animationend', () => dot.remove())
})
