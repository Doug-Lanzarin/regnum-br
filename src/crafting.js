// Receitas de crafting, transcritas dos prints do jogo.
// Nomes em espanhol foram traduzidos para o português; nomes em inglês ficaram como no jogo.
// time = tempo para craftar em segundos; chance = probabilidade de êxito (%).

const icon = (id) => `./crafting/${id}.png`

// Materiais (com ícone quando já foi recortado de um print)
const M = {
  minerioFerro: { name: 'Minério de ferro', icon: icon('mineral-de-ferro') },
  carbonOre: { name: 'Carbon ore' },
  hickory: { name: 'Hickory wood log' },
  coal: { name: 'Coal' },
  essencia: { name: 'Essência de inimigo' },
  enemyBones: { name: 'Enemy bones' },
  bastaoLinho: { name: 'Bastão de linho' },
  capsulasAlgodao: { name: 'Cápsulas de algodão' },
  sabaoSeiva: { name: 'Sabão de seiva de árvore' },
  casuloSeda: { name: 'Casulo de seda' },
  resin: { name: 'Resin' },
  treeSap: { name: 'Tree sap' },
  titaniumOre: { name: 'Titanium ore' },
  titaniumIngot: { name: 'Titanium ingot' },
  xymeraldOre: { name: 'Xymerald ore', icon: './xymerald.png' },
  lesser: { name: 'Lesser enchantment', icon: icon('lesser-enchantment') },
  ench: { name: 'Enchantment' },
}
const LESSER = M.lesser
const ENCH = M.ench
const XYMERALD = { name: 'Xymerald' }

const MIN = 60
const T_26_40 = 26 * MIN + 40
const T_1_50 = 110 * MIN
const T_5_32 = 5 * 3600 + 32 * MIN

/** Lista de materiais: mats([M.coal, 2], [M.lesser, 1]) */
const mats = (...list) => list.map(([m, qty]) => ({ ...m, qty }))

/** Receita base: rec(id, nome, nível, êxito %, tempo em s, materiais, ícone?) */
const rec = (id, name, level, chance, time, materials, img) => ({
  id,
  name,
  level,
  chance,
  time,
  materials,
  ...(img ? { icon: icon(img) } : {}),
})

/** Aprimoramento padrão: 10× material principal + 5× encantamento */
const up = (id, name, chance, time, main, ench = LESSER) => ({
  id,
  name,
  chance,
  time,
  materials: [
    { ...main, qty: 10 },
    { ...ench, qty: 5 },
  ],
})

export const CRAFTING_GROUPS = [
  {
    id: 'receitas',
    label: 'Receitas',
    recipes: [
      rec('barra-de-ferro', 'Barra de ferro', 28, 100, 48, mats([M.minerioFerro, 10]), 'barra-de-ferro'),
      rec('fine-wood-plank', 'Fine wood plank', 28, 100, 48, mats([M.hickory, 10])),
      rec('lesser-enchantment', 'Lesser enchantment', 34, 95, 4 * MIN, mats([M.essencia, 10]), 'lesser-enchantment'),
      rec('tecido-algodao-fino', 'Tecido de algodão fino', 34, 95, 2 * MIN, mats([M.bastaoLinho, 10], [M.capsulasAlgodao, 10]), 'tecido-de-algodao-fino'),
      rec('barra-de-aco', 'Barra de aço', 34, 95, 2 * MIN, mats([M.carbonOre, 10], [M.minerioFerro, 10]), 'barra-de-aco'),
      rec('hardened-wood-plank', 'Hardened wood plank', 34, 95, 2 * MIN, mats([M.carbonOre, 10], [M.hickory, 10]), 'hardened-wood-plank'),
      rec('enchantment', 'Enchantment', 40, 90, 8 * MIN, mats([M.enemyBones, 5], [M.essencia, 25])),
      rec('barra-de-aco-fino', 'Barra de aço fino', 40, 90, 4 * MIN, mats([M.minerioFerro, 10], [M.coal, 2], [M.lesser, 1]), 'barra-de-aco-fino'),
      rec('coal', 'Coal', 40, 90, 4 * MIN, mats([M.hickory, 5], [M.carbonOre, 10])),
      rec('tecido-trama-eterea', 'Tecido de trama etérea', 40, 90, 4 * MIN, mats([M.capsulasAlgodao, 10], [M.sabaoSeiva, 2], [M.lesser, 1])),
      rec('fine-hardened-wood-plank', 'Fine hardened wood plank', 40, 90, 4 * MIN, mats([M.hickory, 10], [M.coal, 2], [M.lesser, 1]), 'fine-hardened-wood-plank'),
      rec('tecido-seda-real', 'Tecido de seda real', 45, 80, 8 * MIN, mats([M.casuloSeda, 10], [M.sabaoSeiva, 2], [M.ench, 1])),
      rec('strengthened-wood-plank', 'Strengthened wood plank', 45, 80, 8 * MIN, mats([M.resin, 1], [M.hickory, 9], [M.coal, 2], [M.ench, 1])),
      rec('titanium-ingot', 'Titanium ingot', 45, 80, 8 * MIN, mats([M.titaniumOre, 10])),
      rec('alloy-steel-ingot', 'Alloy steel ingot', 45, 80, 8 * MIN, mats([M.titaniumIngot, 1], [M.minerioFerro, 9], [M.coal, 2], [M.ench, 1])),
      rec('resin', 'Resin', 45, 80, 8 * MIN, mats([M.treeSap, 10])),
      {
        ...rec('xymerald', 'Xymerald', 50, 50, 60 * MIN, mats([M.ench, 2], [M.xymeraldOre, 10])),
        icon: './xymerald.png',
      },
    ],
  },
  {
    id: 'aprimoramentos',
    label: 'Aprimoramentos de Materiais',
    recipes: [
      up('pano-tecido-tratado', 'Pano → Tecido Tratado', 95, T_26_40, {
        name: 'Tecido de algodão fino',
        icon: icon('tecido-de-algodao-fino'),
      }),
      up('madeira-tratada-endurecida', 'Madeira Tratada → Madeira Endurecida', 95, T_26_40, {
        name: 'Hardened wood plank',
        icon: icon('hardened-wood-plank'),
      }),
      up('ferro-aco', 'Ferro → Aço', 95, T_26_40, { name: 'Barra de aço', icon: icon('barra-de-aco') }),
      up('madeira-endurecida-fine-hardened', 'Madeira Endurecida → Fine hardened wood', 90, T_1_50, {
        name: 'Fine hardened wood plank',
        icon: icon('fine-hardened-wood-plank'),
      }),
      up('aco-aco-tratado', 'Aço → Aço Tratado', 90, T_1_50, {
        name: 'Barra de aço fino',
        icon: icon('barra-de-aco-fino'),
      }),
      up('tecido-tratado-eter-trancado', 'Tecido Tratado → Éter Trançado', 90, T_1_50, {
        name: 'Tecido de trama etérea',
      }),
      up('fine-hardened-strengthened', 'Fine hardened wood → Strengthened wood', 80, T_5_32, { name: 'Strengthened wood plank' }, ENCH),
      up('aco-tratado-aco-liga', 'Aço Tratado → Aço-Liga', 80, T_5_32, { name: 'Alloy steel ingot' }, ENCH),
      up('strengthened-lamina-xymerald', 'Strengthened wood → Lâmina de Xymerald', 50, T_5_32, XYMERALD, ENCH),
      up('aco-liga-xymerald', 'Aço-Liga → Xymerald', 50, T_5_32, XYMERALD, ENCH),
      up('eter-trancado-seda-real', 'Éter Trançado → Seda Real', 80, T_5_32, { name: 'Tecido de seda real' }, ENCH),
      up('seda-real-trancado-xymerald', 'Seda Real → Trançado de Xymerald', 50, T_5_32, XYMERALD, ENCH),
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
