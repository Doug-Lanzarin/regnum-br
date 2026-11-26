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
