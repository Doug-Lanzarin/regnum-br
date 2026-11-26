// Armas de Magnanita por classe, transcritas da imagem do jogo ("Armas de Magnanita") e traduzidas.
// Separadas em Nível 55 (Arcano) e Nível 45 (Artesão).

const icon = (id) => `./magnanita/armas/${id}.png`

const N55 = 'Nível 55 · Arcano'
const N45 = 'Nível 45 · Artesão'

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

// valores comuns de cada classe/nível
const tier = (cls, section, req, common) => (id, name, o) =>
  w(id, name, section, { cls, req, durability: section === N55 ? '246' : '218', ...common, ...o })

const arq55 = tier('Arqueiro', N55, 55, { bonus: 39, crit: 42, weight: '6 Kg' })
const arq45 = tier('Arqueiro', N45, 45, { bonus: 36, crit: 40, weight: '6 Kg' })
const mag55 = tier('Mago', N55, 55, { bonus: 24, crit: 26, weight: '6 Kg' })
const mag45 = tier('Mago', N45, 45, { bonus: 22, crit: 24, weight: '6 Kg' })
const bar55 = tier('Bárbaro', N55, 55, { bonus: 48, crit: 52, weight: '15 Kg' })
const bar45 = tier('Bárbaro', N45, 45, { bonus: 44, crit: 48, weight: '15 Kg' })
const cav55 = tier('Cavaleiro', N55, 55, { bonus: 48, crit: 52, weight: '8 Kg' })
const cav45 = tier('Cavaleiro', N45, 45, { bonus: 44, crit: 48, weight: '8 Kg' })

export const MAGNANITA_WEAPONS = [
  {
    id: 'arqueiro',
    label: 'Arqueiro',
    color: '#7bd389',
    items: [
      arq55('arco-arcano', 'Arco Ancestral de Magnanita (Arcano)', {
        dmg: ['perfurante', '97-117'], category: 'Arcos curtos', speed: 'Média', range: 25, level: 65,
      }),
      arq55('arco-longo-arcano', 'Arco Longo Ancestral de Magnanita (Arcano)', {
        dmg: ['perfurante', '123-138'], category: 'Arcos longos', speed: 'Lenta', range: 30, level: 66,
      }),
      arq45('arco-artesao', 'Arco Ancestral de Magnanita (Artesão)', {
        dmg: ['perfurante', '85-103'], category: 'Arcos curtos', speed: 'Média', range: 25, level: 58,
      }),
      arq45('arco-longo-artesao', 'Arco Longo Ancestral de Magnanita (Artesão)', {
        dmg: ['perfurante', '100-118'], category: 'Arcos longos', speed: 'Lenta', range: 30, level: 57,
      }),
    ],
  },
  {
    id: 'mago',
    label: 'Mago',
    color: '#8fb8ff',
    items: [
      mag55('cajado-arcano', 'Cajado Ancestral de Magnanita (Arcano)', {
        dmg: ['eletrico', '48-57'], category: 'Cajados', speed: 'Rápida', range: 25, level: 66,
      }),
      mag45('cajado-artesao', 'Cajado Ancestral de Magnanita (Artesão)', {
        dmg: ['eletrico', '42-60'], category: 'Cajados', speed: 'Rápida', range: 20, level: 59,
      }),
      mag45('cajado-ardente-artesao', 'Cajado Ígneo Ancestral de Magnanita (Artesão)', {
        dmg: ['fogo', '54-65'], category: 'Cajados', speed: 'Média', range: 30, level: 59,
      }),
    ],
  },
  {
    id: 'barbaro',
    label: 'Bárbaro',
    color: '#ff8a5c',
    items: [
      bar55('espada-2m-arcano', 'Espada Ancestral de Duas Mãos de Magnanita (Arcano)', {
        dmg: ['cortante', '323-351'], category: 'Espadas', speed: 'Média', level: 66,
      }),
      bar55('machado-2m-arcano', 'Machado Ancestral de Duas Mãos de Magnanita (Arcano)', {
        dmg: ['cortante', '395-445'], category: 'Machados', speed: 'Lenta', level: 65,
      }),
      bar55('lanca-2m-arcano', 'Lança Ancestral de Duas Mãos de Magnanita (Arcano)', {
        dmg: ['perfurante', '395-425'], category: 'Lanças', speed: 'Lenta', range: 2, level: 65,
      }),
      bar55('martelo-2m-arcano', 'Martelo Ancestral de Duas Mãos de Magnanita (Arcano)', {
        dmg: ['esmagamento', '395-445'], category: 'Martelos', speed: 'Lenta', level: 65,
      }),
      bar45('espada-2m-artesao', 'Espada Ancestral de Duas Mãos de Magnanita (Artesão)', {
        dmg: ['cortante', '264-280'], category: 'Espadas', speed: 'Média', level: 54,
      }),
      bar45('machado-2m-artesao', 'Machado Ancestral de Duas Mãos de Magnanita (Artesão)', {
        dmg: ['cortante', '329-351'], category: 'Machados', speed: 'Lenta', level: 53,
      }),
      bar45('lanca-2m-artesao', 'Lança Ancestral de Duas Mãos de Magnanita (Artesão)', {
        dmg: ['perfurante', '317-340'], category: 'Lanças', speed: 'Lenta', range: 2, level: 52,
      }),
      bar45('martelo-2m-artesao', 'Martelo Ancestral de Duas Mãos de Magnanita (Artesão)', {
        dmg: ['esmagamento', '329-351'], category: 'Martelos', speed: 'Lenta', level: 53,
      }),
    ],
  },
  {
    id: 'cavaleiro',
    label: 'Cavaleiro',
    color: '#ffb35c',
    items: [
      cav55('cav-espada-arcano', 'Espada Ancestral de Magnanita (Arcano)', {
        dmg: ['cortante', '173-189'], category: 'Espadas', speed: 'Rápida', level: 66,
      }),
      cav55('cav-machado-arcano', 'Machado Ancestral de Magnanita (Arcano)', {
        dmg: ['cortante', '235-250'], category: 'Machados', speed: 'Média', level: 65,
      }),
      cav55('cav-lanca-arcano', 'Lança Ancestral de Magnanita (Arcano)', {
        dmg: ['perfurante', '225-250'], category: 'Lanças', speed: 'Média', range: 2, level: 65,
      }),
      cav55('cav-martelo-arcano', 'Martelo Ancestral de Magnanita (Arcano)', {
        dmg: ['esmagamento', '225-260'], category: 'Martelos', speed: 'Média', level: 65,
      }),
      cav45('cav-espada-artesao', 'Espada Ancestral de Magnanita (Artesão)', {
        dmg: ['cortante', '144-162'], category: 'Espadas', speed: 'Rápida', level: 57,
      }),
      cav45('cav-machado-artesao', 'Machado Ancestral de Magnanita (Artesão)', {
        dmg: ['cortante', '190-210'], category: 'Machados', speed: 'Média', level: 54,
      }),
      cav45('cav-lanca-artesao', 'Lança Ancestral de Magnanita (Artesão)', {
        dmg: ['perfurante', '186-208'], category: 'Lanças', speed: 'Média', range: 2, level: 55,
      }),
      cav45('cav-martelo-artesao', 'Martelo Ancestral de Magnanita (Artesão)', {
        dmg: ['esmagamento', '190-210'], category: 'Martelos', speed: 'Média', level: 54,
      }),
    ],
  },
]
