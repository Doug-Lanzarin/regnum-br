// Receitas de crafting, transcritas dos prints do jogo.
// Nomes em espanhol foram traduzidos para o português; nomes em inglês ficaram como no jogo.
// time = tempo para craftar em segundos; chance = probabilidade de êxito (%).

const icon = (id) => `./crafting/${id}.png`

const MAT = {
  mineralFerro: { name: 'Minério de ferro', icon: icon('mineral-de-ferro') },
  hardenedPlank: { name: 'Hardened wood plank', icon: icon('hardened-wood-plank') },
  fineHardenedPlank: { name: 'Fine hardened wood plank', icon: icon('fine-hardened-wood-plank') },
  lesserEnchantment: { name: 'Lesser enchantment', icon: icon('lesser-enchantment') },
  barraAco: { name: 'Barra de aço', icon: icon('barra-de-aco') },
  barraAcoFino: { name: 'Barra de aço fino', icon: icon('barra-de-aco-fino') },
}

export const CRAFTING_GROUPS = [
  {
    id: 'receitas',
    label: 'Receitas',
    recipes: [
      {
        id: 'barra-de-ferro',
        name: 'Barra de ferro',
        level: 28,
        icon: icon('barra-de-ferro'),
        chance: 100,
        time: 48,
        materials: [{ ...MAT.mineralFerro, qty: 10 }],
      },
    ],
  },
  {
    id: 'aprimoramentos',
    label: 'Aprimoramentos de Materiais',
    recipes: [
      {
        id: 'madeira-tratada-endurecida',
        name: 'Madeira Tratada → Madeira Endurecida',
        chance: 95,
        time: 26 * 60 + 40,
        materials: [
          { ...MAT.hardenedPlank, qty: 10 },
          { ...MAT.lesserEnchantment, qty: 5 },
        ],
      },
      {
        id: 'ferro-aco',
        name: 'Ferro → Aço',
        chance: 95,
        time: 26 * 60 + 40,
        materials: [
          { ...MAT.barraAco, qty: 10 },
          { ...MAT.lesserEnchantment, qty: 5 },
        ],
      },
      {
        id: 'madeira-endurecida-fine-hardened',
        name: 'Madeira Endurecida → Fine hardened wood',
        chance: 90,
        time: 60 * 60 + 50 * 60,
        materials: [
          { ...MAT.fineHardenedPlank, qty: 10 },
          { ...MAT.lesserEnchantment, qty: 5 },
        ],
      },
      {
        id: 'aco-aco-tratado',
        name: 'Aço → Aço Tratado',
        chance: 90,
        time: 60 * 60 + 50 * 60,
        materials: [
          { ...MAT.barraAcoFino, qty: 10 },
          { ...MAT.lesserEnchantment, qty: 5 },
        ],
      },
    ],
  },
]

/** 48 → "48s" · 1600 → "26min 40s" · 6600 → "1h 50min" */
export function formatCraftTime(sec) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return [h && `${h}h`, m && `${m}min`, s && `${s}s`].filter(Boolean).join(' ') || '0s'
}

/** 1600 → "00:26:40", como no jogo */
export function formatGameTime(sec) {
  const p = (n) => String(n).padStart(2, '0')
  return `${p(Math.floor(sec / 3600))}:${p(Math.floor((sec % 3600) / 60))}:${p(sec % 60)}`
}
