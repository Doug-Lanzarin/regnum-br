// Jóias do Rei Momo (Carnaval), transcritas dos prints do jogo e traduzidas.

const icon = (id) => `./momo/${id}.png`

const W = './magnanita/moeda-w.png'
const m = (id, name, qty) => ({ id, name, qty, icon: `./epicos/mat/${id}.png` })
const craft = (chance, time, level, materials, cost) => ({ chance, time, level, materials, costs: [{ coin: W, value: cost }] })

const JEWELS = [
  {
    craft: craft(100, 3600, 8, [
        m('encantamento', 'Encantamento', 3),
        m('chifre-momo', 'Chifre de Momo', 25),
        m('tecido-momo', 'Tecido de Momo', 70),
        m('lingote-aco-fino', 'Lingote de aço fino', 1),
        m('pelo-momo', 'Pelo de Momo', 30),
        m('alma-momo', 'Alma de Momo', 1),
      ], 50000),
    id: 'anel-coragem',
    name: 'Anel da Coragem do Rei Momo',
    icon: icon('anel-coragem'),
    damage: { icon: './joias/dano/esmagamento.png', type: 'esmagador', value: 30 },
    category: 'Anéis',
    weight: '5 g',
    itemLevel: 113,
    level: 55,
    lore: 'Este anel envolve quem o usa com a coragem do Rei Momo.',
    stats: [{ text: 'Dano esmagador +30' }, { text: 'Vida +150' }],
  },
  {
    id: 'anel-tenacidade',
    name: 'Anel da Tenacidade do Rei Momo',
    icon: icon('anel-tenacidade'),
    category: 'Anéis',
    weight: '5 g',
    itemLevel: 88,
    level: 55,
    lore: 'Este anel envolve quem o usa com a tenacidade do Rei Momo.',
    stats: [{ text: 'Mana +125' }, { text: 'Velocidade de conjuração +6%' }],
  },
]

// Os dois anéis do Rei Momo usam a mesma receita
const RECIPE = JEWELS.find((x) => x.craft).craft
export const MOMO_JEWELS = JEWELS.map((x) => ({ ...x, craft: x.craft ?? RECIPE }))
