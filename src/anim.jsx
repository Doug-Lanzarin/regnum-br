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

// brasas do fundo (posições fixas, geradas uma vez)
const EMBERS = Array.from({ length: 22 }, (_, i) => {
  const r = (n) => ((Math.sin(i * 91.7 + n * 47.3) * 24634.6345) % 1 + 1) % 1
  return {
    x: r(1) * 100,
    s: 2 + r(2) * 3,
    d: 14 + r(3) * 16,
    delay: r(4) * 30,
    drift: -40 + r(5) * 80,
    o: 0.25 + r(6) * 0.45,
  }
})

/** Brasas subindo devagar no fundo do app; `color` muda a cor (ex.: reino do próximo épico) */
export function EmberBackground({ color }) {
  return (
    <div className="embers" aria-hidden="true" style={{ '--ember': color }}>
      {EMBERS.map((e, i) => (
        <span
          key={i}
          style={{
            left: `${e.x}%`,
            width: e.s,
            height: e.s,
            animationDuration: `${e.d}s, ${2 + (i % 4)}s`,
            animationDelay: `${-e.delay}s, ${-(i % 5) * 0.7}s`,
            '--drift': `${e.drift}px`,
            '--o': e.o,
          }}
        />
      ))}
    </div>
  )
}
