// Armas de Magnanita por classe, transcritas das imagens do jogo e traduzidas.
// Separadas em Nível 55 (Arcano) e Nível 45 (Artesão). Durabilidade = máxima do item.

const icon = (id) => `./magnanita/armas/${id}.png`

const w = (id, name, section, o) => ({
  id,
  name,
  icon: icon(id),
  section,
  damage: { bonus: o.bonus, parts: [o.dmg] },
  category: o.category,
  speed: o.speed,
  range: o.range,
  durability: o.durability,
  weight: o.weight,
  itemLevel: o.level,
  requires: `${o.cls} Nível ${o.req}`,
  stats: [{ text: `Chance de crítico +${o.crit}%` }],
  sockets: 2,
})

const N55 = 'Nível 55 · Arcano'
const N45 = 'Nível 45 · Artesão'

const arc = (id, name, o) => w(id, name, N55, { durability: '278', req: 55, ...o })
const art = (id, name, o) => w(id, name, N45, { durability: '250', req: 45, ...o })

export const MAGNANITA_WEAPONS = [
  {
    id: 'arqueiro',
    label: 'Arqueiro',
    color: '#7bd389',
    items: [
      arc('arco-longo-arcano', 'Arco Longo Ancestral de Magnanita (Arcano)', {
        bonus: 56, dmg: ['perfurante', '123-138'], category: 'Arcos longos', speed: 'Lenta', range: 30, weight: '6 Kg', level: 74, cls: 'Arqueiro', crit: 70,
      }),
      arc('arco-arcano', 'Arco Ancestral de Magnanita (Arcano)', {
        bonus: 56, dmg: ['perfurante', '97-117'], category: 'Arcos curtos', speed: 'Média', range: 25, weight: '6 Kg', level: 73, cls: 'Arqueiro', crit: 70,
      }),
      art('arco-longo-artesao', 'Arco Longo Ancestral de Magnanita (Artesão)', {
        bonus: 52, dmg: ['perfurante', '100-118'], category: 'Arcos longos', speed: 'Lenta', range: 30, weight: '6 Kg', level: 64, cls: 'Arqueiro', crit: 66,
      }),
      art('arco-artesao', 'Arco Ancestral de Magnanita (Artesão)', {
        bonus: 52, dmg: ['perfurante', '85-103'], category: 'Arcos curtos', speed: 'Média', range: 25, weight: '6 Kg', level: 67, cls: 'Arqueiro', crit: 66,
      }),
    ],
  },
  {
    id: 'barbaro',
    label: 'Bárbaro',
    color: '#ff8a5c',
    items: [
      arc('lanca-2m-arcano', 'Lança Ancestral de Duas Mãos de Magnanita (Arcano)', {
        bonus: 69, dmg: ['perfurante', '395-425'], category: 'Lanças', speed: 'Lenta', range: 2, weight: '15 Kg', level: 68, cls: 'Bárbaro', crit: 86,
      }),
      arc('machado-2m-arcano', 'Machado Ancestral de Duas Mãos de Magnanita (Arcano)', {
        bonus: 69, dmg: ['cortante', '395-445'], category: 'Machados', speed: 'Lenta', weight: '15 Kg', level: 68, cls: 'Bárbaro', crit: 86,
      }),
      arc('martelo-2m-arcano', 'Martelo Ancestral de Duas Mãos de Magnanita (Arcano)', {
        bonus: 69, dmg: ['esmagamento', '395-445'], category: 'Martelos', speed: 'Lenta', weight: '15 Kg', level: 68, cls: 'Bárbaro', crit: 86,
      }),
      arc('espada-2m-arcano', 'Espada Ancestral de Duas Mãos de Magnanita (Arcano)', {
        bonus: 69, dmg: ['cortante', '323-351'], category: 'Espadas', speed: 'Média', weight: '15 Kg', level: 70, cls: 'Bárbaro', crit: 86,
      }),
      arc('maca-2m-arcano', 'Maça Ancestral de Duas Mãos de Magnanita (Arcano)', {
        bonus: 69, dmg: ['esmagamento', '306-348'], category: 'Maças', speed: 'Média', weight: '9 Kg', level: 68, cls: 'Bárbaro', crit: 86,
      }),
      arc('martelo-mao-arcano', 'Martelo Ancestral de Mão Secundária de Magnanita (Arcano)', {
        bonus: 69, dmg: ['esmagamento', '95-115'], category: 'Martelos', speed: 'Média', weight: '8 Kg', level: 92, cls: 'Bárbaro', crit: 86,
      }),
      arc('espada-mao-arcano', 'Espada Ancestral de Mão Secundária de Magnanita (Arcano)', {
        bonus: 69, dmg: ['cortante', '95-115'], category: 'Espadas', speed: 'Média', weight: '8 Kg', level: 92, cls: 'Bárbaro', crit: 86,
      }),
      arc('maca-mao-arcano', 'Maça Ancestral de Mão Secundária de Magnanita (Arcano)', {
        bonus: 69, dmg: ['esmagamento', '95-115'], category: 'Maças', speed: 'Média', weight: '6 Kg', level: 92, cls: 'Bárbaro', crit: 86,
      }),
      art('lanca-2m-artesao', 'Lança Ancestral de Duas Mãos de Magnanita (Artesão)', {
        bonus: 65, dmg: ['perfurante', '317-340'], category: 'Lanças', speed: 'Lenta', range: 2, weight: '15 Kg', level: 56, cls: 'Bárbaro', crit: 82,
      }),
      art('machado-2m-artesao', 'Machado Ancestral de Duas Mãos de Magnanita (Artesão)', {
        bonus: 65, dmg: ['cortante', '329-351'], category: 'Machados', speed: 'Lenta', weight: '15 Kg', level: 56, cls: 'Bárbaro', crit: 82,
      }),
      art('martelo-2m-artesao', 'Martelo Ancestral de Duas Mãos de Magnanita (Artesão)', {
        bonus: 65, dmg: ['esmagamento', '329-351'], category: 'Martelos', speed: 'Lenta', weight: '15 Kg', level: 56, cls: 'Bárbaro', crit: 82,
      }),
      art('espada-2m-artesao', 'Espada Ancestral de Duas Mãos de Magnanita (Artesão)', {
        bonus: 65, dmg: ['cortante', '264-280'], category: 'Espadas', speed: 'Média', weight: '15 Kg', level: 58, cls: 'Bárbaro', crit: 82,
      }),
    ],
  },
  {
    id: 'mago',
    label: 'Mago',
    color: '#8fb8ff',
    items: [
      arc('cajado-arcano', 'Cajado Ancestral de Magnanita (Arcano)', {
        bonus: 35, dmg: ['eletrico', '48-57'], category: 'Cajados', speed: 'Rápida', range: 25, weight: '6 Kg', level: 78, cls: 'Mago', crit: 44,
      }),
      art('cajado-ardente-artesao', 'Cajado Ancestral Ardente de Magnanita (Artesão)', {
        bonus: 33, dmg: ['fogo', '54-65'], category: 'Cajados', speed: 'Média', range: 30, weight: '6 Kg', level: 68, cls: 'Mago', crit: 42,
      }),
      art('cajado-artesao', 'Cajado Ancestral de Magnanita (Artesão)', {
        bonus: 33, dmg: ['eletrico', '42-60'], category: 'Cajados', speed: 'Rápida', range: 20, weight: '6 Kg', level: 70, cls: 'Mago', crit: 42,
      }),
    ],
  },
]
