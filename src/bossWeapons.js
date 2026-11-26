// Armas de chefes por reino, transcritas da imagem do jogo e traduzidas.
// Cada chefe vira uma seção (Sambro, Satarco...) dentro da aba do reino.

const icon = (id) => `./chefes/${id}.png`
const W = './magnanita/moeda-w.png'
const ENC = { name: 'Encantamento', icon: icon('sambro-arco-longo-m0') }

/** materiais: lista de [nome, qtd]; ícones recortados na mesma ordem do print */
const mats = (card, list) =>
  list.map(([name, qty], i) => (i === 0 ? { ...ENC, qty } : { name, qty, icon: icon(`${card}-m${i}`) }))

const wpn = (id, boss, name, o) => ({
  id,
  name,
  icon: icon(id),
  section: boss,
  damage: { bonus: o.bonus, parts: [o.dmg] },
  category: o.category,
  speed: o.speed,
  range: o.range,
  durability: o.durability,
  weight: o.weight,
  itemLevel: o.level,
  requires: `${o.cls} Nível ${o.req}`,
  stats: o.stats.map((text) => ({ text })),
  craft: { materials: mats(id, o.mats) },
  cost: o.cost,
  coin: W,
  rarity: 'Superior',
})

const SAMBRO_MATS = (plank) => [['Encantamento', 2], ['Olho de Sambro', 10], ['Carapaça de Sambro', 40], ['Tábua de madeira endure…', plank], ['Bico de Sambro', 25], ['Alma de Sambro', 1]]
const SATARCO_MATS = (ingot) => [['Encantamento', 3], ['Olho de Satarco', 15], ['Espiga de Satarco', 50], ['Lingote de aço fino', ingot], ['Bracelete de Satarco', 30], ['Alma de Satarco', 1]]
const GRAJ_MATS = (ingot) => [['Encantamento', 2], ['Tecido de Graj', 10], ['Garra de Graj', 40], ['Lingote de aço fino', ingot], ['Venda de Graj', 25], ['Alma de Graj', 1]]
const KRONTARON_MATS = (ingot) => [['Encantamento', 3], ['Corrente de Krontaron', 15], ['Dente de Krontaron', 50], ['Lingote de aço fino', ingot], ['Caveira de Krontaron', 30], ['Alma de Krontaron', 1]]
const ADES_MATS = [['Encantamento', 2], ['Pelo de Ades', 10], ['Trapos de Ades', 40], ['Tábua de madeira endure…', 10], ['Olho de Ades', 25], ['Espírito de Ades', 1]]
const AYSOR_MATS = (ingot) => [['Encantamento', 3], ['Chifre de Aysor', 15], ['Barba de Aysor', 50], ['Lingote de aço fino', ingot], ['Dente de Aysor', 30], ['Alma de Aysor', 1]]

const ARQ = ['Destreza +5', 'Resistir dano perfurante +5%', 'Chance de crítico +20%']

export const BOSS_WEAPONS = [
  {
    id: 'syrtis',
    label: 'Syrtis',
    color: '#6fd67f',
    items: [
      wpn('sambro-arco-longo', 'Sambro', 'Arco Longo de Sambro de Madeira Endurecida Fina (Superior)', {
        bonus: 20, dmg: ['perfurante', '67-85'], category: 'Arcos longos', speed: 'Média', range: 25,
        durability: '174/174', weight: '5 Kg', level: 48, cls: 'Arqueiro', req: 45, stats: ARQ, mats: SAMBRO_MATS(10), cost: 50000,
      }),
      wpn('sambro-arco', 'Sambro', 'Arco de Sambro de Madeira Endurecida Fina (Superior)', {
        bonus: 20, dmg: ['perfurante', '75-92'], category: 'Arcos curtos', speed: 'Média', range: 20,
        durability: '174/174', weight: '4 Kg', level: 48, cls: 'Arqueiro', req: 45, stats: ARQ, mats: SAMBRO_MATS(10), cost: 50000,
      }),
      wpn('satarco-espada', 'Satarco', 'Espada de Satarco de Aço Fino (Superior)', {
        bonus: 24, dmg: ['cortante', '195-215'], category: 'Espadas', speed: 'Média',
        durability: '194/194', weight: '9 Kg', level: 58, cls: 'Guerreiro', req: 55,
        stats: ['Constituição +7', 'Resistir dano cortante +7%', 'Chance de crítico +24%'], mats: SATARCO_MATS(15), cost: 80000,
      }),
      wpn('satarco-espada-2m', 'Satarco', 'Espada de Duas Mãos de Satarco de Aço Fino (Superior)', {
        bonus: 24, dmg: ['cortante', '320-390'], category: 'Espadas', speed: 'Lenta',
        durability: '194/194', weight: '17 Kg', level: 58, cls: 'Bárbaro', req: 55,
        stats: ['Força +7', 'Resistir dano cortante +7%', 'Chance de crítico +24%'], mats: SATARCO_MATS(20), cost: 80000,
      }),
    ],
  },
  {
    id: 'ignis',
    label: 'Ignis',
    color: '#ff8a50',
    items: [
      wpn('graj-martelo', 'Graj', 'Martelo de Graj de Aço Fino (Superior)', {
        bonus: 24, dmg: ['esmagamento', '127-217'], category: 'Martelos', speed: 'Média',
        durability: '174/174', weight: '6 Kg', level: 48, cls: 'Guerreiro', req: 45,
        stats: ['Constituição +5', 'Resistir dano esmagador +5%', 'Chance de crítico +24%'], mats: GRAJ_MATS(10), cost: 50000,
      }),
      wpn('graj-martelo-2m', 'Graj', 'Martelo de Graj de Duas Mãos de Aço Fino (Superior)', {
        bonus: 24, dmg: ['esmagamento', '285-305'], category: 'Martelos', speed: 'Lenta',
        durability: '174/174', weight: '9 Kg', level: 48, cls: 'Bárbaro', req: 45,
        stats: ['Constituição +5', 'Resistir dano esmagador +5%', 'Chance de crítico +24%'], mats: GRAJ_MATS(15), cost: 50000,
      }),
      wpn('krontaron-maca', 'Krontaron', 'Maça de Krontaron de Aço Fino (Superior)', {
        bonus: 24, dmg: ['esmagamento', '190-220'], category: 'Maças', speed: 'Média',
        durability: '194/194', weight: '6 Kg', level: 58, cls: 'Guerreiro', req: 55,
        stats: ['Força +7', 'Resistir dano esmagador +7%', 'Chance de crítico +24%'], mats: KRONTARON_MATS(15), cost: 80000,
      }),
      wpn('krontaron-maca-2m', 'Krontaron', 'Maça de Krontaron de Duas Mãos de Aço Fino (Superior)', {
        bonus: 24, dmg: ['esmagamento', '343-370'], category: 'Maças', speed: 'Lenta',
        durability: '194/194', weight: '10 Kg', level: 58, cls: 'Bárbaro', req: 55,
        stats: ['Força +7', 'Resistir dano esmagador +7%', 'Chance de crítico +24%'], mats: KRONTARON_MATS(20), cost: 80000,
      }),
    ],
  },
  {
    id: 'alsius',
    label: 'Alsius',
    color: '#7cb8f0',
    items: [
      wpn('ades-cajado', 'Ades', 'Cajado de Ades de Madeira Endurecida Fina (Superior)', {
        bonus: 12, dmg: ['gelo', '33-60'], category: 'Cajados', speed: 'Média', range: 30,
        durability: '174/174', weight: '5 Kg', level: 48, cls: 'Mago', req: 45,
        stats: ['Resistir frio +5%', 'Inteligência +5', 'Chance de crítico +12%'], mats: ADES_MATS, cost: 50000,
      }),
      wpn('aysor-garrote', 'Aysor', 'Garrote de Aysor de Madeira Endurecida Fina (Superior)', {
        bonus: 24, dmg: ['esmagamento', '255-275'], category: 'Garrotes', speed: 'Lenta',
        durability: '194/194', weight: '7 Kg', level: 58, cls: 'Guerreiro', req: 55,
        stats: ['Força +7', 'Resistir dano esmagador +7%', 'Chance de crítico +24%'], mats: AYSOR_MATS(15), cost: 80000,
      }),
      wpn('aysor-garrote-2m', 'Aysor', 'Garrote de Aysor de Duas Mãos de Madeira Endurecida Fina (Superior)', {
        bonus: 24, dmg: ['esmagamento', '330-375'], category: 'Garrotes', speed: 'Lenta',
        durability: '194/194', weight: '10 Kg', level: 58, cls: 'Bárbaro', req: 55,
        stats: ['Força +7', 'Resistir dano esmagador +7%', 'Chance de crítico +24%'], mats: AYSOR_MATS(20), cost: 80000,
      }),
    ],
  },
]
