// Pequenos componentes de animação reutilizáveis.

/** Texto que anima só os caracteres que mudaram (efeito de placar) */
export function RollingText({ text, className }) {
  const chars = String(text).split('')
  return (
    <span className={`roll ${className ?? ''}`} role="timer">
      {chars.map((ch, i) => (
        <span key={`${chars.length - i}-${ch}`} className="roll-ch">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

/** true se o épico reapareceu há pouco (até 15 min) */
export const JUST_SPAWNED_MS = 15 * 60 * 1000
